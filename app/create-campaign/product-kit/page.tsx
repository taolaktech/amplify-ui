"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import TextArea from "@/app/ui/form/TextArea";
import { ArrowCircleRight2 } from "iconsax-react";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useAuthStore } from "@/app/lib/stores/authStore";

type BrandColorKey = "primary" | "secondary" | "neutral";

const MAX_SELECTED_IMAGES = 3;

const safeHex = (value: string, fallback: string) => {
  const v = (value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  return fallback;
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToRgb = (hex: string) => {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return { r, g, b };
};

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  // relative luminance approximation
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

const distance = (a: string, b: string) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return Math.sqrt((A.r - B.r) ** 2 + (A.g - B.g) ** 2 + (A.b - B.b) ** 2);
};

async function detectColorsFromImages(
  urls: string[],
): Promise<{ primary: string; secondary: string; neutral: string }> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { primary: "#6800D7", secondary: "#A755FF", neutral: "#111111" };
  }

  const samples: Array<{ r: number; g: number; b: number }> = [];

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    });

  for (const url of urls.slice(0, MAX_SELECTED_IMAGES)) {
    try {
      const img = await loadImage(url);
      const maxSide = 256;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Sample pixels on a grid to keep it fast.
      const step = 8;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          const r = data[idx] ?? 0;
          const g = data[idx + 1] ?? 0;
          const b = data[idx + 2] ?? 0;

          const isNearWhite = r > 245 && g > 245 && b > 245;
          const isNearBlack = r < 10 && g < 10 && b < 10;
          if (isNearWhite || isNearBlack) continue;

          samples.push({ r, g, b });
        }
      }
    } catch {
      // ignore single image failures and continue
    }
  }

  if (samples.length < 50) {
    return { primary: "#6800D7", secondary: "#A755FF", neutral: "#111111" };
  }

  // Simple quantization: bucket RGB to 32-levels and count frequency
  const buckets = new Map<string, number>();
  for (const p of samples) {
    const r = Math.round(p.r / 32) * 32;
    const g = Math.round(p.g / 32) * 32;
    const b = Math.round(p.b / 32) * 32;
    const key = rgbToHex(r, g, b);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const sorted = Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex);

  // Pick primary as most saturated-ish mid luminance
  const score = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = luminance(hex);
    const lumScore = 1 - Math.abs(lum - 0.55) * 1.4;
    return sat * 0.75 + lumScore * 0.25;
  };

  const ranked = [...sorted].sort((a, b) => score(b) - score(a));
  const primary = ranked[0] ?? "#6800D7";

  const secondary =
    ranked.find((c) => distance(c, primary) > 70) ??
    sorted.find((c) => distance(c, primary) > 70) ??
    "#A755FF";

  // Neutral: prefer very dark or very light depending on overall luminance
  const overallLum =
    samples.reduce(
      (acc, p) => acc + (0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b) / 255,
      0,
    ) / samples.length;
  const neutral = overallLum > 0.55 ? "#111111" : "#FFFFFF";

  return {
    primary: safeHex(primary, "#6800D7"),
    secondary: safeHex(secondary, "#A755FF"),
    neutral: safeHex(neutral, "#111111"),
  };
}

export default function ProductKitPage() {
  const router = useRouter();
  const { productSelection, supportedAdPlatforms } = useCreateCampaignStore(
    (state) => state,
  );
  const storeCampaignSnapshots = useCreateCampaignStore(
    (state) => state.actions.storeCampaignSnapshots,
  );
  const campaignSnapshots = useCreateCampaignStore(
    (state) => state.campaignSnapshots,
  );

  const product = productSelection.products?.[0]?.node;

  const allProductImages = useMemo(() => {
    const edges = product?.media?.edges ?? [];
    const urls = edges
      .filter((e: any) => {
        const type = (e?.node?.mediaContentType || "").toString().toUpperCase();
        return type === "IMAGE";
      })
      .map((e: any) => {
        const image = e?.node?.preview?.image;
        return image?.url;
      })
      .filter((u: any) => typeof u === "string" && u.trim().length > 0);
    // Dedupe
    return Array.from(new Set(urls));
  }, [product?.media?.edges]);

  const defaultSelected = useMemo(
    () => allProductImages.slice(0, MAX_SELECTED_IMAGES),
    [allProductImages],
  );

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [productName, setProductName] = useState(product?.title ?? "");
  const [productDescription, setProductDescription] = useState(
    product?.description ?? "",
  );

  const [selectedImages, setSelectedImages] =
    useState<string[]>(defaultSelected);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(
    defaultSelected[0] ?? null,
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [colors, setColors] = useState<{
    primary: string;
    secondary: string;
    neutral: string;
  }>({
    primary: "#6800D7",
    secondary: "#A755FF",
    neutral: "#111111",
  });
  const [locked, setLocked] = useState<Record<BrandColorKey, boolean>>({
    primary: false,
    secondary: false,
    neutral: false,
  });

  const dragIndexRef = useRef<number | null>(null);

  const didHydrateFromStoreRef = useRef(false);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
      return;
    }

    if (!supportedAdPlatforms.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  useEffect(() => {
    setProductName(product?.title ?? "");
    setProductDescription(product?.description ?? "");
    const storedSelected = (campaignSnapshots as any)?.selectedProductImages;
    const storedPrimary = (campaignSnapshots as any)?.primaryProductImageUrl;
    const nextSelected =
      Array.isArray(storedSelected) && storedSelected.length
        ? storedSelected
        : defaultSelected;
    const nextPrimary =
      typeof storedPrimary === "string" && storedPrimary.trim().length > 0
        ? storedPrimary
        : (nextSelected[0] ?? null);

    setSelectedImages(nextSelected);
    setPrimaryImageUrl(nextPrimary);
    didHydrateFromStoreRef.current = true;
  }, [product?.title, product?.description, defaultSelected]);

  useEffect(() => {
    if (!didHydrateFromStoreRef.current) return;
    storeCampaignSnapshots({
      brandColor: colors.primary,
      accentColor: colors.secondary,
      selectedProductImages: selectedImages,
      primaryProductImageUrl: primaryImageUrl,
    });
  }, [
    colors.primary,
    colors.secondary,
    selectedImages,
    primaryImageUrl,
    storeCampaignSnapshots,
  ]);

  const additionalImages = useMemo(() => {
    const all = [...uploadedImages, ...allProductImages];
    const deduped = Array.from(new Set(all));
    return deduped.filter((u) => !selectedImages.includes(u));
  }, [uploadedImages, allProductImages, selectedImages]);

  const canContinue = selectedImages.length > 0;

  const runAutoDetect = async () => {
    const input = selectedImages.length
      ? selectedImages
      : allProductImages.slice(0, 1);
    const detected = await detectColorsFromImages(input);

    setColors((prev) => ({
      primary: locked.primary ? prev.primary : detected.primary,
      secondary: locked.secondary ? prev.secondary : detected.secondary,
      neutral: locked.neutral ? prev.neutral : detected.neutral,
    }));
  };

  useEffect(() => {
    // initial + whenever selected images change
    runAutoDetect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages.join("|")]);

  const handleSelectAdditional = (url: string) => {
    if (selectedImages.includes(url)) return;

    if (selectedImages.length < MAX_SELECTED_IMAGES) {
      setSelectedImages((prev) => [...prev, url]);
      return;
    }

    // Replace the last by default (simple prompt-free behavior)
    setSelectedImages((prev) => {
      const next = [...prev];
      next[next.length - 1] = url;
      return next;
    });
  };

  const handleRemoveSelected = (idx: number) => {
    setSelectedImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setPrimaryImageUrl((cur) => {
        if (cur === prev[idx]) return next[0] ?? null;
        return cur;
      });
      return next;
    });
  };

  const handleReplaceSelected = (idx: number) => {
    const url = additionalImages[0];
    if (!url) return;
    setSelectedImages((prev) => {
      const next = [...prev];
      next[idx] = url;
      return next;
    });
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!imageFiles.length) return;

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/assets/upload", {
            method: "POST",
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formData,
          });
          if (!res.ok) throw new Error("Upload failed");
          const json = await res.json();
          return json.data.url as string;
        }),
      );
      setUploadedImages((prev) => [...uploaded, ...prev]);
    } catch {
      // individual failures are silent; partial successes are still added
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadLogo = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  };

  const ColorChip = ({
    label,
    value,
    onChange,
    locked: isLocked,
    onToggleLock,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    locked: boolean;
    onToggleLock: () => void;
  }) => {
    return (
      <div className="flex items-center gap-3">
        <button
          className="w-[44px] h-[44px] rounded-xl border border-[rgba(255,255,255,0.08)]"
          style={{ backgroundColor: value }}
          onClick={(e) => {
            e.preventDefault();
            const input =
              (e.currentTarget.nextSibling as HTMLInputElement | null) ?? null;
            input?.click();
          }}
        />
        <input
          type="color"
          className="hidden"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex flex-col">
          <span className="text-xs text-neutral-light tracking-40">
            {label}
          </span>
          <span className="text-sm font-medium tracking-100 text-heading">
            {value.toUpperCase()}
          </span>
        </div>
        <button
          className={`ml-auto text-xs px-3 h-[30px] rounded-lg border ${
            isLocked
              ? "border-purple-600 text-purple-600"
              : "border-input-border text-neutral-light"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onToggleLock();
          }}
        >
          {isLocked ? "Locked" : "Lock"}
        </button>
      </div>
    );
  };

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
        <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-8 lg:sticky lg:top-24">
          <div className="text-heading">
            <div className="text-[34px] leading-[40px] font-bold tracking-800">
              YOUR PRODUCT KIT
            </div>
            <p className="mt-3 text-sm text-neutral-light tracking-40 max-w-[320px]">
              Review the details we extracted. You can edit anything before
              generating your video.
            </p>
          </div>

          <div className="mt-10">
            <Button
              text="Continue"
              action={() => {
                if (!canContinue) return;
                storeCampaignSnapshots({
                  brandColor: colors.primary,
                  accentColor: colors.secondary,
                  selectedProductImages: selectedImages,
                  primaryProductImageUrl: primaryImageUrl,
                });
                router.push("/create-campaign/choose-ad-style");
              }}
              disabled={!canContinue}
              hasIconOrLoader
              icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
              iconPosition="right"
              iconSize={16}
            />
            {!canContinue && (
              <p className="mt-3 text-xs text-neutral-light">
                Select at least 1 product image to continue.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium tracking-100 text-heading">
                Product details
              </div>
              <button
                className="text-xs text-purple-600 font-medium"
                onClick={() => setIsEditingDetails((v) => !v)}
              >
                {isEditingDetails ? "Done" : "Edit"}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {isEditingDetails ? (
                <>
                  <Input
                    type="text"
                    name="productName"
                    label="Product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <TextArea
                    name="productDescription"
                    label="Product description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={5}
                  />
                </>
              ) : (
                <>
                  <div className="text-base font-semibold tracking-100 text-heading">
                    {productName}
                  </div>
                  <div className="text-sm text-neutral-light tracking-40 whitespace-pre-line">
                    {productDescription}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium tracking-100 text-heading">
                Product images
              </div>
              <div className="text-xs text-neutral-light tracking-40">
                Max {MAX_SELECTED_IMAGES} images
              </div>
            </div>
            <p className="mt-2 text-xs text-neutral-light tracking-40">
              Select your{" "}
              <span className="font-medium text-heading">reference image</span>{" "}
              (primary image) to be used for ad generation.
            </p>

            <div className="mt-5">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: MAX_SELECTED_IMAGES }).map((_, idx) => {
                  const url = selectedImages[idx];
                  const isEmpty = !url;
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden border ${
                        isEmpty
                          ? "border-dashed border-input-border"
                          : "border-transparent"
                      } bg-[#F3EFF6] aspect-[1/1]`}
                      draggable={!isEmpty}
                      onDragStart={() => {
                        dragIndexRef.current = idx;
                      }}
                      onDragOver={(e) => {
                        if (dragIndexRef.current === null) return;
                        e.preventDefault();
                      }}
                      onDrop={() => {
                        const from = dragIndexRef.current;
                        dragIndexRef.current = null;
                        if (from === null || from === idx) return;
                        setSelectedImages((prev) => {
                          const next = [...prev];
                          const fromUrl = next[from];
                          const toUrl = next[idx];
                          if (!fromUrl) return prev;
                          next[idx] = fromUrl;
                          next[from] = toUrl;
                          return next.filter(Boolean);
                        });
                      }}
                    >
                      {url ? (
                        <>
                          <Image
                            src={url}
                            alt="selected"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(0,0,0,0.55)] text-white text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveSelected(idx);
                            }}
                          >
                            x
                          </button>
                          <button
                            className="absolute bottom-2 left-2 h-[28px] px-3 rounded-lg bg-[rgba(0,0,0,0.55)] text-white text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              handleReplaceSelected(idx);
                            }}
                          >
                            Replace
                          </button>
                          <button
                            className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              primaryImageUrl === url
                                ? "bg-purple-600 border-purple-600"
                                : "bg-[rgba(0,0,0,0.35)] border-white"
                            }`}
                            title="Set as primary image"
                            onClick={(e) => {
                              e.preventDefault();
                              setPrimaryImageUrl(url);
                            }}
                          >
                            {primaryImageUrl === url && (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="5" cy="5" r="3" fill="white" />
                              </svg>
                            )}
                          </button>
                          {primaryImageUrl === url && (
                            <div className="absolute bottom-2 right-2 h-[20px] px-2 rounded-md bg-purple-600 text-white text-[10px] font-medium flex items-center">
                              Primary
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-light tracking-40">
                          Select an image
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="text-xs text-neutral-light tracking-40 text-center">
                  Additional images found
                </div>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2 pink-scroll">
                  {additionalImages.map((url) => (
                    <button
                      key={url}
                      className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden bg-[#F3EFF6] flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectAdditional(url);
                      }}
                    >
                      <Image
                        src={url}
                        alt="additional"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}

                  <label
                    className={`relative w-[72px] h-[72px] rounded-2xl overflow-hidden border border-dashed border-input-border flex-shrink-0 flex items-center justify-center ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="text-xs text-purple-600 font-medium text-center leading-tight px-1">
                      {isUploading ? "..." : "Upload"}
                    </span>
                    <input
                      className="hidden"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={isUploading}
                      onChange={(e) => handleUploadImages(e.target.files)}
                    />
                  </label>
                </div>

                <div className="mt-2 text-xs text-neutral-light tracking-40">
                  Drag to reorder selected images. Order affects color detection
                  and creative generation priority.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6">
            <div className="text-sm font-medium tracking-100 text-heading">
              Logo &amp; Brand colors
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-neutral-light tracking-40">
                  Logo
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {logoUrl ? (
                    <div className="relative w-[54px] h-[54px] rounded-2xl overflow-hidden bg-[#F3EFF6]">
                      <Image
                        src={logoUrl}
                        alt="logo"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-[54px] h-[54px] rounded-2xl bg-[#F3EFF6]" />
                  )}

                  <label className="cursor-pointer">
                    <div className="h-[40px] px-4 rounded-xl border border-input-border flex items-center justify-center text-sm font-medium text-purple-600">
                      {logoUrl ? "Replace logo" : "Upload logo"}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/svg+xml"
                      onChange={(e) =>
                        handleUploadLogo(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>

                  {logoUrl && (
                    <button
                      className="text-xs text-neutral-light"
                      onClick={(e) => {
                        e.preventDefault();
                        setLogoUrl(null);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-light tracking-40">
                    Brand colors
                  </div>
                  <button
                    className="text-xs text-purple-600 font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      runAutoDetect();
                    }}
                  >
                    Auto-detect colors
                  </button>
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  <ColorChip
                    label="Primary"
                    value={colors.primary}
                    onChange={(v) =>
                      setColors((prev) => ({ ...prev, primary: v }))
                    }
                    locked={locked.primary}
                    onToggleLock={() =>
                      setLocked((prev) => ({ ...prev, primary: !prev.primary }))
                    }
                  />
                  <ColorChip
                    label="Secondary"
                    value={colors.secondary}
                    onChange={(v) =>
                      setColors((prev) => ({ ...prev, secondary: v }))
                    }
                    locked={locked.secondary}
                    onToggleLock={() =>
                      setLocked((prev) => ({
                        ...prev,
                        secondary: !prev.secondary,
                      }))
                    }
                  />
                  <ColorChip
                    label="Neutral"
                    value={colors.neutral}
                    onChange={(v) =>
                      setColors((prev) => ({ ...prev, neutral: v }))
                    }
                    locked={locked.neutral}
                    onToggleLock={() =>
                      setLocked((prev) => ({ ...prev, neutral: !prev.neutral }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

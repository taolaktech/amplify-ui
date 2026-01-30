"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import CloseIcon from "@/public/close-circle.svg";
import Button from "@/app/ui/Button";
import { useModal } from "@/app/lib/hooks/useModal";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { useMetaCreativeUploadStore } from "@/app/lib/stores/metaCreativeUploadStore";

type Tab = "image" | "video";

type Props = {
  isOpen: boolean;
  productId: string;
  onClose: () => void;
};

type ValidationLevel = "pass" | "warning" | "error";

type ValidationItem = {
  label: string;
  level: ValidationLevel;
  message?: string;
};

type MediaMeta = {
  width?: number;
  height?: number;
  duration?: number;
  previewUrl?: string;
};

type ImageTransformResult = {
  file: File;
  previewUrl: string;
  targetWidth: number;
  targetHeight: number;
};

type SupportedRatio = {
  key: "1:1" | "4:5" | "9:16" | "1.91:1" | "16:9";
  ratio: number;
  minWidth: number;
  minHeight: number;
  recommended: string;
};

const IMAGE_RATIOS: SupportedRatio[] = [
  {
    key: "1:1",
    ratio: 1,
    minWidth: 600,
    minHeight: 600,
    recommended: "1080×1080",
  },
  {
    key: "4:5",
    ratio: 4 / 5,
    minWidth: 600,
    minHeight: 750,
    recommended: "1080×1350",
  },
  {
    key: "9:16",
    ratio: 9 / 16,
    minWidth: 720,
    minHeight: 1280,
    recommended: "1080×1920",
  },
  {
    key: "1.91:1",
    ratio: 1.91,
    minWidth: 600,
    minHeight: 314,
    recommended: "1200×628",
  },
];

const VIDEO_RATIOS: SupportedRatio[] = [
  ...IMAGE_RATIOS,
  {
    key: "16:9",
    ratio: 16 / 9,
    minWidth: 1280,
    minHeight: 720,
    recommended: "1920×1080",
  },
];

const withinTolerance = (actual: number, target: number, tolerance = 0.01) => {
  return Math.abs(actual - target) / target <= tolerance;
};

const findClosestRatio = (actualRatio: number, supported: SupportedRatio[]) => {
  let best: { ratio: SupportedRatio; delta: number } | null = null;

  for (const r of supported) {
    const delta = Math.abs(actualRatio - r.ratio) / r.ratio;
    if (!best || delta < best.delta) {
      best = { ratio: r, delta };
    }
  }

  return best;
};

export default function UploadMetaCreative({
  isOpen,
  productId,
  onClose,
}: Props) {
  const setToast = useToastStore((state) => state.setToast);
  const addUpload = useMetaCreativeUploadStore(
    (state) => state.actions.addUpload,
  );

  const [tab, setTab] = useState<Tab>("image");
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<MediaMeta>({});
  const [rawImageDims, setRawImageDims] = useState<{
    width?: number;
    height?: number;
  }>({});
  const [loadingMeta, setLoadingMeta] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useModal(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setFile(null);
    setMeta({});
    setRawImageDims({});
    setLoadingMeta(false);
    setTab("image");
  }, [isOpen]);

  const revokePreviewUrl = (url?: string) => {
    if (!url) return;
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    return () => {
      revokePreviewUrl(meta.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractImageMeta = async (f: File): Promise<MediaMeta> => {
    const previewUrl = URL.createObjectURL(f);
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          previewUrl,
        });
      };
      img.onerror = () => {
        reject(new Error("Could not read image"));
      };
      img.src = previewUrl;
    });
  };

  const pickBestImagePreset = (width: number, height: number) => {
    const actualRatio = width / height;
    const closest = findClosestRatio(actualRatio, IMAGE_RATIOS);
    const preset = closest?.ratio || IMAGE_RATIOS[0];

    const targetWidth = parseInt(
      preset.recommended.split("×")[0] || "1080",
      10,
    );
    const targetHeight = parseInt(
      preset.recommended.split("×")[1] || "1080",
      10,
    );

    return {
      preset,
      delta: closest?.delta ?? 0,
      targetWidth,
      targetHeight,
    };
  };

  const letterboxImageToPreset = async (
    source: File,
    targetWidth: number,
    targetHeight: number,
  ): Promise<ImageTransformResult> => {
    const sourceUrl = URL.createObjectURL(source);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new window.Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Could not decode image"));
        i.src = sourceUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context unavailable");
      }

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const scale = Math.min(
        targetWidth / img.naturalWidth,
        targetHeight / img.naturalHeight,
        1,
      );
      const drawWidth = Math.round(img.naturalWidth * scale);
      const drawHeight = Math.round(img.naturalHeight * scale);
      const dx = Math.round((targetWidth - drawWidth) / 2);
      const dy = Math.round((targetHeight - drawHeight) / 2);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (!b) {
              reject(new Error("Could not encode image"));
              return;
            }
            resolve(b);
          },
          "image/png",
          1,
        );
      });

      const outName = source.name.replace(/\.[^.]+$/, "") + "-meta.png";
      const outFile = new File([blob], outName, { type: "image/png" });
      const outPreviewUrl = URL.createObjectURL(outFile);

      return {
        file: outFile,
        previewUrl: outPreviewUrl,
        targetWidth,
        targetHeight,
      };
    } finally {
      revokePreviewUrl(sourceUrl);
    }
  };

  const extractVideoMeta = async (f: File): Promise<MediaMeta> => {
    const previewUrl = URL.createObjectURL(f);

    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({
          duration:
            typeof video.duration === "number" ? video.duration : undefined,
          width:
            typeof video.videoWidth === "number" ? video.videoWidth : undefined,
          height:
            typeof video.videoHeight === "number"
              ? video.videoHeight
              : undefined,
          previewUrl,
        });
      };
      video.onerror = () => reject(new Error("Could not read video"));
      video.src = previewUrl;
    });
  };

  const onPickFile = async (picked: File) => {
    revokePreviewUrl(meta.previewUrl);
    setFile(picked);
    setLoadingMeta(true);

    try {
      if (tab === "image") {
        const raw = await extractImageMeta(picked);
        setRawImageDims({ width: raw.width, height: raw.height });
        if (typeof raw.width !== "number" || typeof raw.height !== "number") {
          throw new Error("Could not detect image dimensions");
        }

        const { targetWidth, targetHeight } = pickBestImagePreset(
          raw.width,
          raw.height,
        );

        const transformed = await letterboxImageToPreset(
          picked,
          targetWidth,
          targetHeight,
        );

        setFile(transformed.file);
        setMeta({
          width: transformed.targetWidth,
          height: transformed.targetHeight,
          previewUrl: transformed.previewUrl,
        });

        revokePreviewUrl(raw.previewUrl);
        return;
      }

      const nextMeta = await extractVideoMeta(picked);
      setMeta(nextMeta);
    } catch (err) {
      setFile(null);
      setMeta({});
      setRawImageDims({});
      setToast({
        type: "error",
        title: "Could not read file",
        message: "Please try another file.",
      });
    } finally {
      setLoadingMeta(false);
    }
  };

  const validation = useMemo((): {
    items: ValidationItem[];
    canUpload: boolean;
  } => {
    const items: ValidationItem[] = [];

    if (!file) {
      return {
        items: [
          {
            label: "Select a file",
            level: "error",
            message: "Choose an image or video to continue.",
          },
        ],
        canUpload: false,
      };
    }

    if (tab === "image") {
      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      const maxBytes = 30 * 1024 * 1024;

      items.push({
        label: "File type (.jpg, .jpeg, .png)",
        level: allowed.includes(file.type) ? "pass" : "error",
        message: allowed.includes(file.type)
          ? undefined
          : "Only .jpg, .jpeg, .png are allowed.",
      });

      items.push({
        label: "Max file size 30MB",
        level: file.size <= maxBytes ? "pass" : "error",
        message:
          file.size <= maxBytes ? undefined : "File too large. Max 30MB.",
      });

      const rawW = rawImageDims.width;
      const rawH = rawImageDims.height;
      const hasRawDims =
        typeof rawW === "number" &&
        typeof rawH === "number" &&
        rawW > 0 &&
        rawH > 0;

      if (!hasRawDims) {
        items.push({
          label: "Dimensions",
          level: loadingMeta ? "warning" : "error",
          message: loadingMeta
            ? "Reading dimensions…"
            : "Could not detect image dimensions.",
        });
      } else {
        const { preset, delta } = pickBestImagePreset(rawW, rawH);
        const meetsMin = rawW >= preset.minWidth && rawH >= preset.minHeight;

        items.push({
          label: `Auto-fit to ${preset.key} (${preset.recommended})`,
          level: "pass",
        });

        items.push({
          label: "Minimum resolution",
          level: meetsMin ? "pass" : "error",
          message: meetsMin
            ? undefined
            : `Minimum is ${preset.minWidth}×${preset.minHeight} for ${preset.key}.`,
        });

        if (delta > 0.05) {
          items.push({
            label: "Aspect ratio warning",
            level: "warning",
            message: `Your image is far from ${preset.key}. We'll add padding to fit ${preset.recommended}.`,
          });
        }
      }

      const canUpload = items.every((i) => i.level !== "error");
      return { items, canUpload };
    }

    // Video
    const allowed = ["video/mp4", "video/quicktime", "video/webm"];
    const maxBytes = 250 * 1024 * 1024;

    items.push({
      label: "File type (.mp4 recommended, .mov allowed, .webm allowed)",
      level: allowed.includes(file.type) ? "pass" : "error",
      message: allowed.includes(file.type)
        ? undefined
        : "Unsupported video format.",
    });

    items.push({
      label: "Max file size 250MB",
      level: file.size <= maxBytes ? "pass" : "error",
      message: file.size <= maxBytes ? undefined : "File too large. Max 250MB.",
    });

    const duration = meta.duration;
    if (typeof duration !== "number") {
      items.push({
        label: "Duration",
        level: loadingMeta ? "warning" : "error",
        message: loadingMeta
          ? "Reading duration…"
          : "Could not detect duration.",
      });
    } else {
      if (duration > 120) {
        items.push({
          label: "Max duration 120s",
          level: "error",
          message: "Video too long. Max 120 seconds.",
        });
      } else {
        items.push({
          label: "Max duration 120s",
          level: "pass",
        });
      }

      if (duration < 6 || duration > 60) {
        items.push({
          label: "Recommended duration 6–60s",
          level: "warning",
          message: "6–60 seconds works best for Meta placements.",
        });
      } else {
        items.push({
          label: "Recommended duration 6–60s",
          level: "pass",
        });
      }
    }

    const w = meta.width;
    const h = meta.height;
    const hasDims =
      typeof w === "number" && typeof h === "number" && w > 0 && h > 0;

    if (!hasDims) {
      items.push({
        label: "Dimensions",
        level: loadingMeta ? "warning" : "error",
        message: loadingMeta
          ? "Reading dimensions…"
          : "Could not detect dimensions.",
      });
    } else {
      const actualRatio = w / h;
      const match = VIDEO_RATIOS.find((r) =>
        withinTolerance(actualRatio, r.ratio),
      );

      if (!match) {
        items.push({
          label: "Meta-safe aspect ratio",
          level: "error",
          message:
            "Unsupported dimensions. Upload 1:1, 4:5, 9:16, 16:9, or 1.91:1.",
        });
      } else {
        const meetsMin = w >= match.minWidth && h >= match.minHeight;
        items.push({
          label: `Aspect ratio ${match.key}`,
          level: "pass",
        });
        items.push({
          label: "Minimum resolution",
          level: meetsMin ? "pass" : "error",
          message: meetsMin
            ? undefined
            : `Minimum is ${match.minWidth}×${match.minHeight} for ${match.key}.`,
        });
      }
    }

    // Frame rate: we cannot reliably extract FPS from the raw file in-browser.
    items.push({
      label: "Frame rate 24–60fps (warning only)",
      level: "warning",
      message: "Frame rate validation will run during campaign creation.",
    });

    const canUpload = items.every((i) => i.level !== "error");
    return { items, canUpload };
  }, [file, loadingMeta, meta.duration, meta.height, meta.width, tab]);

  const handleUpload = () => {
    if (!file || !meta.previewUrl || !validation.canUpload) return;

    const id = `meta-${Math.random().toString(36).slice(2)}`;

    addUpload({
      id,
      type: tab,
      productId,
      file,
      previewUrl: meta.previewUrl,
      width: meta.width,
      height: meta.height,
      duration: meta.duration,
      resolutionLabel:
        typeof meta.width === "number" && typeof meta.height === "number"
          ? `${meta.width}×${meta.height}`
          : undefined,
      createdAt: Date.now(),
    });

    setToast({
      type: "success",
      title: "Creative added",
      message: "We’ll upload it when you launch your campaign.",
    });

    // Keep the preview URL alive (do not revoke) because we store it in global state.
    // Reset local state for another upload.
    setFile(null);
    setMeta({});
  };

  if (!isOpen) return null;

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={onClose}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]
        h-[85vh] w-[92vw] max-w-[820px] z-30 rounded-3xl overflow-hidden custom-shadow"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#efefef]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-semibold">
                  Upload Creative (Meta)
                </div>
                <div className="text-xs md:text-sm text-neutral-light mt-1">
                  Upload a creative that meets Meta specs. We’ll automatically
                  validate format, size, and dimensions. Recommended: Use
                  Instagram-friendly dimensions for best placement coverage.
                </div>
              </div>
              <button onClick={onClose} className="-mt-3 -mr-3">
                <CloseIcon width={48} height={48} />
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setFile(null);
                  setMeta({});
                  setTab("image");
                }}
                className={`h-[36px] px-4 rounded-[39px] border text-sm font-medium ${
                  tab === "image"
                    ? "bg-[#F0E6FB] border-[#D0B0F3]"
                    : "bg-[#ECECEC] border-[#E0E0E0]"
                }`}
              >
                Image
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setMeta({});
                  setTab("video");
                }}
                className={`h-[36px] px-4 rounded-[39px] border text-sm font-medium ${
                  tab === "video"
                    ? "bg-[#F0E6FB] border-[#D0B0F3]"
                    : "bg-[#ECECEC] border-[#E0E0E0]"
                }`}
              >
                Video
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FBFAFC] border border-[#EFEFEF] rounded-3xl p-5">
                <div className="text-sm font-medium text-heading">
                  Quick Instructions
                </div>
                <div className="text-xs md:text-sm text-neutral-light mt-2">
                  Upload a creative that meets Meta specs. We’ll automatically
                  validate format, size, and dimensions.
                </div>
                <div className="text-xs md:text-sm text-neutral-light mt-2">
                  Recommended: Use Instagram-friendly dimensions for best
                  placement coverage.
                </div>
              </div>

              <div className="bg-white border border-[#EFEFEF] rounded-3xl p-5">
                <div className="text-sm font-medium text-heading">Upload</div>

                <div
                  className="mt-3 border border-dashed border-[#CFCFCF] rounded-2xl p-6 bg-[#FBFAFC] cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-sm font-medium text-heading">
                    Drop file here, or click to browse
                  </div>
                  <div className="text-xs text-neutral-light mt-1">
                    {tab === "image"
                      ? "jpg, jpeg, png • max 30MB"
                      : "mp4, mov, webm • max 250MB"}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={
                      tab === "image"
                        ? "image/jpeg,image/png"
                        : "video/mp4,video/quicktime,video/webm"
                    }
                    onChange={(e) => {
                      const picked = e.target.files?.[0];
                      if (!picked) return;
                      void onPickFile(picked);
                    }}
                  />
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-heading">
                    Preview
                  </div>

                  {!file || !meta.previewUrl ? (
                    <div className="mt-2 text-sm text-[#BFBFBF]">
                      No file selected.
                    </div>
                  ) : tab === "image" ? (
                    <div className="mt-2 relative w-full h-[220px] rounded-2xl overflow-hidden bg-[#F1F1F1]">
                      <Image
                        src={meta.previewUrl}
                        alt="Upload preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 w-full rounded-2xl overflow-hidden bg-[#F1F1F1]">
                      <video
                        src={meta.previewUrl}
                        controls
                        className="w-full h-[220px] object-contain"
                      />
                    </div>
                  )}

                  {(meta.width || meta.height || meta.duration) && (
                    <div className="mt-2 text-xs text-neutral-light">
                      {typeof meta.width === "number" &&
                      typeof meta.height === "number"
                        ? `Resolution: ${meta.width}×${meta.height}`
                        : ""}
                      {typeof meta.duration === "number"
                        ? ` • Duration: ${Math.round(meta.duration)}s`
                        : ""}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-heading">
                    Requirements
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {validation.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="text-sm text-[#555456]">
                          {item.label}
                          {item.message && (
                            <div className="text-xs text-neutral-light mt-1">
                              {item.message}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded-[39px] border ${
                            item.level === "pass"
                              ? "bg-[#E8F5E9] border-[#BFE6C3] text-[#2E7D32]"
                              : item.level === "warning"
                                ? "bg-[#FFF8E1] border-[#FFE0B2] text-[#A15C00]"
                                : "bg-[#FDECEA] border-[#F5C2C0] text-[#B3261E]"
                          }`}
                        >
                          {item.level === "pass"
                            ? "OK"
                            : item.level === "warning"
                              ? "Warn"
                              : "Fix"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[90px] flex items-center justify-end p-6 rounded-b-3xl border-t border-[#efefef]">
            <div className="flex gap-4 w-full justify-end items-center">
              <div className="w-full max-w-[120px]">
                <Button
                  text="Cancel"
                  hasIconOrLoader
                  secondary
                  action={onClose}
                />
              </div>
              <div className="w-full max-w-[120px]">
                <Button
                  text="Upload"
                  hasIconOrLoader
                  disabled={!validation.canUpload}
                  action={handleUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

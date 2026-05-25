"use client";

import React, { useRef } from "react";
import Image from "next/image";
import TemplateFilterBar from "./TemplateFilterBar";
import {
  type FilterState,
  EMPTY_FILTERS,
  hasActiveFilters,
} from "./templateFilters";
import { type VideoPreset } from "@/app/lib/api/base/video-presets";
import { type MediaPreset } from "@/app/lib/api/base/media-presets";

type CardItem = {
  preset: VideoPreset;
  templateId: string;
  label: string;
  disabled: boolean;
};

type AdStyleBrowserProps = {
  presetType: "video" | "image";
  setPresetType: (type: "video" | "image") => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  // video
  presets: VideoPreset[];
  videoTotal: number | null;
  cards: CardItem[];
  selectedVideoTemplateId: string | null;
  setSelectedVideoTemplateId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  unmutedVideoTemplateId: string | null;
  setUnmutedVideoTemplateId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  isLoading: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  // image
  imagePresets: MediaPreset[];
  imageTotal: number | null;
  isLoadingImages: boolean;
  imagePresetLoadError: string | null;
  selectedImageTemplateIds: string[];
  toggleImageTemplateId: (templateId: string) => void;
};

export default function AdStyleBrowser({
  presetType,
  setPresetType,
  filters,
  setFilters,
  presets,
  videoTotal,
  cards,
  selectedVideoTemplateId,
  setSelectedVideoTemplateId,
  unmutedVideoTemplateId,
  setUnmutedVideoTemplateId,
  isLoading,
  sentinelRef,
  listRef,
  imagePresets,
  imageTotal,
  isLoadingImages,
  imagePresetLoadError,
  selectedImageTemplateIds,
  toggleImageTemplateId,
}: AdStyleBrowserProps) {
  return (
    <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-heading text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-purple-600" />
          <span>Ad styles</span>
        </div>

        <div className="flex items-center gap-2 bg-[#F3EFF6] p-1 rounded-2xl">
          <button
            className={`px-4 h-[36px] rounded-xl text-sm font-medium ${
              presetType === "video"
                ? "bg-white text-heading"
                : "text-neutral-light"
            }`}
            onClick={() => setPresetType("video")}
          >
            Video Ads
          </button>
          <button
            className={`px-4 h-[36px] rounded-xl text-sm font-medium ${
              presetType === "image"
                ? "bg-white text-heading"
                : "text-neutral-light"
            }`}
            onClick={() => setPresetType("image")}
          >
            Image Ads
          </button>
        </div>
      </div>

      <div className="mt-4">
        <TemplateFilterBar
          filters={filters}
          onChange={setFilters}
          resultCount={
            presetType === "image"
              ? (imageTotal ?? imagePresets.length)
              : (videoTotal ?? presets.length)
          }
        />
      </div>

      <div
        ref={listRef}
        className={`mt-5 max-h-[calc(100vh-220px)] overflow-y-auto overflow-x-hidden pr-2 pink-scroll ${
          presetType === "video"
            ? "grid grid-cols-2 md:grid-cols-3 gap-4"
            : ""
        }`}
      >
        {presetType === "image" ? (
          <>
            {imagePresetLoadError ? (
              <div className="col-span-full text-xs text-neutral-light">
                {imagePresetLoadError}
              </div>
            ) : null}

            {isLoadingImages ? (
              <div className="col-span-full text-xs text-neutral-light">
                Loading…
              </div>
            ) : null}

            {!isLoadingImages &&
            !imagePresetLoadError &&
            (imageTotal ?? imagePresets.length) === 0 &&
            hasActiveFilters(filters) ? (
              <div className="col-span-full text-xs text-neutral-light">
                No templates match your filters.
              </div>
            ) : null}

            {!isLoadingImages &&
            !imagePresetLoadError &&
            (imageTotal ?? imagePresets.length) === 0 &&
            !hasActiveFilters(filters) ? (
              <div className="col-span-full text-xs text-neutral-light">
                No image presets available.
              </div>
            ) : null}

            <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePresets.map((p) => {
                const isSelected = selectedImageTemplateIds.includes(p._id);
                const previewUrl = p.thumbnailUrl || p.mediaUrl || "";
                const label = (p.label || "Image").trim();
                const disabled = !previewUrl;

                return (
                  <button
                    key={p._id}
                    className={`relative rounded-3xl overflow-hidden border aspect-[9/16] w-full transition-all duration-200 ${
                      disabled
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    } ${
                      isSelected
                        ? "border-purple-600 ring-2 ring-purple-600 shadow-[0_0_0_2px_rgba(104,0,215,0.12),0_0_18px_rgba(104,0,215,0.12)]"
                        : "border-[rgba(0,0,0,0.06)]"
                    } bg-[#F3EFF6]`}
                    aria-disabled={disabled}
                    tabIndex={disabled ? -1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      if (disabled) return;
                      toggleImageTemplateId(p._id);
                    }}
                  >
                    <div className="absolute inset-0 bg-[#1b1b1b]" />

                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={label}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}

                    <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white text-sm font-semibold tracking-100 whitespace-pre-line">
                        {label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {(videoTotal ?? presets.length) === 0 &&
            !isLoading &&
            hasActiveFilters(filters) ? (
              <div className="col-span-full mt-8 rounded-2xl border border-dashed border-input-border p-8 text-center animate-fadeIn">
                <div className="text-2xl mb-2">🎬</div>
                <div className="text-sm font-medium text-heading">
                  No templates match your filters
                </div>
                <div className="mt-1 text-xs text-neutral-light">
                  Try adjusting your Creative Direction, Niche, or Tags.
                </div>
                <button
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="mt-4 h-[36px] px-5 rounded-xl bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : null}

            {(videoTotal ?? presets.length) === 0 &&
            !isLoading &&
            !hasActiveFilters(filters) ? (
              <div className="col-span-full text-xs text-neutral-light">
                No video presets available.
              </div>
            ) : null}

            {cards.map((c) => {
              const isSelected =
                Boolean(c.templateId) &&
                selectedVideoTemplateId === c.templateId;
              const disabled = c.disabled;
              const isUnmuted =
                Boolean(c.templateId) &&
                unmutedVideoTemplateId === c.templateId;

              return (
                <button
                  key={c.preset?._id}
                  className={`relative rounded-3xl overflow-hidden aspect-[9/16] w-full transition-all duration-200 ${
                    disabled ? "cursor-not-allowed" : "cursor-pointer"
                  } ${
                    isSelected
                      ? "ring-2 ring-purple-600 shadow-[0_0_0_2px_rgba(104,0,215,0.18),0_0_22px_rgba(104,0,215,0.18)]"
                      : ""
                  }`}
                  aria-disabled={disabled}
                  tabIndex={disabled ? -1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    if (disabled) return;
                    setSelectedVideoTemplateId((prev) =>
                      prev === c.templateId ? null : c.templateId,
                    );
                  }}
                >
                  {c.preset?.videoUrl ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      muted={!isUnmuted}
                      playsInline
                      loop
                      autoPlay
                      poster={c.preset.thumbnailImageUrl}
                      src={c.preset.videoUrl}
                    />
                  ) : c.preset?.thumbnailImageUrl ? (
                    <Image
                      src={c.preset.thumbnailImageUrl}
                      alt={c.label}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1b1b1b]" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />

                  {c.preset?.videoUrl && !disabled && (
                    <button
                      type="button"
                      className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-100 text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUnmutedVideoTemplateId((prev) =>
                          prev === c.templateId
                            ? null
                            : (c.templateId ?? null),
                        );
                      }}
                      aria-label={isUnmuted ? "Mute video" : "Unmute video"}
                    >
                      {isUnmuted ? "Mute" : "Unmute"}
                    </button>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white text-sm font-semibold tracking-100 whitespace-pre-line">
                      {c.label}
                    </div>
                  </div>
                </button>
              );
            })}
            <div ref={sentinelRef} className="col-span-full w-full h-8" />
          </>
        )}
      </div>

      {isLoading && (
        <div className="mt-4 text-xs text-neutral-light">Loading…</div>
      )}
    </div>
  );
}

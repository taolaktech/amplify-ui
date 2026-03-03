"use client";

import { useEffect, useRef, useState } from "react";
import {
  CREATIVE_DIRECTIONS,
  NICHES,
  QUICK_TAGS,
  type CreativeDirection,
  type FilterState,
  type Niche,
  type QuickTag,
  countActiveFilters,
  hasActiveFilters,
} from "./templateFilters";

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
};

export default function TemplateFilterBar({
  filters,
  onChange,
  resultCount,
}: Props) {
  const [cdOpen, setCdOpen] = useState(false);
  const [nicheOpen, setNicheOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cdRef = useRef<HTMLDivElement>(null);
  const nicheRef = useRef<HTMLDivElement>(null);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cdRef.current && !cdRef.current.contains(e.target as Node)) {
        setCdOpen(false);
      }
      if (nicheRef.current && !nicheRef.current.contains(e.target as Node)) {
        setNicheOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleCreativeDirection = (cd: CreativeDirection) => {
    const next = filters.creativeDirections.includes(cd)
      ? filters.creativeDirections.filter((x) => x !== cd)
      : [...filters.creativeDirections, cd];
    onChange({ ...filters, creativeDirections: next });
  };

  const toggleNiche = (n: Niche) => {
    const next = filters.niches.includes(n)
      ? filters.niches.filter((x) => x !== n)
      : [...filters.niches, n];
    onChange({ ...filters, niches: next });
  };

  const toggleTag = (t: QuickTag) => {
    const next = filters.tags.includes(t)
      ? filters.tags.filter((x) => x !== t)
      : [...filters.tags, t];
    onChange({ ...filters, tags: next });
  };

  const clearAll = () =>
    onChange({ creativeDirections: [], niches: [], tags: [] });

  return (
    <>
      {/* ── Desktop filter bar ── */}
      <div className="hidden md:flex flex-col gap-3 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] px-4 py-3 shadow-sm">
        {/* Row 1: Creative Direction dropdown + Niche dropdown + Clear */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Creative Direction dropdown */}
          <div className="relative shrink-0" ref={cdRef}>
            <button
              onClick={() => {
                setCdOpen((v) => !v);
                setNicheOpen(false);
              }}
              className={`h-[30px] px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.creativeDirections.length > 0
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-white border-[rgba(0,0,0,0.1)] text-neutral-light hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              Creative Direction
              {filters.creativeDirections.length > 0 && (
                <span className="bg-white/30 rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-semibold">
                  {filters.creativeDirections.length}
                </span>
              )}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className={`transition-transform ${cdOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {cdOpen && (
              <div className="absolute left-0 top-[calc(100%+6px)] z-50 bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xl p-3 w-[240px] max-h-[300px] overflow-y-auto">
                {CREATIVE_DIRECTIONS.map((cd) => {
                  const active = filters.creativeDirections.includes(cd);
                  return (
                    <button
                      key={cd}
                      onClick={() => toggleCreativeDirection(cd)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between gap-2 ${
                        active
                          ? "bg-purple-50 text-purple-700"
                          : "text-neutral-light hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <span>{cd}</span>
                      {active && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#6800D7"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Niche dropdown */}
          <div className="relative shrink-0" ref={nicheRef}>
            <button
              onClick={() => {
                setNicheOpen((v) => !v);
                setCdOpen(false);
              }}
              className={`h-[30px] px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.niches.length > 0
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-white border-[rgba(0,0,0,0.1)] text-neutral-light hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              Niche
              {filters.niches.length > 0 && (
                <span className="bg-white/30 rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-semibold">
                  {filters.niches.length}
                </span>
              )}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className={`transition-transform ${nicheOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {nicheOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xl p-3 w-[220px] max-h-[300px] overflow-y-auto">
                {NICHES.map((n) => {
                  const active = filters.niches.includes(n);
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between gap-2 ${
                        active
                          ? "bg-purple-50 text-purple-700"
                          : "text-neutral-light hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <span>{n}</span>
                      {active && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#6800D7"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clear + count */}
          {hasActiveFilters(filters) && (
            <button
              onClick={clearAll}
              className="h-[30px] px-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-red-600 shrink-0 hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 2l6 6M8 2L2 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Clear{" "}
              <span className="bg-red-100 rounded-full px-1.5 py-0.5 text-[10px]">
                {activeCount}
              </span>
            </button>
          )}
        </div>

        {/* Row 2: Quick tag pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-neutral-light shrink-0 mr-1">
            Tags
          </span>
          {QUICK_TAGS.map((t) => {
            const active = filters.tags.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`h-[28px] px-3 rounded-xl border text-xs font-medium transition-all shrink-0 ${
                  active
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-[#F3F4F6] border-transparent text-neutral-light hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between pt-1 border-t border-[rgba(0,0,0,0.05)]">
          <span className="text-xs text-neutral-light">
            {resultCount} template{resultCount !== 1 ? "s" : ""} match
            {resultCount === 1 ? "es" : ""} your filters
          </span>
          {hasActiveFilters(filters) && (
            <div className="flex gap-1 flex-wrap justify-end">
              {filters.creativeDirections.map((cd) => (
                <span
                  key={cd}
                  className="h-[22px] px-2 rounded-lg bg-purple-100 text-purple-700 text-[10px] font-medium flex items-center gap-1"
                >
                  {cd}
                  <button
                    onClick={() => toggleCreativeDirection(cd)}
                    className="opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.niches.map((n) => (
                <span
                  key={n}
                  className="h-[22px] px-2 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-medium flex items-center gap-1"
                >
                  {n}
                  <button
                    onClick={() => toggleNiche(n)}
                    className="opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.tags.map((t) => (
                <span
                  key={t}
                  className="h-[22px] px-2 rounded-lg bg-green-100 text-green-700 text-[10px] font-medium flex items-center gap-1"
                >
                  {t}
                  <button
                    onClick={() => toggleTag(t)}
                    className="opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter trigger ── */}
      <div className="flex md:hidden items-center justify-between gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className={`flex items-center gap-2 h-[38px] px-4 rounded-xl border text-sm font-medium transition-all ${
            activeCount > 0
              ? "bg-purple-600 border-purple-600 text-white"
              : "bg-white border-[rgba(0,0,0,0.1)] text-neutral-light"
          }`}
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <path
              d="M1 1h12M3 6h8M5 11h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="bg-white/30 rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </button>
        <span className="text-xs text-neutral-light">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-500 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Mobile bottom sheet ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-10 max-h-[85vh] overflow-y-auto">
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-[#E0E0E0] mx-auto mb-5" />

            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-semibold text-heading">
                Filter templates
              </div>
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-red-500 font-medium"
                >
                  Clear all ({activeCount})
                </button>
              )}
            </div>

            {/* Creative Direction */}
            <div className="mb-5">
              <div className="text-xs font-medium text-neutral-light mb-2 uppercase tracking-wider">
                Creative Direction
              </div>
              <div className="flex flex-wrap gap-2">
                {CREATIVE_DIRECTIONS.map((cd) => {
                  const active = filters.creativeDirections.includes(cd);
                  return (
                    <button
                      key={cd}
                      onClick={() => toggleCreativeDirection(cd)}
                      className={`h-[34px] px-4 rounded-xl border text-sm font-medium transition-all ${
                        active
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-[#F3F4F6] border-transparent text-neutral-light"
                      }`}
                    >
                      {cd}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Niche */}
            <div className="mb-5">
              <div className="text-xs font-medium text-neutral-light mb-2 uppercase tracking-wider">
                Niche
              </div>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => {
                  const active = filters.niches.includes(n);
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`h-[34px] px-4 rounded-xl border text-sm font-medium transition-all ${
                        active
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-[#F3F4F6] border-transparent text-neutral-light"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-5">
              <div className="text-xs font-medium text-neutral-light mb-2 uppercase tracking-wider">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((t) => {
                  const active = filters.tags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`h-[34px] px-4 rounded-xl border text-sm font-medium transition-all ${
                        active
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-[#F3F4F6] border-transparent text-neutral-light"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="w-full h-[48px] rounded-2xl bg-purple-600 text-white text-sm font-semibold"
            >
              Show {resultCount} result{resultCount !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

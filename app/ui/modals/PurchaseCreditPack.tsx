"use client";

import { useEffect, useMemo, useState } from "react";
import CloseIcon from "@/public/close-circle.svg";
import Button from "@/app/ui/Button";
import { useModal } from "@/app/lib/hooks/useModal";
import {
  createCreditsCheckoutSessionForPrice,
  CreditsTopUpPack,
  getCreditsTopUpPacks,
} from "@/app/lib/api/wallet";
import { useToastStore } from "@/app/lib/stores/toastStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  token: string;
};

function formatMoneyFromMinorUnits(params: {
  unitAmount: number | null;
  currency: string | null;
}): string {
  const { unitAmount, currency } = params;
  if (unitAmount === null || unitAmount === undefined) return "";
  const c = (currency || "usd").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: c,
    }).format(unitAmount / 100);
  } catch {
    return `$${(unitAmount / 100).toFixed(2)}`;
  }
}

export default function PurchaseCreditPack({ isOpen, onClose, token }: Props) {
  const setToast = useToastStore((state) => state.setToast);
  useModal(isOpen);

  const [packs, setPacks] = useState<CreditsTopUpPack[]>([]);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");
  const [openSelect, setOpenSelect] = useState(false);
  const [loadingPacks, setLoadingPacks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoadingPacks(true);

    getCreditsTopUpPacks(token)
      .then((res) => {
        const next = (res?.data || []) as CreditsTopUpPack[];
        if (cancelled) return;
        setPacks(next);
        setSelectedPriceId((prev) => prev || next?.[0]?.priceId || "");
      })
      .catch(() => {
        setToast({
          title: "Something went wrong",
          message: "Could not load credit packs. Please try again.",
          type: "error",
        });
      })
      .finally(() => {
        if (!cancelled) setLoadingPacks(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, setToast, token]);

  const selectedPack = useMemo(() => {
    return packs.find((p) => p.priceId === selectedPriceId) || null;
  }, [packs, selectedPriceId]);

  const selectLabel = useMemo(() => {
    if (!selectedPack) return "Select a pack";

    const money = formatMoneyFromMinorUnits({
      unitAmount: selectedPack.unitAmount,
      currency: selectedPack.currency,
    });

    return money || `${selectedPack.tokens} Credits`;
  }, [loadingPacks, selectedPack]);

  const handleClose = () => {
    if (submitting) return;
    setOpenSelect(false);
    onClose();
  };

  const handleContinue = async () => {
    if (!selectedPriceId) {
      setToast({
        title: "Select a pack",
        message: "Please choose a credit pack size to continue.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await createCreditsCheckoutSessionForPrice(
        token,
        selectedPriceId,
      );
      const url = res?.data?.url;
      if (!url) {
        setToast({
          title: "Something went wrong",
          message: "Could not start checkout. Please try again.",
          type: "error",
        });
        return;
      }
      window.location.assign(url);
    } catch {
      setToast({
        title: "Something went wrong",
        message: "Could not start checkout. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]
        w-[92vw] max-w-[720px]
        z-30 rounded-3xl p-6 flex flex-col"
      >
        <div className="flex items-center justify-end">
          <button onClick={handleClose} className="-mt-4 -mr-5 md:m-0">
            <CloseIcon width={48} height={48} />
          </button>
        </div>

        <div className="-mt-2">
          <div className="text-[40px] leading-[44px] font-semibold text-[#333] tracking-250">
            Purchase a credit pack
          </div>
          <div className="text-base text-[#595959] mt-3 tracking-100">
            Credit packs offer predictable upfront spend
          </div>

          <div className="text-sm text-[#333] mt-6 tracking-100">
            Choose a credit pack size
          </div>

          <div className="mt-3 relative z-50">
            <button
              type="button"
              className="w-full h-[64px] rounded-2xl bg-[#FBFAFC] border border-[#EFEFEF] px-5 flex items-center justify-between"
              onClick={() => setOpenSelect((v) => !v)}
              disabled={loadingPacks || submitting}
            >
              <div className="text-[36px] leading-[36px] font-semibold text-[#333]">
                {selectLabel}
              </div>
              <div className="text-[#333] text-xl">⌄</div>
            </button>

            {openSelect && packs.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white overflow-hidden border border-[#EFEFEF] z-[60] custom-shadow-profile">
                {packs.map((p) => {
                  const money = formatMoneyFromMinorUnits({
                    unitAmount: p.unitAmount,
                    currency: p.currency,
                  });
                  const label = money
                    ? `${money} Credit Pack for ${p.tokens.toLocaleString()} credits`
                    : `${p.tokens} Credit Pack`;

                  const isActive = p.priceId === selectedPriceId;

                  return (
                    <button
                      key={p.priceId}
                      type="button"
                      className={`w-full text-left px-5 py-4 text-xl md:text-2xl tracking-100 ${
                        isActive
                          ? "bg-[#FBFAFC] text-[#333]"
                          : "text-[#333] hover:bg-[#FBFAFC]"
                      }`}
                      onClick={() => {
                        setSelectedPriceId(p.priceId);
                        setOpenSelect(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>{label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 relative z-10">
            <Button
              text={submitting ? "Redirecting…" : "Continue"}
              action={handleContinue}
              hasIconOrLoader
              loading={submitting}
              disabled={loadingPacks || !selectedPriceId}
            />
            <Button
              text="Cancel"
              secondary
              action={handleClose}
              disabled={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

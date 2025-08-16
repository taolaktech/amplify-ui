import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

export default function CarouselArrow({
  title,
  scrollBy,
}: {
  title: string;
  scrollBy: (offset: number) => void;
}) {
  const width = title === "Google" ? 350 : 300;

  return (
    <div className="flex items-center justify-end gap-4 p-6 w-full">
      <button
        onClick={() => scrollBy((-width + 24) * 2)}
        className="w-[38px] h-[38px] arrow-shadow rounded-full bg-[#fff] flex items-center justify-center"
      >
        <ArrowLeft2 size={26} color="#000" />
      </button>

      <button
        onClick={() => scrollBy((width + 24) * 2)}
        className="w-[38px] h-[38px] arrow-shadow rounded-full bg-[#fff] flex items-center justify-center"
      >
        <ArrowRight2 size={26} color="#000" />
      </button>
    </div>
  );
}

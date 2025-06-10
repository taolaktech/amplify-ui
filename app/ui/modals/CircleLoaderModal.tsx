import CircleLoader from "../loaders/CircleLoader";

export default function CircleLoaderModal({ text }: { text: string }) {
  return (
    <div className="">
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"></div>

      <div
        className="bg-white items-center justify-center fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
    h-[70vh] w-[90vw] max-h-[390px] md:max-h-[480px] max-w-[720px]
    z-30 rounded-3xl p-6 flex flex-col
    "
      >
        <CircleLoader />
        <p className="mt-6 text-center tracking-250">{text}</p>
      </div>
    </div>
  );
}

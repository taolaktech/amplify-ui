export default function EditCampaign({
  handleClose,
}: {
  handleClose: () => void;
}) {
  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>
      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
    h-[90vh] w-[90vw] max-w-[558px] max-h-[620px]  sm:max-h-[720px] 
    z-30 rounded-3xl flex flex-col pt-3
    "
      ></div>
    </div>
  );
}

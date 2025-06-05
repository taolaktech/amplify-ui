import React from "react";
import CloudLoading from "./CloudLoading";

function AutoFetchingProduct({
  closeClicked,
  fetchingProgress,
}: {
  closeClicked: () => void;
  fetchingProgress: number;
}) {
  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={closeClicked}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
    h-[70vh] w-[90vw] max-h-[390px] md:max-h-[480px] max-w-[720px]
    z-30 rounded-3xl p-6 flex flex-col
    "
      >
        <CloudLoading
          fetchingProgress={fetchingProgress}
          headingText="Auto-fetching products from synced Shopify store"
          subText="This might take a few minutes"
        />
      </div>
    </div>
  );
}

export default AutoFetchingProduct;

import { useState } from "react";

export const useImgTracker = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return {
    imgLoaded,
    setImgLoaded,
    imgError,
    setImgError,
  };
};

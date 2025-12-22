"use client";

import { useEffect } from "react";

export function useVisibilityChange(
  onHide: () => void,
  onShow: () => void
) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onHide();
      } else {
        onShow();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [onHide, onShow]);
}

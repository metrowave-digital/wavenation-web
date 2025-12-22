"use client"

import { useEffect } from "react"
import gsap from "gsap"

export function useArrowAnimation() {
  useEffect(() => {
    gsap.fromTo(
      ".movement",
      { y: 0 },
      {
        y: -3,
        duration: 0.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      }
    )
  }, [])
}

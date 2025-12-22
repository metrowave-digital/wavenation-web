"use client"

import { useEffect } from "react"
import gsap from "gsap"

export default function ChartAnimations() {
  useEffect(() => {
    /* -------------------------------------------------
       ONE-TIME ENTRANCE ONLY (EDITORIAL SAFE)
    ------------------------------------------------- */

    gsap.fromTo(
      `[data-wn-row]`,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.035,
      }
    )
  }, [])

  return null
}

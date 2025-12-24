"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTopOnSlugChange() {
  const pathname = usePathname()

  useEffect(() => {
    const el = document.querySelector("main")
    if (el) {
      el.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [pathname])

  return null
}

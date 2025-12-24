"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./MobileMenuModal.module.css";
import MobileMenu from "./MobileMenu";

interface MobileMenuModalProps {
  open: boolean;
  onClose: () => void;
}

const EXIT_MS = 220;

// Drag tuning
const DRAG_CLOSE_PX = 130;
const VELOCITY_CLOSE = 0.85;
const DRAG_MAX_PX = 520;

/* ------------------------------------------------------------
   ENV HELPERS
------------------------------------------------------------ */

function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------
   COMPONENT
------------------------------------------------------------ */

export default function MobileMenuModal({
  open,
  onClose,
}: MobileMenuModalProps) {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  const [dragY, setDragY] = useState(0);

  // Scroll freeze
  const scrollYRef = useRef(0);

  // Drag refs
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const velRef = useRef(0);

  const reduceMotion = prefersReducedMotion();

  /* ------------------------------------------------------------
     OPEN / CLOSE + PAGE FREEZE
  ------------------------------------------------------------ */

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
      setDragY(0);

      // -------------------------------
      // FREEZE PAGE (HARD LOCK)
      // -------------------------------
      scrollYRef.current = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Haptic feedback (mobile only)
      if (!reduceMotion && isCoarsePointer() && "vibrate" in navigator) {
        navigator.vibrate(10);
      }
    } else if (visible) {
      setClosing(true);

      const timeout = setTimeout(() => {
        setVisible(false);
        setClosing(false);
        setDragY(0);

        // -------------------------------
        // RESTORE PAGE SCROLL
        // -------------------------------
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        window.scrollTo(0, scrollYRef.current);
      }, EXIT_MS);

      return () => clearTimeout(timeout);
    }
  }, [open, visible, reduceMotion]);

  // Safety cleanup
  useEffect(() => {
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, []);

  /* ------------------------------------------------------------
     ESC KEY
  ------------------------------------------------------------ */

  useEffect(() => {
    if (!visible) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  /* ------------------------------------------------------------
     DRAG LOGIC
------------------------------------------------------------ */

  const beginDrag = (y: number) => {
    if (closing || reduceMotion) return;

    draggingRef.current = true;
    startYRef.current = y;
    lastYRef.current = y;
    lastTRef.current = performance.now();
    velRef.current = 0;
  };

  const moveDrag = (y: number) => {
    if (!draggingRef.current || closing || reduceMotion) return;

    const dy = Math.max(0, y - startYRef.current);
    const clamped = Math.min(DRAG_MAX_PX, dy);

    const now = performance.now();
    const dt = Math.max(1, now - lastTRef.current);
    velRef.current = (y - lastYRef.current) / dt;

    lastYRef.current = y;
    lastTRef.current = now;

    setDragY(clamped);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    if (dragY > DRAG_CLOSE_PX || velRef.current > VELOCITY_CLOSE) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  /* ------------------------------------------------------------
     STYLES (TYPE-SAFE)
------------------------------------------------------------ */

  const panelStyle: CSSProperties =
    !reduceMotion && dragY > 0
      ? {
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? "none" : undefined,
        }
      : {};

  const backdropStyle: CSSProperties =
    !reduceMotion && dragY > 0
      ? { opacity: Math.max(0.25, 1 - dragY / 420) }
      : {};

  if (!visible) return null;

  /* ------------------------------------------------------------
     RENDER
------------------------------------------------------------ */

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.closing : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <button
        className={styles.backdrop}
        style={backdropStyle}
        onClick={onClose}
        aria-label="Close menu"
      />

      <div
        className={`${styles.panel} ${closing ? styles.panelClosing : ""}`}
        style={panelStyle}
        onTouchStart={(e) => beginDrag(e.touches[0].clientY)}
        onTouchMove={(e) => {
          moveDrag(e.touches[0].clientY);
          e.preventDefault();
        }}
        onTouchEnd={endDrag}
        onPointerDown={(e) => beginDrag(e.clientY)}
        onPointerMove={(e) => moveDrag(e.clientY)}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className={styles.handle} aria-hidden="true" />
        <MobileMenu onNavigate={onClose} />
      </div>
    </div>
  );
}

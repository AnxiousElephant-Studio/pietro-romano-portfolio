"use client";

import { useEffect, useRef } from "react";
import { getFrameDeltaSeconds } from "@/core/lib/frameTime";
import { clamp } from "@/core/lib/math";
import type { LampScene } from "../lamp/createLampScene";
import { createHopMotion } from "../lamp/hopMotion";
import { createSwitchSounds } from "../lamp/switchSounds";

type LampSpotlightProps = { firstSectionId: string; lastSectionId: string };

const DESKTOP_QUERY = "(min-width: 1100px) and (pointer: fine)";
const LIT_CLASS = "is-lit";
const ACTIVE_CANVAS_CLASS = "is-active";
const LIGHTABLE_SELECTOR = ".card, .skill-group, .area";
const HOME_SECTION_SELECTOR = ".home-section";
const CONTENT_MAX_WIDTH_VARIABLE = "--max";
const FALLBACK_CONTENT_MAX_WIDTH_PX = 1160;

const LAMP_SCALE = { min: 0.85, max: 1.2, gutterWidthAtFullScale: 150 };
const LAMP_MIN_BASE_X_PX = 64;

const REGION = { topOffsetPx: 320, bottomPaddingPx: 40, restingViewportRatio: 0.62 };
const IDLE_TARGET_OFFSET = { x: 240, y: 20 };

const SCROLL_SETTLE_MS = 180;
const LIGHT_OFF_DELAY_MS = 500;

function readContentMaxWidth() {
  const cssValue = getComputedStyle(document.documentElement).getPropertyValue(CONTENT_MAX_WIDTH_VARIABLE);
  const parsedWidth = Number.parseFloat(cssValue);

  return Number.isFinite(parsedWidth) ? parsedWidth : FALLBACK_CONTENT_MAX_WIDTH_PX;
}

export default function LampSpotlight({ firstSectionId, lastSectionId }: LampSpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const firstSection = document.getElementById(firstSectionId);
    const lastSection = document.getElementById(lastSectionId);

    if (!canvas || !firstSection || !lastSection) {
      return;
    }

    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    const contentMaxWidth = readContentMaxWidth();
    const pointer = { x: 0, y: 0, isInsideWindow: false };
    const hopMotion = createHopMotion(0);
    const switchSounds = createSwitchSounds();
    const visibleSections = new Set<Element>();
    let litElement: HTMLElement | null = null;
    let lampScene: LampScene | null = null;
    let animationFrameId = 0;
    let lastFrameTime = 0;
    let hasPlacedLamp = false;
    let isCancelled = false;
    let lastScrollTime = 0;
    let restingDocumentY = 0;
    let isLightOn = false;
    let lightOffTimeoutId = 0;

    const setLightOn = (shouldBeOn: boolean) => {
      if (isLightOn === shouldBeOn) {
        return;
      }

      isLightOn = shouldBeOn;

      if (shouldBeOn) {
        switchSounds.playOn();
      } else {
        switchSounds.playOff();
      }
    };

    const setLitElement = (element: HTMLElement | null) => {
      if (litElement === element) {
        return;
      }

      litElement?.classList.remove(LIT_CLASS);
      element?.classList.add(LIT_CLASS);
      litElement = element;
      window.clearTimeout(lightOffTimeoutId);

      if (element) {
        setLightOn(true);
      } else {
        lightOffTimeoutId = window.setTimeout(() => setLightOn(false), LIGHT_OFF_DELAY_MS);
      }
    };

    const isLampActive = () => Boolean(lampScene) && visibleSections.size > 0;

    const handleUserGesture = () => {
      switchSounds.unlock();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.isInsideWindow = true;
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = (event.target as Element).closest<HTMLElement>(LIGHTABLE_SELECTOR);
      setLitElement(isLampActive() ? element : null);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) {
        return;
      }

      pointer.isInsideWindow = false;
      setLitElement(null);
    };

    const handleScroll = () => {
      lastScrollTime = performance.now();
    };

    const getRestingDocumentY = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = document.documentElement.clientHeight;
      const regionTop = firstSection.getBoundingClientRect().top + scrollTop + REGION.topOffsetPx;
      const regionBottom = lastSection.getBoundingClientRect().bottom + scrollTop - REGION.bottomPaddingPx;
      const viewportRestingY = scrollTop + viewportHeight * REGION.restingViewportRatio;

      return clamp(viewportRestingY, regionTop, Math.max(regionTop, regionBottom));
    };

    const getGutterWidth = () => Math.max((document.documentElement.clientWidth - contentMaxWidth) / 2, 0);
    const getBaseX = () => Math.max(LAMP_MIN_BASE_X_PX, getGutterWidth() / 2);
    const getLampScale = () =>
      clamp(getGutterWidth() / LAMP_SCALE.gutterWidthAtFullScale, LAMP_SCALE.min, LAMP_SCALE.max);

    const getLightTarget = (baseX: number, baseY: number) => {
      if (isLightOn && pointer.isInsideWindow) {
        return { x: pointer.x, y: pointer.y, isActive: true };
      }

      return { x: baseX + IDLE_TARGET_OFFSET.x, y: baseY + IDLE_TARGET_OFFSET.y, isActive: false };
    };

    const renderFrame = (frameTime: number) => {
      animationFrameId = 0;

      if (!lampScene || !isLampActive()) {
        return;
      }

      const deltaSeconds = getFrameDeltaSeconds(lastFrameTime, frameTime);
      lastFrameTime = frameTime;

      if (!hasPlacedLamp) {
        restingDocumentY = getRestingDocumentY();
        hopMotion.reset(restingDocumentY);
        hasPlacedLamp = true;
      }

      if (frameTime - lastScrollTime > SCROLL_SETTLE_MS) {
        restingDocumentY = getRestingDocumentY();
      }

      const { y: documentY, squash } = hopMotion.update(restingDocumentY, deltaSeconds);
      const baseY = documentY - window.scrollY;
      const baseX = getBaseX();
      const target = getLightTarget(baseX, baseY);

      lampScene.render({ baseX, baseY, lampScale: getLampScale(), squash, target }, deltaSeconds);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (animationFrameId || !isLampActive()) {
        return;
      }

      lastFrameTime = 0;
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const resizeCanvas = () =>
      lampScene?.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target);
        } else {
          visibleSections.delete(entry.target);
        }
      });

      const hasVisibleSection = visibleSections.size > 0;
      canvas.classList.toggle(ACTIVE_CANVAS_CLASS, hasVisibleSection);

      if (!hasVisibleSection) {
        setLitElement(null);
        hasPlacedLamp = false;
      }

      startLoop();
    });

    const mountLamp = async () => {
      if (lampScene || !desktopMedia.matches) {
        return;
      }

      const { createLampScene } = await import("../lamp/createLampScene");

      if (isCancelled || lampScene || !desktopMedia.matches) {
        return;
      }

      lampScene = createLampScene(canvas);
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("pointerdown", handleUserGesture);
      window.addEventListener("keydown", handleUserGesture);
      document.addEventListener("pointerover", handlePointerOver);
      document.addEventListener("pointerout", handlePointerOut);
      document.querySelectorAll(HOME_SECTION_SELECTOR).forEach((section) => sectionObserver.observe(section));
    };

    const unmountLamp = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      sectionObserver.disconnect();
      visibleSections.clear();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      setLitElement(null);
      window.clearTimeout(lightOffTimeoutId);
      isLightOn = false;
      canvas.classList.remove(ACTIVE_CANVAS_CLASS);
      hasPlacedLamp = false;
      lampScene?.dispose();
      lampScene = null;
    };

    const handleMediaChange = () => {
      if (desktopMedia.matches) {
        mountLamp();
      } else {
        unmountLamp();
      }
    };

    mountLamp();
    desktopMedia.addEventListener("change", handleMediaChange);

    return () => {
      isCancelled = true;
      desktopMedia.removeEventListener("change", handleMediaChange);
      unmountLamp();
      switchSounds.dispose();
    };
  }, [firstSectionId, lastSectionId]);

  return <canvas ref={canvasRef} className="lamp-canvas" aria-hidden="true" />;
}

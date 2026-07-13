import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useId,
  useReducer,
  useContext,
  createContext,
  useLayoutEffect,
  Fragment
} from "react";
import { cn } from "./cn";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useAnimationControls,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  LayoutGroup
} from "framer-motion";

export const liveScope = {
  React,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useId,
  useReducer,
  useContext,
  createContext,
  useLayoutEffect,
  Fragment,
  cn,
  motion,
  AnimatePresence,
  useAnimation,
  useAnimationControls,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  LayoutGroup,
};

export const prepareCodeForLivePreview = (rawCode) => {
  if (!rawCode) return { code: "", noInline: false };

  let processedCode = rawCode;

  // 1. Remove all import statements cleanly
  let code = processedCode
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
    .replace(/import\s+['"][^'"]+['"];?/g, '')
    .trim();

  // 2. Check for "export default function ComponentName"
  const exportFuncMatch = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
  if (exportFuncMatch) {
    const componentName = exportFuncMatch[1];
    code = code.replace(/export\s+default\s+function/, 'function');
    code += `\nrender(<${componentName} />);`;
    return { code, noInline: true };
  }

  // 3. Check for "export default ComponentName;" at bottom
  const exportDefaultMatch = code.match(/export\s+default\s+([A-Za-z0-9_]+);?/);
  if (exportDefaultMatch) {
    const componentName = exportDefaultMatch[1];
    code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, '');
    code += `\nrender(<${componentName} />);`;
    return { code, noInline: true };
  }

  // 4. Check if it defines a function or const component with return statements
  const funcMatch = code.match(/function\s+([A-Z][A-Za-z0-9_]*)/) || code.match(/const\s+([A-Z][A-Za-z0-9_]*)\s*=/);
  if (funcMatch && code.includes("return")) {
    const componentName = funcMatch[1];
    if (!code.includes("render(")) {
      code += `\nrender(<${componentName} />);`;
    }
    return { code, noInline: true };
  }

  return { code: processedCode, noInline: false };
};

export const getPreviewLayoutConfig = (code = "", name = "", slug = "") => {
  const text = `${code} ${name} ${slug}`.toLowerCase();

  // 1. Widescreen Dashboard / Bento Grid / Hero / Big Layouts
  if (
    text.includes("bento") ||
    text.includes("hero") ||
    text.includes("grid-cols-3") ||
    text.includes("grid-cols-4") ||
    text.includes("max-w-4xl") ||
    text.includes("max-w-5xl") ||
    text.includes("max-w-6xl") ||
    text.includes("max-w-7xl") ||
    text.includes("dashboard") ||
    text.includes("table")
  ) {
    return {
      bentoSpan: "col-span-1",
      containerClass: "w-[760px] max-w-none h-[440px] flex items-center justify-center scale-[0.66] origin-center pointer-events-none overflow-hidden p-4",
      type: "widescreen"
    };
  }

  // 2. Wide Horizontal Bars / Navbars / Headers / Docks
  if (
    text.includes("navbar") ||
    text.includes("nav-") ||
    text.includes("<nav") ||
    text.includes("dock") ||
    text.includes("header") ||
    text.includes("max-w-3xl")
  ) {
    return {
      bentoSpan: "col-span-1",
      containerClass: "w-[720px] max-w-none h-[280px] flex items-center justify-center scale-[0.76] origin-center pointer-events-none overflow-hidden p-4",
      type: "navbar"
    };
  }

  // 3. Tall Vertical Cards / Pricing / Auth / Forms / Accordions
  if (
    text.includes("pricing") ||
    text.includes("accordion") ||
    text.includes("saas") ||
    text.includes("tier") ||
    text.includes("max-w-sm") ||
    text.includes("max-w-xs") ||
    text.includes("form") ||
    text.includes("login") ||
    text.includes("auth")
  ) {
    return {
      bentoSpan: "col-span-1",
      containerClass: "w-[420px] max-w-none h-[380px] flex items-center justify-center scale-[0.80] origin-center pointer-events-none overflow-hidden p-4",
      type: "vertical-card"
    };
  }

  // 4. Compact Elements (Buttons, Toggles, Badges, Icons, Spinners)
  if (
    text.includes("button") ||
    text.includes("btn") ||
    text.includes("toggle") ||
    text.includes("badge") ||
    text.includes("spinner") ||
    text.includes("shimmer") ||
    (text.includes("<button") && !text.includes("max-w-"))
  ) {
    return {
      bentoSpan: "col-span-1",
      containerClass: "w-full h-full flex items-center justify-center scale-100 origin-center pointer-events-none p-4",
      type: "compact"
    };
  }

  // 5. Default Medium Widgets (Cards, Text Animations, Spotlight, Terminal, FAQ, etc.)
  return {
    bentoSpan: "col-span-1",
    containerClass: "w-full max-w-lg h-full flex items-center justify-center scale-95 origin-center pointer-events-none p-6",
    type: "medium-widget"
  };
};

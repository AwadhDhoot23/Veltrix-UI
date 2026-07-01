import React, { useState, useEffect, useRef, useCallback, useMemo, useId, useReducer, Fragment } from "react";
import { cn } from "./cn";
import { motion, AnimatePresence } from "framer-motion";

export const liveScope = {
  React,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useId,
  useReducer,
  Fragment,
  cn,
  motion,
  AnimatePresence,
};

export const prepareCodeForLivePreview = (rawCode) => {
  if (!rawCode) return { code: "", noInline: false };

  // Ensure responsive grid columns and flex items never collapse or hide in miniature catalog preview cards or zoomed viewports
  let processedCode = rawCode
    .replace(/grid-cols-1\s+md:grid-cols-3/g, 'grid-cols-3')
    .replace(/hidden\s+md:flex/g, 'flex')
    .replace(/md:col-span-2/g, 'col-span-2');

  // If it's a full file with export default
  if (processedCode.includes("export default")) {
    // 1. Remove imports
    let code = processedCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
    
    // 2. Extract exported component name
    const exportMatch = processedCode.match(/export\s+default\s+([A-Za-z0-9_]+);?/);
    if (exportMatch) {
      const componentName = exportMatch[1];
      // Remove export statement
      code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, '');
      // Append render call
      code += `\nrender(<${componentName} />);`;
      return { code, noInline: true };
    }
  }

  return { code: processedCode, noInline: false };
};

export const getPreviewLayoutConfig = (code = "", name = "", slug = "") => {
  const text = `${code} ${name} ${slug}`.toLowerCase();

  // 1. Widescreen Dashboard / Bento Grid / Multi-column Grid / Big Layouts
  if (
    text.includes("bento") ||
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
      containerClass: "w-[920px] max-w-none h-[520px] flex items-center justify-center scale-[0.42] origin-center pointer-events-none p-4",
      type: "widescreen"
    };
  }

  // 2. Wide Horizontal Bars / Navbars / Headers
  if (
    text.includes("navbar") ||
    text.includes("nav-") ||
    text.includes("<nav") ||
    text.includes("header") ||
    text.includes("max-w-3xl")
  ) {
    return {
      containerClass: "w-[760px] max-w-none h-[400px] flex items-center justify-center scale-[0.52] origin-center pointer-events-none p-4",
      type: "navbar"
    };
  }

  // 3. Tall Vertical Cards / Pricing / Auth / Forms
  if (
    text.includes("pricing") ||
    text.includes("saas") ||
    text.includes("tier") ||
    text.includes("max-w-sm") ||
    text.includes("max-w-xs") ||
    text.includes("form") ||
    text.includes("login") ||
    text.includes("auth")
  ) {
    return {
      containerClass: "w-[500px] max-w-none h-[520px] flex items-center justify-center scale-[0.54] origin-center pointer-events-none p-4",
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
      containerClass: "w-full h-full flex items-center justify-center scale-[0.9] origin-center pointer-events-none p-4",
      type: "compact"
    };
  }

  // 5. Default Medium Widgets (Accordions, Feature Cards, Spotlight, Terminal, FAQ, max-w-md, max-w-lg, max-w-xl)
  return {
    containerClass: "w-[540px] max-w-none h-[420px] flex items-center justify-center scale-[0.66] origin-center pointer-events-none p-4",
    type: "medium-widget"
  };
};

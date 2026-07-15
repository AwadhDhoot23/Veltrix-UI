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


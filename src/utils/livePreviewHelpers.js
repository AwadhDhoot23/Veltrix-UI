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

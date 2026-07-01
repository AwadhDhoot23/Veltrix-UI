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

  // If it's a full file with export default
  if (rawCode.includes("export default")) {
    // 1. Remove imports
    let code = rawCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
    
    // 2. Extract exported component name
    const exportMatch = rawCode.match(/export\s+default\s+([A-Za-z0-9_]+);?/);
    if (exportMatch) {
      const componentName = exportMatch[1];
      // Remove export statement
      code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, '');
      // Append render call
      code += `\nrender(<${componentName} />);`;
      return { code, noInline: true };
    }
  }

  // If it's just a functional component without export default but has a function definition
  // We can try to guess the function name, but usually they'll have export default if they copied a file.

  return { code: rawCode, noInline: false };
};

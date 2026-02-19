import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"; // <-- Here is the twMerge import!

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
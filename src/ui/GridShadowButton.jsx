import React from "react";
import { cn } from "../utils/cn";
function GridShadowButton({ className }) {
  return (
    <div>
      <div
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0",
          backgroundSize: "6px 6px",
        }}
        className="rounded-md"
      >
        <button
          className={cn(
            "px-6 py-3 font-semibold text-2xl rounded-md hover:border hover:border-neutral-500 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 text-white hover:-translate-y-3 hover:translate-x-3 transform transition duration-400 cursor-pointer",
            className,
          )}
        >
          Button
        </button>
      </div>
    </div>
  );
}
export default GridShadowButton;

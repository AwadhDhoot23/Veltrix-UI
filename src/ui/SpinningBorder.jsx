import React from "react";

function SpinningBorder() {
  return (
    <div className="relative w-40 h-40 overflow-hidden rounded-md">
      <div className="absolute -inset-2 bg-gradient-to-r from-neutral-400 via-purple-400 to-pink-400 animate-[spin_2s_linear_infinite]" />

      <div className="flex items-center justify-center absolute inset-[4px] bg-black rounded-xl">
        <p className="text-2xl">Card</p>
      </div>
    </div>
  );
}

export default SpinningBorder;

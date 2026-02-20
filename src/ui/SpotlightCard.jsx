import React, { useState } from "react";
const SpotlightCard = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-900/80 bg-neutral-950 min-h-[16rem] w-full max-w-lg p-7"
    >
      <div
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(200,200,255,0.1),transparent 35%)`,
        }}
        className=" pointer-events-none absolute inset-0"
      ></div>

      <div className="relative z-1  text-center pointer-events-none text-white">
        <h2 className=" text-3xl font-bold text-neutral-200">Spotlight Card</h2>
        <p className="text-neutral-400 text-md mt-4">
          Hover over me to see the magic.
        </p>
      </div>
    </div>
  );
};

export default SpotlightCard;

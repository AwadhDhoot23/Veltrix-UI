import React from "react";

function SimpleButton() {
  return (
    <div>
      <div className="border border-dashed border-neutral-600 rounded-md">
        <button className="px-6 py-3 text-2xl rounded-md border hover:border-2 hover:border-neutral-500 bg-neutral-100 text-neutral-900 hover:-translate-y-3 hover:translate-x-3 transform transition duration-400 cursor-pointer">
          
          Simple
        </button>
      </div>
    </div>
  );
}

export default SimpleButton;

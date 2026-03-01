import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
function DependenciesDropdown({ dependencies }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!dependencies || dependencies.length === 0) {
    return null; 
  }
  const installCommand = `npm install ${dependencies.join(" ")}`;
  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };
  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setOpen(!open)}
        className="border relative font-bold border-neutral-400 bg-neutral-700/50 rounded-t-lg pl-2"
      >
        dependencies
        {open ? (
          <ArrowDropUpIcon sx={{ fontSize: 25 }} />
        ) : (
          <ArrowDropDownIcon sx={{ fontSize: 25 }} />
        )}
      </button>
      {open && (
        <div className="w-full absolute left-0 mt-1 right-0  border border-neutral-500 bg-black/95 p-2 rounded-b-lg  shadow-xl">
          <div className="flex justify-between">
          <p className="text-xs text-neutral-400 mb-2">
            Run this in your terminal:
          </p>
           <button
              onClick={handleCopyCommand}
              className=" relative -top-1 text-neutral-400 hover:text-white cursor-pointer"
            >
            {copied ? (
                <DoneIcon className="text-green-400" sx={{ fontSize: 18 }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 18 }} />
              )}
              </button>
          </div>

          <div className=" flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded p-2">
            <code className="text-sm text-green-500">
                {installCommand}
            </code>

           
          </div>
        </div>
      )}
    </div>
  );
}

export default DependenciesDropdown;

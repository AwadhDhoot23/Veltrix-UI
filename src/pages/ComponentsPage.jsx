import React, { useState } from "react";
import { Components } from "../data/Components";
import CardComponent from "../components/CardComponent";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Cancel";

import { useParams } from "react-router-dom";
function ComponentsPage() {
  const [query, setQuery] = useState("");
  const { slug } = useParams();
  const filterComponents = Components.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLocaleLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLocaleLowerCase()),
      ),
  );
  return (
    <div>
      <div className="flex-0 min-h-screen overflow-hidden pl-6 md:pl-80 code-scroll ">
        <Sidebar className="" />
        <div className=" relative mt-5 ml-5">
          <SearchIcon className="relative left-7 md:top-0 md:left-8 pb-1" />
          <input
            className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-500 text-white px-9 w-55 md:w-60 lg:w-150 rounded-full h-10 border border-neutral-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="  Search.."
          />
          <ClearIcon
            onClick={() => setQuery("")}
            className="absolute left-53 top-2  md:left-58 lg:left-147 md:top-2 cursor-pointer "
          />
        </div>

        {filterComponents.length === 0 && (
          <div className="absolute top-15 mt-6 left-166 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-300">
            <CancelIcon className="absolute mt-6 top-1 text-red-500" />
            <pre className="absolute text-center">
              No Components found! Try tweeking the search
            </pre>
          </div>
        )}
        <div
          layoutId={`card-${slug}`}
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4  flex-1 md:gap-1 lg:gap-70 xl:gap-80 overflow-y-auto h-full my-5"
        >
          {filterComponents.map((item) => (
            <CardComponent
              key={item.slug}
              name={item.name}
              description={item.description}
              slug={item.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComponentsPage;

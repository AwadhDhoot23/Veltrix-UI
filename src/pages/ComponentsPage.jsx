import React, { useState } from "react";
import { Components } from "../data/Components";
import CardComponent from "../components/CardComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Cancel";
import HomeIcon from '@mui/icons-material/Home';
import {motion} from 'framer-motion'

import { useNavigate, useParams } from "react-router-dom";

function ComponentsPage() {
  useGSAP(()=>{
    gsap.from(".componentCard",{
      y:100,
      stagger:0.2,
      opacity:0,
      ease:'linear',
      scrollTrigger:{
        trigger:'.gridBox',
        start: "top 85%",
      }
    })
  })
  const navigate=useNavigate();
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
    <motion.div
      initial={{
            opacity:0,
            y:20,
          }}
          animate={{
            opacity:1,
            y:0,
          }}
          exit={{
            opacity:0,
            y:-20,
          }}
          transition={{
            duration:0.4,
          }}
    >
      <div className="flex flex-col min-h-full relative pl-6 md:pl-80">
        <Sidebar/>
        <div onClick={()=>navigate('/')} className="absolute  md:hidden top-7 left-8">
          <HomeIcon className="text-neutral-400"/>
        </div>
        <div className="relative gap-5 md:flex  md:flex-row mt-5 ml-5">
          <SearchIcon className="relative left-8 top-0.5 md:top-3 md:left-14 pb-1" />
          <input
            className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-500 text-white px-9 w-55 md:w-60 lg:w-150 rounded-full h-10 border border-neutral-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="  Search.."
          />
          <div className="md:mt-0 mt-5 left-0 top-10 flex items-center justify-center gap-3 font-bold">
            
            <div onClick={()=>setQuery('button')} className="bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 text-xs cursor-pointer px-3 py-2 rounded-xl border border-neutral-500">Buttons</div>
            <div onClick={()=>setQuery('card')} className="bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 text-xs cursor-pointer px-3 py-2 rounded-xl border border-neutral-500">Cards</div>
          </div>
          <ClearIcon
            onClick={() => setQuery("")}
            className="absolute left-53 top-2  md:left-58 lg:left-147 md:top-2 cursor-pointer "
          />
        </div>

        {filterComponents.length === 0 && (
          <div className="absolute left-45 text-xs md:text-xl top-[10%] text-[14px] md:text-lg mt-3md:top-13 md:mt-6 md:left-166 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-300">
            <CancelIcon className="absolute mt-6 top-1 text-red-500" />
            <pre className="absolute text-center">
              No Components found! Try tweeking the search
            </pre>
          </div>
        )}
        <div
          layoutId={`card-${slug}`}
          className="overflow-y-hidden grid gridBox grid-cols-1 md:grid-cols-1 lg:grid-cols-2 pb-10 xl:grid-cols-3 flex-1 overflow-y-auto min-h-screen gap:20"
        >
          
            {filterComponents.map((item) => (
              <div className="componentCard ">
            <CardComponent
              key={item.slug}
              name={item.name}
              description={item.description}
              slug={item.slug}
              />
              </div>
          ))}
        </div>
        
      </div>
    </motion.div>
  );
}

export default ComponentsPage;

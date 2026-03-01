import React from 'react'
import GridShadowButton from '../ui/GridShadowButton.jsx?raw';
import SpotlightCard from '../ui/SpotlightCard.jsx?raw';
import SpinningBorder from '../ui/SpinningBorder.jsx?raw';
export const FilterTags = [
  "All",
  "button",
  "card",
  "3d",
];
export const Components=[
    

  {name:'Grid Shadow Button' ,slug:'grid-shadow-button', description:'A sleek, dark-themed button that lifts on hover to reveal a stylish dotted grid pattern underneath, creating a 3D offset effect.',
    tags:['button','grid','hover'],  
    featured:true,
    code:GridShadowButton,
    dependencies:["clsx", "tailwind-merge"],
  },

  {name:'Spotlight Card' ,slug:'spotlight-card', description:'An interactive card with a soft, glowing radial gradient that smoothly tracks the mouse cursor across its surface and borders.',
    tags:['card','interactive','hover'],  
    featured:true,
    code:SpotlightCard,
    dependencies:[],
  },
  {name:'Spinning Border' ,slug:'spinning-border', description:'A border around a button that spins continously.',
    tags:['border','button','animation'],  
    featured:true,
    code:SpinningBorder,
    dependencies:[],
  },

]

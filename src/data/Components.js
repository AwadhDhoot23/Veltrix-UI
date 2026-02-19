import React from 'react'
import SimpleButton from '../ui/SimpleButton?raw';
export const FilterTags = [
  "All",
  "button",
  "card",
  "3d",
];
export const Components=[
    {name:'3D Cards' ,slug:'3d-cards', description:'A card which looks 3d as if coming out of screen with smooth animations.',tags:['card','3d','animation'],featured:true},

    {name:'Simple Button' ,slug:'simple-button', description:'A very well simple and minimal button that can be used anywhere.',
    tags:['button','simple','minimal'],  
    featured:true,
    code:SimpleButton,}

]

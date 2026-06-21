const express=require('express');
const connectDB=require('./config/db');
const cors=require('cors');
const dotenv = require('dotenv');
const authRoutes=require("./routes/auth.routes");

dotenv.config();
connectDB();

const app=express();
const port=process.env.PORT || 5000

app.use(cors());
app.use(express.json())
app.use('/api/auth',authRoutes);

app.get('/',(req,res)=>{
    res.json({message:'Veltrix UI API is running'})
})

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})
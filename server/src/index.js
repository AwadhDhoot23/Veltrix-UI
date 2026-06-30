const express=require('express');
const connectDB=require('./config/db');
const cors=require('cors');
const dotenv = require('dotenv');
const authRoutes=require("./routes/auth.routes");
const componentRoutes = require('./routes/component.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const analyticsRoutes = require('./routes/analytics.routes');

dotenv.config();
connectDB();

const app=express();
const port=process.env.PORT || 5000

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json())
app.use('/api/auth',authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/',(req,res)=>{
    res.json({message:'Veltrix UI API is running'})
})

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})
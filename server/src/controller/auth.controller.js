const User = require("../models/User.models");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

const generateToken=(userId)=>{
    return jwt.sign({id:userId},
        process.env.JWT_SECRET,{expiresIn:"15d"}
    )
}

exports.register=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const existingUser=await User.findOne({$or: [{email},{username}]});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=await User.create({
            username,
            email,
            password:hashedPassword,
        });
        const token=generateToken(user._id);
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token,
        });
    }   catch (error) {
        res.status(500).json({message:error.message})
    }
};

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token=generateToken(user._id);
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token,
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.getMe = async (req, res) => {
  try {
    // req.user will be attached by our auth middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from query
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


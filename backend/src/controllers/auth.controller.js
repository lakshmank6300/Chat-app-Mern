import express from 'express';
import { User } from '../models/user.model.js'
import { generateToken } from '../lib/utils.js';
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js';



export async  function signup (req,res){
    const {fullname,email,password}=req.body;
    try{
        if( !fullname || !email || !password){
        console.log(fullname,email,password)
            return res.status(400).json({message:"all fields are required"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const user = await User.findOne({ email })
        if(user) return res.status(400).json({message:"Email already exists"});

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullname:fullname,email:email,password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res)

            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                password:hashedPassword,
                ProfilePic: newUser.ProfilePic,
            });
        }
        else{
            return res.status(400).json({message:"Invalid User Data"});
        }
    }catch(err){
        console.log("Error in Sign Up controller",err.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function login (req,res){
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email}); 
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Password Incorrect"})
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            ProfilePic:user.ProfilePic
        })
    }catch(err){
        console.log("Error in login controller",err.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function logout(req,res){
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }catch(err){
        console.log("Error in login controller",err.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function updateProfile(req,res){
    try{
        const {ProfilePic} = req.body;
        // console.log(ProfilePic);
        const userId=req.user._id;
        if(!ProfilePic){
            return res.status(400).json({message:"Profile pic not provided"})
        }
        const uploadResponse=await cloudinary.uploader.upload(ProfilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{ProfilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updatedUser);
    }catch(err){
        console.log("Error in Update Profile",err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
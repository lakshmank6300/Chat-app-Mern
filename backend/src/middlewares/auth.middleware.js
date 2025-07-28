import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

export const protectRoute = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message : "un-authorized No token Provided"});
            return;
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded) {
            return res.status(401).json({message: "UnAuthorized Token not Valid"})
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({message:"User not found"});
        req.user=user;
        next();
    }catch(err){
        console.log("Error in Protected Route ",err);
        return res.status(501).json({message:"Internal Server Error"});
    }
}
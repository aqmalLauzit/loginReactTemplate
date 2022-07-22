import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const refreshToken = asyncHandler(async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        res.sendStatus(401);
        throw new Error('Tidak ada token');
    }
    const user = await User.find({
        refresh_token : refreshToken
    })
    if(!user) {
        res.sendStatus(403)
        throw new Error('Forbiden')
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            res.sendStatus(403)
        }
        const userId = user[0]._id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId,name,email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        })
        res.json({accessToken})
    })
})
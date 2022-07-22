import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async(req,res) => {
    const { name,email,password,confPassword,pic } = req.body;

    const userExist = await User.findOne({email})
    if(userExist) {
        res.status(400)
        throw new Error('email sudah terdaftar')
    }


    if (name == '' && email == '' && password == '' && confPassword == '' && pic == '') {
        res.status(400)
        throw new Error('isi semua field')
    }

    if (password !== confPassword) {
        res.status(400)
        throw new Error('password dan Confirm password tidak sama')
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        const user = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            pic: pic,
            refresh_token: 'notSet'
        })
    
        if(user) {
            res.status(201).json({mesage: "Register berhasil"})
        } else {
            res.status(400)
            throw new Error('Server error')
        }
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
    
})

export const getUsers = asyncHandler(async(req,res) => {
    const users = await User.find().select('-password');


    console.log(users);
    res.status(200).json(users)
})

export const login = asyncHandler(async (req,res) => {
    const {email, password} = req.body;

    if(!email && !password) {
        res.status(400)
        throw new Error('Field Email dan Password wajib di isi')
    }

    const userExist = await User.findOne({email})

    if(userExist) {
        const match = await bcrypt.compare(password, userExist.password)

        if(match) {
            const userId = userExist._id;
            const name = userExist.name;
            const email = userExist.email;
            const pic = userExist.pic;
            const isAdmin = userExist.isAdmin;
            const accessToken = jwt.sign({userId, name, email, pic, isAdmin}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            })
            const refreshToken = jwt.sign({userId, name, email, pic, isAdmin}, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            })

            const user = await User.findByIdAndUpdate(userId, {
                refresh_token : refreshToken
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                
            });

            res.status(200).json({ accessToken })


        } else {
            res.status(404)
            throw new Error('Password salah')
        }
    } else {
        res.status(404)
        throw new Error('Email belum terdaftar')
    }
})

export const logout = asyncHandler(async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        res.sendStatus(204);
        throw new Error('Tidak ada token');
    }
    const user = await User.find({
        refresh_token : refreshToken
    })
    if(!user) {
        res.sendStatus(403)
        throw new Error('Forbiden')
    }
    const userId = user._id;
    await User.findByIdAndUpdate(userId,{refresh_token: null})
    res.clearCookie('refreshToken');
    return res.sendStatus(200)
})


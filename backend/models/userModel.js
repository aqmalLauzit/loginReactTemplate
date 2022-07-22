import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'field nama wajib di isi']
    },
    email: {
        type: String,
        required: [true, 'field email wajib di isi'],
        unique: [true, 'email sudah terdaftar']
    },
    password: {
        type: String,
        required: [true, 'field password wajib di isi']
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    pic: {
        type: String,
        required: true,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
    },
    refresh_token: {
        type: String
    }
}, {
    timestamp: true
})

const User = mongoose.model('User', userSchema);

export default User;
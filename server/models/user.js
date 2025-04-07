const mongoose = require("mongoose");

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 50, unique:true},
    email: { type: String, required: true, unique:true},
    password: { type: String, required: true},
    dateOfRegistration: { type: Date,require:true, default: Date.now},
    role: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date}
})

module.exports = mongoose.model("User", UserSchema);
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    usertype: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: Number,
        required: false
    },
    apartmentnumber: {
        type: String,
        required: false
    },
    checkindate: {
        type: Date,
        required: false
    },
    checkoutdate: {
        type: Date,
        required: false
    },
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }]
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const passenger = new Schema({
    name:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    birthNumber:{
        type: Number,
        required: true
    },
    coach:{
        type: String,
        required: true
    },
    trainNumber:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    }
});

const Passenger = mongoose.model("passenger",passenger);

module.exports = {Passenger};
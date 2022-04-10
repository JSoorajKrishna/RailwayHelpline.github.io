const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const police = new Schema({
    name:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    idNumber:{
        type: Number,
        required: true
    }
});

const Police = mongoose.model("police",police);


const doctor = new Schema({
    name:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    idNumber:{
        type: Number,
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
    // coach:{
    //     type: String,
    //     required: true
    // },
    // from:{
    //     type: String,
    //     required: true
    // },
    // to:{
    //     type: String,
    //     required: true
    // }
});

const Doctor = mongoose.model("doctor",doctor);


const ttr = new Schema({
    name:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    idNumber:{
        type: Number,
        required: true
    }
});

const Ttr = mongoose.model("ttr",ttr);

module.exports = {Police, Doctor, Ttr};
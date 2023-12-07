const mongoose = require('mongoose')

const maintenanceRequestSchema = new mongoose.Schema({

    userid:{
        type: String,
        required:false
    },
    apartmentnumber: {
        type: String,
        required: true
    },
    problemarea:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    datetime:{
        type: Date,
        required: true
    },
    problemimage: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    }
    
});

const maintenanceRequestModel = mongoose.model("maintenanceRequests", maintenanceRequestSchema);
module.exports = maintenanceRequestModel;
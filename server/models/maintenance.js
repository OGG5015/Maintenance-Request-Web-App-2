const mongoose = require('mongoose')

const maintenanceSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
});

const maintenanceModel = mongoose.model("maintenance", maintenanceSchema);
module.exports = maintenanceModel;
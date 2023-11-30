const mongoose = require('mongoose')
const department = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        ref: "users",
    },
    department_name: {
        type: String,
    },
},
    {
        timestamps: true,
    }
)
const Department = mongoose.model('Department', department);
module.exports = Department;
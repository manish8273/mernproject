const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        email: {
            type: String,
        },

        phoneNumber: {
            type: Number,
        },

        countryCode: {
            type: String,
        },

        country: {
            type: String,
        },

        password: {
            type: String,
        },

        dob: {
            type: String,
        },

        role: {
            type: Number,
            enum: [1, 2],
        }, //,1=manager,2-employees
       
        gender: {
            type: Number,
            enum: [1, 2],
        }, //,1-male,2-female,

        age: {
            type: Number,
        },

        address: {
            type: String,
        },
      location: {
            type: String,
        },
        images: {
            type: String,
            default: "",
        },
        loginTime: {
            type: Number,
            default: 0,
        },
      deviceType: {
            type: Number,
            enum: [0, 1],
        }, //0-android,1-ios

        socialType: {
            type: Number,
            enum: [1, 2, 3],
        }, //1 google//2 facebook//3 apple
       
        socialId: {
            type: String,
        },
       
        otp: {
            type: Number,
        },

        role: {
            type: Number,
            enum: [0, 1]
        },

        

        deviceToken: {
            type: String,
        },

        isNotification: {
            type: Number,
            enum: [0, 1],
            default: 0,
        }, //0-off, 1-on
    },

    {
        timestamps: true,
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;
// export default new mongoose.models("users", users);
// module.exports = new mongoose.model("users", users);
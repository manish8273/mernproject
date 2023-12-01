
const db = require("../models/User.js")
var model = require("../models/Department.js")
const helper = require('../helper/helpers')
const bcrypt = require('bcryptjs');


const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secretCryptoKey = "jwtSecretKey";
const mongoose = require("mongoose");

module.exports = {

  singup: async (req, res) => {
    try {

      const required = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,

        country: req.body.country,
        password: req.body.password,

        age: req.body.age,

        location: req.body.location,

      };
      const nonRequired = {
        deviceToken: req.body.deviceToken,
        address: req.body.address,
        deviceType: req.body.deviceType,
        dob: req.body.dob,
        gender: req.body.gender,
        socialType: req.body.socialType,
        countryCode: req.body.countryCode,
        socialId: req.body.socialId,
        otp: req.body.otp,
        images: req.files && req.files.images,
        role: req.body.role,
        address: req.body.address,
      }
      const getdata = await helper.vaildObject(required, nonRequired, res);


      const findphone = await db.findOne({
        phoneNumber: getdata.phoneNumber
      })
      if (findphone) {

        return helper.error(res, "This Number is Already Exits please Used Another Number");
      }

      const findemail = await db.findOne({
        email: getdata.email
      })
      if (findemail) {
        helper.error(res, "This is Already Exits please use Another Email")
      }

      if (req.files && req.files.images) {
        var images = req.files.images
        if (images) {
          req.body.images = (await helper.fileUpload(images, 'images'));
        }
      }
      const password = bcrypt.hashSync(getdata.password, saltRounds);

      const createUser = await db.create({
        name: getdata.name,
        email: getdata.email,
        phoneNumber: getdata.phoneNumber,
        countryCode: getdata.countryCode,
        country: getdata.country,
        password: password,
        dob: getdata.dob,
        gender: getdata.gender,
        age: getdata.age,
        address: getdata.address,
        location: getdata.location,
        images: req.body.images,
        role: getdata.role

      })

      return helper.success(res, "SignUp Successfully", createUser);

    } catch (error) {
     return helper.error(res,error)
    }
  },


 

  update_profile: async (req, res) => {
    try {
      const required = {}
      const nonRequired = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        countryCode: req.body.countryCode,
        country: req.body.country,

        dob: req.body.dob,
        gender: req.body.gender,
        age: req.body.age,
        address: req.body.address,
        location: req.body.location,
        deviceToken: req.body.deviceToken,
        deviceType: req.body.deviceType,
        socialType: req.body.socialType,
        socialId: req.body.socialId,
        otp: req.body.otp,
        images: req.files && req.files.images,
      };

      const getdata = await helper.vaildObject(required, nonRequired, res);
      if (req.files && req.files.images) {
        var images = req.files.images
        if (images) {
          req.body.images = (await helper.fileUpload(images, 'images'));
        }
      }


      const update = await db.findOneAndUpdate(
        { _id: req.user.id }, // Filter by _id
        { $set:{

          name: getdata.name,
          email: getdata.email,
          phoneNumber: getdata.phoneNumber,
          countryCode: getdata.countryCode,
          country: getdata.country,

          dob: getdata.dob,
          gender: getdata.gender,
          age: getdata.age,
          address: getdata.address,
          location: getdata.location,
          deviceToken: getdata.deviceToken,
          deviceType: getdata.deviceType,
          socialType: getdata.socialType,
          socialId: getdata.socialId,
          otp: getdata.otp,
          images: req.body.images,
        }

        },

      );
return helper.success(res,"Update Profile Success",update)
    } catch (error) {
      return helper.error(res,error)
    }
  },

  delete: async (req, res) => {
    try {
      const deleteuser = await model.deleteOne({
        _id: req.params._id
      });
      return helper.success(res, 'Department deleted successfully', deleteuser);
    } catch (error) {
      return helper.error(res, error)

    }
  },

 

  login: async function (req, res) {
    try {
      const required = {
        email: req.body.email,
        password: req.body.password,
      };
      const nonRequired = {
        deviceToken: req.body.deviceToken,
       
      };

      const getdata = await helper.vaildObject(required, nonRequired, res);
      let user = await db.findOne({
        email: getdata.email,
      });

      if (user == null) {
        return helper.error(res, "Email does not exist", user);
      }

      let time = helper.unixTimestamp();

      let checkPassword = await bcrypt.compare(getdata.password, user.password);

      if (!checkPassword) {
        return helper.error(res, 'Incorrect email or password');
      }

      await db.updateOne(
        { _id: user._id },
        {
          $set: {
            loginTime: time,
            deviceToken: getdata.deviceToken,
          },
        }
      );

      let token = jwt.sign(
        {
          data: {
            _id: user._id,
            email: user.email,
            loginTime: time,
          },
        },
        secretCryptoKey,
        // { expiresIn: "365d" } // Optionally, you can set an expiration time for the token
      );
      user = JSON.parse(JSON.stringify(user));

      // Assign the token to the user object
      user.token = token;
     return helper.success(res,"Login Success",user)
    } catch (error) {
     return helper.error(res,error)
    }
  },

  userLogout: async (req, res) => {
    try {
      const logout = await db.updateOne(
        { _id: req.user._id },
        {
          $set: {
            loginTime: 0,
          },

        }
      );

      if (!logout) {
        return error(res, "UserNot Found");
      }
      return helper.success(res, "Logout Successfully");
    } catch (error) {
      console.log(error);
    }
  },


  adminprofile: async (req, res) => {
    try {
      const finddetails = await db.findOne({
        _id: req.user._id
      })
      if (!finddetails) {
        return helper.error(res, "User Profile Not Found")
      }

      return helper.success(res, "User Profile Get SuccessFully", finddetails)
    } catch (error) {
      console.log(error);
    }
  },


  changePassword: async (req, res) => {
    try {
      const required = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        currentPassword: req.body.currentPassword,
      }
      const nonRequired = {}
      let requestData = await helper.vaildObject(required, nonRequired, res);

      const findemail = await db.findById({
        _id: req.user._id
      })
      if (requestData.newPassword !== requestData.currentPassword) {
        return helper.error("NewPassword And CurrentPassword is Not Match")
      }
      const hash = bcrypt.hashSync(requestData.newPassword, saltRounds);
      const match = await bcrypt.compare(requestData.oldPassword, findemail.password);
      if (!match)
        return helper.error(res, "Old Password is Not Match")


      const updateddsdsr = await db.updateOne(
        { _id: req.user._id },
        { $set: { password: hash } }
      );

      const updatedUser = await db.findOne({

        _id: req.user._id,

      });
      return helper.success(res, "Updated Password Successfully", updatedUser)
    } catch (error) {
      return helper.error(res,error)
    }
  },

  employee_list: async(req,res)=>{
    try {
      const find_details =  await db.find({
        role:0
      }) 
      return helper.success(res,"Get All Employee Details",find_details)
    } catch (error) {
      return helper.error(res,error)
    }
  }














}






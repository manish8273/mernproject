const db = require("../models")
const bcrypt = require('bcryptjs');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const saltRounds = 10;
var jwt = require("jsonwebtoken");

// const secretCryptoKey = "jwtSecretKey";
const helper = require('../helpers/helper.js');
// db.messages.belongsTo(db.users,{foreignKey:'senderId',as:'sender_details'});



db.users.hasOne(db.rating, {foreignKey: 'user_id'});

module.exports = {

    createuser: async function (req, res) {
        try {

            const required = {

                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                dob: req.body.dob,
                country: req.body.country,
                age: req.body.age,
                location: req.body.location,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                password: req.body.password,


            };

            const nonRequired = {
                images: req.body.images,
                role: req.body.role,
                confirm_password: req.body.confirm_password

            };

            const getdata = await helper.vaildObject(required, nonRequired, res);

            const emailfind = await db.users.findOne({
                where: {
                    email: getdata.email
                }
            });
            if (emailfind)
                res.json({ code: 400, message: "Email Already exits" });

            const findnumber = await db.users.findOne({
                where: {
                    phone: getdata.phone
                }
            });
            if (findnumber) throw new Error('Phone number is already in use. Please use another number.');
            if (req.files && req.files.images) {
                var images = req.files.images;

                if (images) {
                    req.body.images = (await helper.fileUpload(images, "images"));
                }
            }
            const password = await bcrypt.hash(getdata.password, saltRounds);
            var otp = Math.floor(1000 + Math.random() * 9000);
            let time = helper.unixTimestamp();
         
            const data = await db.users.create({
                name: getdata.name,
                email: getdata.email,
                phone: getdata.phone,
                images: req.body.images, // Assuming imgdata has already been processed
                dob: getdata.dob,
                country: getdata.country,
                password: password,
                age: getdata.age,
                location: getdata.location,
                latitude: getdata.latitude,
                longitude: getdata.longitude,
                role: getdata.role,
                otp:otp
            });

            const token = jwt.sign(
                {
                    data: {
                        id: data.id, // Use data.id instead of getdata.id
                        name: getdata.name,
                        email: getdata.email,
                        role: getdata.role,
                        loginTime: time,
                  
                    },
                },
                secretCryptoKey,
                { expiresIn: "365d" }
            );

            const userDetail = await db.users.findOne({
                where: {
                    email: getdata.email,
                    role: getdata.role
                },
                raw: true
            });

            return helper.success(res, "SignUp Successfully", userDetail);
        } catch (error) {
            console.log(error);
        }
    },

    longiapi: async function (req, res) {
        try {
            const required = {
                email: req.body.email,
                password: req.body.password,


            };
            const nonRequired = {};

            const getdata = await helper.vaildObject(required, nonRequired, res)
            let verify_email = await db.users.findOne({
                where: {
                    email: getdata.email,

                },
                raw: true
            })
            if (verify_email == null) {
                res.json({ code: 400, message: "email does not exits", verify_email })
            };
            let time = helper.unixTimestamp();

            let checkPassword = await bcrypt.compare(getdata.password, verify_email.password)
            if (!checkPassword) throw 'Incorrect email or password';
            await db.users.update({
                loginTime: time

            }, {
                where: {
                    email: getdata.email,

                }
            });

            let userDetail = await db.users.findOne({
                where: {
                    id: verify_email.id
                },
                raw: true
            })

            let token = jwt.sign(
                {
                    data: {
                        id: userDetail.id,
                        email: userDetail.email,
                        loginTime: time,
                    },
                },
                secretCryptoKey,
                { expiresIn: "365d" }
            );

            userDetail.token = token;

            return helper.success(res, "User Login successfully", userDetail)

        } catch (error) {
            helper.error(res, error);
        }
    },



    matchuser: async (req, res) => {
      try {
        const required = {};
        const nonRequired = {
          location: req.body.location,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          ratingtype: req.body.ratingtype,
          location_range: req.body.location_range,
          name: req.body.name,
        };
    
        const getdata = await helper.vaildObject(required, nonRequired, res);
    
        let whereClause = {};
    
        if (getdata.ratingtype !== undefined) {
          whereClause['$rating.ratingtype$'] = getdata.ratingtype;
        }
    
        // Add name condition to filter users by name
        if (getdata.name) {
          whereClause.name = {
            [sequelize.Op.like]: `%${getdata.name}%`, // Match partial names
          };
        }
    
        // if (typeof getdata.latitude !== 'undefined' && typeof getdata.longitude !== 'undefined') {
          if (
            typeof getdata.latitude !== 'undefined' &&
            typeof getdata.longitude !== 'undefined' &&
            !isNaN(getdata.latitude) &&
            !isNaN(getdata.longitude)
          ) {
          const haversine = `
            6371 * acos(
              cos(radians(${getdata.latitude}))
              * cos(radians(latitude))
              * cos(radians(longitude) - radians(${getdata.longitude}))
              + sin(radians(${getdata.latitude})) * sin(radians(latitude))
            )
          `;
    
          const distanceConversionFactor = 0.621371; // Convert km to miles
          const distanceInMiles = `${haversine} * ${distanceConversionFactor}`;
          console.log('whereClause:', whereClause);
          // Fetch users based on the provided criteria
          const users = await db.users.findAll({
            attributes: [
              'id',
              'name',
              'location',
              'latitude',
              'longitude',
              'location_range',
              [
                sequelize.literal(distanceInMiles),
                'distance' // Alias the calculated distance as 'distance'
              ],
            ],
            where: whereClause,
            include: [
              {
                model: db.rating,
                attributes: ['user_id', 'ratingtype'],
                where: {
                  ratingtype: getdata.ratingtype, // Filter by ratingtype
                },
              },
            ],
            raw:true,
            order: sequelize.col("distance"),
            having: sequelize.literal(
              `distance <= ${getdata.location_range === 0 ? 100 : getdata.location_range}`
            ),
            replacements: {
              latitude: getdata.latitude,
              longitude: getdata.longitude,
            },
          });
    
          console.log(users.toString());

          // Log the values
          console.log('getdata.ratingtype:', getdata.ratingtype);
          console.log('whereClause:', whereClause);
          // Send the filtered user data with their ratings
          res.json({ code: 200, message: "success", users });
        } 
        else {
          // Handle the case where latitude and longitude are not provided
          res.json({ code: 400, message: "Latitude and longitude are required parameters" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Internal server error" });
      }
    },
    
      



otp : async (req, res) => {
    try {
        const required = {
            phone: req.body.phone,
            email: req.body.email
        };
        const nonRequired = {};
        const requestdata = await helper.validObject(required, nonRequired, res);

        const finduser = await db.users.findOne({
            where: { phone: requestdata.phone } // Corrected the usage of 'phone'
        });

        if (!finduser) {
            res.json({ code: 404, message: "User not found with the provided phone number" });
            return; // Added a return statement to exit the function
        }

        let x = Math.floor((Math.random() * 100) + 1);
        // Assuming you have a field in your users model to store OTP, you need to update it
        await db.users.update({ otp: otp }, { where: { id: finduser.id } });

        res.json({ code: 200, message: "OTP sent successfully", otp: x });
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: "Internal server error" });
    }
},
otp_verify : async(req,res)=>{
    try {
        const required = {
            otp:req.body.otp,
        }
        const nonRequired = {}
        const requestData = await helper.vaildObject(required,nonRequired,res)
        
        const verifyOtp = await db.users.findOne({
            id:req.user.id
        })
        if(verifyOtp){
            if(req.body.otp == verifyOtp.otp){
                await db.users.update({otp:requestData.otp},{ otp: "" })
            }else{
res.json({code:400,message:"otp does not matched"})
            }
        }
    } catch (error) {
        console.log(error);
    }
},

forgot_password: async (req, res) => {
    try {
        const required = {
            // roolType: req.body.roolType,
            email: req.body.email
        };

        const non_required = {
            // roolType: req.body.roolType,
            // security_key: req.headers.security_key
        };

        let requestdata = await helper.vaildObject(required, non_required);

        let existingUser = await db.users.findOne({
            where: {
                email: requestdata.email,
                //   role: requestdata.roolType
            },
            raw: true
        });
        if (!existingUser) throw "Email does not exist.";

        existingUser.forgotPasswordHash = helper.createSHA1();

        let html = `Click here to change your password <a href="${
            req.protocol
            }://${req.get("host")}/api/forgot_url/${
            existingUser.forgotPasswordHash
            }"> Click</a>`;

        let emailData = {
            to: requestdata.email,
            subject: "Transit Forgot Password",
            html: html
        };
        console.log("9999999999999", existingUser.forgotPasswordHash);

        await helper.sendEmail(emailData);
        const ligin_user_profile_change = await db.users.update({
            forgotPasswordHash: existingUser.forgotPasswordHash,
        }, {
            where: {
                email: requestdata.email
            }

        })
        return helper.success(
            res,
            "Forgot Password email sent successfully.", {}
        );
    } catch (err) {
        return helper.error(res, err);
    }
},
forgotUrl: async (req, res) => {
    try {
        console.log("77777777777777777777777", req.params.hash);

        let user_detail = await db.users.findOne({
            where: {
                forgotPasswordHash: req.params.hash
            }
        });
        console.log("0000000000000000000000000", user_detail);

        if (user_detail) {
            console.log("111111111111111111111111111");

            res.render("reset_password", {
                title: "Transit",
                response: user_detail,
                msg: req.flash('msg'),
                hash: req.params.hash
            });
        } else {
            const html = `
            <br/>
            <br/>
            <br/>
            <div style="font-size: 50px;" >
                <b><center>Link has been expired!</center><p>
            </div>
          `;
            res.status(403).send(html);
        }
    } catch (err) {
        throw err;
    }
},
resetPassword: async (req, res) => {
    try {
        const {
            password,
            forgotPasswordHash
        } = {
            ...req.body
        };

        const forgot_user = await db.users.findOne({
            where: {
                forgotPasswordHash
            },
            raw: true
        });
        if (!forgot_user) throw "Something went wrong.";
        console.log("================================", password);

        const updateObj = {};
        updateObj.password = await bcrypt.hash(password, 12)
       
        
        updateObj.forgotPasswordHash = "";
        updateObj.id = forgot_user.id;
        const ligin_user_profile_change = await db.users.update({
            forgotPasswordHash: "",
            password: updateObj.password
        }, {
            where: {
                id: forgot_user.id
            }

        })

        console.log("111111111111111111111111111", ligin_user_profile_change);

        if (ligin_user_profile_change) {
            return helper.success(res, "Password updated successfully.", {});

        } else {
            throw "Invalid User.";
        }
    } catch (err) {
        return helper.error(res, err);

    }
},


acceptRejectRequest: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        id: "required",
        status: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }

      const updateStatus = await friend.findOneAndUpdate(
        {
          $or: [
            { userId: req.user.id, user_id2: req.body.id },
            { userId: req.body.id, user_id2: req.user.id },
          ],
        },
        { status: req.body.status }
      );

      if (updateStatus) {
        var done = await friend
          .findOne({
            $or: [
              { userId: req.user.id, user_id2: req.body.id },
              { userId: req.body.id, user_id2: req.user.id },
            ],
          })
          .populate("userId")
          .populate("user_id2");
      } else {
        done = await friend
          .findOne({
            $or: [
              { userId: req.user.id, user_id2: req.body.id },
              { userId: req.body.id, user_id2: req.user.id },
            ],
          })
          .sort({ createdAt: -1 })
          .populate("userId")
          .populate("user_id2");
      }

      if (done) {
        await notifications.findOneAndUpdate(
          {
            $or: [
              { userid: req.user.id, user2id: req.body.id },
              { userid: req.body.id, user2id: req.user.id },
            ],
          },
          { userid: null, user2id: null }
        );
      }

      var toId =
        req.user.id == done.userId._id ? done.user_id2._id : done.userId._id;

      var toToken =
        req.user.id !== done.userId._id
          ? done.userId.deviceToken
          : done.user_id2.deviceToken;

      var toName =
        req.user.id == done.userId._id ? done.userId.name : done.user_id2.name;

      var notificationObj = {
        noti_type: 2 == done.status ? 4 : 3,
        msg:
          2 == done.status
            ? `${toName} accpted Your friend request `
            : `${toName}. rejected  Your friend request`,
        sender_id: toId,
        deviceToken: toToken,
      };
      console.log(
        "🚀 ~ file: ApiController.js:1806 ~ acceptRejectRequest: ~ notificationObj:",
        notificationObj
      );

      // =====================================================================================================

      if (done.status == 2) {
        await notifications.create({
          user2id: req.body.id,
          userid: req.user.id,
          isRead: 0,
          status: 2,
          message: notificationObj.msg,
        });

        helper.sendFCMnotification(notificationObj);
      } else {
        await friend.deleteOne({
          $or: [
            { userId: req.user.id, user_id2: req.body.id },
            { userId: req.body.id, user_id2: req.user.id },
          ],
        });

        // await notifications.deleteOne({
        //   $or: [
        //     { userId: req.user.id, user_id2: req.body.id },
        //     { userId: req.body.id, user_id2: req.user.id },
        //   ],
        // });

        helper.sendFCMnotification(notificationObj);
      }

      var msg = done.status == 2 ? "Request Accepted" : " Request Rejected";

      if (updateStatus) {
        return helper.success(res, msg, notificationObj);
      } else {
        return helper.failed(res, "Unable to change status");
      }
    } catch (error) {
      console.log(error);
    }
  },
  removeFriend: async (req, res) => {
    try {
      await friends.deleteOne({
        $or: [
          { userId: req.user.id, user_id2: req.body.id },
          { userId: req.body.id, user_id2: req.user.id },
        ],
      });

      let data = await friend.findOne({
        $or: [
          { userId: req.user.id, user_id2: req.body.id },
          { userId: req.body.id, user_id2: req.user.id },
        ],
      });

      if (data) {
        return helper.failed(res, "Something went wrong");
      }
      return helper.success(res, "Friend removed successfully");
    } catch (error) {
      console.log(error);
    }
  },


    

}



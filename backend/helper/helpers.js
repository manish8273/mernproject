
// const { Validator } = require("node-input-validator");


var jwt = require("jsonwebtoken");
const secretCryptoKey = "jwtSecretKey";
const db = require("../models")
// const SECRET_KEY =process.env.SECRET_KEY;
// const PUBLISH_KEY =process.env.PUBLISH_KEY;
var FCM = require("fcm-node");
var serverKey = "AAAAUfhvbiw:APA91bG0Hl0Qvz5UczQVlbRzaborIleCpAylt--ahYNwlT-1me1_SDC6SVmP8payASGAu56KeoUx0xap6iw1F06HU9XWXUzw5aENPtuPOAZzzAtPee2Af7akkaak_5C1Nf8TIU6hcaBS"; // Replace with your server key here
var fcm = new FCM(serverKey);
module.exports={


    vaildObject: async function (required, non_required, res) {
    let msg ='';
    let empty = [];
    let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';
    
    for (let key in required) {
        if (required.hasOwnProperty(key)) {
            if (required[key] == undefined || required[key] == '') {
                empty.push(key)
;
            }
        }
    }

    if (empty.length != 0) {
        msg = empty.toString();
        if (empty.length > 1) {
            msg += " fields are required"
        } else {
            msg += " field is required"
        }
        res.status(400).json({
            'success': false,
            'msg': msg,
            'code': 400,
             'body': {}
        });
        return;
    } else {
        if (required.hasOwnProperty('security_key')) {
            if (required.security_key != "") {
                msg = "Invalid security key";
                res.status(403).json({
                    'success': false,
                    'msg': msg,
                    'code': 403,
                    'body': []
                });
                res.end();
                return false;
            }
        }
        if (required.hasOwnProperty('password')) {
            
        }
        const marge_object = Object.assign(required, non_required);
        delete marge_object.checkexit;

        for(let data in marge_object){
            if(marge_object[data]==undefined){
                delete marge_object[data];
            }else{
                if(typeof marge_object[data]=='string'){
                    marge_object[data]=marge_object[data].trim();
                } 
            }
        }

        return marge_object;
    }
},


unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },

  
 

  authenticateHeader: async function (req, res, next) {
    // console.log(req.headers, "--------in header check------------");
    const v = new Validator(req.headers, {
      secret_key: "required|string",
      publish_key: "required|string",
    });

    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return helper.failed(res, errorsResponse);
    }

    if (
      req.headers.secret_key !== SECRET_KEY ||
      req.headers.publish_key !== PUBLISH_KEY
    ) {
      return helper.failed(res, "Key not matched!");
    }
    next();
  },

  authenticateJWT: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secretCryptoKey, async (err, payload) => {
        // console.log("🚀 ~ file: nextHelpers.js:41 ~ jwt.verify ~ payload:", payload)
        if (err) {
          return res.sendStatus(403);
        }

        const existingUser = await db.users.findOne({
          
            id: payload.data.id,
            loginTime: payload.data.loginTime,
          
        });

        if (existingUser) {
          req.user = existingUser;

          next();
        } else {
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(403);
    }
  },
 verifyUser: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("object");
      jwt.verify(token, secretCryptoKey, async (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }
        console.log("object,,,,,,,,", payload.data.id);
        const existingUser = await db.users.findOne({
          where: {
            id: payload.data.id,
            loginTime: payload.data.loginTime,
          },
        });
        console.log("existingUser,,,,,,,,,,,,,,,,,", existingUser);return

        // const existingUser = await users.findOne({
        //   where: {
        //     id: payload.id,
        //     login_time: payload.login_time,
        //   },
        // });
        if (existingUser) {
          req.user = existingUser;
          next();
        } else {
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  },
  
  
  



  fileUpload(file, folder = "users") {
    console.log(file, "===================================##@@");

    let file_name_string = file.name;
    var file_name_array = file_name_string.split(".");

    var file_ext = file_name_array[1];

    var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    var result = "";
    while (result.length < 28) {
      var rand_int = Math.floor(Math.random() * 19 + 1);
      var rand_chr = letters[rand_int];
      if (result.substr(-1, 1) != rand_chr) result += rand_chr;
    }
    
    var resultExt = `${result}.${file_ext}`;
    file.mv(`public/${folder}/${result}.${file_ext}`, function (err) {
      if (err) {
        throw err;
      }
    });
    console.log(resultExt, "===========result");
    return resultExt;
  },


  vaildObject: async function (required, non_required, res) {
    let msg ='';
    let empty = [];
    let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';
    
    for (let key in required) {
        if (required.hasOwnProperty(key)) {
            if (required[key] == undefined || required[key] == '') {
                empty.push(key)
;
            }
        }
    }

    if (empty.length != 0) {
        msg = empty.toString();
        if (empty.length > 1) {
            msg += " fields are required"
        } else {
            msg += " field is required"
        }
        res.status(400).json({
            'success': false,
            'msg': msg,
            'code': 400,
             'body': {}
        });
        return;
    } else {
        if (required.hasOwnProperty('security_key')) {
            if (required.security_key != "") {
                msg = "Invalid security key";
                res.status(403).json({
                    'success': false,
                    'msg': msg,
                    'code': 403,
                    'body': []
                });
                res.end();
                return false;
            }
        }
        if (required.hasOwnProperty('password')) {
            
        }
        const marge_object = Object.assign(required, non_required);
        delete marge_object.checkexit;

        for(let data in marge_object){
            if(marge_object[data]==undefined){
                delete marge_object[data];
            }else{
                if(typeof marge_object[data]=='string'){
                    marge_object[data]=marge_object[data].trim();
                } 
            }
        }

        return marge_object;
    }
},

success: function (res, message, body = {}) {
    return res.status(200).json({
        'success': 1,
        'code': 200,
        'message': message,
        'body': body
    });
},

error: function (res, err, body = {}) {
    console.log(err, '===========================>error');
    
    let code = (typeof err === 'object') ? (err.code) ? err.code : 400 : 400;
    let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
    res.status(code).json({
        'success': false,
        'code': code,
        'message': message,
        'body': body
    });
},

error401:function(res,err,body={}){
    let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
    let code=401;
    res.status(code).json({
    'success': false,
    'code': code,
    'message': message,
    'body': body
});

},

send_emails: function(otp,email,resu) {
        
  try {
      const nodemailer = require('nodemailer');
      
      var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "c6c7fa2796584c",
          pass: "97598bd2dd3d5a"
        }
      });
        

          var mailOptions = {
          from: 'test978056@gmail.co',
          to: email,
          subject:  'PicMash App: Forgot password',
          html: `Hi, ${email} your otp is ${otp} please verify once and reset your password`     
          };  
          
         /*  var mailOptions = {
            from: 'test978056@gmail.co',
            to: email,
            subject:  'ProxApp: Forgot password',
            template: 'forgetpassword',
            data: {
              email: email, 
              otp: otp, 
            },  
          }; 
           */
          transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
          console.log(error);
          } else {
          console.log(info)
;
          res.send('Email send');
          }
        });
       return resu;
  } catch (err) {
    throw err;
  }
  },
  sendEmail(object) {
    try {
        console.log("-------------------",object);
        
        var transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "c6c7fa2796584c",
            pass: "97598bd2dd3d5a"
          }
        });
        var mailOptions = {
            from: `"Transit",<${object.to}>`,
            ...object,
        };

        console.log(mailOptions);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('error', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (err) {
        throw err;
    }
},
send_email: async function (get_param, req, res) {

    console.log(get_param, "get_param");
    var data = await db.users.findOne({
        where: {
            email: get_param.email,
        },
        raw: true,
    });
    /  console.log(data) /
    if (data) {

        var email_password_get = await this.email_password_for_gmail();

        var url_data = await this.url_path(req);

        let auth_data = await this.generate_auth_key();
        await db.users.update({resetpassword_token:auth_data},{where:{
          email:data.email
        }})

        / console.log(auth_data,"auth_data"); 
      
        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "c6c7fa2796584c",
            pass: "97598bd2dd3d5a"
          }
        });
      
        var mailOptions = {

            from: email_password_get.email_data,
            to: get_param.email,
            subject: 'Display Forgot Password',
            html: 'Click here for change password <a href="' +
                url_data +
                "/api/reset_password/" +
                auth_data +
                '"> Click</a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        save = await db.users.update({
            forgotPassword: auth_data,
        }, {
            where: {

                id: data.id

            }
        });
        507
        return transporter;
    } else {

        let msg = 'Email not registered';
        throw msg
    }

},









sendPushNotification:(deviceToken, title, message) => {
  try {
    const fcm = new FCM(serverKey);

    const messageData = {
      registration_ids: Array.isArray(deviceToken) ? deviceToken : [deviceToken],
      notification: {
        title: title,
        body: message,
      },
    };

    fcm.send(messageData, function (err, response) {
      if (err) {
        console.error('Error sending push notification:', err);
      } else {
        console.log('Successfully sent with response:', response);
      }
    });
  } catch (err) {
    console.error('Error sending push notification:', err);
    throw err;
  }
},

}





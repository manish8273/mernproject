const db = require("../models/User.js")

const helper = require('../helper/helpers.js')
const bcrypt = require('bcryptjs');


const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secretCryptoKey = "jwtSecretKey";
const mongoose = require("mongoose");

module.exports = {


    employee_list: async(req,res)=>{
        try {
          const find_details =  await db.find({
            role:0
          }) 
          return helper.success(res,"Get All Employee Details",find_details)
        } catch (error) {
          return helper.error(res,error)
        }
      },

      emp_sort_location: async (req, res) => {
        try {
          const order = req.params.order === 'asc' ? 1 : req.params.order === 'desc' ? -1 : 1;
          const employees = await db.find().sort({ location: order });
          return helper.success(res, "Employees fetched successfully", employees);
        } catch (error) {
          return helper.error(res, "Error fetching employees", error);
        }
      },
   

    emp_sort_name: async (req, res) => {
      try {
        const order = req.params.order === 'asc' ? 1 : req.params.order === 'desc' ? -1 : 1;
        const employees = await db.find().sort({ name: order });
        return helper.success(res, "Employees fetched successfully", employees);
      } catch (error) {
        return helper.error(res, "Error fetching employees", error);
      }
    },


    update_epmoyee: async(req,res)=>{
      try {
        
        if(req.files && req.files.images){
          const images = req.files.images;
          if(images){
            req.body.images = (await helper.fileUpload(images,'images'))
          } 
        }

        const update = await db.findOneAndUpdate(
          { _id: req.params._id },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              images: req.body.images,
              location: req.body.location,
            },
          },
          { new: true } // Add this option to return the updated document
        );
        return helper.success(res,"Update Successfully",update)
      } catch (error) {
        return helper.error(res,error)
      }
    },

    delete_empl:async(req,res)=>{
      try {
        const delete_data = await db.deleteOne({
          _id:req.params.id
        })
        return helper.success(res,"Employee Delete Success",delete_data)
      } catch (error) {
        return helper.error(res,error)
      }
    },
    
    view_employee:async(req,res)=>{
      try {
        const user = await db.findOne({
          _id:req.params._id
        })
        return helper.success(res,"Employee Get Successfully",user)
      } catch (error) {
        return helper.error(res,error)
      }
    }
}


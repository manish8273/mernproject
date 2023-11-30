const db = require("../models/User.js")
var model = require("../models/Department.js")
const helper = require('../helper/helpers')
const bcrypt = require('bcryptjs');


const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secretCryptoKey = "jwtSecretKey";
const mongoose = require("mongoose");




module.exports = {


update_depart: async (req, res) => {
    try {
      const required = {};
      const nonRequired = {
        department_name: req.body.department_name,
      };
      const getdata = await helper.vaildObject(required, nonRequired, res);
  
      const update = await model.findOneAndUpdate(
        { _id: req.params._id }, // Filter by _id
        {
          $set: {
            department_name: getdata.department_name,
          },
        },
        { new: true } // Return the updated document
      );
  
      return helper.success(res, "Update Successfully", update);
    } catch (error) {
      return helper.error(res, error);
    }
  },
  
  get_department: async(req,res)=>{
    try {
      const getdata = await model.findOne({
        _id:req.params._id
      })
      return helper.success(res,"get data success",getdata)
    } catch (error) {
      return helper.error(res,error)
    }
  },

  delete_department: async (req, res) => {
    try {
      const del = await model.deleteOne({
        _id: req.params.id
      });
  
      if (del.deletedCount === 0) {
        return helper.success(res, "No document found for deletion", del);
      }
  
      return helper.success(res, "Delete Successfully", del);
    } catch (error) {
      return helper.error(res, error);
    }
  },
  

  create_depart: async (req, res) => {
    try {
      const required = {
        department_name: req.body.department_name,
      };
  
      const user_id = req.user.id;
      const nonRequired = {};
  
      const getdata = await helper.vaildObject(required, nonRequired, res);
 
      const create_dept = await model.create({
        user_id: user_id,
        department_name: getdata.department_name,
      });
  
      return helper.success(res, "Department created successfully", create_dept);
    } catch (error) {
      return helper.error(res, error);
    }
  },
  

department_list: async(req,res) =>{
  try {
    const find = await model.find({})
    return helper.success(res,"Department List",find)
  } catch (error) {
    return helper.error(res,error)
  }
},


view: async (req, res) => {
    try {

      const user = await model.findOne({ _id: req.params._id });



      return helper.success(res, "User Data Get Successfully", user);
    } catch (error) {

      return helper.error(res, error)
    }
  },

}
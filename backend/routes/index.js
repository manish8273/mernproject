var express = require('express');

var router = express.Router();
const userController = require('../controller/userController');
const department_Controller = require('../controller/department_Controller');
const employeeController = require('../controller/employeeController')
const authenticateJWT = require('../helper/helpers').authenticateJWT
const verifyUser = require('../helper/helpers').verifyUser


router.post('/singup',userController.singup)

router.post("/login",userController.login)

router.get("/view/:_id",authenticateJWT,verifyUser,department_Controller.view)

router.delete("/delete/:_id",authenticateJWT,verifyUser,userController.delete)

router.put("/update_profile",authenticateJWT,verifyUser,userController.update_profile)

router.post("/create_depart",authenticateJWT,verifyUser,department_Controller.create_depart)

router.get("/department_list",authenticateJWT,verifyUser,department_Controller.department_list)

router.put("/update_depart/:_id",authenticateJWT,verifyUser,department_Controller.update_depart)

router.get("/get_department/:_id",authenticateJWT,verifyUser,department_Controller.get_department)

router.delete("/delete_department/:_id",authenticateJWT,verifyUser,department_Controller.delete_department)

router.get("/employee_list",authenticateJWT,verifyUser,employeeController.employee_list)

router.get("/emp_sort_name/:order",authenticateJWT,verifyUser,employeeController.emp_sort_name)

router.get("/emp_sort_location/:order",authenticateJWT,verifyUser,employeeController.emp_sort_location)

router.put("/update_epmoyee/:_id",authenticateJWT,verifyUser,employeeController.update_epmoyee)

router.get("/view_employee/:_id",authenticateJWT,verifyUser,employeeController.view_employee)

router.delete("/delete_empl/:_id",authenticateJWT,verifyUser,employeeController.delete_empl)

router.put("/userLogout",authenticateJWT,verifyUser,userController.userLogout)

router.get("/adminprofile",authenticateJWT,verifyUser,userController.adminprofile)

router.put("/changePassword",authenticateJWT,verifyUser,userController.changePassword)




module.exports = router;

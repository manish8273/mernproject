import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import AdminLayout from "./Components/auth/adminLayout/AdminLayout";
import { Dashboard } from "./Components/Dashboard";
import Login from "./Components/Login";
import ChangePassword from "./Components/auth/ChangePassword";
import EditAdminDetail from "./Components/auth/EditAdminDetail";
import Employee from "./Components/Employee";
import DepartUpdate from "./Components/DepartUpdate";
import DepartmentList from "./Components/DepartmentList";
import AddDepartment from "./Components/AddDepartment";
import UpdateEmployee from "./Components/UpdateEmployee";
import Signup from "./Components/Signup";
import ViewEmployee from "./Components/ViewEmployee";

function App() {
    // const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!adminInfo) {
    //         // If the token does not exist, redirect the user to the login page
    //         navigate('/');
    //     }
    // }, [adminInfo, navigate]);

    return (
        <>
            <Routes>
            <Route path="/signup" element={<Signup />} />
                <Route index element={<Login />} />
           
                <Route path="/" element={<AdminLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/changepassword" element={<ChangePassword />} />
                    <Route path="/editadmindetail" element={<EditAdminDetail />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/departupdate/:_id" element={<DepartUpdate />} />
                    <Route path="/userlisting" element={<userlisting />} />
                    <Route path="/departmentlist" element={<DepartmentList />} />
                    <Route path="/adddepartment" element={<AddDepartment />} />
                    <Route path="/updateemployee/:_id" element={<UpdateEmployee />} />
                    <Route path="/viewemployee/:_id" element={<ViewEmployee />} />
                </Route>
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;

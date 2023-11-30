import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { httpFile } from "../../../config/axiosConfig";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const Navigate = useNavigate();
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    currentPassword: "",
  });
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    httpFile
      .put(`/changePassword`,data ,{
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success === 1) {
          // Password changed successfully
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Password Changed Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          Navigate("/");
        } else {
          // Handle other success cases if needed
          // Show an error toast or do something else
        }
      })
      .catch((err) => {
        if (err.response) {
          const errorMessage =
            err.response.data.message || "An error occurred while changing the password";
          toast.error(errorMessage);
          if (err.response.data.message === "Please Login First") {
            localStorage.clear();
            Navigate("/");
          }
        } else {
          // Handle other types of errors (e.g., network errors)
          toast.error("An error occurred. Please try again later.");
        }
      });
  };



  

  return (
    <>
      <section className="section">
        <div
          className="section-header  rounded py-4 shadow"
          style={{ marginTop: "-48px", padding: "17px" }}
        >
          <h1>Change Password</h1>
        </div>

        <div className="section-body ">
          <div className="card mb-0 py-4 bg-transparent shadow-none">
            <form action="" onSubmit={submitHandler}>
              {" "}
              <div className="container">
                <div className="row">
                  <div className="col-lg-4 d-flex align-items-start justify-content-center ">
                    <div className="card-footer profile_tab_link w-100 p-2 d-flex flex-column shadow bg-white align-items-start"></div>
                  </div>
                  <div className="col-lg-8 ">
                    <div className="about-text go-to shadow p-3 rounded h-100 text-left card">
                      <h5 className="dark-color mb-4 p-md-0 ">Change Password</h5>

                      <h6 className="theme-color lead"></h6>
                      <div className=" about-list">
                        <div className="media pro_file_Set border-0">
                          <label htmlFor="" style={{ color: "black" }}>
                            Current Password:
                          </label>
                          <input
                            id="old-password"
                            type="password"
                            className="form-control pwstrength"
                            name="oldPassword"
                            value={data.oldPassword}
                            onChange={handleChange}
                            tabIndex="1"
                            required
                            
                        
                          />
                        </div>
                        <div className="media pro_file_Set border-0">
                          <label htmlFor="" style={{ color: "black" }}>
                            New Password:
                          </label>

                          <input
                            id="password"
                            type="password"
                            className="form-control pwstrength"
                            data-indicator="pwindicator"
                            name="newPassword"
                            value={data.newPassword}
                            onChange={handleChange}
                            tabIndex="2"
                            required
                          />
                        </div>
                        <div className="media pro_file_Set border-0">
                          <label htmlFor="" style={{ color: "black" }}>
                            Confirm Password:
                          </label>

                          <input
                            id="password-confirm"
                            type="password"
                            className="form-control"
                            name="currentPassword"
                            value={data.currentPassword}
                            onChange={handleChange}
                            tabIndex="3"
                            required
                          />
                        </div>
                        <button className="btn btn-outline-primary mx-auto " type="submit">
                          {" "}
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;

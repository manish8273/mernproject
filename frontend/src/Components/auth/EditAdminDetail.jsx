import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { httpFile } from "../../../config/axiosConfig";

const EditAdminDetail = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
  const Navigate = useNavigate();

  const [infoData, setInfoData] = useState("");
  const [validation, setValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");

  const [data, setData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    images: null, // Initialize images as null
  });

  const getProfile = async () => {
    try {
      const res = await httpFile.get(`/adminprofile`, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      });
      const userData = res.data.body;
      setData(userData);
      setInfoData(userData);
    } catch (err) {
      var error = err.response.data.message;
      if (error === "Please Login First") {
        localStorage.clear();
        Navigate("/");
      }
      // Handle other errors and toast notifications here
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("images", data.images);
  
    httpFile
      .put(`/update_profile`, formData, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const updatedData = res.data.body;
        setInfoData(updatedData);
        toast.success("Admin Information Updated");
        Navigate("/EditAdminDetail");
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(errorMessage);
      });
  };
  

  return (
    <>
      <section className="section">
        <div
          className="section-header  rounded py-4 shadow"
          style={{ marginTop: "-48px", padding: "17px" }}
        >
          <h1>Edit Detail</h1>
        </div>

        <div className="section-body p-3 " style={{ borderRadius: "10px" }}>
          <div className="row mt-sm-4 ">
            <div className="col-12 col-md-12 col-lg-12 mx-auto text-left ">
              <div className="card p-md-3 shadow">
                <form onSubmit={handleSubmit}>
                  <div className="card-header p-0">
                    <h3 style={{ color: "black" }}>Edit Profile</h3>
                  </div>
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="form-group col-md-6 col-12">
                        <label>Name</label>
                        <input
                          type="text"
                          maxLength={30}
                          className="form-control"
                          value={data.name}
                          name="name"
                          required=""
                          onChange={handleChange}
                        />
                        <div className="m-0 error_text" style={{ color: "red" }}>
                          {validation}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6 col-12">
                        <label>Email</label>
                        <input
                          type="email"
                          disabled
                          maxLength={25}
                          className="form-control"
                          name="email"
                          value={data.email}
                          required=""
                          onChange={handleChange}
                        />
                        <div className="m-0 error_text" style={{ color: "red" }}>
                          {emailValidation}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6 col-12">
                        <label>Mobile</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          className="form-control"
                          value={data.phoneNumber}
                          onChange={handleChange}
                        />
                        <div id="error" style={{ color: "red" }}></div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-12 my-3">
                      <input
  type="file"
  name="images"
  accept="image/*"
  onChange={(e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setData({
        ...data,
        images: selectedFile,
      });
    }
  }}
/>

                        <img
                          style={{ borderRadius: "10px" }}
                          className="shadow"
                          src={
                            data?.images
                              ? `${import.meta.env.VITE_BASE_URL}/images/${data?.images}`
                              : "/fallback-image-url.png"
                          }
                          height="50px"
                          width="50px"
                          alt="avatar"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-12 my-3 col-12 d-flex">
                        <div className="card-footer p-0 me-2 text-left">
                          <button className="btn btn-primary" type="submit">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditAdminDetail;

import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signup = () => {
    httpFile
      .post("/singup", data)  // Assuming your backend endpoint is "/signup"
      .then((res) => {
        const adminProfile = res.data.body;
        localStorage.setItem("adminProfile", JSON.stringify(adminProfile));

        if (adminProfile.role === 0) {
          toast.success("Employee Signup Successfully");
        } else if (adminProfile.role === 1) {
          toast.success("Manager Signup Successfully");
        }

        navigate("/");
      })
      .catch((err) => {
        var errorMessage = err.response.data.message;
        if (errorMessage === "Please Signup First") {
          localStorage.clear();
        }

        setError(errorMessage);
      });
  };

  return (
    <section className="section">
      <div className="d-flex flex-wrap align-items-stretch">
        <div className="col-lg-4 col-md-6 col-12 order-lg-1 min-vh-100 order-2 bg-white mx-auto">
          <div className="p-4 m-3">
         

            <div className="user_form">
            <div className="form-group">
                <label className="mt-0" htmlFor="name">
                Name                </label>
                <div className="form_group">
                
                  <input
                    id="name"
                    type="name"
                    className="form-control"
                    name="name"
                    value={data?.name}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in your Name
                </div>
              </div>
              <div className="form-group">
                <label className="mt-0" htmlFor="email">
                  Email
                </label>
                <div className="form_group">
                 
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    name="email"
                    value={data?.email}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in your email
                </div>
              </div>
              <div className="form-group">
                <label className="mt-0" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <div className="form_group">
                
                  <input
                    id="phoneNumber"
                    type="phoneNumber"
                    className="form-control"
                    name="phoneNumber"
                    value={data?.phoneNumber}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in your Phone Number
                </div>
              </div>
       
                <label className="mt-0" htmlFor="email">
                country 
                </label>
                <div className="form_group">
           
                  <input
                    id="country"
                    type="country"
                    className="form-control"
                    name="country"
                    value={data?.country}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
               
                <div className="invalid-feedback">
                  Please fill in your Country 
                </div>
              </div>
        
              <div className="form-group">
                <label className="mt-0" htmlFor="email">
                Age 
                </label>
                <div className="form_group">
              
                  <input
                    id="age"
                    type="age"
                    className="form-control"
                    name="age"
                    value={data?.age}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in your Age 
                </div>
              </div>
              <div className="form-group">
                <label className="mt-0" htmlFor="email">
                Location 
                </label>
                <div className="form_group">
               
                  <input
                    id="location"
                    type="location"
                    className="form-control"
                    name="location"
                    value={data?.location}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in your Location 
                </div>
              </div>
              <div className="form-group">   
  <label className="mt-0" htmlFor="role">
    Role
  </label>
  <div className="form_group">
  
    <select
      id="role"
      className="form-control"
      name="role"
      value={data?.role}
      onChange={handleChange}
      tabIndex="1"
      required=""
      autoFocus=""
    >
      <option value="0">Employee</option>
      <option value="1">Manager</option>
    </select>
  </div>
  <div className="invalid-feedback">Please select your Role</div>
</div>


              <div className="form-group">
                <label className="mt-0" htmlFor="email">
                  Images
                </label>
                <div className="form_group">
               
                  <input
                    id="images"
                    type="file"
                    className="form-control"
                    name="images"
                    value={data?.images}
                    onChange={handleChange}
                    tabIndex="1"
                    required=""
                    autoFocus=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in your Image
                </div>
              </div>

              <div className="form-group" style={{ position: "relative" }}>
                <div className="d-block">
                  <label htmlFor="password" className="mt-0">
                    Password
                  </label>
                </div>
                <div className="form_group">
                 
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={data?.password}
                    onChange={handleChange}
                    tabIndex="2"
                    required=""
                  />
                </div>
                <i
                  onClick={togglePasswordVisibility}
                  className={
                    showPassword
                      ? "fa fa-eye customClass"
                      : "fa fa-eye-slash customClass"
                  }
                  aria-hidden="true"
                ></i>
                <div className="invalid-feedback">
                  please fill in your password
                </div>
              </div>

              <div className="form-group text-right">
                <button
                  onClick={signup}
                  type="submit"
                  className="btn btn-primary btn-lg btn-icon icon-right w-100"
                  tabIndex="4"
                >
Signup                </button>
              </div>

              {error && <div className="text-danger mt-3">{error}</div>}
            </div>

            <div className="text-center mt-5 text-small">
              Copyright © Demo. Made with by Social
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

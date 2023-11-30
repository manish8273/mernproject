import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    user_id: "",
    department_name: "",
  });
  const [error, setError] = useState("");
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const addTask = () => {
    if (adminInfo?.role !== 2) {
      toast.error("You do not have permission to Add Department.");
      return;
    }
  
    const requestData = {
      user_id: adminInfo.user_id,
      department_name: data.department_name,
    };
  
    httpFile
      .post("/addtask", requestData, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      })
      .then((res) => {
        const responseData = res.data.body;
        setData(responseData);
        toast.success("Department created successfully");
        navigate("/TaskList");
        setError(""); // Reset error state
      })
      .catch((err) => {
        var errorMsg = err.response.data.message;
        if (errorMsg === "Please Login First") {
          localStorage.clear();
          navigate("/");
        }
        setError(errorMsg);
        console.error(err.message);
      });
  };
  

  return (
    <section className="section">
      <div
        className="section-header"
      
      >
         <h1>Department Add</h1>
      </div>
      <div className="d-flex flex-wrap align-items-stretch">
        <div className="col-lg-4 col-md-6 col-12 order-lg-1 min-vh-100 order-2 bg-white mx-auto">
          <div className="p-4 m-3">
            <div className="user_form">
            

              <div className="form-group" >
                <div className="d-block">
                  <label className="mt-0">Department Name</label>
                </div>
                <div className="form_group">
                  <input
                    id="department_name"
                    type="text"
                    className="form-control"
                    name="department_name"
                    value={data.department_name}
                    onChange={handleChange}
                    tabIndex="2"
                    required=""
                  />
                </div>
                <div className="invalid-feedback">
                  Please fill in the Department Name
                </div>
              </div>

              <div className="form-group text-right">
                <button
                  onClick={addTask}
                  type="button"
                  className="btn btn-primary btn-lg btn-icon icon-right w-100"
                  tabIndex="3"
                >
                  Add Department
                </button>
              </div>

              {/* Display the error message */}
              {error && <div className="text-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddDepartment;

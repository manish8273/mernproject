import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";
import { toast } from "react-toastify";

const DepartUpdate = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
  const Navigate = useNavigate();
  const { _id } = useParams();
  const [data, setData] = useState({
    department_name: "",
  });

  useEffect(() => {
    // Fetch existing department data based on _id
    httpFile
      .get(`/get_department/${_id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      })
      .then((res) => {
        const existingData = res.data.body;
        setData(existingData);
      })
      .catch((error) => {
        // Handle error, e.g., redirect to an error page
        console.error("Error fetching department data:", error);
      });
  }, [_id, adminInfo?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminInfo?.role !== 2) {
        toast.error("You do not have permission to update employee information.");
        return;
      }
    httpFile
      .put(`/update_depart/${_id}`, data, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const updatedData = res.data.body;
        setData(updatedData);
        toast.success("Department Information Updated");
        Navigate("/departmentlist");
      })
      .catch((er) => {
        const errorMessage =
          er.response?.data?.message || "An error occurred.";
        toast.error(errorMessage);
      });
  };

  return (
    <section className="section">
        
      <div className="section-body p-3" style={{ borderRadius: "10px" }}>
        <div className="row mt-sm-4">
          <div className="col-12 col-md-12 col-lg-12 mx-auto text-left">
            <div className="card p-md-3 shadow">
              <form onSubmit={handleSubmit}>
              <div
          className="section-header  rounded py-4 shadow"
          
        >
                <h3 style={{ color: "black" }}>Update Department</h3>
        </div>

                <div className="card-body p-0">
                  <div className="row">
                    <div className="form-group col-md-6 col-12">
                      <label style ={{ color: "black" }}>Department Name</label>
                      <input
                        type="text"
                        maxLength={30}
                        className="form-control"
                        value={data.department_name}
                        name="department_name"
                        required=""
                        onChange={handleChange}
                      />
                      <div className="m-0 error_text" style={{ color: "red" }}></div>
                    </div>
                  </div>

                  <div className="form-group text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-icon icon-right"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartUpdate;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";
import { toast } from "react-toastify";

const UpdateEmployee = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
  const navigate = useNavigate();
  const { _id } = useParams();
  const [data, setData] = useState({
    name: "",
    email: "",
    location: "",
    images: null, // Use null for file input
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpFile.get(`/view_employee/${_id}`, {
          headers: {
            Authorization: `Bearer ${adminInfo?.token}`,
          },
        });

        const existingData = response.data.body;
        setData(existingData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchData();
  }, [_id, adminInfo?.token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Handle file input separately
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (adminInfo?.role !== 2) {
        toast.error("You do not have permission to update employee information.");
        return;
      }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("location", data.location);
    formData.append("images", data.images);

    try {
      const response = await httpFile.put(`/update_employee/${_id}`, formData, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = response.data.body;
      setData(updatedData);
      toast.success("Employee Information Updated");
      navigate("/employee");
    } catch (error) {
        console.log(error)
      const errorMessage = error.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="section">
      <div className="section-body p-3" style={{ borderRadius: "10px" }}>
        <div className="row mt-sm-4">
          <div className="col-12 col-md-12 col-lg-12 mx-auto text-left">
            <div className="card p-md-3 shadow">
              <form onSubmit={handleSubmit}>
                <div className="section-header rounded py-4 shadow">
                  <h3 style={{ color: "black" }}>Update Employee</h3>
                </div>

                <div className="card-body p-0">
                  <div className="row">
                    <div className="form-group col-md-6 col-12">
                      <label style={{ color: "black" }}>Name</label>
                      <input
                        type="text"
                        maxLength={30}
                        className="form-control"
                        value={data.name}
                        name="name"
                        onChange={handleChange}
                      />
                      <div className="m-0 error_text" style={{ color: "red" }}></div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 col-12">
                      <label style={{ color: "black" }}>Location</label>
                      <input
                        type="text"
                        maxLength={30}
                        className="form-control"
                        value={data.location}
                        name="location"
                        onChange={handleChange}
                      />
                      <div className="m-0 error_text" style={{ color: "red" }}></div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 col-12">
                      <label style={{ color: "black" }}>Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      <div className="m-0 error_text" style={{ color: "red" }}></div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 col-12">
                      <label style={{ color: "black" }}>Email</label>
                      <input
                        type="text"
                        maxLength={30}
                        className="form-control"
                        value={data.email}
                        name="email"
                      
                        disabled
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

export default UpdateEmployee;

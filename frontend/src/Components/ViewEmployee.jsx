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

 

  

  return (
    <section className="section">
      <div className="section-body p-3" style={{ borderRadius: "10px" }}>
        <div className="row mt-sm-4">
          <div className="col-12 col-md-12 col-lg-12 mx-auto text-left">
            <div className="card p-md-3 shadow">
              <form>
                <div className="section-header rounded py-4 shadow">
                  <h3 style={{ color: "black" }}>View Employee</h3>
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
                        disabled
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
                       disabled
                      />
                      <div className="m-0 error_text" style={{ color: "red" }}></div>
                    </div>
                  </div>
                  <div className="row">
  <div className="form-group col-md-6 col-12">
    <label style={{ color: "black" }}>Image</label>
   
    {data?.images ? (
      <img
        src={`${import.meta.env.VITE_BASE_URL}/images/${data?.images}`}
        alt="Employee Image"
        style={{ maxWidth: "20%", marginTop: "10px" }}
      />
    ) : (
      <p>No image available</p>
    )}
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
                   
                      />
                      <div className="m-0 error_text" style={{ color: "red" }}></div>
                    </div>
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

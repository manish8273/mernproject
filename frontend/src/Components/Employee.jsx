import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";
import Swal from "sweetalert2";

const Employee = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const getuser = () => {
    httpFile
      .get("/employee_list", {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      })
      .then((res) => {
        setData(res.data.body);
      })
      .catch((err) => {
        var error = err.response.data.message;
        if (error === "Please Login First") {
          localStorage.clear();
          navigate("/");
        }
        console.error(err.message);
      });
  };

  const sortByLocation = (order) => {
    httpFile
      .get(`/emp_sort_location/${order}`, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      })
      .then((res) => {
        setData(res.data.body);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const sortByName = (order) => {
    httpFile
      .get(`/emp_sort_name/${order}`, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      })
      .then((res) => {
        setData(res.data.body);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const deleteHandler = (id) => {
    if (adminInfo?.role !== 1) {
      toast.error("You do not have authorization to delete.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        httpFile
          .delete(`/delete_empl/${id}`, {
            headers: {
              Authorization: `Bearer ${adminInfo?.token}`,
            },
          })
          .then(() => {
            getalltask();
            toast.success("Task Deleted Successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Something went wrong",
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
            console.error("Delete error:", error);
          });
      }
    });
  };

  const handleFilter = () => {
    Swal.fire({
      title: "Select Sorting Criteria",
      input: "select",
      inputOptions: {
        "location-asc": "Location (Ascending)",
        "location-desc": "Location (Descending)",
        "name-asc": "Name (Ascending)",
        "name-desc": "Name (Descending)",
      },
      inputPlaceholder: "Select a criteria",
      showCancelButton: true,
      confirmButtonText: "Apply",
    }).then((result) => {
      if (result.isConfirmed) {
        const [criteria, order] = result.value.split("-");
        if (criteria === "location") {
          sortByLocation(order);
        } else if (criteria === "name") {
          sortByName(order);
        }
      }
    });
  };

  useEffect(() => {
    getuser();
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <h1>Employee List</h1>
      </div>

      <div className="section-body">
        <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title">Employee List</h2>
          <button onClick={handleFilter} className="btn btn-primary">
          Filter
          </button>
        </div>
          <div className="table-responsive">
            <table id="myTable" className="table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((userData, index) => (
                  <tr key={userData._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        alt="images"
                        style={{ height: "35px", width: "35px" }}
                        src={
                          userData.images
                            ? `${import.meta.env.VITE_BASE_URL}/images/${userData.images}`
                            : "/fallback-image-url.png"
                        }
                        className="rounded-circle mr-1"
                      />
                    </td>
                    <td>{userData.name}</td>
                    <td>{userData.email}</td>
                    <td>{userData.location}</td>
                  
                    <td>
                    <Link to={`/viewemployee/${userData._id}`} className="btn px-2 py-1 btn_hover btn-outline-success">
                      <i className="fas fa-eye"></i>
                    </Link>


                      <Link
                        to={`/updateemployee/${userData._id}`}
                        className="btn px-2 py-1 btn_hover btn-outline-success"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>

                      <button
                        onClick={() => deleteHandler(userData._id)}
                        className="btn px-2 py-1 btn-outline-danger"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Employee;

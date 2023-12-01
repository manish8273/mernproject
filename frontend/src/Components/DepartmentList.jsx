import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentList = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const getalltask = () => {
    httpFile
      .get(`/department_list`, {
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

  useEffect(() => {
    getalltask();
  }, []);

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
          .delete(`/delete_department/${id}`, {
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

  // Calculate the index of the first and last item to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Task List</h1>
      </div>
      {adminInfo?.role === 0 && (
        <div className="text-right">
          <Link
            to={`/adddepartment`}
            className="btn btn-icon icon-left btn-primary shadow"
          >
            <i className=" "></i>Add Task
          </Link>
        </div>
      )}

      <div className="section-body">
        <div className="card-body">
          <div className="table-responsive">
            <table id="myTable" className="table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">DepartMent Name</th>
                  <th scope="col md">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((userData, index) => (
                  <tr key={userData._id}>
                    <td>{index + 1}</td>
                    <td>{userData.department_name}</td>
                    <td>
                      {adminInfo?.role === 0 && (
                        <>
                          <Link
                            to={`/departupdate/${userData._id}`}
                            className="btn px-2 py-1 btn_hover btn-outline-success"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => deleteHandler(userData.id)}
                            className="btn px-2 py-1 btn-outline-danger"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {Array.from({ length: totalPages }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default DepartmentList;

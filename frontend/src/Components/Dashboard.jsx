
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { httpFile } from "../../config/axiosConfig";


export function Dashboard() {
  const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
 

  const [data, setData] = useState([]);
  
  const getuser = () => {
    httpFile
      .get(`/getplayerlisting`, {
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
         
          toast.error("Please Login First");
        }
        console.error(err.message);
      });
  };
  
  useEffect(() => {
    getuser();
  }, []);


    

  return (
    <>
  <section className="section">
  <div
    className="section-header  rounded py-4 shadow"
   
  >
    <h1>Dashboard</h1>
  </div>
  {adminInfo?.role === 1 ? (
    <div className="container-fluid">
      <div className="row">
        <Link
          to={"/employee"}
          className="col-lg-3 col-md-6 col-sm-6 col-12 "
        >
          <div className="card card-statistic-1">
            <div className="card-icon bg-danger shadow">
              <i
                style={{ fontSize: "1.3rem", color: "white" }}
                className="fa-solid fa-users"
              ></i>
            </div>
            <div className="card-wrap">
              <div className="card-header">
                <h4> Employee</h4>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  ) : (
    <div className="container-fluid">
    <div className="row">
      <Link
       
        className="col-lg-3 col-md-6 col-sm-6 col-12 "
      >
        <div className="card card-statistic-1">
          <div className="card-icon bg-danger shadow">
            <i
              style={{ fontSize: "1.3rem", color: "white" }}
              className="fa-solid fa-users"
            ></i>
          </div>
          <div className="card-wrap">
            <div className="card-header">
              <h4> Manager</h4>
            </div>
            <div className="card-body"></div>
          </div>
        </div>
      </Link>
    </div>
    </div>
  )}
</section>

    </>
  );
                }
 

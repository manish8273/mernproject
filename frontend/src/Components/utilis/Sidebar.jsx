import React, { useEffect, useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import { httpFile } from "../../../config/axiosConfig";
function Sidebar() {

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
    <div>
      <div className="main-sidebar sidebar-style-2 shadow">
        <aside id="sidebar-wrapper">
          <div className="sidebar-brand">
            <Link to={"/Dashboard"}>
            <img
                src="http://localhost:2180/images/SOcial.png"
                alt="logo"
                className="mb-5 mt-2"
                style={{ width: "80px", height: "80px" }}
              />
            </Link>
          </div>
          <div className="sidebar-brand sidebar-brand-sm">
            <Link to={"/Dashboard"}>
              <img
                src="../../assets/SOcial.png"
                alt="logo"
                className="mb-5 mt-2 mx-auto"
                style={{ width: "60px" }}
              />
            </Link>
          </div>
          <ul className="sidebar-menu">
            <li className="menu-header"></li>
            <li
            //   className=("nav-item", {
            //     active: path === "/Dashboard",
            //   })}
              to={"/Dashboard"}
              onClick=""
            >
              <Link to={"/Dashboard"} className="nav-link ">
                <i className="fas fa-fire"></i>
                <span>Dashboard</span>
              </Link>
            </li>
          
          
            <li
              className=
              // {className("nav-item", {
              //   active: path === "/UserTable",
              // })}
              {"/departmentlist"}
              onClick=""
            >
              <Link to={"/departmentlist"} className="nav-link ">
                <i className="fas fa-users"></i>
                <span>Department List</span>
              </Link>
            </li>
        
                  <li
              className=
           
              {"/employee"}
              onClick=""
            >
              <Link to={"/employee"} className="nav-link ">
                <i className="fas fa-users"></i>
                <span>Employee Listing</span>
              </Link>
            </li>
         

             </ul>
        </aside>
      </div>
    </div>
  );
}

export default Sidebar;

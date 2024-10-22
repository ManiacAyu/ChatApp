import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";
import io from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchUserDetails = async () => {
    try {
      console.log(document.cookie);
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        method: "GET",
        url: URL,
        withCredentials: true,
      });
      
      dispatch(setUser(response.data.data));
      
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    if (!localStorage["token"]) {
      navigate("/email");
    } else {
      fetchUserDetails(); // Fetch user details only if the token is present
    }
  }, []);

  /*** Socket connection ***/
  useEffect(() => {
    if (!localStorage["token"]) {
      console.log("Navigating to email due to missing token");
      navigate("/email");
      return; // Exit early if there's no token
    }
    
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/";
  
  // If loading, display a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/** Message component **/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;

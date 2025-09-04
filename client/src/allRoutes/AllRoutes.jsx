import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Homepage from "../pages/Homepage.jsx";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AllRoutes;

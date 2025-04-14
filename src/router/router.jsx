import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router";
  
  import React, { Children } from "react";
  import ReactDOM from "react-dom/client";
import Login from "../components/Login";
import Master from "../Layout/Master";
import Register from "../components/Register";
import Home from "../components/Home";
import ProtectedRoute from "./ProtectedRoute";
import LoginTest from "../components/LoginTest";
import Dashboard from "../components/Dashboard";
import Product from "../components/Product";
import Category from "../components/Category";

  
  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Master></Master>,  children : [
        {
          element : <ProtectedRoute roles={["super_admin"]}/>, children : [
           {path: "/" , element: <Home/>} ,
           {path: "/dashboard" , element: <Dashboard/>} ,
           {path: "/products" , element: <Product/>} ,
           {path: "/categories" , element: <Category/>} ,
          ],
        },
        {path: "/home" , element: <Home/>},
      ]
    },
    {path : "/login" , element : <LoginTest/>} ,
    {path : "/register" , element : <Register/>} ,
    {path : "/unauthorized" , element : <h1>Unauthorized</h1>} ,
   
    
  
  ]);
  

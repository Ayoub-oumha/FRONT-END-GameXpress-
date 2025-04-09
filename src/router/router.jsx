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
  
  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Master></Master>,  children : [
        {path: "/" , element: <h>Home</h>},
        {path: "/home" , element: <Home/>},
      ]
    },
    {path : "/login" , element : <Login/>} ,
    {path : "/register" , element : <Register/>} ,
  
  ]);
  

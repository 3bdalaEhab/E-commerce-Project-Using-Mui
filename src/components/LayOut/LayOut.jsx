import React from "react";
import { Outlet } from "react-router-dom";
import Drawer from "../Drawer/Drawer";

export default function LayOut() {
  return (
    <>
      <Drawer/>
      <Outlet/>
    </>
  );
}

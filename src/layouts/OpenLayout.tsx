import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const OpenLayout = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
};

export default OpenLayout;

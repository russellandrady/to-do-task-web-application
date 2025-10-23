"use client";

import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lavender-500"></div>
    </div>
  );
};

export default LoadingSpinner;
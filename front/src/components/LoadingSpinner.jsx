import { forwardRef } from "react";


const LoadingSpinner = forwardRef(({}, ref) => {
  return (
    <div ref={ref} className="fixed z-40 cursor-wait top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-800 flex justify-center items-center">
      <div className="text-white text-3xl">LOADING...</div>
    </div>
  );
});

export default LoadingSpinner;

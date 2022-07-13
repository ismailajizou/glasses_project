const CheckBox = ({ children, checked, handleClick, ...props }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`option m-2 ${
        checked
          ? "bg-blue-500 text-white shadow-blue-500/50"
          : "text-gray-700 hover:bg-blue-500 hover:border-blue-400 hover:text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CheckBox;

const ChangeButton = ({ handleChange, children, ...props }) => {
  return (
    <button
      className="text-gray-200 flex items-center justify-center font-bold text-sm p-4 rounded-full b-none m-2 bg-gray-800 bg-opacity-50 disabled:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
      onClick={() => handleChange()}
      {...props}
    >
      {children}
    </button>
  );
};

export default ChangeButton;

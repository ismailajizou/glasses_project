const COLORS = {
  primary: "bg-blue-700 enabled:hover:bg-blue-800 focus-visible:ring-blue-500",
  success: "bg-green-600 enabled:hover:bg-green-700 focus-visible:ring-green-500",
  danger: "bg-red-600 enabled:hover:bg-red-700 focus-visible:ring-red-500",
  warning: "bg-yellow-600 enabled:hover:bg-yellow-700 focus-visible:ring-yellow-500",
  secondary: "bg-gray-600 enabled:hover:bg-gray-700 focus-visible:ring-gray-500",
};

const Button = ({ variant = "primary", children, className, ...props }) => {
  return (
    <button
      className={`flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${COLORS[variant]} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

const THead = ({ className, children, ...props }) => {
  return (
    <thead className={`text-xs uppercase bg-gray-700 text-gray-400 ${className}`}>
      {children}
    </thead>
  );
};

export default THead;

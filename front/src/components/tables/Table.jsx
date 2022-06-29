const Table = ({ className, children, ...props }) => {
  return (
    <table className={`w-full text-sm text-left text-gray-400 ${className}`}>
      {children}
    </table>
  );
};

export default Table;

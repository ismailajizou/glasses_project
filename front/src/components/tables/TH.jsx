const TH = ({ children, className, ...props }) => {
  return (
    <th scope="col" className={`px-6 py-3 ${className}`}>
      {children}
    </th>
  );
};

export default TH;

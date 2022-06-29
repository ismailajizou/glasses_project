const TBody = ({ empty, children }) => {
  return (
    <tbody>
      {!empty ? (
        children
      ) : (
        <tr>
          <td colSpan={100} className="text-center text-4xl ">
            No Records were found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TBody;

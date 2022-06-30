const Color = ({ name, code }) => {
  return (
    <div
      style={{ backgroundColor: code }}
      className={`group w-20 h-10 border-2 border-slate-400 rounded-full flex justify-center items-center mx-2 text-white`}
    >
      {name && (
        <p className="bg-gray-900 px-2 text-white text-sm rounded-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {name}
        </p>
      )}
    </div>
  );
};

export default Color;

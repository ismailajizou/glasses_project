import { HiExternalLink } from "react-icons/hi";

const VARIANTS = {
  blue: "from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50",
  red: "from-red-500 via-red-600 to-red-700 shadow-red-500/50",
  green: "from-green-500 via-green-600 to-green-700 shadow-green-500/50",
  yellow: "from-yellow-500 via-yellow-600 to-yellow-700 shadow-yellow-500/50",
  purple: "from-purple-500 via-purple-600 to-purple-700 shadow-purple-500/50",
  gray: "from-gray-500 via-gray-600 to-gray-700 shadow-gray-500/50",
  orange: "from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/50",
  pink: "from-pink-500 via-pink-600 to-pink-700 shadow-pink-500/50",
};

const StatCard = ({
  title,
  link,
  value,
  Icon,
  color,
  variant = "blue",
  secondaryNote,
  styles,
}) => {
  return (
    <div
      className={`relative max-w-sm min-w-[20rem] bg-white rounded-xl p-4 shadow-lg mx-4 my-6 ${styles}`}
    >
      <div
        className={`absolute -top-5 p-4 bg-gradient-to-r rounded-xl shadow-lg ${VARIANTS[variant]}`}
      >
        <Icon className="w-10 h-10 text-white" />
      </div>
      <div className="flex flex-col justify-center font-bold  ml-auto max-w-max">
        <a
          href={link}
          className="flex items-center uppercase text-gray-600 text-lg hover:cursor-pointer hover:underline hover:text-gray-700"
        >
          {title} <HiExternalLink className="ml-2" />
        </a>
        <div className="text-4xl text-gray-800">{value}</div>
      </div>
      {secondaryNote && (
        <div className="text-green-500 text-sm font-semibold">
          {secondaryNote}
        </div>
      )}
    </div>
  );
};

export default StatCard;

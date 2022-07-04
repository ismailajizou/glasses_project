import { HiX } from "react-icons/hi";
import { BsCheckCircleFill, BsInfoCircleFill } from "react-icons/bs";
import { RiErrorWarningFill } from "react-icons/ri";
const VARIANTS = {
  success: {
    color: "from-green-500 via-green-600 to-green-700 shadow-green-500/50",
    icon: BsCheckCircleFill,
  },
  error: {
    color: "from-red-500 via-red-600 to-red-700 shadow-red-500/50",
    icon: HiX,
  },
  warning: {
    color: "from-yellow-500 via-yellow-600 to-yellow-700 shadow-yellow-500/50",
    icon: RiErrorWarningFill,
  },
  info: {
    color: "from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50",
    icon: BsInfoCircleFill,
  },
};

const Toast = ({ title, message, variant = "success", onClose, isVisible }) => {
  const Icon = VARIANTS[variant]?.icon ?? BsCheckCircleFill;
  return (
    <div
      className={`fixed z-50 ${
        isVisible ? "flex" : "hidden"
      } bottom-4 right-4 items-center w-full max-w-xs p-4 rounded-lg shadow-lg text-gray-400 bg-slate-800`}
    >
      <div
        className={`inline-flex rounded-lg text-white items-center justify-center flex-shrink-0 w-8 h-8 bg-gradient-to-r ${VARIANTS[variant]?.color}`}
      >
        <Icon />
      </div>
      <div className="ml-3 text-sm font-normal">
        <h5 className="text-md text-gray-100 font-semibold">{title}</h5>
        <p>{message}.</p>
      </div>
      <button
        type="button"
        className="flex justify-center items-center ml-auto -mx-1.5 -my-1.5 bg-transparent text-white hover:text-gray-900 hover:bg-gray-600 rounded-lg focus:ring-2 h-8 w-8"
        onClick={onClose}
      >
        <HiX />
      </button>
    </div>
  );
};

export default Toast;

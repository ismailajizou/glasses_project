import { Tab } from "@headlessui/react";

const SectionTab = ({ children }) => {
  return (
    <Tab
      className={({ selected }) =>
        `px-6 py-1 m-1 rounded-xl focus:border-none min-w-[8rem] text-lg
            ${
              selected
                ? "bg-blue-600 text-white  font-semibold"
                : "hover:text-white hover:bg-blue-500"
            }`
      }
    >
      {children}
    </Tab>
  );
};

export default SectionTab;

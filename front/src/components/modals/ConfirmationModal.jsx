import ModalWrapper from "./ModalWrapper";

const COLORS = {
  primary: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
  success: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500",
  danger: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
  warning: "bg-yellow-600 hover:bg-yellow-700 focus-visible:ring-yellow-500",
};

const ConfirmationModal = ({
  closeModal,
  isOpen,
  title,
  onSubmit,
  actionName,
  actionColor = "primary",
  children,
}) => {
  return (
    <ModalWrapper closeModal={closeModal} isOpen={isOpen} title={title}>
      {children}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className={`rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white ${COLORS[actionColor]} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          onClick={onSubmit}
        >
          {actionName}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmationModal;

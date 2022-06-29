import Button from "../forms/buttons/Button";
import ModalWrapper from "./ModalWrapper";

const ConfirmationModal = ({
  closeModal,
  isOpen,
  title,
  onSubmit,
  actionName,
  variant = "primary",
  children,
}) => {
  return (
    <ModalWrapper closeModal={closeModal} isOpen={isOpen} title={title}>
      {children}
      <div className="flex justify-end mt-4">
        <Button variant={variant} onClick={onSubmit}>
          {actionName}
        </Button>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmationModal;

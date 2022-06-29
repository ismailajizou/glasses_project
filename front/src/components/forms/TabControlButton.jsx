import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Button from "./buttons/Button";

const TabControlButton = ({ controller, text }) => (
    <Button
      onClick={controller}
      type="button"
      className={text === "Next" ? "ml-4" : "mr-4"}
    >
      {text === "Next" ? (
        <>
          {text}
          <BsArrowRight className="ml-2" />
        </>
      ) : (
        <>
          <BsArrowLeft className="mr-2" />
          {text}
        </>
      )}
    </Button>
  );
export default TabControlButton;  
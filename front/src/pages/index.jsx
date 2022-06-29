import { useRef, useEffect, useState } from "react";
import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import Canvas from "@/components/Canvas";
import ChangeButton from "@/components/forms/buttons/ChangeButton";
import { init_VTOWidget } from "@/helpers/initCanvas";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaCamera } from "react-icons/fa";

const HomePage = ({}) => {
  const refPlaceHolder = useRef();
  const refCanvas = useRef();
  const refLoading = useRef();
  const [adjustMode, setAdjustMode] = useState(false);
  const [image, setImage] = useState(null);

  const toggleLoading = (isLoadingVisible) => {
    refLoading.current.style.display = isLoadingVisible ? "block" : "none";
  };

  const enter_adjustMode = () => {
    setAdjustMode(true);
    JEELIZVTOWIDGET.enter_adjustMode();
  };

  const exit_adjustMode = () => {
    setAdjustMode(false);
    JEELIZVTOWIDGET.exit_adjustMode();
  };

  // const set_glassesModel = (sku) => {
  //   JEELIZVTOWIDGET.load(sku);
  // };

  const takeScreenshot = () => {
    const data = refCanvas.current.toDataURL("image/jpg");
    setImage(data);
  };

  useEffect(() => {
    const placeHolder = refPlaceHolder.current;
    const canvas = refCanvas.current;
    init_VTOWidget(placeHolder, canvas, toggleLoading);

    return () => {
      JEELIZVTOWIDGET.destroy();
    };
  }, []);
  return (
    <>
      <div className="relative">
        <div
          ref={refPlaceHolder}
          className="w-screen h-screen mx-auto relative text-center max-w-[100vh] max-h-[100vw]"
        >
          <Canvas ref={refCanvas} />

          <div
            className={`absolute z-20 w-full ${
              adjustMode ? "hidden" : "block"
            }`}
          >
            <button
              className=" text-gray-200 font-bold text-base py-4 px-8 b-none m-2 bg-gray-800 bg-opacity-40 JeelizVTOWidgetAdjustEnterButton"
              onClick={enter_adjustMode}
            >
              Adjust
            </button>
          </div>

          <div
            className={`w-full absolute bg-gray-800 bg-opacity-40 text-white z-30 text-base bottom-0 content-center py-8 ${
              adjustMode ? "block" : "hidden"
            }`}
          >
            Move the glasses to adjust them.
            <button
              className="text-gray-200 font-bold text-sm py-4 px-8 b-none m-2 bg-gray-800 bg-opacity-40 absolute right-2 bottom-2"
              onClick={exit_adjustMode}
            >
              Quit
            </button>
          </div>

          <div
            className={`absolute z-20 w-full bottom-8 ${
              adjustMode ? "hidden" : "block"
            }`}
          >
            <ChangeButton handleChange={takeScreenshot}>
              <FaCamera className="text-white w-8 h-8" />
            </ChangeButton>
          </div>
        </div>
        <div className="border-2 border-blue-500 flex justify-center items-center absolute z-40 top-8 right-8 w-36 h-36">
            <img 
              src={image ?? "https://cdn-icons-png.flaticon.com/512/15/15117.png?w=140"} 
              alt="capture" 
              className=""
              width={image ? "144" : "50"} 
              height={image ? "144" : "50"}  />
        </div>
      </div>

      <LoadingSpinner ref={refLoading} />
    </>
  );
};

export default HomePage;

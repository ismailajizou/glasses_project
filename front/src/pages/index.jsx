import Canvas from "@/components/Canvas";
import ChangeButton from "@/components/forms/buttons/ChangeButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ModalWrapper from "@/components/modals/ModalWrapper";
import Snapshot from "@/components/Snapshot";
import { init_VTOWidget } from "@/helpers/initCanvas";
import useFetch from "@/hooks/useFetch";
import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { IoIosPricetags } from "react-icons/io";

const HomePage = ({}) => {
  const { data: glasses, error } = useFetch("/glasses");
  const refPlaceHolder = useRef();
  const refCanvas = useRef();
  const refScreenshot = useRef();
  const refLoading = useRef();
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [adjustMode, setAdjustMode] = useState(false);
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState(null);
  const [priceModal, setPriceModal] = useState({ item: null, isOpen: false });

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

  const set_glassesModel = (sku) => {
    JEELIZVTOWIDGET.load(sku);
  };

  const takeScreenshot = () => {
    const res = refScreenshot.current;
    const resCanvas = res.getContext("2d");
    const canvas = refCanvas.current;
    let image = new Image();
    image.src = canvas.toDataURL("image/jpg");
    image.onload = function () {
      resCanvas.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      resCanvas.drawImage(logo, 2, 2, 20, 20);
      const data = res.toDataURL("image/jpg");
      setImages([...images, { src: data, id: Date.now() }]);
    };
  };

  useEffect(() => {
    if (glasses) {
      const placeHolder = refPlaceHolder.current;
      const canvas = refCanvas.current;
      const logo = new Image();
      logo.src = "/src/assets/images/target.png";
      logo.onload = () => {
        setLogo(logo);
        init_VTOWidget(placeHolder, canvas, toggleLoading);
      };
      return () => {
        JEELIZVTOWIDGET.destroy();
      };
    }
  }, [glasses]);
  if (error) return <div>Error: {error.response.data.message}</div>;
  if (!glasses) return <LoadingSpinner />;
  return (
    <main>
      <nav className="h-12 bg-black">
        <div>
          <h1>Jeeliz VTO</h1>
        </div>
      </nav>
      <div className="flex justify-between mt-4">
        <canvas ref={refScreenshot} className="hidden"></canvas>
        {/* Left sidebar containing all sunglasses */}
        <div className="bg-gray-100 h-[80vh] max-w-xs w-full border-y-2 border-r-2 border-blue-600 rounded-r-lg">
          <div className="max-h-[90%] overflow-y-auto">
            {glasses.data.map((item) => (
              <div key={item.id} className="flex items-center py-1 border">
                <div
                  onClick={() => {
                    setSelectedGlasses(item.model3d);
                    JEELIZVTOWIDGET.load_modelStandalone(
                      `${import.meta.env.VITE_API_URL}/models/${item.model3d}`
                    );
                  }}
                  className={`relative w-24 m-2 h-full`}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/features/${
                      item.feature_image
                    }`}
                    alt="feature"
                    className="w-full h-full"
                  />
                  {selectedGlasses === item.model3d ? (
                    <div className="absolute flex items-center justify-center top-0 right-0 w-8 h-8 bg-blue-500 rounded-full">
                      <HiCheck className="text-white" />
                    </div>
                  ) : null}
                </div>
                <div className=" break-words ml-4 h-full max-w-[10rem]">
                  <p className="text-base max-h-[50%] overflow-clip text-md my-4">
                    {item.description}
                  </p>
                  <button
                    onClick={() => setPriceModal({ item, isOpen: true })}
                    className="flex items-center bg-gray-900 hover:bg-black text-white px-2 py-1 rounded-md"
                  >
                    <IoIosPricetags className="mr-2" />
                    See Price
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center bg-white max-h-[10%]">
            {glasses.links.slice(1, glasses.links.length - 1).map((link, i) => (
              <button
                key={i}
                className="font-semibold mx-1 p-2 hover:underline"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        {/* Canvas container */}
        <div
          ref={refPlaceHolder}
          className="relative left-0 mx-auto mt-4 text-center w-screen h-screen max-w-[36rem] max-h-[36rem]"
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

        {/* Right side bar containing the screenshot */}
        <div className="max-h-[80vh] max-w-[24rem] border-2 bg-gray-100 border-y-2 border-l-2 rounded-l-lg shadow">
          <div className="h-full overflow-y-auto">
            {images.length ? (
              images.map((item) => (
                <Snapshot
                  key={item.id}
                  item={item}
                  images={images}
                  setImages={setImages}
                  send={() => console.log("hi")}
                />
              ))
            ) : (
              <Snapshot item={null} />
            )}
          </div>
        </div>
        {priceModal.item && (
          <ModalWrapper
            title={`Sunglasses N° ${priceModal.item.ref}`}
            isOpen={priceModal.isOpen}
            closeModal={() => setPriceModal({ item: null, isOpen: false })}
          >
            <div className="w-52 my-2 mx-auto h-full shadow">
              <img
                src={`${import.meta.env.VITE_API_URL}/features/${
                  priceModal.item.feature_image
                }`}
                alt="feature"
                className="w-full h-full"
              />
            </div>
            <p className="text-lg font-semibold text-center">
              {priceModal.item.description}
            </p>
            <p className="my-4 mx-auto flex items-center bg-gray-900 hover:bg-black text-white px-2 py-1 rounded-md max-w-fit">
              <IoIosPricetags className="mr-2" />
              {priceModal.item.price} DHs
            </p>
          </ModalWrapper>
        )}
      </div>
      <LoadingSpinner ref={refLoading} />
    </main>
  );
};

export default HomePage;

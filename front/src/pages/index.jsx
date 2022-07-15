import Canvas from "@/components/Canvas";
import FilterGlassesPopover from "@/components/FilterGlassesPopover";
import ChangeButton from "@/components/forms/buttons/ChangeButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ModalWrapper from "@/components/modals/ModalWrapper";
import Snapshot from "@/components/Snapshot";
import http from "@/helpers/http";
import { init_VTOWidget } from "@/helpers/initCanvas";
import useFetch from "@/hooks/useFetch";
import { usePersistedState } from "@/hooks/usePersistedState";
import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import { useEffect, useRef, useState } from "react";
import { FaCamera, FaFacebookF, FaLink, FaWhatsapp } from "react-icons/fa";
import { HiCheck, HiPause, HiPlay } from "react-icons/hi";
import { IoIosPricetags } from "react-icons/io";
import { SiGmail } from "react-icons/si";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton
} from "react-share";

const HomePage = ({}) => {
  const [params, setParams] = useSearchParams();
  const l = useLocation();
  const { data: glasses, error } = useFetch("/" + l.search);
  const [shareModal, setShareModal] = useState({ src: "", isOpen: false });
  const refPlaceHolder = useRef();
  const refCanvas = useRef();
  const refLoading = useRef();
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [adjustMode, setAdjustMode] = useState(false);
  const [images, setImages] = usePersistedState("images", []);
  const [recordOn, setRecordOn] = useState(true);
  const [priceModal, setPriceModal] = useState({ item: null, isOpen: false });
  const [copied, setCopied] = useState(false);

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

  const onGlassesSelect = (model) => {
    setSelectedGlasses(model);
    JEELIZVTOWIDGET.load_modelStandalone(
      `${import.meta.env.VITE_API_URL}/models/${model}`
    );
  };

  const takeScreenshot = () => {
    JEELIZVTOWIDGET.capture_image(15, async function (image) {
      try {
        const { data } = await http.post("/screenshot", {
          screenshot: image.toDataURL("base64"),
        });
        setImages((images) => [
          ...images,
          `${import.meta.env.VITE_API_URL}/screenshot/${data.name}`,
        ]);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const getPagination = (links) => {
    const current = params.get("page") ?? 1;
    const final = current + 5;
    const last = final > links.length ? links.length - 1 : final;
    return [current, last];
  };

  useEffect(() => {
    if (error) alert(error);
    if (!glasses) toggleLoading(true);
    if (glasses) toggleLoading(false);
  }, [glasses, error]);

  useEffect(() => {
    const placeHolder = refPlaceHolder.current;
    const canvas = refCanvas.current;
    init_VTOWidget(placeHolder, canvas, toggleLoading);
    return () => {
      JEELIZVTOWIDGET.destroy();
    };
  }, []);

  return (
    <main className="flex flex-col h-screen">
      <nav className="h-12 bg-gray-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2 h-full">
          {/* <h1 className="text-white font-bold text-xl">Jeeliz VTO</h1> */}
          <img
            src={`${import.meta.env.VITE_API_URL}/logo.png`}
            alt="logo"
            className="h-10"
          />
          <FilterGlassesPopover />
        </div>
      </nav>

      <div className="flex justify-between py-4 grow-1">
        <div className="flex flex-col justify-between overflow-hidden bg-gray-100 h-full max-w-xs w-full border-y-2 border-r-2 border-blue-600 rounded-r-lg">
          <div className="max-h-[90%] overflow-y-auto">
            {glasses?.data.map((item) => (
              <div key={item.id} className="flex items-center py-1 border">
                <div
                  onClick={() => onGlassesSelect(item.model3d)}
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
                  <p
                    className={`text-base max-h-[50%] overflow-clip text-md my-4 ${
                      selectedGlasses === item.model3d ? "underline" : ""
                    }`}
                  >
                    {item.title}
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
          <div className="flex items-center bg-white max-h-[10%] py-2">
            {glasses?.links
              .slice(...getPagination(glasses.links))
              .map((link, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setParams({ page: Number.parseInt(link.label) })
                  }
                  className="font-semibold rounded-full border mx-1 w-10 h-10 hover:underline"
                >
                  {link.label}
                </button>
              ))}
          </div>
        </div>

        <div
          ref={refPlaceHolder}
          className="relative mx-auto text-center w-screen h-screen max-w-[36rem] max-h-[36rem]"
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
            className={`w-full absolute bg-gray-800 bg-opacity-40 text-white z-20 text-base bottom-0 content-center py-8 ${
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
            className={`absolute flex justify-evenly z-20 w-full bottom-8 ${
              adjustMode ? "hidden" : "block"
            }`}
          >
            <ChangeButton handleChange={takeScreenshot}>
              <FaCamera className="text-white w-8 h-8" />
            </ChangeButton>

            <ChangeButton
              handleChange={async () => {
                if (recordOn) {
                  await JEELIZVTOWIDGET.pause(true);
                  setRecordOn(false);
                } else {
                  await JEELIZVTOWIDGET.resume(true);
                  setRecordOn(true);
                }
              }}
            >
              {recordOn ? (
                <HiPause className="text-white w-8 h-8" />
              ) : (
                <HiPlay className="text-white w-8 h-8" />
              )}
            </ChangeButton>
          </div>
        </div>

        {/* Right side bar containing the screenshot */}
        <div className="h-full border-2 bg-gray-100 border-y-2 border-l-2 rounded-l-lg shadow">
          <div className="h-full overflow-y-auto">
            {images.length ? (
              images.map((src, idx) => (
                <Snapshot
                  key={idx}
                  src={src}
                  images={images}
                  share={() => setShareModal({ isOpen: true, src })}
                  setImages={setImages}
                />
              ))
            ) : (
              <Snapshot src={null} />
            )}
          </div>
        </div>
        {priceModal.item && (
          <ModalWrapper
            title={`Sunglasses N° ${priceModal.item.ref}`}
            isOpen={priceModal.isOpen}
            closeModal={() => setPriceModal({ item: null, isOpen: false })}
          >
            <div className="relative w-52 my-2 mx-auto h-full shadow">
              <img
                src={`${import.meta.env.VITE_API_URL}/features/${
                  priceModal.item.feature_image
                }`}
                alt="feature"
                className="w-full h-full"
              />
              <div className="absolute top-2 left-2 px-2 rounded-md text-sm bg-blue-400 text-blue-900 font-semibold">
                {priceModal.item.price_with_discount ? (
                  <>
                    <span className="line-through text-blue-800">
                      {priceModal.item.price}
                    </span>{" "}
                    <span className="">
                      {priceModal.item.price_with_discount}
                    </span>
                  </>
                ) : (
                  priceModal.item.price
                )}{" "}
                Dhs
              </div>
            </div>
            <p className="text-lg font-semibold text-center">
              {priceModal.item.title}
            </p>
            <p className="ml-2 text-base text-gray-600 font-medium">
              Buy them now from :
            </p>
            <div className="flex flex-wrap">
              {priceModal.item.providers.map(
                ({ name, purchase_link: { link } }) => (
                  <a
                    href={link}
                    className="uppercase my-4 mx-2 flex items-center bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md max-w-fit"
                  >
                    {name}
                  </a>
                )
              )}
            </div>
          </ModalWrapper>
        )}
      </div>

      <div className="w-full h-8 bg-gray-900 absolute bottom-0">
        <div className="flex items-center justify-end max-w-7xl mx-auto px-4 h-full">
          <a href="#" className="text-white hover:underline text-base ">
            Contact
          </a>
        </div>
      </div>
      <ModalWrapper
        closeModal={() => setShareModal({ src: "", isOpen: false })}
        isOpen={shareModal.isOpen}
        title="Share this image"
      >
        {shareModal.src && (
          <>
            <div className="h-60 w-60 mb-4 mx-auto">
              <img
                src={shareModal.src}
                alt="snapshot"
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-wrap justify-center items-center">
            <FacebookShareButton url={shareModal.src}>
              <button className="m-4 bg-blue-800 hover:bg-blue-700 flex items-center px-4 py-2 rounded font-medium">
                <FaFacebookF className="text-white w-4 h-4" />
                <span className="text-white ml-2">Share</span>
              </button>
            </FacebookShareButton>
            <WhatsappShareButton url={shareModal.src}>
              <button className="m-4 bg-green-600 hover:bg-green-500 flex items-center px-4 py-2 rounded font-medium">
                <FaWhatsapp className="text-white w-4 h-4" />
                <span className="text-white ml-2">Whatsapp</span>
              </button>
            </WhatsappShareButton>
            <EmailShareButton url={shareModal.src}>
              <button className="m-4 bg-red-600 hover:bg-red-500 flex items-center px-4 py-2 rounded font-medium">
                <SiGmail className="text-white w-4 h-4" />
                <span className="text-white ml-2">Email</span>
              </button>
            </EmailShareButton>
            <button 
            onClick={() => {
              navigator.clipboard.writeText(shareModal.src);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
              className="m-4 bg-yellow-500 hover:bg-yellow-400 flex items-center px-4 py-2 rounded font-medium">
                <FaLink className="text-white w-4 h-4" />
                <span className="text-white ml-2">{copied ? "Copied" : "Copy link"}</span>
              </button>
            </div>
          </>
        )}
      </ModalWrapper>
      <LoadingSpinner ref={refLoading} />
    </main>
  );
};

export default HomePage;

import Canvas from "@/components/Canvas";
import FilterGlassesPopover from "@/components/FilterGlassesPopover";
import ChangeButton from "@/components/forms/buttons/ChangeButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ModalWrapper from "@/components/modals/ModalWrapper";
import ShareModal from "@/components/modals/ShareModal";
import GlassesOverlay from "@/components/overlays/GlassesOverlay";
import ImagesOverlay from "@/components/overlays/ImagesOverlay";
import Snapshot from "@/components/Snapshot";
import { API_URL } from "@/CONSTANT";
import { getSnapshotUrl } from "@/helpers/getSnapshotUrl";
import http from "@/helpers/http";
import { init_VTOWidget } from "@/helpers/initCanvas";
import useFetch from "@/hooks/useFetch";
import { usePersistedState } from "@/hooks/usePersistedState";
import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import { useEffect, useRef, useState } from "react";
import { FaCamera, FaGlasses, FaImage } from "react-icons/fa";
import { FcNext, FcPrevious } from "react-icons/fc";
import { HiCheck, HiPause, HiPlay, HiX } from "react-icons/hi";
import { IoIosPricetags } from "react-icons/io";
import { useLocation, useSearchParams } from "react-router-dom";

const HomePage = ({}) => {
  const [params, setParams] = useSearchParams();
  const l = useLocation();
  const { data: glasses, error } = useFetch("/" + l.search);
  const [shareModal, setShareModal] = useState({ imageSrc: "", isOpen: false });
  const refPlaceHolder = useRef();
  const refCanvas = useRef();
  const refLoading = useRef();
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [adjustMode, setAdjustMode] = useState(false);
  const [snapshots, setSnapshots] = usePersistedState("snapshots", []);
  const [recordOn, setRecordOn] = useState(true);
  const [priceModal, setPriceModal] = useState({ item: null, isOpen: false });
  const [imagesOverlayShown, setImagesOverlayShown] = useState(false);
  const [glassesOverlayShown, setGlassesOverlayShown] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

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

  const onGlassesSelect = async (glasses) => {
    if(glasses.id === selectedGlasses.id) return;
    try {
      await http.post(`glasses/${glasses.id}/select`);
      setSelectedGlasses(glasses);
      JEELIZVTOWIDGET.load_modelStandalone(
        `${API_URL}/models/${glasses.model3d}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const takeScreenshot = () => {
    if (!selectedGlasses) return;
    JEELIZVTOWIDGET.capture_image(15, async function (image) {
      try {
        const { data } = await http.post("/snapshots/add", {
          screenshot: image.toDataURL("base64"),
          glasses_id: selectedGlasses.id,
        });
        setSnapshots([...snapshots, data.snapshot]);
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
    <>
      <main className="flex flex-col w-screen h-screen">
        <nav className="h-12 bg-gray-800">
          <div className="flex items-center justify-between max-w-[95%] mx-auto px-4 py-2 h-full">
            <img src={`${API_URL}/logo.png`} alt="logo" className="h-10" />
            <div className="lg:hidden flex">
              <button
                onClick={() => setGlassesOverlayShown(!glassesOverlayShown)}
                className="disabled:opacity-60 disabled:cursor-not-allowed flex mx-4 text-white items-center w-8 h-8 justify-center px-2 py-1 rounded-full bg-gray-500 hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                disabled={imagesOverlayShown}
              >
                {glassesOverlayShown ? (
                  <HiX className="h-4 w-4" />
                ) : (
                  <FaGlasses className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setImagesOverlayShown(!imagesOverlayShown)}
                className={`disabled:opacity-60 disabled:cursor-not-allowed flex mx-4 text-white items-center w-8 h-8 justify-center px-2 py-1 rounded-full bg-gray-500 hover:bg-gray-700 focus:outline-none focus:shadow-outline`}
                disabled={glassesOverlayShown}
              >
                {imagesOverlayShown ? (
                  <HiX className="h-4 w-4" />
                ) : (
                  <FaImage className="h-4 w-4" />
                )}
              </button>
            </div>

            <div>
              <button
                onClick={() => setFilterOpen(true)}
                className="flex mx-4 text-white items-center justify-center px-2 py-1 rounded-lg bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Chercher
              </button>
            </div>
          </div>
        </nav>

        {/* Beginning */}
        <div className="relative flex flex-grow p-4">
          {/* GLASSES */}
          <div className="lg:flex flex-col hidden w-80 h-full justify-between bg-gray-100">
            <div className="flex-grow w-full overflow-y-scroll">
              {glasses?.data.map((item) => (
                <div key={item.id} className="flex h-28 p-1 border-b">
                  <div
                    onClick={() => onGlassesSelect(item)}
                    className={`relative p-1 w-1/3 h-full cursor-pointer`}
                  >
                    <img
                      src={`${API_URL}/features/${item.feature_image}`}
                      alt="feature"
                      className="w-full h-full"
                    />
                    {selectedGlasses?.id === item.id ? (
                      <div className="absolute flex items-center justify-center top-0 right-0 w-8 h-8 bg-blue-500 rounded-full">
                        <HiCheck className="text-white" />
                      </div>
                    ) : null}
                  </div>
                  <div className="w-2/3 h-full flex flex-col justify-between p-2">
                    <p
                      onClick={() => onGlassesSelect(item)}
                      className={`text-base font-medium cursor-pointer hover:underline overflow-hidden h-16 mb-1 text-md ${
                        selectedGlasses?.id === item.id ? "underline" : ""
                      }`}
                    >
                      {item.title}
                    </p>
                    <button
                      onClick={() => setPriceModal({ item, isOpen: true })}
                      className="flex max-w-fit items-center bg-gray-900 hover:bg-black h-8 text-white px-2 py-1 rounded-md"
                    >
                      <IoIosPricetags className="mr-2" />
                      Voir prix
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-white h-10 px-4 mt-4 shadow">
              <button
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!glasses?.links.at(0).url}
                onClick={() => {
                  if (glasses?.links.at(0).url) {
                    params.set("page", pageIndex - 1);
                    setParams(params);
                  }
                }}
              >
                <FcPrevious />
              </button>
              <div>
                {glasses?.links
                  .slice(...getPagination(glasses.links))
                  .map((link, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setParams({ page: Number.parseInt(link.label) })
                      }
                      className="font-semibold mx-1 hover:underline"
                    >
                      {link.label}
                    </button>
                  ))}
              </div>
              <button
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!glasses?.links.at(-1).url}
                onClick={() => {
                  if (glasses?.links.at(-1).url) {
                    params.set("page", pageIndex + 1);
                    setParams(params);
                  }
                }}
              >
                <FcNext />
              </button>
            </div>
          </div>

          {/* CANVAS */}
          <div
            ref={refPlaceHolder}
            className="relative mx-4 text-center flex-grow"
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
                Régler
              </button>
            </div>

            <div
              className={`w-full absolute bg-gray-800 bg-opacity-40 text-white z-20 text-base bottom-0 content-center py-8 ${
                adjustMode ? "block" : "hidden"
              }`}
            >
              Déplacer les lunettes pour les régler
              <button
                className="text-gray-200 font-bold text-sm py-4 px-8 b-none m-2 bg-gray-800 bg-opacity-40 absolute right-2 bottom-2"
                onClick={exit_adjustMode}
              >
                Quitter
              </button>
            </div>

            <div
              className={`absolute flex justify-evenly z-20 w-full bottom-8 ${
                adjustMode ? "hidden" : "block"
              }`}
            >
              <ChangeButton
                handleChange={takeScreenshot}
                disabled={!selectedGlasses}
              >
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

          {/* SNAPSHOTS */}
          <div className="h-full w-64 lg:block hidden bg-gray-50 shadow-lg">
            <div className="h-full overflow-y-auto">
              {snapshots.length ? (
                snapshots.map(({ id, name }) => (
                  <Snapshot
                    key={id}
                    imageName={name}
                    images={snapshots}
                    share={() =>
                      setShareModal({
                        isOpen: true,
                        imageSrc: getSnapshotUrl(name),
                      })
                    }
                    setImages={setSnapshots}
                  />
                ))
              ) : (
                <Snapshot src={null} />
              )}
            </div>
          </div>

          <FilterGlassesPopover
            show={filterOpen}
            close={() => setFilterOpen(false)}
          />
          <ImagesOverlay
            images={snapshots}
            isOpen={imagesOverlayShown}
            setImages={setSnapshots}
            setShareModal={setShareModal}
          />
          <GlassesOverlay
            isOpen={glassesOverlayShown}
            data={glasses}
            setPriceModal={setPriceModal}
            onGlassesSelect={onGlassesSelect}
            selectedGlasses={selectedGlasses}
            getPagination={getPagination}
          />
        </div>

        {/* END */}

        <div className="w-full h-8 bg-gray-900">
          <div className="flex items-center justify-end max-w-[95%] mx-auto px-4 h-full">
            <a
              href="/contact"
              className="text-white hover:underline text-base "
            >
              Contacter
            </a>
          </div>
        </div>
      </main>

      {priceModal.item && (
        <ModalWrapper
          title={`Lunettes N° ${priceModal.item.ref}`}
          isOpen={priceModal.isOpen}
          closeModal={() => setPriceModal({ item: null, isOpen: false })}
        >
          <div className="relative w-52 my-2 mx-auto h-full shadow">
            <img
              src={`${API_URL}/features/${priceModal.item.feature_image}`}
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
            Acheter maintenant de auprès de :
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
      {shareModal.imageSrc && (
        <ShareModal
          isOpen={shareModal.isOpen}
          setShareModal={setShareModal}
          src={shareModal.imageSrc}
        />
      )}
      <LoadingSpinner ref={refLoading} />
    </>
  );
};

export default HomePage;

import Canvas from "@/components/Canvas";
import LoadingSpinner from "@/components/LoadingSpinner";
import http from "@/helpers/http";
import { init_VTOWidget } from "@/helpers/initCanvas";
import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TryOnPage = ({}) => {
  const { ref } = useParams();
//   const { data: model, error } = useFetch(`/glasses/${ref}/model`);
  const refPlaceHolder = useRef();
  const refCanvas = useRef();
  const refLoading = useRef();
  const to = useNavigate();

//   const [model, setModel] = useState(null);
  //   const [adjustMode, setAdjustMode] = useState(false);

  const toggleLoading = (isLoadingVisible) => {
    refLoading.current.style.display = isLoadingVisible ? "block" : "none";
  };

  //   const enter_adjustMode = () => {
  //     setAdjustMode(true);
  //     JEELIZVTOWIDGET.enter_adjustMode();
  //   };

  //   const exit_adjustMode = () => {
  //     setAdjustMode(false);
  //     JEELIZVTOWIDGET.exit_adjustMode();
  //   };

  useEffect(() => {
    (async function (){
        try{
            const { data } = await http.get(`/glasses/${ref}/model`);	
            // setModel(data);
            JEELIZVTOWIDGET.load_modelStandalone(
                `${import.meta.env.VITE_API_URL}/models/${data}`
              );
        }catch(e){
            if(e.response.status === 404){
                to("/");
            }
        }
    })();
  }, []);

  useEffect(() => {
    // if (error) to("/");

      const placeHolder = refPlaceHolder.current;
      const canvas = refCanvas.current;
      init_VTOWidget(placeHolder, canvas, toggleLoading);
    //   setLoaded(true);

      return () => {
        JEELIZVTOWIDGET.destroy();
      };
    
  }, []);

  return (
    <div className="">
      {/* Canvas container */}
      <div
        ref={refPlaceHolder}
        id="JeelizVTOWidget"
        className="relative left-0 mx-auto text-center w-screen h-screen max-w-[100vh] max-h-[100vw]"
      >
        <Canvas ref={refCanvas} />
        {/* 
        <div
          className={`absolute z-20 w-full ${adjustMode ? "hidden" : "block"}`}
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
        </div> */}

        {/* <div
          className={`absolute z-20 w-full bottom-8 ${
            adjustMode ? "hidden" : "block"
          }`}
        >
          <ChangeButton handleChange={takeScreenshot}>
            <FaCamera className="text-white w-8 h-8" />
          </ChangeButton>
        </div> */}
      </div>

      <LoadingSpinner ref={refLoading} />
    </div>
  );
};

export default TryOnPage;

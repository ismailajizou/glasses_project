import { useField } from "formik";
import { useEffect, useRef, useState } from "react";

const PriceSliderField = ({ name, min, max, gap, ...props }) => {
  const [{value}, meta, {setValue}] = useField(name);
  const refRangeMin = useRef();
  const refRangeMax = useRef();
  const [minthumb, setMinthumb] = useState(0);
  const [maxthumb, setMaxthumb] = useState(0);

  function minTrigger() {
    const val = Math.min(refRangeMin.current.value, value.max - gap);
    setValue({ ...value, min: val});
    setMinthumb(((val - min) / (max - min)) * 100);
  }
  function maxTrigger() {
    const val = Math.max(refRangeMax.current.value, value.min + gap);
    setValue({ ...value, max: val});
    setMaxthumb(100 - ((val - min) / (max - min)) * 100);
  }
  useEffect(() => {
    maxTrigger();
    minTrigger();
  }, []);

  return (
    <div className="my-4">
      <div className="relative max-w-xl w-full">
        <div>
          <input
            type="range"
            onInput={minTrigger}
            step="10"
            value={value.min}
            ref={refRangeMin}
            min={min}
            max={max}
            className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
          />

          <input
            type="range"
            step="10"
            value={value.max}
            min={min}
            max={max}
            onInput={maxTrigger}
            ref={refRangeMax}
            className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
          />

          <div className="relative z-10 h-2">
            <div className="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200" />
            <div
              className="absolute z-20 top-0 bottom-0 rounded-md bg-blue-300"
              style={{ right: `${maxthumb}%`, left: `${minthumb}%` }}
            />
            <div
              className="absolute z-30 w-6 h-6 top-0 left-0 bg-blue-300 rounded-full -mt-2 -ml-1"
              style={{ left: `${minthumb}%` }}
            />
            <div
              className="absolute z-30 w-6 h-6 top-0 right-0 bg-blue-300 rounded-full -mt-2 -mr-3"
              style={{ right: `${maxthumb}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center py-5">
          <div>
            <input
              type="text"
              maxLength="5"
              value={value.min}
              className="px-2 py-1 border border-gray-200 rounded w-24 text-center"
              disabled
            />
          </div>
          <div>
            <input
              type="text"
              maxLength="5"
              value={value.max}
              className="px-2 py-1 border border-gray-200 rounded w-24 text-center"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSliderField;

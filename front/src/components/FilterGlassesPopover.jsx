import useFetch from "@/hooks/useFetch";
import { Disclosure, Transition } from "@headlessui/react";
import { Form, Formik } from "formik";
import { HiChevronDown, HiX } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import Button from "./forms/buttons/Button";
import CheckBox from "./forms/buttons/CheckBox";
import ColorButton from "./forms/buttons/ColorButton";
import CheckBoxField from "./forms/CheckBoxField";
import PriceSliderField from "./forms/PriceSliderField";
import SelectMultiple from "./forms/SelectMultiple";
import SubmitButton from "./forms/SubmitButton";

const FilterGlassesPopover = ({ show, close }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, error } = useFetch("/api/glasses/form/all");

  const handleMultipleSelection = (values, setFieldValue, name, itemId) => {
    if (values.includes(itemId))
      setFieldValue(
        name,
        values.filter((id) => id !== itemId)
      );
    else setFieldValue(name, [...values, itemId]);
  };
  return (
    <Transition show={show}>
      <div className="fixed inset-0 z-30">
        <Transition.Child
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <Transition.Child
          as="div"
          className="absolute top-1/2 -translate-y-1/2 h-4/5 w-[28rem] bg-white border-2 border-blue-400 rounded-r-lg"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative w-full h-full overflow-auto p-4">
            <button
              onClick={close}
              className="fixed z-40 top-0 right-6 p-4 text-gray-800 hover:text-gray-900"
            >
              <HiX className="w-8 h-8" />
            </button>

            {error ? (
              <p>ERROR: {error.message}</p>
            ) : !data ? (
              <p className="text-lg font-semibold">Loading...</p>
            ) : (
              <Formik
                initialValues={{
                  gender: searchParams.get("gender") ?? "",
                  brand_id: searchParams.get("brand_id")?.split(",") ?? [],
                  collection_id:
                    searchParams.get("collection_id")?.split(",") ?? [],
                  price: {
                    min: searchParams.get("price")?.split(",")[0] ?? 20,
                    max: searchParams.get("price")?.split(",")[1] ?? 1000,
                  },
                  lens_color_id:
                    searchParams.get("lens_color_id")?.split(",") ?? [],
                  frame_color_id:
                    searchParams.get("frame_color_id")?.split(",") ?? [],
                  frame_material_id:
                    searchParams.get("frame_material_id")?.split(",") ?? [],
                  frame_shape_id:
                    searchParams.get("frame_shape_id")?.split(",") ?? [],
                  frame_type: searchParams.get("frame_type")?.split(",") ?? [],
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const { price, gender, ...rest } = values;
                  let params = {
                    price: `${price.min},${price.max}`,
                    gender,
                  };
                  for (let key in rest) {
                    params[key] = rest[key].join(",");
                  }
                  setSearchParams({
                    page: searchParams.get("page") ?? 1,
                    ...params,
                  });
                  setSubmitting(false);
                }}
              >
                {({
                  initialValues,
                  setFieldValue,
                  values,
                  isSubmitting,
                  resetForm,
                }) => (
                  <Form className="relative rounded-lg bg-white px-7 py-4 h-full">
                    <div className="flex flex-col justify-between h-full">
                      <h1 className="text-lg font-medium ">
                        Filtrer les lunettes par:{" "}
                      </h1>
                      <div className="flex-grow overflow-y-auto mb-4">
                        <Disclosure id="gender">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Genre</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel className="flex justify-evenly">
                                <CheckBoxField name="gender" value="male">
                                  Homme
                                </CheckBoxField>
                                <CheckBoxField name="gender" value="female">
                                  Femme
                                </CheckBoxField>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                        <Disclosure id="price">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Prix</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel>
                                <PriceSliderField
                                  name="price"
                                  min={initialValues.price.min}
                                  max={initialValues.price.max}
                                  gap={50}
                                />
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>

                        <Disclosure id="brands">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Marques</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel className="flex justify-evenly">
                                <SelectMultiple
                                  name="brand_id"
                                  data={data.brands}
                                  label="Brands"
                                />
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>

                        <Disclosure id="brands">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Collections</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel className="flex justify-evenly">
                                <SelectMultiple
                                  name="collection_id"
                                  data={data.collections}
                                  label="Collections"
                                />
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>

                        <Disclosure id="lenscolors">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Couleur de verres</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel className="flex flex-wrap justify-center">
                                {data.lens.colors.map((color) => (
                                  <ColorButton
                                    key={color.id}
                                    color={color}
                                    checked={values.lens_color_id.includes(
                                      color.id
                                    )}
                                    handleClick={() =>
                                      handleMultipleSelection(
                                        values.lens_color_id,
                                        setFieldValue,
                                        "lens_color_id",
                                        color.id
                                      )
                                    }
                                  />
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>

                        <Disclosure id="frame">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Cadre</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>

                              <Disclosure.Panel className="">
                                <div>
                                  <label
                                    htmlFor="frameshapes"
                                    className="font-medium"
                                  >
                                    Montures
                                  </label>
                                  <div className="flex justify-center flex-wrap">
                                    {[
                                      { label: "Cerclées", value: "full rim" },
                                      { label: "Percées", value: "rimless" },
                                      {
                                        label: "Demi-cerclées",
                                        value: "half rim",
                                      },
                                    ].map(({ label, value }, idx) => (
                                      <CheckBox
                                        value={value}
                                        key={idx}
                                        checked={values.frame_type.includes(
                                          value
                                        )}
                                        handleClick={() =>
                                          handleMultipleSelection(
                                            values.frame_type,
                                            setFieldValue,
                                            "frame_type",
                                            value
                                          )
                                        }
                                      >
                                        <img
                                          src={`/frame_types/${value}.png`}
                                          className="w-10"
                                        />
                                        {label}
                                      </CheckBox>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label
                                    htmlFor="frameshapes"
                                    className="font-medium"
                                  >
                                    Forme
                                  </label>
                                  <div className="flex justify-center flex-wrap">
                                    {data.frames.shapes.map((shape) => (
                                      <CheckBox
                                        value={shape.id}
                                        key={shape.id}
                                        checked={values.frame_shape_id.includes(
                                          shape.id
                                        )}
                                        handleClick={() =>
                                          handleMultipleSelection(
                                            values.frame_shape_id,
                                            setFieldValue,
                                            "frame_shape_id",
                                            shape.id
                                          )
                                        }
                                      >
                                        <img
                                          src={`/frame_shapes/${shape.name}.png`}
                                          className="w-10"
                                        />
                                        {shape.name}
                                      </CheckBox>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label
                                    htmlFor="framecolors"
                                    className="font-medium"
                                  >
                                    Couleur
                                  </label>
                                  <div className="flex justify-center flex-wrap">
                                    {data.frames.colors.map((color) => (
                                      <ColorButton
                                        key={color.id}
                                        color={color}
                                        checked={values.frame_color_id.includes(
                                          color.id
                                        )}
                                        handleClick={() =>
                                          handleMultipleSelection(
                                            values.frame_color_id,
                                            setFieldValue,
                                            "frame_color_id",
                                            color.id
                                          )
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>

                        <Disclosure id="materials">
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                <span>Materiel</span>
                                <HiChevronDown
                                  className={`${
                                    open ? "rotate-180 transform" : ""
                                  } h-5 w-5 text-black`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="flex flex-wrap justify-center">
                                {data.frames.materials.map((material) => (
                                  <CheckBox
                                    value={material.id}
                                    key={material.id}
                                    checked={values.frame_material_id.includes(
                                      material.id
                                    )}
                                    handleClick={() =>
                                      handleMultipleSelection(
                                        values.frame_material_id,
                                        setFieldValue,
                                        "frame_material_id",
                                        material.id
                                      )
                                    }
                                  >
                                    {material.name}
                                  </CheckBox>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      </div>
                      <div className="flex justify-end h-12 items-center">
                        <Button
                          variant="secondary"
                          type="reset"
                          className={"mx-4"}
                          onClick={() => {
                            resetForm();
                            setSearchParams({});
                          }}
                        >
                          Réinitialiser Filtre
                        </Button>

                        <SubmitButton
                          isSubmitting={isSubmitting}
                          text="Chercher"
                          isValid
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default FilterGlassesPopover;

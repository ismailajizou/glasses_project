import useFetch from "@/hooks/useFetch";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import { Form, Formik } from "formik";
import { Fragment } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import Button from "./forms/buttons/Button";
import CheckBox from "./forms/buttons/CheckBox";
import ColorButton from "./forms/buttons/ColorButton";
import CheckBoxField from "./forms/CheckBoxField";
import SelectMultiple from "./forms/SelectMultiple";
import SubmitButton from "./forms/SubmitButton";
import PriceSliderField from "./forms/PriceSliderField";
import { useSearchParams } from "react-router-dom";

const FilterGlassesPopover = () => {
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
    <div className="">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`group inline-flex items-center rounded-md bg-blue-700 px-3 py-1 text-base font-medium text-white`}
            >
              <span>Filter Glasses</span>
              <HiChevronDown
                className={`ml-2 h-5 w-5 text-white`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-30 right-0 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-xl">
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  {error ? (
                    <p>ERROR: {error.message}</p>
                  ) : !data ? (
                    <p className="text-lg font-semibold">Loading...</p>
                  ) : (
                    <Formik
                      initialValues={{
                        gender: searchParams.get("gender") ?? "",
                        brand_id:
                          searchParams.get("brand_id")?.split(",") ?? [],
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
                          searchParams.get("frame_material_id")?.split(",") ??
                          [],
                        frame_shape_id:
                          searchParams.get("frame_shape_id")?.split(",") ?? [],
                        frame_type:
                          searchParams.get("frame_type")?.split(",") ?? [],
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
                        <Form className="relative rounded-lg bg-white px-7 py-4 max-h-[70vh] overflow-y-auto ">
                          <h1 className="text-base font-medium text-gray-700">
                            Filter glasses by :{" "}
                          </h1>

                          <Disclosure id="gender">
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                  <span>Gender</span>
                                  <HiChevronUp
                                    className={`${
                                      open ? "rotate-180 transform" : ""
                                    } h-5 w-5 text-black`}
                                  />
                                </Disclosure.Button>

                                <Disclosure.Panel className="flex justify-evenly">
                                  <CheckBoxField name="gender" value="male">
                                    Male
                                  </CheckBoxField>
                                  <CheckBoxField name="gender" value="female">
                                    Female
                                  </CheckBoxField>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                          <Disclosure id="price">
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="border-b flex w-full mb-4 justify-between text-lg font-semibold">
                                  <span>Price</span>
                                  <HiChevronUp
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
                                  <span>Brands & Collections</span>
                                  <HiChevronUp
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
                                  <span>Lens Color</span>
                                  <HiChevronUp
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
                                  <span>Frame</span>
                                  <HiChevronUp
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
                                      Type
                                    </label>
                                    <div className="flex justify-center flex-wrap">
                                      {["full rim", "rimless", "half rim"].map(
                                        (type, idx) => (
                                          <CheckBox
                                            value={type}
                                            key={idx}
                                            checked={values.frame_type.includes(
                                              type
                                            )}
                                            handleClick={() =>
                                              handleMultipleSelection(
                                                values.frame_type,
                                                setFieldValue,
                                                "frame_type",
                                                type
                                              )
                                            }
                                          >
                                            <img
                                              src={`/frame_types/${type}.png`}
                                              className="w-10"
                                            />
                                            {type}
                                          </CheckBox>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="frameshapes"
                                      className="font-medium"
                                    >
                                      Shapes
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
                                      Colors
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
                                  <span>Materials</span>
                                  <HiChevronUp
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

                          <div className="flex justify-end">
                            <Button
                              variant="secondary"
                              type="reset"
                              className={"mx-4"}
                              onClick={resetForm}
                            >
                              Reset Filter
                            </Button>

                            <SubmitButton isSubmitting={isSubmitting} isValid />
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default FilterGlassesPopover;

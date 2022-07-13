import http, { csrf } from "@/helpers/http";
import useFetch from "@/hooks/useFetch";
import { useNotification } from "@/hooks/useNotification";
import AdminLayout from "@/layouts/AdminLayout";
import addGlassesValidator from "@/validators/add-glasses-validator";
import { Tab } from "@headlessui/react";
import { FieldArray, Form, Formik } from "formik";
import { useState } from "react";
import {
  BsFillTrashFill,
  BsGenderFemale,
  BsGenderMale,
  BsPlus,
} from "react-icons/bs";
import { GiMirrorMirror } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../forms/buttons/Button";
import ColorField from "../forms/buttons/ColorField";
import CheckBoxField from "../forms/CheckBoxField";
import Error from "../forms/Error";
import FileInput from "../forms/FileInput";
import InputField from "../forms/InputField";
import Label from "../forms/Label";
import SectionTab from "../forms/SectionTab";
import SelectField from "../forms/SelectField";
import SubmitButton from "../forms/SubmitButton";
import TabControlButton from "../forms/TabControlButton";
import LoadingSpinner from "../LoadingSpinner";

const AddGlassesForm = ({ initialValues: v, edit }) => {
  const { data, error } = useFetch("/api/glasses/form/all");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const { showNotification } = useNotification();
  const to = useNavigate();
  const { id } = useParams();
  const nextTab = () => setSelectedIndex((index) => index + 1);
  const previousTab = () => setSelectedIndex((index) => index - 1);
  if (error) return <div>failed to load: {error.response.data.message}</div>;
  if (!data) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <Formik
        validationSchema={addGlassesValidator}
        initialValues={{
          ref: edit ? v.ref : "",
          title: edit ? v.title : "",
          description: edit ? v.description : "",
          price: edit ? v.price : 20,
          price_with_discount: edit ? v.price_with_discount : 0,
          gender: edit ? v.gender : "male",
          feature_image: undefined,
          model3d: undefined,
          purchase_links: edit
            ? [
                ...v.providers.map(
                  ({ id: provider_id, purchase_link: { link } }) => ({
                    provider_id,
                    link,
                  })
                ),
              ]
            : [{ provider_id: 0, link: "" }],
          brand_id: edit ? v.brand_id : 0,
          collection_id: edit ? v.collection_id : 0,
          lens_color_id: edit ? v.lens_color_id : 0,
          lens_type: edit ? v.lens_type : "",
          frame_type: edit ? v.frame_type : "",
          frame_color_id: edit ? v.frame_color_id : 0,
          frame_shape_id: edit ? v.frame_shape_id : 0,
          frame_material_id: edit ? v.frame_material_id : 0,
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setErrors({});
          try {
            await csrf();
            await http.post(
              edit ? `/glasses/${id}` : "/glasses/add",
              {
                ...values,
                purchase_links: JSON.stringify(values.purchase_links),
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            showNotification({
              title: "Success",
              message: edit
                ? `Updated Successfully`
                : `The glasses with the ref ${values.ref} registered successfully`,
            });

            to("/admin/glasses");
          } catch (e) {
            console.error(e);
            if (e.response.status === 422) setErrors(e.response.data.errors);
            else
              showNotification({
                title: "Error",
                message: "Something went wrong !",
                variant: "error",
              });
          }
          setSubmitting(false);
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          values,
          isValid,
        }) => (
          <Form
            className="max-w-3xl px-4 py-6 bg-white rounded-lg shadow-lg mx-auto"
            encType="multipart/form-data"
          >
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
              manual
            >
              <Tab.List className="bg-blue-300 rounded-xl max-w-fit mx-auto">
                <SectionTab>Glasses</SectionTab>
                <SectionTab>Providers</SectionTab>
                <SectionTab>Lens</SectionTab>
                <SectionTab>Frame</SectionTab>
              </Tab.List>
              <Tab.Panels className="my-6 mx-6">
                <Tab.Panel>
                  <InputField
                    name="ref"
                    label={"Reference"}
                    placeholder="Glasses reference"
                    id="ref"
                  />
                  <InputField
                    name="title"
                    label={"Title"}
                    placeholder="Title to be displayed"
                    id="title"
                  />
                  <InputField
                    name="description"
                    label={"Description"}
                    placeholder="some description ..."
                    as="textarea"
                    id="desc"
                  />
                  <div className="flex justify-between flex-1">
                    <InputField
                      label="Price"
                      name="price"
                      id="main_price"
                      placeholder="Main price"
                      type="number"
                      tail="DHs"
                    />
                    <InputField
                      label="Price with discount"
                      name="price_with_discount"
                      id="price_with_discount"
                      placeholder="Price with discount"
                      type="number"
                      tail="DHs"
                    />
                  </div>
                  <div>
                    <div>
                      <Label id={"gender"} name="gender">
                        Gender
                      </Label>
                      <Error name="gender" />
                    </div>
                    <div className="flex justify-evenly">
                      <CheckBoxField
                        name="gender"
                        value="male"
                        checked={values.gender === "male"}
                      >
                        <BsGenderMale />
                        Male
                      </CheckBoxField>
                      <CheckBoxField name="gender" value="female">
                        <BsGenderFemale />
                        Female
                      </CheckBoxField>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <FileInput
                      label="Feature image"
                      description="A picture of the glasses"
                      id="feature"
                      name="feature_image"
                      setFieldValue={setFieldValue}
                      setTouched={setFieldTouched}
                    />
                    <FileInput
                      label="3D glasses model"
                      description="A 3D model of the glasses (.glb)"
                      id="model"
                      name="model3d"
                      setFieldValue={setFieldValue}
                      setTouched={setFieldTouched}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <SelectField
                      label="Brand"
                      name="brand_id"
                      id="brand"
                      options={data.brands}
                    />

                    <SelectField
                      label="Collection"
                      name="collection_id"
                      id="collection"
                      options={data.collections}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <TabControlButton text={"Next"} controller={nextTab} />
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <FieldArray
                    name="purchase_links"
                    render={({ remove, push }) => (
                      <div>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => push({ provider_id: 0, link: "" })}
                        >
                          <BsPlus className="mr-2 w-6 h-6" /> Add
                        </Button>
                        {values.purchase_links.map((link, index) => (
                          <div key={index} className="flex items-center">
                            <SelectField
                              className={"mr-4"}
                              label="Provider"
                              name={`purchase_links[${index}].provider_id`}
                              id={`provider-${index}`}
                              options={data.providers}
                            />
                            <InputField
                              className={"mr-4"}
                              label="Link"
                              name={`purchase_links[${index}].link`}
                              id={`link-${index}`}
                              placeholder="Link to purchase"
                            />
                            {index !== 0 && (
                              <Button
                                type="button"
                                className={"self-end mb-2"}
                                variant="danger"
                                onClick={() => remove(index)}
                              >
                                <BsFillTrashFill />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <div className="flex justify-end mt-6">
                    <TabControlButton
                      text={"Previous"}
                      controller={previousTab}
                    />
                    <TabControlButton text={"Next"} controller={nextTab} />
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div>
                    <div className="flex">
                      <Label id={"lens_type"} name="lens_type">
                        Type
                      </Label>
                      <Error name="lens_type" />
                    </div>
                    <div className="flex justify-center">
                      <CheckBoxField name="lens_type" value="mirror" toggle>
                        <GiMirrorMirror />
                        Mirror
                      </CheckBoxField>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex">
                      <Label id={"lens_color_id"} name="lens_color_id">
                        Color
                      </Label>
                      <Error name="lens_color_id" />
                    </div>
                    <div className="flex flex-wrap my-4 justify-center">
                      {data.lens.colors.map((color) => (
                        <ColorField
                          name="lens_color_id"
                          key={color.id}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <TabControlButton
                      text={"Previous"}
                      controller={previousTab}
                    />
                    <TabControlButton text={"Next"} controller={nextTab} />
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div>
                    <div className="flex">
                      <Label id={"frame_type"} name="frame_type">
                        Type
                      </Label>
                      <Error name="frame_type" />
                    </div>
                    <div className="flex justify-center">
                      {["full rim", "half rim", "rimless"].map((type, id) => (
                        <CheckBoxField value={type} key={id} name="frame_type">
                          <img
                            src={`/src/assets/frame_types/${type}.png`}
                            alt="type"
                            className="w-10"
                          />
                          {type.toUpperCase()}
                        </CheckBoxField>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex">
                      <Label id={"frame_shape_id"} name="frame_shape_id">
                        Shape
                      </Label>
                      <Error name="frame_shape_id" />
                    </div>
                    <div className="flex justify-center flex-wrap">
                      {data.frames.shapes.map((shape) => (
                        <CheckBoxField
                          value={shape.id}
                          key={shape.id}
                          name="frame_shape_id"
                        >
                          <img
                            src={`/src/assets/frame_shapes/${shape.name}.png`}
                            alt="type"
                            className="w-10"
                          />
                          {shape.name.toUpperCase()}
                        </CheckBoxField>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex">
                      <Label id={"material_id"} name="frame_material_id">
                        Material
                      </Label>
                      <Error name="frame_material_id" />
                    </div>
                    <div className="flex justify-center flex-wrap">
                      {data.frames.materials.map((material) => (
                        <CheckBoxField
                          id="material_id"
                          value={material.id}
                          key={material.id}
                          name="frame_material_id"
                        >
                          {material.name.toUpperCase()}
                        </CheckBoxField>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex">
                      <Label id={"frame_color_id"} name="frame_color_id">
                        Color
                      </Label>
                      <Error name="frame_color_id" />
                    </div>
                    <div className="flex flex-wrap my-4 justify-center">
                      {data.frames.colors.map((color) => (
                        <ColorField
                          key={color.id}
                          name="frame_color_id"
                          color={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <TabControlButton
                      text={"Previous"}
                      controller={previousTab}
                    />
                    <SubmitButton
                      isSubmitting={isSubmitting}
                      isValid={isValid}
                    />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Form>
        )}
      </Formik>
    </AdminLayout>
  );
};

export default AddGlassesForm;

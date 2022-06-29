import http, { csrf } from "@/helpers/http";
import AdminLayout from "@/layouts/AdminLayout";
import addGlassesValidator from "@/validators/add-glasses-validator";
import { Tab } from "@headlessui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { GiMirrorMirror } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import ColorButton from "../forms/buttons/ColorButton";
import CustomOption from "../forms/CustomOption";
import Error from "../forms/Error";
import FileInput from "../forms/FileInput";
import InputField from "../forms/InputField";
import Label from "../forms/Label";
import SectionTab from "../forms/SectionTab";
import SelectField from "../forms/SelectField";
import SubmitButton from "../forms/SubmitButton";
import TabControlButton from "../forms/TabControlButton";

const AddGlassesForm = ({
  data: { brands, collections, frames, lens },
  initialValues: v,
  edit,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const to = useNavigate();
  // get id from url
  const { id } = useParams();
  const nextTab = () => setSelectedIndex((index) => index + 1);
  const previousTab = () => setSelectedIndex((index) => index - 1);
  return (
    <AdminLayout>
      <Formik
        validationSchema={addGlassesValidator}
        initialValues={{
          ref: edit ? v.ref : "",
          description: edit ? v.description : "",
          price: edit ? v.price : 20,
          gender: edit ? v.gender : "male",
          feature_image: undefined,
          model3d: undefined,
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
              edit ? `/glasses/${id}/edit` : "/glasses/add",
              values,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            alert(
              edit
                ? `Updated Successfully`
                : `The glasses with the ref ${values.ref} registered successfully`
            );

            to("/admin/glasses");
          } catch (e) {
            console.error(e);
            if (e.response.status === 500) setErrors(e.response.data.errors);
            alert(e.response.data.message);
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
                    name="description"
                    label={"Description"}
                    placeholder="some description ..."
                    as="textarea"
                    id="desc"
                  />
                  <InputField
                    label="Price"
                    name="price"
                    id="price"
                    placeholder="Price"
                    type="number"
                    tail="DHs"
                  />
                  <div>
                    <div>
                      <Label id={"gender"} name="gender">
                        Gender
                      </Label>
                      <Error name="gender" />
                    </div>
                    <div className="flex justify-evenly">
                      <CustomOption
                        name="gender"
                        value="male"
                        checked={values.gender === "male"}
                      >
                        <BsGenderMale />
                        Male
                      </CustomOption>
                      <CustomOption name="gender" value="female">
                        <BsGenderFemale />
                        Female
                      </CustomOption>
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
                      options={brands}
                    />

                    <SelectField
                      label="Collection"
                      name="collection_id"
                      id="collection"
                      options={collections}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
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
                      <CustomOption name="lens_type" value="mirror" toggle>
                        <GiMirrorMirror />
                        Mirror
                      </CustomOption>
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
                      {lens.colors.map((color) => (
                        <ColorButton
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
                        <CustomOption value={type} key={id} name="frame_type">
                          <img
                            src={`/src/assets/frame_types/${type}.png`}
                            alt="type"
                            className="w-10"
                          />
                          {type.toUpperCase()}
                        </CustomOption>
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
                      {frames.shapes.map((shape) => (
                        <CustomOption
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
                        </CustomOption>
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
                      {frames.materials.map((material) => (
                        <CustomOption
                          id="material_id"
                          value={material.id}
                          key={material.id}
                          name="frame_material_id"
                        >
                          {material.name.toUpperCase()}
                        </CustomOption>
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
                      {frames.colors.map((color) => (
                        <ColorButton
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

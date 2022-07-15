import * as yup from "yup";

yup.setLocale({
  mixed: {
    required: "required field",
  },
  number: {
    positive: "You must select an option",
  },
});

export default function addGlassesValidator() {
  return yup.object({
    ref: yup.string().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().required().positive(),
    price_with_discount: yup.number().optional(),
    gender: yup.string().oneOf(["male", "female"], "invalid gender"),
    brand_id: yup.number().required().positive(),
    collection_id: yup.number().required().positive(),
    lens_color_id: yup.number().required().positive(),
    frame_color_id: yup.number().required().positive(),
    frame_type: yup.string().required(),
    frame_shape_id: yup.number().required().positive(),
    frame_material_id: yup.number().required().positive(),
    purchase_links: yup
      .array()
      .of(
        yup.object({
          link: yup.string().url("must be a valid URL").required(),
          provider_id: yup.number().required().positive(),
        })
      )
      .required()
      .min(1, "You must provide at least one purchase link"),
  });
}

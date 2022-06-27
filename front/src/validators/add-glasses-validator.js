import * as yup from 'yup'

yup.setLocale({
    number: {
        positive: "You must select an option"
    }
})

export default function addGlassesValidator(){
    return yup.object({
        ref: yup.string().required(),
        description: yup.string().required(),
        price: yup.number().required().positive(),
        gender: yup.string().oneOf(["male", "female"], "invalid gender"),
        brand_id: yup.number().required().positive(),
        collection_id: yup.number().required().positive(),
        lens_color_id: yup.number().required().positive(),
        frame_color_id: yup.number().required().positive(),
        frame_type: yup.string().required(),
        frame_shape_id: yup.number().required().positive(),
        frame_material_id: yup.number().required().positive(),
    })
}
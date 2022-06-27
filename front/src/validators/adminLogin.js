import * as yup from 'yup'

export const adminLoginValidator = () => {
    return yup.object({
        email: yup.string().email().required(),
        password: yup.string().required(),
        remember: yup.boolean()
    })
}
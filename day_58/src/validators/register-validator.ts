import * as yup from 'yup'

const registerValidator = yup.object({
    email: yup.string()
        .email("Please enter an email")
        .required("Please enter email"),
    password: yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character")
        .required("Please enter password"),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref("password"), ""], "Password must match")
        .required()
})

export {
    registerValidator
}
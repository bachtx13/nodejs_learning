import * as yup from 'yup'

const changePasswordValidator = yup.object({
    oldPassword: yup.string()
        .required("Please enter old password"),
    newPassword: yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character")
        .required("Please enter new password"),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref("newPassword"), ""], "Password must match")
        .required()
})

export {
    changePasswordValidator
}
import * as yup from 'yup'

const userInformationValidator = yup.object({
    username: yup.string()
        .required("Please enter username"),
    age: yup.number()
        .required("Please enter age")
})

export {
    userInformationValidator
}
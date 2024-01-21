export interface IChangePasswordRequest {
    oldPassword: string,
    newPassword: string,
    confirmationPassword: string,
}
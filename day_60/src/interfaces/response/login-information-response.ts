export interface ILoginInformationResponse {
    deviceId: string,
    browser: string,
    version: string,
    os: string,
    platform: string,
    isLogout: boolean,
    lastVisit: string
}
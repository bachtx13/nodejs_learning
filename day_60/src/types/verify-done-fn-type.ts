import {IVerifyOptions} from "passport-local";

export type VerifyDoneFnType = (error: any, user?: Express.User | false, options?: IVerifyOptions) => void
import { DESIGNATIONS } from "./types";

export interface IUser {
  name: string;
  email: string;
  avatar: string;
  phone: string;
  designation: DESIGNATIONS;
  college: string;
}

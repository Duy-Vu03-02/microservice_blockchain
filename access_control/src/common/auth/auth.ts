export interface ILoginRequest {
  account: string;
  password: string;
}

export enum UserRole {
  USER = "user",
  PATIENT = "patient",
  DOCTOR = "doctor",
  SYS = "system",
  BHYT = "bhyt",
}

export interface IAuthUser {
  id: string;
  name: string;
  role: UserRole;
  token_id?: string;
  parent_token_id?: string;
}

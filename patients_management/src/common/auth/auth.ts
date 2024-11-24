export interface ILoginRequest {
    account: string;
    password: string;
}

export enum UserRole {
    USER = 'user',
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    SYS = 'system',
    BHYT = 'bhyt',
}

export const UserRoleGroupAdmin = [UserRole.DOCTOR, UserRole.SYS, UserRole.BHYT];

export const UserRoleGroupUser = [UserRole.USER, UserRole.PATIENT];

export interface IAuthUser {
    id: string;
    name: string;
    role: UserRole;
    hospital_id: string;
    token_id?: string;
    parent_token_id?: string;
}

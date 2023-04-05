export interface ISingUp {
    phone: string
    password: string
    email: string
    name: string
    confirmPassword: string
    isAgree: boolean
}

export interface ILogin {
    phone: string
    password: string
}


export enum Role {
    super_admin = "super-admin",
    admin = "admin",
    user = "user"
}

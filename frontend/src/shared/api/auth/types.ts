export type LoginPayload = {
    username: string;
    password: string;
}

export type LoginResponse = {
    name: string;
    access: string;
    refresh: string;
}

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
}

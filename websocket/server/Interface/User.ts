export type Token = string;

export interface User {
    data: any;

    get getToken(): Token;
    send: (event: string, data: any) => void;
    close: () => void;
}

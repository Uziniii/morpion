export type Token = string;

export interface User {
    token: Token;
    data: any;

    send: (event: string, data: any) => void;
    close: () => void;
}

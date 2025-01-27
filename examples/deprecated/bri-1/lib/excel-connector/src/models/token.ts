import { Uuid, TokenStr } from "./common";

export interface Token {
    id: Uuid;
    expires_in: number;
    access_token: TokenStr;
    refresh_token: TokenStr;
    scope: string;
    permissions: number;
}
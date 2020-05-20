export interface GoogleUser{
    "iss": string
    "azp": string
    "aud": string
    "sub": string
    "email": string
    "email_verified": boolean,
    "at_hash": string
    "nonce"?: string
    "name": string
    "picture": string
    "given_name": string
    "family_name": string
    "locale": string,
    "iat": number,
    "exp": number
}

export interface PersonInfo{
    userId?: number
    guestId?: number
}
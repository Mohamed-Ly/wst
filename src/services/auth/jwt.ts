import crypto from 'crypto';

const secret = process.env.SECRET as string;

export enum VerifyJwtErrors {
    invalid_token = "invalid token",
    token_expired = "token expired",
    invalid_signature = "invalid signature"
}


interface IClaims {
    name: string
    value: string
}

export function generateJwt(milleSecondes: number, claims: IClaims[]): string {
    const header = { alg: 'HS256', typ: 'JWT' };

    const payload: any = { exp: (Date.now() + milleSecondes) };

    for (const claim of claims) {
        payload[claim.name] = claim.value;
    }

    const token = base64urlEncode(JSON.stringify(header)) + '.' + base64urlEncode(JSON.stringify(payload));

    const signature = crypto.createHmac('sha256', secret).update(token).digest('base64');

    return (token + '.' + signature);
}

export function VerifyJwt(jwt: string): {payload?: any, error?: VerifyJwtErrors} {
    const parts = jwt.split('.');
    const header = JSON.parse(base64urlDecode(parts[0]));
    const payload = JSON.parse(base64urlDecode(parts[1]));
    const signature = parts[2];

    if (header?.alg !== 'HS256' || header?.typ !== 'JWT') {
        return {error: VerifyJwtErrors.invalid_token}
    }

    if (payload?.exp < Date.now()) {
        return {error: VerifyJwtErrors.token_expired}
    }

    var expectedSignature = crypto.createHmac('sha256', secret).update(parts[0] + '.' + parts[1]).digest('base64');

    if (signature !== expectedSignature) {
        return {error:  VerifyJwtErrors.invalid_signature}
    }

    return {payload}
}

export function base64urlEncode(str: string) {
    return Buffer.from(str).toString('base64')
}

export function base64urlDecode(b64: string) {
    return Buffer.from(b64, 'base64').toString();
}

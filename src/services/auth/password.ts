import crypto from 'crypto';

export function encrypt(password: string): { salt: string, encrypted: string } {
    const salt = crypto.randomBytes(16).toString("hex");
    const encrypted = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { salt, encrypted }
}

export function compare(password: string, encrypted: string, salt: string): boolean {
    const inputHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512");
    const isValid = crypto.timingSafeEqual(inputHash, Buffer.from(encrypted, "hex"));
    return isValid;
}

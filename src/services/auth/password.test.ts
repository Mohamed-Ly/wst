import {encrypt, compare} from './password'

describe("testing encrypt function", () => {
    test('encrypt function return encrypted password and salt', () => {
        const password = "12345678"
        const {salt, encrypted} = encrypt(password)

        expect(salt).toBeTruthy();
        expect(encrypted).toBeTruthy();
      });

      test('encrypt function should return always unique salt and encrypted password', () => {
        const password = "12345678"
        const v1 = encrypt(password)
        const v2 = encrypt(password)

        expect(v1.salt).not.toBe(v2.salt);
        expect(v1.encrypted).not.toBe(v2.encrypted);
      });
})

describe("testing compare function", () => {
    test('compare function return false', () => {
        const password = "12345678"
        const {salt, encrypted} = encrypt(password)

        expect(compare("123456789", encrypted, salt)).toBeFalsy();
      });

      test('compare function return true', () => {
        const password = "12345678"
        const {salt, encrypted} = encrypt(password)

        expect(compare("12345678", encrypted, salt)).toBeTruthy();
      });
})

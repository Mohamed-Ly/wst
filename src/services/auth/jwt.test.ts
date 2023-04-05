import { base64urlEncode, generateJwt, VerifyJwt, VerifyJwtErrors } from './jwt'
import { Role } from '../../types/auth';

describe("testing generateJwt function", () => {
  test('generateJwt function return new jwt', () => {
    const year = (365 * 24 * 60 * 60 * 1000);
    const token = generateJwt(1, Role.user, year)
    expect(token).toBeTruthy();
  });
})

describe("testing VerifyJwt function errors", () => {
  test('VerifyJwt function should return token_expired', () => {
    const token = generateJwt(1, Role.user, -1)
    const { error, id, role } = VerifyJwt(token)
    expect(error).toBeTruthy();
    expect(error).toBe(VerifyJwtErrors.token_expired);
  });

  test('VerifyJwt function should return invalid_token', () => {
    const year = (365 * 24 * 60 * 60 * 1000);
    const token = generateJwt(1, Role.user, year).split(".")
    const header = { alg: 'foo', typ: 'bar' };

    token[0] = base64urlEncode(JSON.stringify(header))

    const { error, id, role } = VerifyJwt(token.join("."))
    expect(error).toBeTruthy();
    expect(error).toBe(VerifyJwtErrors.invalid_token);
  });

  test('VerifyJwt function should return invalid_signature', () => {
    const year = (365 * 24 * 60 * 60 * 1000);
    const token = generateJwt(1, Role.user, year).split(".")
    token[2] = base64urlEncode("foo")

    const { error, id, role } = VerifyJwt(token.join("."))
    expect(error).toBeTruthy();
    expect(error).toBe(VerifyJwtErrors.invalid_signature);
  });
})

describe("testing VerifyJwt function success values", () => {
  test('VerifyJwt function should return {id: 1, role: "super-admin"}', () => {
    const year = (365 * 24 * 60 * 60 * 1000);
    const token = generateJwt(1, Role.super_admin, year)
    const { error, id, role } = VerifyJwt(token)
    expect(error).toBeUndefined();
    expect(id).toBeTruthy();
    expect(role).toBeTruthy();
    expect(id).toBe(1);
    expect(role).toBe(Role.super_admin);
  });

  test('VerifyJwt function should return {id: 3, role: "admin"}', () => {
    const year = (365 * 24 * 60 * 60 * 1000);
    const token = generateJwt(3, Role.admin, year)
    const { error, id, role } = VerifyJwt(token)
    expect(error).toBeUndefined();
    expect(id).toBeTruthy();
    expect(role).toBeTruthy();
    expect(id).toBe(3);
    expect(role).toBe(Role.admin);
  });

  test('VerifyJwt function should return {id: 1221, role: "user"}', () => {
    const year = (365 * 24 * 60 * 60 * 1000);
    const token = generateJwt(1221, Role.user, year)
    const { error, id, role } = VerifyJwt(token)
    expect(error).toBeUndefined();
    expect(id).toBeTruthy();
    expect(role).toBeTruthy();
    expect(id).toBe(1221);
    expect(role).toBe(Role.user);
  });
})

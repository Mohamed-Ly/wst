import { Request, Response } from 'express'
import context from '../config/context'
import { ILogin, ISingUp } from '../types/auth';
import * as validation from '../utils/validation';
import * as errors from '../utils/errors';
import sendMail from '../services/email';
import { compare, encrypt } from '../services/auth/password';
import { generateJwt } from '../services/auth/jwt';

export async function singUp(req: Request, res: Response) {

    const data: ISingUp = req.body;

    const errorFiled = validation.RequiredList([{
        value: data?.confirmPassword,
        name: "مطلوب كلمة المرور التأكيدية"
    }, {
        value: data?.password,
        name: "مطلوب كلمة المرور"
    }, {
        value: data?.email,
        name: "مطلوب عنوان بريد إلكتروني"
    }, {
        value: data?.name,
        name: "مطلوب الاسم"
    }, {
        value: data?.isAgree,
        name: "مطلوب الموافقه علي الشروط"
    }, {
        value: data?.phone,
        name: "مطلوب رقم الهاتف"
    }])

    if (errorFiled) {
        errors.validationError(errorFiled, res)
        return;
    }

    if (!validation.validateEmail(data.email) || !validation.max(data.email, 255)) {
        errors.validationError("عنوان بريد إلكتروني غير صالح", res)
        return;
    }

    if (data.password !== data.confirmPassword) {
        errors.validationError("كلمة المرور وكلمة المرور التأكيدية ليسا متطابقين", res)
        return;
    }

    if (!validation.max(data.password, 255)) {
        errors.validationError("كلمة المرور كبيرة جدًا ، الحد الأقصى لكلمة المرور هو 255 حرفًا", res)
        return;
    }

    if (!validation.min(data.password, 8)) {
        errors.validationError("كلمة المرور صغيرة جدًا ، الحد الأدنى لكلمة المرور هو 8 أحرف", res)
        return;
    }

    if (!validation.max(data.name, 255)) {
        errors.validationError("الاسم كبير جدًا ،الحد الأقصى للاسم هو 255 حرفًا", res)
        return;
    }

    if (!validation.min(data.name, 2)) {
        errors.validationError("الاسم صغير جدًا ، الحد الأدنى للاسم هو حرفان", res)
        return;
    }

    if (!validation.validatePhone(data.phone)) {
        errors.validationError("رقم هاتف غير صالح", res)
        return;
    }

    const isFound = await context.user.findFirst({
        where: { OR: [
            { email: data.email },
            { phone: data.phone },
          ]},
        select: {email: true, phone: true}
    })

    if (isFound?.phone && isFound?.phone === data.phone) {
        errors.validationError(`المستخدم برقم الهاتف ${data.phone} موجود بالفعل ، حاول تسجيل الدخول`, res)
        return;
    }

    if (isFound?.email && isFound?.email === data.email) {
        errors.validationError(`المستخدم بالبريد الإلكتروني ${data.email} موجود بالفعل ، حاول تسجيل الدخول`, res)
        return;
    }

    const {salt, encrypted} = encrypt(data.password);

    const user = await context.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            ip_address: req.ip,
            password: encrypted,
            salt: salt
        }
    })

    const token = generateJwt((24 * 60 * 60 * 1000), [{ name: "id", value: user.id.toString() }])

    sendMail("email-verification", [data.name, `${req.protocol + '://' + req.get('host')}/api/email-verification?token=${token}`], data.email, "email verification")

    res.status(200).json({ massage: "نجاح الاشتراك ، يرجى التحقق من بريدك الإلكتروني للحصول على رابط التحقق ، إذا لم تستلم بريدًا إلكترونيًا بعد ، فيرجى التحقق من رسائل البريد الإلكتروني العشوائية" })
}



export async function login(req: Request, res: Response) {

    const data: ILogin = req.body;

    const errorFiled = validation.RequiredList([{
            value: data?.password,
            name: "مطلوب كلمة المرور"
        }, {
            value: data?.phone,
            name: "مطلوب رقم الهاتف"
        }])

    if (errorFiled) {
        errors.validationError(errorFiled, res)
        return;
    }

    const isFound = await context.user.findFirst({
        where: { phone: data.phone },
        select: { email: true, phone: true, password: true, salt: true, verified_email: true, role: true, id: true, name: true }
    })

    if (!isFound?.phone) {
        errors.validationError(`مستخدم برقم هاتف ${data.phone} هذا غير موجود حاول الاشتراك`, res)
        return;
    }

    if (!compare(data.password, isFound?.password, isFound?.salt)) {
        errors.validationError(`كلمة مرور أو رقم هاتف خاطئ`, res)
        return;
    }

    if (isFound.verified_email) {

        const refreshToken = generateJwt((60 * 24 * 60 * 60 * 1000), [{name: "role", value: isFound.role}, {name: "id", value: isFound.id.toString()}])
        const accessToken = generateJwt((15 * 60 * 1000), [{name: "role", value: isFound.role}, {name: "id", value: isFound.id.toString()}])

        res.setHeader('Set-Cookie', [
            `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=strict; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
            `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${60 * 24 * 60 * 60}; SameSite=strict; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`
        ]);

        res.status(200).json({ massage: "نجاح في تسجيل الدخول" })
        return;
    }

    const token = generateJwt((24 * 60 * 60 * 1000), [{ name: "id", value: isFound.id.toString() }])

    sendMail("email-verification", [isFound.name, `${req.protocol + '://' + req.get('host')}/api/email-verification?token=${token}`], isFound.email, "email verification")

    res.status(200).json({ massage: "نجاح تسجيل الدخول ، يرجى التحقق من بريدك الإلكتروني للحصول على رابط التحقق ، إذا لم تستلم بريدًا إلكترونيًا بعد ، فيرجى التحقق من رسائل البريد الإلكتروني العشوائية" })
}

export function logout(req: Request, res: Response) {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    res.status(200).json({ message: 'نجاح تسجيل الخروج' });
}



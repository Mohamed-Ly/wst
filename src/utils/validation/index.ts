export const validateEmail = (email: string): boolean => {
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
}

export const min = (input: string, min: number):  boolean => {
    return input.length >= min;
}

export const max = (input: string, max: number):  boolean => {
    return input.length <= max;
}

export const isNull = (input: unknown):  boolean => {
    return !input;
}


export const RequiredList = (input: {name: string, value: unknown}[]): string | null => {
    let errorFiled = null;
    for (const item of input) {
        if (!item.value) {
            errorFiled = item.name;
            break;
        }
    }
    return errorFiled;
}


export const validatePhone = (phone: string): boolean => {
    let isValid = true;
    const options = ["091", "092", "094", "095"]

    if (!options.includes(phone.slice(0, 3))) {
        console.log("one")
        console.log(phone.slice(0, 2))
        isValid = false
    }

    if (phone.length !== 10) {
        console.log("two")
        isValid = false
    }

    return isValid;
}

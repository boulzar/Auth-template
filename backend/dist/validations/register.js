"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'invalid email',
            },
        ];
    }
    if (options.name.length <= 2) {
        return [
            {
                field: 'name',
                message: 'length must be greater than 2',
            },
        ];
    }
    if (options.name.includes('@')) {
        return [
            {
                field: 'name',
                message: 'cannot include an @',
            },
        ];
    }
    if (options.password.length <= 2) {
        return [
            {
                field: 'password',
                message: 'length must be greater than 2',
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=register.js.map
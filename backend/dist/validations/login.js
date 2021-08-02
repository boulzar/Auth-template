"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const validateLogin = (options) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'invalid email',
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
exports.validateLogin = validateLogin;
//# sourceMappingURL=login.js.map
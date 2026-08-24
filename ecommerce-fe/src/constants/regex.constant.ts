export const REGEX = {
    PHONE: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
    USERNAME: /^[a-zA-Z0-9_]{4,20}$/
} as const;

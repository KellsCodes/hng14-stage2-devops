import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
        },
        languageOptions: {
            globals: {
                // This replaces the "env": {"node": true} setting
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                console: "readonly",
                setTimeout: "readonly"
            }
        }
    }
];

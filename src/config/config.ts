let environment = "dev";
// let environment = "production";

const config = {
    baseURL:
        environment === "production"
            ? import.meta.env.VITE_APP_URL_PROD
            : import.meta.env.VITE_APP_URL_LOCAL,
};

export default config;

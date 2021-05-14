export { };

const prod: any = {
    url: {
        CLIENT_URL: "https://cah-webgame-1332a.web.app",
    }
};

const dev: any = {
    url: {
        CLIENT_URL: "http://localhost:3000"
    }
};

export const config = process.env.NODE_ENV === "production" ? prod : dev;
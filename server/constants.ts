export { };

const prod: any = {
    url: {
        CLIENT_URL: "https://cah-webgame-1332a.web.app",
    },
    ROOM_EXPIRY: 3600,
};

const dev: any = {
    url: {
        CLIENT_URL: "http://localhost:3000",
    },
    ROOM_EXPIRY: 3600,
};

export const config = process.env.NODE_ENV === "production" ? prod : dev;
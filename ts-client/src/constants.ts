export { };

const prod: any = {
    url: {
        API_URL: "https://cah-project-server.herokuapp.com/",
    }
};

const dev: any = {
    url: {
        API_URL: "http://localhost:5000"
    }
};

export const config = process.env.NODE_ENV === "production" ? prod : dev;

export const randomString = (len:number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const fetchFromLocalStorage = (key: string) => {
  const jsonValue = localStorage.getItem('cah-webgame-' + key);
  if (jsonValue !== null) return JSON.parse(jsonValue);
}


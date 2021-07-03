export const fetchFromLocalStorage = (key: string) => {
  const jsonValue = localStorage.getItem('cah-webgame-' + key);
  if (jsonValue !== null) return JSON.parse(jsonValue);
}

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem('cah-webgame-' + key);
}

export const cleanUpLocalStorage = () => {
  removeFromLocalStorage('room-users');
  removeFromLocalStorage('host-user');
  removeFromLocalStorage('current-user');
}


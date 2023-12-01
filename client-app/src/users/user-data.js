export const getTokenDuration = function () {
  const storedExpirationDate = localStorage.getItem("tokenExpiryDate");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
};

export const getToken = function () {
  const token = localStorage.getItem("token") ?? "";

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return "EXPIRED";
  }

  return token;
};

export const getEmail = function () {
  const username = localStorage.getItem("email") ?? "";

  return username;
};

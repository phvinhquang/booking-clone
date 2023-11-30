export const getToken = function () {
  const token = localStorage.getItem("token") ?? "";

  return token;
};

export const getUsername = function () {
  const username = localStorage.getItem("username") ?? "";

  return username;
};

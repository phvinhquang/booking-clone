export const tokenLoader = function () {
  const token = sessionStorage.getItem("token") ?? "";

  return token;
};

export const emailLoader = function () {
  const email = sessionStorage.getItem("email") ?? "";

  return email;
};

import React, { useEffect, useState } from "react";
import styles from "./Authentication.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import useInput from "../../hooks/use-input";

const Authentication = function () {
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = searchParams.get("mode") === "login";

  //Sử dụng custom hook để xử lý input
  // Username
  const usernameValidate = function (username) {
    return username.trim() !== "";
  };

  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: usernameReset,
  } = useInput(usernameValidate);

  // Password
  const passwordValidate = function (password) {
    return password.trim().length >= 8;
  };

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput(passwordValidate);

  // Fullname, validate chung với usernam
  const {
    value: fullNameValue,
    isValid: fullNameIsValid,
    hasError: fullNameHasError,
    valueChangeHandler: fullNameChangeHandler,
    inputBlurHandler: fullNameBlurHandler,
    reset: fullNameReset,
  } = useInput(usernameValidate);

  // Email
  const emailValidate = function (email) {
    return email.includes("@");
  };

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput(emailValidate);

  // Phone
  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    reset: phoneReset,
  } = useInput(usernameValidate);

  //Clear error khi chuyển mode
  useEffect(() => {
    //reset input và error để không hiển thị lỗi
    setError(null);
    usernameReset();
    passwordReset();
    fullNameReset();
    emailReset();
    phoneReset();
  }, [isLogin]);

  //Hàm xử lý submit form
  const submitHandler = function (e) {
    e.preventDefault();
    setError(null);

    //Check valid toàn bộ form
    let formIsValid = false;
    let postData;

    if (isLogin && usernameIsValid && passwordIsValid) {
      formIsValid = true;

      //Body của request
      postData = { username: usernameValue, password: passwordValue };
    }

    if (
      !isLogin &&
      usernameIsValid &&
      passwordIsValid &&
      fullNameIsValid &&
      phoneIsValid &&
      emailIsValid
    ) {
      formIsValid = true;

      //Body của request
      postData = {
        username: usernameValue,
        password: passwordValue,
        phone: phoneValue,
        email: emailValue,
        fullName: fullNameValue,
      };
    }

    if (!formIsValid) {
      console.log("form not valid");
      return;
    }

    //Hàm gửi request
    const postLogin = async function () {
      setIsLoggingIn(true);

      try {
        const req = await fetch(
          `http://localhost:5000/${isLogin ? "login" : "register"}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          }
        );

        //Check lỗi
        if (
          !req.ok &&
          req.status !== 401 &&
          req.status !== 409 &&
          req.status !== 403
        ) {
          throw new Error("Something went wrong");
        }

        const data = await req.json();
        console.log(data);
        // Nhận và lưu token
        let token, email;
        if (isLogin) {
          token = data.token;
          email = data.userData.email;
        }

        // Nếu request trả về token thì lưu lại
        if (token) {
          const remainingMilliseconds = 1000 * 60 * 60 * 24 * 2;
          const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );

          localStorage.setItem("token", token);
          localStorage.setItem("tokenExpiryDate", expiryDate.toISOString());
          // Set auto logout
        }

        if (email) {
          dispatch(authActions.logIn(email));
          localStorage.setItem("email", email);
        }

        //Check lỗi được gửi về từ server
        if (req.status === 401) {
          throw new Error(data);
        }

        if (req.status === 409) {
          throw new Error(data);
        }

        if (req.status === 403) {
          throw new Error(data.message);
        }

        if (req.ok && isLogin) {
          navigate("/");
        } else if (req.ok && !isLogin) {
          navigate("/auth?mode=login");
        }
      } catch (err) {
        setError(err.message);
      }

      setIsLoggingIn(false);
    };

    postLogin();
  };

  return (
    <div className={styles["form-container"]}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="username"
          placeholder={`${
            isLogin ? "Your Username or Email" : "Your Username"
          }`}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
          value={usernameValue}
        />
        {usernameHasError && (
          <p
            style={{ textAlign: "center", color: "red", marginBottom: "10px" }}
          >
            Bạn không được để trống username
          </p>
        )}
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          value={passwordValue}
        />
        {passwordHasError && (
          <p
            style={{ textAlign: "center", color: "red", marginBottom: "10px" }}
          >
            Password cần có ít nhất 8 kí tự
          </p>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="fullName"
              placeholder="Your Full Name"
              onChange={fullNameChangeHandler}
              onBlur={fullNameBlurHandler}
              value={fullNameValue}
            />
            {fullNameHasError && (
              <p
                style={{
                  textAlign: "center",
                  color: "red",
                  marginBottom: "10px",
                }}
              >
                Bạn không được để trống phần này
              </p>
            )}
          </>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              onChange={phoneChangeHandler}
              onBlur={phoneBlurHandler}
              value={phoneValue}
            />
            {phoneHasError && (
              <p
                style={{
                  textAlign: "center",
                  color: "red",
                  marginBottom: "10px",
                }}
              >
                Bạn không được để trống phần này
              </p>
            )}
          </>
        )}
        {!isLogin && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              value={emailValue}
            />
            {emailHasError && (
              <p
                style={{
                  textAlign: "center",
                  color: "red",
                  marginBottom: "10px",
                }}
              >
                Bạn cần nhập đúng định dạng email
              </p>
            )}
          </>
        )}

        {error && (
          <p
            style={{ textAlign: "center", color: "red", marginBottom: "10px" }}
          >
            {error}
          </p>
        )}
        {isLoggingIn && isLogin && (
          <p
            style={{
              textAlign: "center",
              color: "#1864ab",
              marginBottom: "10px",
            }}
          >
            Checking....
          </p>
        )}
        {isLoggingIn && !isLogin && (
          <p
            style={{
              textAlign: "center",
              color: "#1864ab",
              marginBottom: "10px",
            }}
          >
            Creating ...
          </p>
        )}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  );
};

export default Authentication;

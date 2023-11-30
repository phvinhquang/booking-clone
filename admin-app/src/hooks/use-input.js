import { useState } from "react";

const useInput = function (validateValueFn, defaultValue = "") {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValueFn(enteredValue);
  const hasError = !valueIsValid && isTouched;

  // Hàm xử lý sự kiện nhập input
  const valueChangeHandler = function (e) {
    setEnteredValue(e.target.value);
  };

  // Hàm xử lý sự kiện blur input
  const inputBlurHandler = function (e) {
    setIsTouched(true);
  };

  const reset = function () {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError: hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;

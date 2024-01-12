import { useState } from "react";
import handleValidation from "../utility/handleValidation";

const useValidator = (
  initialValue,
  validator = {
    isRequired: false,
    length: { min: 0, max: 999 },
    equalizer: "",
    type: "string",
    name: "",
  }
) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    const result = handleValidation(validator, value);
    setIsValid(result.isValid);
    setErrorMsg(result.msg);
    setIsFocused(true);
  };

  const isValidated = () => {
    if ((!validator.isRequired || isFocused) && isValid) {
      return true;
    }
    if (!isFocused && isValid) onBlur();
    return false;
  };

  return {
    value,
    isValid,
    errorMsg,
    onChange,
    onBlur,
    isValidated,
  };
};

export default useValidator;

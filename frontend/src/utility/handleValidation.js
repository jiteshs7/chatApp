import { EMAIL_REGEX } from "./constants";

const handleValidation = (validator, value) => {
  if (validator.isRequired && !value) {
    return {
      isValid: false,
      msg: `${validator.name} is a required field`,
    };
  }
  switch (validator.type) {
    case "email":
      if (!EMAIL_REGEX.test(value)) {
        return {
          isValid: false,
          msg: "Please enter valid email address",
        };
      }
      return {
        isValid: true,
        msg: "",
      };
    case "string":
      if (value.length > 0 && validator.length) {
        if (validator.length.min && validator.length.min > value.length) {
          return {
            isValid: false,
            msg: `${validator.name} must be more than ${validator.length.min} characters.`,
          };
        } else if (
          validator.length.max &&
          validator.length.max < value.length
        ) {
          return {
            isValid: false,
            msg: `${validator.name} must be less than ${validator.length.max} characters.`,
          };
        } else {
          return {
            isValid: true,
            msg: "",
          };
        }
      }
      return {
        isValid: true,
        msg: "",
      };

    case "cPassword":
      if (validator.equalizer !== value)
        return {
          isValid: false,
          msg: "Confirm password must be equal to password",
        };
      return {
        isValid: true,
        msg: "",
      };
    default:
      return {
        isValid: true,
        msg: "",
      };
  }
};

export default handleValidation;

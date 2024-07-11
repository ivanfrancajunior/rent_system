import { body } from "express-validator";

export const validateCreateUser = () => {
  return [
    body("name")
      .isString()
      .withMessage("Name is required.")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters."),
    body("email")
      .isString()
      .withMessage("E-mail is required.")
      .isEmail()
      .withMessage("Enter a valid e-mail address."),
    body("address").isString().withMessage("Address is required."),
    body("phone")
      .isString()
      .withMessage("Phone number is required.")
      .isLength({ min: 9 })
      .withMessage("Phone must be at least 9 characteres."),
    body("password")
      .isString()
      .withMessage("Password is required.")
      .isLength({ min: 5 })
      .withMessage("The password needs at least 5 characters."),
  ];
};

export const validateSigninUser = () => {
  return [
    body("email")
      .isString()
      .withMessage("E-mail is required.")
      .isEmail()
      .withMessage("Enter a valid e-mail address."),
    body("password")
      .isString()
      .withMessage("Password is required.")
      .isLength({ min: 5 })
      .withMessage("The password needs at least 5 characters."),
  ];
};

export const validateUpdateUser = () => {
  return [
    body("name")
      .isString()
      .withMessage("Name is required.")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters.")
      .optional(),
    body("email")
      .isString()
      .withMessage("E-mail is required.")
      .isEmail()
      .withMessage("Enter a valid e-mail address.")
      .optional(),
    body("address").isString().withMessage("Address is required.").optional(),
    body("phone")
      .isString()
      .withMessage("Phone number is required.")
      .isLength({ min: 9 })
      .withMessage("Phone must be at least 9 characteres.")
      .optional(),
    body("password")
      .isString()
      .withMessage("Password is required.")
      .isLength({ min: 5 })
      .withMessage("The password needs at least 5 characters.")
      .optional(),
  ];
};

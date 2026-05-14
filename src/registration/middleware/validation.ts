import { body } from "express-validator";
import isBlackListed from "password-blacklist";
import sanitize from "mongo-sanitize";

export const signupSanitization = [
  body("email")
    .normalizeEmail()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
  body("password")
    .trim()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
  body("username")
    .trim()
    .escape()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
  body("firstName")
    .trim()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
  body("lastName")
    .trim()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
];

export const signupValidator = [
  body("email").isEmail().withMessage("The email is invalid"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage(
      "The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .custom((value) => {
      const isPasswordBlackListed = isBlackListed(value);
      if (isPasswordBlackListed)
        throw new Error("The password is in the blacklist");
    }),
  body("username")
    .isLength({ min: 3 })
    .withMessage("The username must be at least 3 characters")
    .isLength({ max: 30 })
    .withMessage("The username cannot be longer than 30 characters")
    .matches(/^[a-zA-Z0-9_-]{3, 30}$/)
    .withMessage("The username contains invalid characters"),
  body("firstName")
    .notEmpty()
    .withMessage("The first name must be provided")
    .matches(/^[\p{L}\p{M}'\-\. ]{1,50}$/u)
    .withMessage("The first name contains invalid characters")
    .isLength({ max: 50 })
    .withMessage("The first name is too long"),
  body("lastName")
    .notEmpty()
    .withMessage("The last name must be provided")
    .matches(/^[\p{L}\p{M}'\-\. ]{1,50}$/u)
    .withMessage("The last name contains invalid characters")
    .isLength({ max: 50 })
    .withMessage("The last name is too long"),
];

export const resendEmailValidator = [
  body("email")
    .isEmail()
    .withMessage("The email is invalid")
    .notEmpty()
    .withMessage("The email must be provided")
    .isString()
    .withMessage("The email must be string"),
];

export const LoginSanitization = [
  body("email")
    .trim()
    .normalizeEmail()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
  body("username")
    .trim()
    .escape()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
  body("password")
    .trim()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
];

import { body } from "express-validator";
import sanitize from "mongo-sanitize";

export const sanitizeProfileUpdateInput = [
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
  body("bio")
    .trim()
    .customSanitizer((value) => {
      return sanitize(value);
    }),
];

export const validateProfileUpdateInput = [
  body("firstName")
    .matches(/^[\p{L}\p{M}'\-\. ]{1,50}$/u)
    .withMessage("The first name contains invalid characters")
    .isLength({ max: 50 })
    .withMessage("The first name is too long"),
  body("lastName")
    .matches(/^[\p{L}\p{M}'\-\. ]{1,50}$/u)
    .withMessage("The first name contains invalid characters")
    .isLength({ max: 50 })
    .withMessage("The first name is too long"),
];

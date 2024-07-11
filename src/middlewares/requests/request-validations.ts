import { body } from "express-validator";

const validStatus = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export const validateCreateRequest = () => {
  return [
    body("description")
      .isString()
      .withMessage("Description is required.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
  ];
};

export const validateUpdateRequest = () => {
  return [
    body("description")
      .isString()
      .withMessage("Description is required.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
    body("assignedTo")
      .isString()
      .withMessage("The employee name is required.")
      .optional(),
    body("status")
      .optional()
      .isString()
      .withMessage("Status is required.")
      .custom((value) => {
        if (!validStatus.includes(value)) {
          throw new Error("Invalid value");
        }
        return true;
      }),
  ];
};

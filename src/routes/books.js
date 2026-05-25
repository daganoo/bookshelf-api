const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");
const auth = require("../middleware/auth");

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("status")
    .optional()
    .isIn(["want-to-read", "reading", "finished"])
    .withMessage("Status must be want-to-read, reading, or finished"),
  body("rating")
    .optional({ values: "null" })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

const updateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("author").optional().trim().notEmpty().withMessage("Author cannot be empty"),
  body("status")
    .optional()
    .isIn(["want-to-read", "reading", "finished"])
    .withMessage("Status must be want-to-read, reading, or finished"),
  body("rating")
    .optional({ values: "null" })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

router.use(auth);

router.get("/", getAllBooks);
router.get("/:id", getBook);
router.post("/", createValidation, validate, createBook);
router.put("/:id", updateValidation, validate, updateBook);
router.delete("/:id", deleteBook);

module.exports = router;

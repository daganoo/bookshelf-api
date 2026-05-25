const pool = require("../config/database");

const getAllBooks = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM books WHERE user_id = $1";
    const params = [req.user.id];

    if (status) {
      query += " AND status = $2";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    res.json({ count: result.rows.length, books: result.rows });
  } catch (err) {
    next(err);
  }
};

const getBook = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ book: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, genre, status, rating, review } = req.body;

    const result = await pool.query(
      `INSERT INTO books (user_id, title, author, genre, status, rating, review)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, title, author, genre || null, status || "want-to-read", rating || null, review || null]
    );

    res.status(201).json({ book: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const ownerCheck = await pool.query(
      "SELECT id FROM books WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, genre, status, rating, review } = req.body;

    const result = await pool.query(
      `UPDATE books
       SET title = COALESCE($1, title),
           author = COALESCE($2, author),
           genre = COALESCE($3, genre),
           status = COALESCE($4, status),
           rating = COALESCE($5, rating),
           review = COALESCE($6, review),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title || null, author || null, genre || null, status || null, rating || null, review || null, req.params.id, req.user.id]
    );

    res.json({ book: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBooks, getBook, createBook, updateBook, deleteBook };

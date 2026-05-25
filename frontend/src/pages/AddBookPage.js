import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const AddBookPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("want-to-read");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/books", {
        title,
        author,
        genre: genre || undefined,
        status,
        rating: rating ? Number(rating) : undefined,
        review: review || undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(errors.map((e) => e.msg).join(", "));
      } else {
        setError(msg || "Failed to add book");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container page">
        <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>Add New Book</h1>
          <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
            Add a book to your collection
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                id="genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Fantasy, Sci-Fi"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating (1–5)</label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="form-group">
              <label htmlFor="review">Review</label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Your thoughts..."
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Book"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;

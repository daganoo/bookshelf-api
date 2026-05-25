import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./BookDetailPage.css";

const statusColors = {
  "want-to-read": "badge-gray",
  reading: "badge-blue",
  finished: "badge-green",
};

const renderStars = (rating) => {
  if (!rating) return <span className="stars">No rating</span>;
  return <span className="stars">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
};

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/api/books/${id}`);
      setBook(res.data.book);
      setForm(res.data.book);
    } catch (err) {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleEdit = () => {
    setForm({ ...book });
    setEditing(true);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await api.put(`/api/books/${id}`, {
        title: form.title,
        author: form.author,
        genre: form.genre || undefined,
        status: form.status,
        rating: form.rating ? Number(form.rating) : undefined,
        review: form.review || undefined,
      });
      setBook(res.data.book);
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(errors.map((e) => e.msg).join(", "));
      } else {
        setError(msg || "Failed to update book");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.delete(`/api/books/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container page">
          <div className="card">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container page">
        <div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
          {editing ? (
            <>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>Edit Book</h1>
              <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
                Update your book details
              </p>

              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange("title")}
                  placeholder="Book title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text"
                  value={form.author}
                  onChange={handleChange("author")}
                  placeholder="Author name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  type="text"
                  value={form.genre || ""}
                  onChange={handleChange("genre")}
                  placeholder="Genre"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={handleChange("status")}
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
                  value={form.rating || ""}
                  onChange={handleChange("rating")}
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label htmlFor="review">Review</label>
                <textarea
                  id="review"
                  value={form.review || ""}
                  onChange={handleChange("review")}
                  placeholder="Your thoughts..."
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="detail-header">
                <h1>{book.title}</h1>
                <div className="detail-header-actions">
                  <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Author</span>
                  <span className="detail-value">{book.author}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Genre</span>
                  <span className="detail-value">{book.genre || "—"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`badge ${statusColors[book.status]}`}>
                    {book.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rating</span>
                  <span className="detail-value">{renderStars(book.rating)}</span>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 16 }}>
                <span className="detail-label">Review</span>
                <span className="detail-value">
                  {book.review || "No review yet"}
                </span>
              </div>

              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                Created: {new Date(book.created_at).toLocaleDateString()}
                {book.updated_at !== book.created_at &&
                  ` · Updated: ${new Date(book.updated_at).toLocaleDateString()}`}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;

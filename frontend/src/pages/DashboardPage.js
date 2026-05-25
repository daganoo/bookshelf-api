import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./DashboardPage.css";

const statusColors = {
  "want-to-read": "badge-gray",
  reading: "badge-blue",
  finished: "badge-green",
};

const renderStars = (rating) => {
  if (!rating) return null;
  return <span className="stars">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
};

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const url = statusFilter
        ? `/api/books?status=${statusFilter}`
        : "/api/books";
      const res = await api.get(url);
      setBooks(res.data.books);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBooks();
  }, [statusFilter]);

  return (
    <div>
      <Navbar />
      <div className="container page">
        <div className="dashboard-header">
          <h1>My BookShelf</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/books/add")}
          >
            + Add Book
          </button>
        </div>

        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Books</option>
            <option value="want-to-read">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <h2>No books found</h2>
            <p>Start building your collection</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/books/add")}
            >
              + Add Your First Book
            </button>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <div
                key={book.id}
                className="card book-card"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <div className="book-card-header">
                  <div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>
                  </div>
                </div>
                <div className="book-meta">
                  <span className={`badge ${statusColors[book.status] || "badge-gray"}`}>
                    {book.status}
                  </span>
                  {book.rating && renderStars(book.rating)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

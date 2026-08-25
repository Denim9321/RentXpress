import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      if (res.data.success) setReviews(res.data.reviews);
    } catch (error) {
      console.error("❌ Error loading reviews:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        { itemId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("✅ Review submitted!");
        setRating(0);
        setComment("");
        fetchReviews();
      }
    } catch (error) {
      console.error("❌ Review Submit Error:", error);
      alert("Failed to submit review.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#1E40AF", marginBottom: "20px" }}>⭐ Reviews</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (1–5)"
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          required
          style={{ marginRight: "10px", width: "300px" }}
        />
        <button type="submit" style={{ padding: "6px 12px" }}>
          Submit
        </button>
      </form>

      <div style={{ marginTop: "30px" }}>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} style={{ borderBottom: "1px solid #ccc", marginTop: "10px" }}>
              <p>
                ⭐ {r.rating} — {r.comment}
              </p>
              <small>by {r.user?.name}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

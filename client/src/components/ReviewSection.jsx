import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function ReviewSection() {
  const { itemId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${itemId}`);
      if (res.data.success) setReviews(res.data.reviews);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/reviews/${itemId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("✅ Review added successfully!");
        setComment("");
        fetchReviews();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("❌ Failed to add review. Please log in or try again.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Link
        to="/"
        className="text-blue-700 font-semibold hover:underline mb-4 inline-block"
      >
        ← Back to Items
      </Link>
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        💬 Item Reviews
      </h2>

      {/* Add Review */}
      {token ? (
        <form
          onSubmit={addReview}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <label className="block font-semibold mb-2">Rating (1–5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border rounded-md px-3 py-2 mb-4 w-full focus:outline-blue-500"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>

          <label className="block font-semibold mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-blue-500"
            placeholder="Write your experience..."
            rows="3"
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600 mb-8">
          Please log in to add a review.
        </p>
      )}

      {/* Review List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold text-blue-800">
                {r.user?.name || "Anonymous"}{" "}
                <span className="text-yellow-500">{"⭐".repeat(r.rating)}</span>
              </p>
              <p className="text-gray-700 mt-1">{r.comment}</p>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import BookSection from "../components/BookSection";

export default function Equipment() {
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddReview, setShowAddReview] = useState({});
  const [newReview, setNewReview] = useState({});
  const token = localStorage.getItem("token");

  // ✅ Fetch Equipment
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items?category=Equipment");
      if (res.data.success) setItems(res.data.items);
    } catch (error) {
      console.error("❌ Error fetching equipment:", error);
    }
  };

  // ✅ Fetch Reviews
  const fetchReviews = async (itemId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${itemId}`);
      if (res.data.success) setReviews((prev) => ({ ...prev, [itemId]: res.data.reviews }));
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
    }
  };

  // ✅ Add Review
  const handleAddReview = async (itemId) => {
    if (!token) {
      alert("Please log in to add a review.");
      window.location.href = "/login";
      return;
    }

    const reviewData = newReview[itemId];
    if (!reviewData?.rating || !reviewData?.comment?.trim()) {
      alert("Please provide both rating and comment.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          itemId,
          rating: Number(reviewData.rating),
          comment: reviewData.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Review added successfully!");
        setNewReview((prev) => ({ ...prev, [itemId]: { rating: "", comment: "" } }));
        setShowAddReview((prev) => ({ ...prev, [itemId]: false }));
        fetchReviews(itemId);
      } else {
        alert(res.data.message || "Failed to add review. Try again later.");
      }
    } catch (error) {
      console.error("❌ Add Review Error:", error.response?.data || error.message);
      alert("Failed to add review. Please try again later.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ color: "#1E40AF", fontWeight: "bold", marginBottom: "20px" }}>
        ⚙️ Equipment on Rent
      </h1>

      {/* ✅ Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Search equipment by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "60%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {filteredItems.length === 0 ? (
        <p>No equipment found matching your search.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                width: "320px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "180px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
              <h3 style={{ color: "#1E40AF" }}>{item.name}</h3>
              <p>📍 {item.location}</p>
              <p>💰 ₹{item.price}/day</p>
              <p>{item.description}</p>

              <BookSection itemId={item._id} itemName={item.name} price={item.price} />

              {/* ✅ View Reviews */}
              <button
                onClick={() => fetchReviews(item._id)}
                style={{
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                View Reviews
              </button>

              {/* ✅ Reviews Section */}
              {reviews[item._id] && (
                <div style={{ marginTop: "10px" }}>
                  <h4 style={{ color: "#1E3A8A" }}>⭐ Reviews:</h4>
                  {reviews[item._id].length === 0 ? (
                    <p>No reviews yet.</p>
                  ) : (
                    reviews[item._id].map((r) => (
                      <div key={r._id} style={{ borderBottom: "1px solid #ccc", margin: "5px 0" }}>
                        <p>
                          ⭐ {r.rating} — {r.comment}
                        </p>
                        <small>by {r.user?.name || "Anonymous"}</small>
                      </div>
                    ))
                  )}

                  {/* ✅ Add Review Form */}
                  {!showAddReview[item._id] ? (
                    <button
                      onClick={() =>
                        setShowAddReview((prev) => ({ ...prev, [item._id]: true }))
                      }
                      style={{
                        background: "#22C55E",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        cursor: "pointer",
                        marginTop: "8px",
                        width: "100%",
                      }}
                    >
                      ➕ Add Review
                    </button>
                  ) : (
                    <div style={{ marginTop: "10px", borderTop: "1px solid #ddd" }}>
                      <h4 style={{ color: "#1E40AF" }}>Write Your Review</h4>
                      <select
                        value={newReview[item._id]?.rating || ""}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            [item._id]: { ...prev[item._id], rating: e.target.value },
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          marginBottom: "6px",
                        }}
                      >
                        <option value="">Select Rating</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r} ⭐
                          </option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Write your comment..."
                        value={newReview[item._id]?.comment || ""}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            [item._id]: { ...prev[item._id], comment: e.target.value },
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          marginBottom: "6px",
                        }}
                      />
                      <button
                        onClick={() => handleAddReview(item._id)}
                        style={{
                          background: "#22C55E",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

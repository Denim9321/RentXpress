import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://rentxpress.onrender.com/api";

console.log("🌐 Using API Base URL:", baseURL);

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add item
export const addItem = async (formData) => {
  const res = await API.post("/items/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Get all items
export const getAllItems = async () => {
  const res = await API.get("/items");
  return res.data;
};

// ✅ Delete item
export const deleteItem = async (id) => {
  const res = await API.delete(`/items/${id}`);
  return res.data;
};

export default API;

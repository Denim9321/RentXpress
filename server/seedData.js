import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/itemModel.js";
import { connectDB } from "./config/db.js";

dotenv.config();

// ✅ Connect to MongoDB
await connectDB();

// ✅ Sample Data
const sampleItems = [
  // 🚗 Vehicles
  {
    name: "Honda Activa 6G",
    category: "vehicles",
    price: 400,
    location: "Mumbai",
    description: "Reliable scooter perfect for city rides.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Honda_Activa_6G.jpg",
  },
  {
    name: "Royal Enfield Classic 350",
    category: "vehicles",
    price: 900,
    location: "Pune",
    description: "Classic retro motorcycle for long rides.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Royal_Enfield_Classic_350.jpg",
  },
  {
    name: "Maruti Swift",
    category: "vehicles",
    price: 1500,
    location: "Nashik",
    description: "Compact car suitable for daily travel.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Maruti_Swift.jpg",
  },

  // 🧰 Equipment
  {
    name: "DSLR Camera Canon 80D",
    category: "equipment",
    price: 1200,
    location: "Mumbai",
    description: "Professional DSLR camera for photography.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Canon_EOS_80D_body.jpg",
  },
  {
    name: "Electric Drill Machine",
    category: "equipment",
    price: 250,
    location: "Thane",
    description: "Powerful drilling machine for home or professional use.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Drill_machine.jpg",
  },

  // 🏨 Rooms
  {
    name: "Deluxe Room - Hotel SeaView",
    category: "rooms",
    price: 1800,
    location: "Goa",
    description: "Beach-facing deluxe room with free breakfast.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Deluxe_room_in_Goa.jpg",
  },
  {
    name: "Budget Room - BlueSky Inn",
    category: "rooms",
    price: 800,
    location: "Mumbai",
    description: "Clean and comfortable budget room near airport.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Hotel_room_bed.jpg",
  },
];

// ✅ Function to insert data
const seedDatabase = async () => {
  try {
    await Item.deleteMany(); // Clears old items
    await Item.insertMany(sampleItems);
    console.log("✅ Sample data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

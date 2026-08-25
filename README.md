# 🏠 RentXpress

### Full-Stack Rental Management Platform

RentXpress is a full-stack web application designed to simplify the process of discovering, managing, and booking rental resources through a centralized platform.

The application provides separate workflows for **users and administrators**, with features including rental browsing, authentication, booking management, reviews, inventory management, and image handling.

---

## 🚀 Features

### 👤 User Features

* User registration and login
* Secure authentication
* Browse rental resources
* View rooms, vehicles, and equipment
* View rental details
* Book rental resources
* View and manage bookings
* Submit and view reviews
* Responsive user interface

### 👨‍💼 Admin Features

* Dedicated admin dashboard
* Manage rental items
* Add, update, and delete rental listings
* Manage bookings
* Manage rental inventory
* Administrative access control

### 📅 Booking Management

* Create rental bookings
* Store and retrieve booking information
* User-specific booking management
* Admin booking management

### ⭐ Review System

* Users can submit reviews
* Display reviews for rental resources
* Backend API support for review management

### ☁️ Image Management

* Cloudinary integration for image handling
* Image credentials managed through environment variables
* Secure separation of application credentials from source code

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **JavaScript / JSX**
* **Vite**
* **Tailwind CSS**
* **Axios**
* **React Router**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**
* **REST APIs**

### Tools & Services

* **Cloudinary**
* **Git**
* **GitHub**
* **npm**
* **VS Code**

---

## 🏗️ System Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │     + Vite      │
                    └────────┬────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌─────────────────┐
                    │ Node.js +       │
                    │ Express Server  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          Routes       Controllers      Middleware
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │ MongoDB +        │
                    │    Mongoose     │
                    └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Cloudinary    │
                    │ Image Management │
                    └─────────────────┘
```

---

## 🔄 Application Workflow

### User Workflow

```text
Register / Login
       ↓
Browse Rentals
       ↓
View Rental Details
       ↓
Select Rental
       ↓
Create Booking
       ↓
Manage Booking
       ↓
Submit Review
```

### Admin Workflow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Manage Rental Items
     ↓
Manage Inventory
     ↓
Manage Bookings
```

---

## 📂 Project Structure

```text
RentXpress/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ReviewSection.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookNow.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── BookingsDashboard.jsx
│   │   │   ├── Equipment.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ItemManager.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Reviews.jsx
│   │   │   ├── Rooms.jsx
│   │   │   └── Vehicles.jsx
│   │   │
│   │   ├── services/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── itemController.js
│   │   └── reviewController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── bookingModel.js
│   │   ├── itemModel.js
│   │   ├── reviewModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── itemRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── seedAdmin.js
│   ├── seedData.js
│   └── server.js
│
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 🗄️ Database

MongoDB is used as the primary database, with Mongoose for schema modeling and database operations.

### Main Models

| Model   | Purpose                             |
| ------- | ----------------------------------- |
| User    | User and authentication information |
| Item    | Rental item and listing information |
| Booking | Booking and rental information      |
| Review  | User reviews and ratings            |

---

## 🔌 Backend Architecture

The backend follows a modular REST API architecture:

```text
Client Request
      ↓
    Route
      ↓
 Middleware
      ↓
  Controller
      ↓
    Model
      ↓
   MongoDB
      ↓
   Response
```

This separation of **routes, controllers, models, and middleware** improves code organization, maintainability, and scalability.

---

## 🔐 Security & Configuration

Sensitive credentials are not hard-coded into the application.

Environment variables are used for configuration such as:

```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
```

The `.gitignore` file prevents sensitive `.env` files and unnecessary dependencies such as `node_modules` from being uploaded to GitHub.

> Never commit real credentials or API keys to the repository.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Denim9321/RentXpress.git
cd RentXpress
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create the required `.env` file for the backend and add your MongoDB, Cloudinary, and authentication configuration.

### 4. Start the backend

```bash
cd server
npm start
```

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

---

## 💡 Technical Highlights

* Full-stack web application using React and Node.js
* RESTful API architecture
* MongoDB database integration using Mongoose
* Authentication and protected backend routes
* Modular MVC-style backend structure
* CRUD operations for rental inventory
* Booking management system
* Review management system
* Separate user and admin workflows
* Cloudinary integration for image management
* Environment-based configuration for sensitive credentials
* Component-based React frontend
* Responsive user interface
* Seed scripts for initial application data

---

## 📸 Screenshots

Add screenshots of the major application pages here.

Recommended screenshots:

* Home Page
* Login/Register
* Rental Listings
* Booking Page
* User Bookings
* Admin Dashboard
* Item Management
* Reviews

Example:

```markdown
## 📸 Screenshots

### Home Page
![RentXpress Home](screenshots/home.png)

### Booking Page
![Booking Page](screenshots/booking.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 🔮 Future Enhancements

* Online payment gateway integration
* Real-time rental availability
* Email and SMS booking notifications
* Advanced search and filtering
* Location-based rental discovery
* Analytics and reporting dashboard
* Booking cancellation and refund workflow
* Automated testing
* CI/CD pipeline
* Production deployment using Docker

---

## 👨‍💻 Developer

**Yashwant Gupta**

RentXpress was developed as a full-stack web application to demonstrate practical experience in **frontend development, backend API development, database management, authentication, CRUD operations, and cloud service integration**.

---



# 🏠 Basha Lagbe — MERN To-Let Platform

<div align="center">

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern, full-stack property rental platform built with the MERN stack**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**Basha Lagbe** (Bengali: "Need a Home") is a comprehensive property rental platform designed to simplify the process of finding and listing rental properties. Built with modern web technologies, it provides a seamless experience for both property seekers and landlords.

### 🌟 Why Basha Lagbe?

- **User-Centric Design**: Intuitive interface for easy navigation
- **Secure & Reliable**: JWT authentication, Firebase integration, and data encryption
- **Real-Time Updates**: Instant notifications and messaging
- **Advanced Search**: Powerful filters to find the perfect property
- **Admin Control**: Comprehensive dashboard for platform management

---

## ✨ Features

### 👤 User Features

- ✅ **User Authentication**
  - Email/Password registration and login
  - OAuth integration (Google, GitHub)
  - Email verification
  - Password reset functionality
  
- 🏘️ **Property Listings**
  - Browse available properties with rich details
  - Advanced search with multiple filters (location, price, type, amenities)
  - Image galleries with high-quality photos
  - Save favorite properties
  
- 📝 **Property Management**
  - List properties with detailed descriptions
  - Upload multiple images
  - Edit and delete listings
  - Track views and applications
  
- 💬 **Communication**
  - In-app inquiry system
  - Direct messaging with property owners
  - Application tracking
  - Notification system
  
- ⭐ **Reviews & Ratings**
  - Rate and review properties
  - Read reviews from other tenants
  - Verified tenant reviews

### 🔐 Admin Features

- 📊 **Dashboard Analytics**
  - User statistics
  - Property metrics
  - Application tracking
  - Revenue insights
  
- 👥 **User Management**
  - View all users
  - Manage user roles
  - Handle user reports
  
- 🏢 **Property Moderation**
  - Approve/reject listings
  - Monitor property quality
  - Handle reported listings
  
- 📧 **Communication Management**
  - Monitor inquiries
  - Manage notifications
  - Email system oversight

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v7** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Firebase** - Authentication & Storage
- **Swiper** - Image carousels

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Sharp** - Image processing

### DevOps & Tools
- **Git** - Version control
- **ESLint** - Code linting
- **Nodemon** - Development server
- **dotenv** - Environment management

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Firebase Account** (for authentication)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nicgott99/Basha-Lagbe-MERN-To-Let-Platform.git
   cd Basha-Lagbe-MERN-To-Let-Platform
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Return to root
   cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # MongoDB
   MONGO_URL=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Email Service (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Frontend URL
   CLIENT_URL=http://localhost:5173

   # Server
   PORT=3000
   NODE_ENV=development
   ```

   Create a `.env` file in the `client` directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id

   # API Base URL
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Initialize the database (optional)**

   ```bash
   # Create admin user
   node server/createAdmin.js

   # Initialize database
   node server/initDB.js
   ```

5. **Run the application**

   ```bash
   # Development mode with both client and server
   # Terminal 1 - Run server
   npm run dev

   # Terminal 2 - Run client
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## 🔧 Environment Variables

### Server (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `EMAIL_USER` | Email for nodemailer | ✅ |
| `EMAIL_PASS` | Email app password | ✅ |
| `CLIENT_URL` | Frontend URL | ✅ |
| `PORT` | Server port | ❌ (default: 3000) |

### Client (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `VITE_API_BASE_URL` | Backend API URL | ✅ |

---

## 📖 Usage

### For Property Seekers

1. **Sign Up/Login** - Create an account or log in
2. **Browse Properties** - Use search and filters to find properties
3. **View Details** - Check property details, images, and reviews
4. **Apply** - Submit applications for properties you're interested in
5. **Contact Owners** - Send inquiries directly to property owners
6. **Leave Reviews** - Share your experience after renting

### For Property Owners

1. **Create Listing** - Add your property with details and images
2. **Manage Listings** - Edit, update, or remove your properties
3. **Review Applications** - Check applications from interested tenants
4. **Communicate** - Respond to inquiries and messages
5. **Track Performance** - Monitor views and application statistics

### For Administrators

1. **Access Dashboard** - View comprehensive platform analytics
2. **Moderate Content** - Review and approve property listings
3. **Manage Users** - Handle user accounts and permissions
4. **Monitor Activity** - Track platform usage and metrics

---

## 📁 Project Structure

```
Basha-Lagbe/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ...
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── redux/         # Redux store & slices
│   │   │   ├── store.js
│   │   │   └── users/
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── listing.controller.js
│   │   └── ...
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── listing.model.js
│   │   ├── Review.js
│   │   └── ...
│   ├── routes/           # API routes
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── listing.route.js
│   │   └── ...
│   ├── utils/            # Utility functions
│   │   ├── emailService.js
│   │   ├── jwtUtils.js
│   │   └── ...
│   ├── uploads/          # User uploaded files
│   ├── index.js          # Server entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json          # Root package.json
```

---

## 🔌 API Documentation

### Authentication Endpoints

```
POST   /server/auth/signup              # Register new user
POST   /server/auth/signin              # Login user
POST   /server/auth/google              # Google OAuth
POST   /server/auth/signout             # Logout user
POST   /server/auth/forgot-password     # Request password reset
POST   /server/auth/reset-password      # Reset password
GET    /server/auth/verify-email/:token # Verify email
```

### User Endpoints

```
GET    /server/user/profile             # Get user profile
PUT    /server/user/update/:id          # Update user
DELETE /server/user/delete/:id          # Delete user
GET    /server/user/listings/:id        # Get user listings
```

### Listing Endpoints

```
GET    /server/listing                  # Get all listings
GET    /server/listing/:id              # Get single listing
POST   /server/listing/create           # Create listing
PUT    /server/listing/update/:id       # Update listing
DELETE /server/listing/delete/:id       # Delete listing
GET    /server/listing/search           # Search listings
```

### Review Endpoints

```
GET    /server/review/listing/:id       # Get listing reviews
POST   /server/review/create            # Create review
PUT    /server/review/update/:id        # Update review
DELETE /server/review/delete/:id        # Delete review
```

### Admin Endpoints

```
GET    /server/admin/users              # Get all users
GET    /server/admin/stats              # Get platform stats
PUT    /server/admin/user/:id           # Update user role
DELETE /server/admin/listing/:id        # Remove listing
```

For detailed API documentation with request/response examples, see [API_DOCS.md](./docs/API_DOCS.md)

---

## 📸 Screenshots

> *Add screenshots of your application here*

<div align="center">

### Home Page
![Home Page](./docs/screenshots/home.png)

### Property Search
![Search](./docs/screenshots/search.png)

### Property Details
![Details](./docs/screenshots/details.png)

### Admin Dashboard
![Admin](./docs/screenshots/admin.png)

</div>

---

## 🗺️ Roadmap

- [x] User authentication and authorization
- [x] Property listing and management
- [x] Advanced search and filters
- [x] Review and rating system
- [x] Admin dashboard
- [ ] Real-time chat system
- [ ] Payment integration
- [ ] Mobile application (React Native)
- [ ] AI-powered property recommendations
- [ ] Virtual property tours
- [ ] Tenant verification system
- [ ] Multi-language support
- [ ] Dark mode

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [Nicgott99](https://github.com/Nicgott99)

---

## 🙏 Acknowledgments

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- All contributors who have helped this project grow

---

## 📞 Contact

**Project Link**: [https://github.com/Nicgott99/Basha-Lagbe-MERN-To-Let-Platform](https://github.com/Nicgott99/Basha-Lagbe-MERN-To-Let-Platform)

**Email**: your.email@example.com

---

<div align="center">

Made with ❤️ by the Basha Lagbe Team

⭐ Star this repository if you found it helpful!

</div>

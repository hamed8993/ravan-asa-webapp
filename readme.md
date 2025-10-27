# 🧠 Ravan Asa - Professional Psychology Platform

![Node.js](https://img.shields.io/badge/Node.js-v16.15.0-green)
![Express.js](https://img.shields.io/badge/Express.js-4.16.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0.16-green)
![Mongoose](https://img.shields.io/badge/mongoose-5.0.16-green)
![License: ISC](https://img.shields.io/badge/License-ISC-blue)

![JWT](https://img.shields.io/badge/JWT-8.3.0-red)
![Passport](https://img.shields.io/badge/Passport-0.4.0-blue)
![bcrypt](https://img.shields.io/badge/bcrypt-5.0.1-orange)

![Multer](https://img.shields.io/badge/Multer-1.3.0-yellow)
![Nodemailer](https://img.shields.io/badge/Nodemailer-6.7.7-lightgrey)
![WebSocket](https://img.shields.io/badge/WebSocket-8.8.1-blue)

A comprehensive psychology platform built with Express.js featuring user management, live chat, course system, and admin panel.

## 🚀 Overview

Ravan Asa WebApp is a small-scale yet fully functional **web platform** simulating a psychology/education website.  
It supports **user registration**, **role-based access control**, **real-time chat (like WhatsApp)**, and an **admin dashboard** to manage content, users, and permissions.

Originally built in **mid-2022**, this project demonstrates backend architecture design, RESTful routing, and clean Express MVC structure.

🚀 Features
🔐 Authentication & Security
- User Registration & Login with email verification  
- Google OAuth 2.0 integration  
- Password Reset functionality  
- Role-Based Access Control (RBAC)  
- JWT Authentication  
- CSRF Protection  
- Rate Limiting  
- Helmet.js for security headers


💬 Real-time Communication
- Live Chat System (WhatsApp-like interface)
- WebSocket integration
- Real-time messaging between users and admins
- Chat rooms management

🎓 Course Management
- Course Creation & Management
- Episode System with file downloads
- Course Categorization
- Payment Integration for premium content
- RSS Feed for courses and episodes
- Comment System with moderation

👥 User Management
Multi-level User Roles (Admin, VIP, Regular Users)
- User Profile Management
- Avatar Upload functionality
- Purchase History
- VIP Subscription system

🛠 Admin Panel
- Complete CRUD Operations for courses, episodes, categories
- User Management with role assignment
- Comment Moderation
- Permission & Role Management
- Category Management
- Real-time statistics

📱 Technical Features
- EJS Templating with layouts
- File Upload with Multer
- Image Processing with Sharp
- Email Services with Nodemailer
- Sitemap Generation
- RSS Feed Generation
- Input Validation with Express Validator
- MongoDB with Mongoose ODM
- Session Management with connect-mongo

## 🛠 Installation & Setup

### Prerequisites
- Node.js v16.15.0  
- MongoDB  
- npm or yarn

Environment Variables
Create a .env file in the root directory:

env
- PORT=3000
- WEBSITE_URL=http://localhost:3000
- DATABASE_URL=mongodb://localhost/webSocket
- SESSION_SECRET_KEY=your_session_secret
- COOKIE_SECRET_KEY=your_cookie_secret

# reCAPTCHA Keys
- CLIENT_KEY=your_recaptcha_client_key
- SECRET_KEY=your_recaptcha_secret_key

# Google OAuth
- GOOGLE_CLIENTKEY=your_google_client_id
- GOOGLE_SECRETKEY=your_google_secret
- GOOGLE_CALLBACKURL=http://localhost:3000/auth/google/callback
- Installation Steps
- Clone the repository

bash
- git clone https://github.com/yourusername/ravan-asa-webapp.git
- cd ravan-asa-webapp
- Install dependencies

bash
- npm install
- Set up MongoDB

bash
# Make sure MongoDB is running


nodemon server.js


running PORT:
http://localhost:3000

📁 Project Structure
```
app/
├── http/
│   ├── controllers/
│   ├── middleware/
│   └── validators/
├── models/
├── routes/
│   └── web/
├── helpers/
└── views/
```

🎯 API Routes
Authentication Routes
- GET/POST /auth/register - User registration
- GET/POST /auth/login - User login
- GET /auth/google - Google OAuth
- GET/POST /auth/password/\* - Password reset

User Routes
- GET /user/panel - User dashboard
- GET /user/panel/history - Purchase history
- GET /user/panel/messaging - Messaging interface
- POST /user/panel/chatroom - Chat room management

Course Routes
- GET /courses - All courses
- GET /courses/:course - Single course
- POST /courses/payment - Course payment
- GET /download/:episode - Episode download

Admin Routes
- GET /admin - Admin dashboard
- GET /admin/courses/\* - Course management
- GET /admin/episodes/\* - Episode management
- GET /admin/users/\* - User management
- GET /admin/comments/\* - Comment moderation

🔧 Key Dependencies
Core Framework
Express.js - Web framework
- EJS - Templating engine
- Mongoose - MongoDB ODM

Authentication & Security
- Passport.js - Authentication middleware
- bcrypt - Password hashing
- jsonwebtoken - JWT tokens
- csurf - CSRF protection
- helmet - Security headers

File Handling
- Multer - File uploads
- Sharp - Image processing

Utilities
- Axios - HTTP client
- Nodemailer - Email service
- Moment.js - Date handling
- Validator - Input validation

🎨 Frontend Features
- Responsive Design with EJS layouts
- AJAX File Uploads
- Real-time Chat Interface
- Payment Integration
- Admin Dashboard with analytics
- User Profile Management
- Course Player with episode navigation

🔒 Security Features
- Input validation and sanitization
- CSRF protection
- XSS prevention
- Secure session management
- Rate limiting
- Role-based access control
- File upload security
- HTTPS ready

🚀 Deployment
The application is ready for production deployment with:
nodemon server.js

📝 License
This project is licensed under the ISC License.

👨‍💻 Developer
Developed by Hamed shahri (hamed7087@gmail.com) in August 2022 as a professional backend demonstration project showcasing full-stack JavaScript development capabilities.

Note: This is a demonstration project for portfolio purposes. Some features like payment processing and email services require additional configuration for production use.

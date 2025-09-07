# LearnHub: AI-Powered E-Learning Platform

![LearnHub Banner](https://img.shields.io/badge/LearnHub-AI%20Powered%20LMS-blue?style=for-the-badge&logo=graduationcap)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)

A sophisticated, full-stack Learning Management System designed for the future of education. LearnHub combines AI-powered features with modern web technologies to deliver an exceptional learning experience.

## 🚀 Quick Links

- [**Live Demo**](https://elearning-fww9.vercel.app/) 
- [**Backend API**](https://course-frontend-nu.vercel.app)
- [**Features Overview**](#features)
- [**Getting Started**](#getting-started)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo Credentials](#demo-credentials)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

LearnHub is a comprehensive e-learning platform that provides two distinct user experiences:

- **Admin Portal**: Complete course management, student analytics, and AI-powered assignment generation
- **Student Portal**: Interactive learning dashboard with secure video streaming and progress tracking

### Key Statistics
- 10,000+ Active Students
- 500+ Courses Available
- 4.8/5 Average Rating
- 95% Completion Rate

## Features

### 🎯 Core Features

- **AI-Powered Learning**: Personalized course recommendations and intelligent assignment generation using Google Gemini AI
- **Secure Video Streaming**: Chunk-based video delivery with download prevention
- **Payment Integration**: Seamless transactions with Razorpay
- **Real-time Analytics**: Comprehensive dashboard with enrollment trends and performance metrics
- **Mobile Responsive**: Optimized for all devices

### 👨‍💻 Admin Portal Features

**Dashboard & Analytics**
- Real-time student enrollment trends
- Revenue analytics and reporting
- Course performance metrics
- Popular content analysis

**Course Management**
- Intuitive course creation and editing
- AWS S3 integration for secure video uploads
- Content linking and organization
- Bulk operations support

**AI Assignment Generator**
- Google Gemini AI integration
- Topic-based question generation
- Professional PDF creation
- Instant assignment deployment

**Student Management**
- Streamlined enrollment approval workflow
- Automated email notifications
- User access control and permissions
- Detailed student performance tracking

### 👩‍🎓 Student Portal Features

**Authentication & Security**
- OTP email verification
- JWT-based authentication
- Role-based access control
- Secure payment processing

**Learning Environment**
- Personalized learning dashboard
- Interactive video player with progress tracking
- Assignment submission system
- Achievement badges and certificates

**Progress Tracking**
- Visual progress reports
- Performance analytics
- Grade management
- Goal setting and tracking

## Tech Stack

### Frontend
- **React.js** ^18.0.0 - UI Framework
- **Tailwind CSS** ^3.0.0 - Styling
- **React Router** ^6.0.0 - Navigation
- **Axios** ^1.0.0 - HTTP Client
- **Vidstack Player** ^1.0.0 - Video Streaming
- **Lucide React** ^0.263.1 - Icons

### Backend
- **Node.js** ^18.0.0 - Runtime Environment
- **Express.js** ^4.18.0 - Web Framework
- **MongoDB** ^5.0.0 - Database
- **Mongoose** ^7.0.0 - ODM
- **JWT** ^9.0.0 - Authentication
- **Bcrypt.js** ^2.4.3 - Password Hashing

### Third-Party Services
- **AWS S3** - File Storage and CDN
- **Google Gemini AI** - Content Generation
- **Razorpay** - Payment Processing
- **Nodemailer** - Email Service
- **Node-Cron** - Task Scheduling

## Demo Credentials

### Test Account
| Role | Email | Password | Access |
|------|-------|----------|--------|
| Student | `arthp2210@gmail.com` | `arthp2210@gmail.com` | Full Stack Web Development Bootcamp |

> **Note**: Use these credentials to explore the student portal and course features.



## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB instance (local or Atlas)
- AWS Account with S3 bucket
- Google AI Studio API key
- Razorpay merchant account

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahulsaini27/Elearning.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Bug Reports

When reporting bugs, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, etc.)

### Feature Requests

For feature requests, please provide:
- Detailed description of the feature
- Use case scenarios
- Potential implementation approach
- Benefits to the platform

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors and the open-source community
- Special recognition to the developers and maintainers of the technologies used
- Appreciation for user feedback and suggestions

## Contact

**Developer**: [Rahul Saini](https://github.com/Rahulsaini27/)

For questions, suggestions, or support, please open an issue on GitHub or contact the development team.

---

⭐ **If you find this project helpful, please star the repository!** ⭐
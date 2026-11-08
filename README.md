# 🏋️ AI Fitness Coach

### Your Personal AI-Powered Fitness & Workout Companion

AI Fitness Coach is a full-stack fitness platform designed to help users manage their fitness journey through AI-powered coaching, workout management, exercise discovery, and community interaction.

Built with the MERN stack, the platform combines artificial intelligence, real-time communication, and personalized fitness management in one application.

## 🏗️ System Architecture

The application uses a full-stack client-server architecture with REST APIs and real-time communication through a shared HTTP server.

For the detailed architecture diagram and communication flow, see:

[View System Architecture](docs/architecture.md)

## 🚀 Features

### 🤖 AI Fitness Coach
- AI-powered fitness conversations
- Personalized fitness guidance
- Workout and exercise recommendations
- Google Gemini API integration

### 💪 Workout Management
- Exercise library
- Workout plan management
- Workout logging and history
- Personal records tracking
- Exercise discovery

### 👥 Community Platform
- Create and share fitness posts
- Like and comment on posts
- Bookmark community content
- Image attachments and media uploads

### 💬 Real-Time Messaging
- Real-time communication using Socket.IO
- User online presence
- Messaging and conversation management
- Image attachments

### 🎥 Fitness Video Discovery
- YouTube video search integration
- Fitness video discovery
- Video caching and management

### 🔐 Authentication & Security
- JWT-based authentication
- Protected routes
- Role-based access control
- Password hashing
- Admin functionality

### ☁️ Media Management
- Cloudinary integration
- Image uploading and storage
- Media attachment support

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| AI Integration | Google Gemini API |
| Real-Time Communication | Socket.IO |
| Media Storage | Cloudinary |
| Video Integration | YouTube Data API |
| API Testing | Postman |
| Development Tools | Git, GitHub, VS Code |

## 📁 Project Structure

```text
AI-Fitness-Coach/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── providers/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Google Gemini API key
- YouTube Data API key
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-fitness-coach.git
cd ai-fitness-coach
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory using `server/.env.example` as a reference.

Configure the required environment variables:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model

YOUTUBE_API_KEY=your_youtube_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Add any additional variables required by the backend's `.env.example`.

Start the backend using the development script configured in `server/package.json`:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Configure frontend environment variables according to `client/.env.example`.

Start the frontend:

```bash
npm run dev
```

### 4. Open the Application

Open the local URL displayed by Vite in your browser.

The frontend and backend run on their respective configured ports.

## 🔑 Environment Variables & Security

This project uses environment variables for sensitive configuration, including:

- MongoDB connection string
- JWT secret
- Google Gemini API key
- YouTube API key
- Cloudinary credentials

**Never commit `.env` files, API keys, passwords, database credentials, or private tokens to GitHub.**

Use the provided `.env.example` files as configuration templates. Replace placeholder values with your own credentials.

## 🧪 Testing

The project includes test scripts covering areas such as:

- AI Coach functionality
- Community interactions
- Real-time messaging
- Online presence
- YouTube API integration

Run the appropriate test scripts from the server directory after configuring the required environment variables.

## 🔮 Future Improvements

- Personalized AI-generated workout programs
- Advanced fitness analytics and progress charts
- Enhanced nutrition and calorie tracking
- More detailed workout recommendations
- Improved real-time community features
- Production deployment and scalability improvements



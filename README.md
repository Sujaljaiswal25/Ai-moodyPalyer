# Moody Player 🎵😊

An intelligent music player that detects your mood through facial expressions and plays music to match your current emotional state. Built with React, Node.js, and powered by face-api.js for real-time emotion detection.

## ✨ Features

- **Real-time Mood Detection**: Uses your webcam to detect facial expressions and determine your current mood
- **Smart Music Recommendations**: Suggests songs based on your detected mood (happy, sad, neutral, etc.)
- **Modern UI/UX**: Sleek, responsive interface built with Tailwind CSS and Framer Motion
- **Song Management**: Upload and categorize songs by mood
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 19** - Frontend library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **face-api.js** - Real-time face detection and emotion recognition
- **Framer Motion** - Animation library for smooth UI transitions
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/moody-player.git
   cd moody-player
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will start on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
moody-player/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── service/        # Business logic
│   │   ├── app.js          # Express app configuration
│   │   └── db/             # Database connection
│   └── server.js           # Server entry point
│
└── frontend/               # Frontend React application
    ├── public/             # Static files
    │   └── models/         # face-api.js models
    └── src/
        ├── components/     # React components
        │   ├── FacialExpression.jsx  # Mood detection
        │   ├── MoodSongs.jsx         # Song display
        │   └── SongUploadForm.jsx    # Song upload form
        ├── App.jsx         # Main application component
        └── main.jsx        # Application entry point
```

## 🌟 How It Works

1. **Mood Detection**:
   - The application accesses your webcam using the browser's MediaDevices API
   - face-api.js processes the video feed to detect faces and analyze expressions
   - The detected emotion (happy, sad, angry, etc.) is used to determine your mood

2. **Music Selection**:
   - Based on your detected mood, the application fetches songs from the database
   - Songs are filtered and displayed according to the current mood

3. **Song Management**:
   - Upload new songs with metadata (title, artist, mood)
   - Songs are stored in the database with their associated mood

## 📝 API Endpoints

### Songs
- `POST /api/songs` - Upload a new song
  ```json
  // Request Body
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "mood": "happy"
  }
  // File: audio file
  ```

- `GET /api/songs?mood=:mood` - Get songs by mood
  ```json
  // Response
  {
    "message": "Songs fetched successfully",
    "songs": [
      {
        "_id": "...",
        "title": "Song Title",
        "artist": "Artist Name",
        "audio": "https://...",
        "mood": "happy"
      }
    ]
  }
  ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - For facial recognition capabilities
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - For smooth animations

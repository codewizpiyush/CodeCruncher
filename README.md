# 🚀 CodeCruncher - AI Powered Code Complexity Analyzer

CodeCruncher is a full-stack MERN application that helps developers analyze code quality, evaluate time and space complexity, visualize performance metrics, and receive AI-powered insights for code optimization.

The platform combines modern web technologies with AI to provide an interactive coding environment where users can write, analyze, and improve their code efficiently.

---

## 📌 Features

### 🔍 Code Complexity Analysis
- Analyze submitted code for Time Complexity.
- Analyze Space Complexity.
- Detect inefficient coding patterns.
- Generate optimization suggestions.

### 🤖 AI-Powered Insights
- AI-assisted code review.
- Complexity explanation in human-readable format.
- Optimization recommendations.
- Performance improvement suggestions.

### 📊 Visualization
- Interactive complexity graphs.
- Performance trend analysis.
- Visual representation of algorithm efficiency.

### 👤 User Management
- User Registration & Authentication.
- JWT-based secure login system.
- Protected routes.
- User-specific analysis history.

### 📝 Blog System
- Create technical blogs.
- Read and explore community blogs.
- Detailed blog pages.
- User-generated content management.

### 📚 Analysis History
- Store previous code analyses.
- Access past reports.
- Track improvement over time.

### 🎨 Modern UI
- Responsive design.
- Monaco Code Editor integration.
- User-friendly dashboard.
- Mobile-friendly experience.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Monaco Editor
- Chart.js
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

### AI Integration
- Google Gemini API

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📂 Project Structure

```bash
CodeCruncher/
│
├── client/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md


### GitHub Repository Description

> AI-Powered Code Complexity Analyzer built with MERN Stack, Gemini AI, Monaco Editor, and Chart.js. Analyze time & space complexity, receive optimization suggestions, visualize performance metrics, and improve code quality efficiently. 🚀

⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/your-username/CodeCruncher.git
cd CodeCruncher
2️⃣ Install Frontend Dependencies
cd client
npm install
3️⃣ Install Backend Dependencies
cd ../server
npm install
🔐 Environment Variables

Create a .env file inside the server directory:

PORT=5000
MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

Create a .env file inside the client directory:

VITE_API_URL=http://localhost:5000
▶️ Running the Project
Backend
cd server
npm start
Frontend
cd client
npm run dev

Frontend:

http://localhost:5173

Backend:

http://localhost:5000
📈 Future Enhancements
Multi-language code support
Real-time collaborative coding
Advanced AI code reviews
Algorithm benchmarking
Team workspaces
Export analysis reports (PDF)
👨‍💻 Contributors
Piyush Gupta

Project Lead & Full Stack Developer

Designed and developed the complete application architecture.
Developed the entire frontend application.
Developed the complete backend system.
Integrated authentication, APIs, and AI services.
Implemented code analysis features and business logic.
Managed project deployment and integration.
Kunal Dhote

Frontend & Database Developer

Contributed to frontend development.
Assisted in database design and implementation.
Supported MongoDB schema development and integration.
Anuj Singh Gurjar

Frontend UI Designer

Designed frontend user interfaces.
Improved user experience and visual consistency.
Contributed to application design enhancements.
🎯 Project Objective

The primary objective of CodeCruncher is to assist developers in understanding and improving the efficiency of their code through automated complexity analysis, AI-powered recommendations, and intuitive visualizations.

📜 License

This project is developed for educational, research, and learning purposes.

⭐ Support

If you find this project useful, consider giving it a star on GitHub and sharing feedback to help improve future versions.

Built with ❤️ using MERN Stack and AI
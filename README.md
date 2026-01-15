# Expense Tracker (MERN Stack)

A full-stack expense tracking application built using the MERN stack (MongoDB, Express, React, Node.js).
This app helps users manage their income and expenses, visualize financial data, and export reports in Excel format.

----------------------------------------------------------------

FEATURES

- User authentication using JWT
- Add, view, and delete income and expenses
- Dashboard with:
  - Total balance
  - Total income
  - Total expenses
- Interactive charts:
  - Bar Chart
  - Pie Chart
  - Line Chart
- Recent transactions overview
- Export income & expense data in Excel format
- Responsive UI (mobile, tablet, desktop)
- Clean and intuitive navigation

----------------------------------------------------------------

TECH STACK

Frontend:
- React
- Tailwind CSS
- Axios
- Chart.js / Recharts

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)

----------------------------------------------------------------

PROJECT STRUCTURE

expensetracker/
│
├── frontend/        # React app
├── backend/         # Express API
├── .gitignore
└── README.md

----------------------------------------------------------------

SETUP INSTRUCTIONS

1) Clone the Repository

git clone https://github.com/afshan0401/expense-tracker-mern.git  
cd expense-tracker-mern  

----------------------------------------------------------------

BACKEND SETUP

cd backend  
npm install  

Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5000  

Start the backend server:

npm run dev  

Server will run on:  
http://localhost:5000  

----------------------------------------------------------------

FRONTEND SETUP

Open a new terminal:

cd frontend  
npm install  
npm run dev  

Frontend will run on:  
http://localhost:5173  

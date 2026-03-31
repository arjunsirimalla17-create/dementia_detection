const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.0.112:5173'],
  credentials: true,
}));

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);

app.get('/', (req, res) => {
  res.send('Neuro Loop Insight API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: [
      'http://localhost:5173', 
      // 'http://localhost:8000'
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

module.exports = app;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Proxy endpoint for Perenual API
app.get('/api/plants', async (req, res) => {
  try {
    const response = await axios.get('https://perenual.com/api/species-list?key=YOUR_PERENUAL_API_KEY');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching plants' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
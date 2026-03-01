const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kulture';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const portfolioSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  link: String,
  technologies: [String],
  createdAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

app.get('/api/portfolio', async (req, res) => {
  try {
    const projects = await Portfolio.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    const newProject = new Portfolio(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const project = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

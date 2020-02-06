const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project)
    return res.status(400).json({ error: 'Project not found '});

  req.project = project;

  return next();
}

function requestLog(req, res, next) {
  console.count("Request triggered");

  return next();
}

server.use(requestLog);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  const project = req.project;
  project.title = title;
  
  return res.json(project);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const project = req.project;
  const projectIndex = projects.findIndex(p => p.id == project.id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { title } = req.body;
  const project = req.project;
  
  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
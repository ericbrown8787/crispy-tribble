#! /usr/bin/env node

import express from 'express';
import nunjucks from 'nunjucks';
import axios from 'axios';
import fs from 'fs';
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.set('view engine', 'nunjucks');

// Templating
const globalFields = {
  mainStyle: 'stylesheets/style.css',
};

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// ======Page Rendering======s
app.get('/', (req, res) => {
  res.render('index.njk', globalFields);
  return { request: req, response: res };
});

app.get('/info', (req, res) => {
  res.render('info.njk', globalFields);
  return { request: req, response: res };
});

app.use((req, res) => {
  const funMessages = ['It looks like you\'ve made a wrong turn.', 'Run.', 'This page doesn\'t exist. Does anything even exist?'];
  function randomMessage() {
    return funMessages[Math.floor(Math.random() * funMessages.length)];
  }
  const templateFields = {
    ...globalFields,
    notFoundMessage: randomMessage(),
  };
  res.status(404).render('404.njk', templateFields);
  return { request: req, response: res };
});

// ======Get my public github info======
app.get('/apitest', async (req, res) => {
  let data = {};

  try {
    const response = await axios.get('https://api.github.com/users/ericbrown8787');
    data = response.data;
  } catch (e) {
    data = { message: 'User not found' };
  } finally {
    data = {
      ...data,
      docs: 'https://docs.github.com/rest/reference/users#get-a-user',
    };
  }

  fs.writeFileSync('./local-logs/github.json', JSON.stringify(data));
  res.send(data);
  return { request: req, response: res };
});

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });

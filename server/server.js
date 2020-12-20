require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('The database has been connected...');
  })
  .catch((error) => console.log(error.message));

app.use(express.json());
app.use(cors());
app.use('/', authRoutes);
app.use('/', postRoutes);
app.use('/', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

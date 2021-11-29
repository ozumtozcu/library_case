const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const Joi = require('joi');
const mongoose = require('mongoose');
const Book = require('./models/books');
const User = require('./models/user');
const BorrowBook = require('./models/borrowBook');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbUrl =
  'mongodb://ozum:Asd.1234@mongo:27017/library?retryWrites=true&w=majority';
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log('connected'))
  .catch(err => console.log(err));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/users', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({ message: 'Bad request.' });
  }
  console.log(req.body);
  new User({
    name: req.body.name
  })
    .save()
    .then(result => {
      res.status(200).json({ message: 'Success' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/users', function(req, res) {
  User.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/users/:id', function(req, res) {
  User.findById(req.params.id)
    .then(result => {
      if (result == null) {
        res.status(404).json({ message: 'User not found.' });
      } else {
        res.send(result);
      }
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/books', function(req, res) {
  Book.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/books/:id', async function(req, res) {
  let score = 0;

  const borrow = await BorrowBook.find({ book: req.params.id })
    .then(result => {
      if (result.length != 0) {
        for (let i = 0; i < result.length; i++) {
          score += result[i].score;
        }
        score = score / result.length;
      }
    })
    .catch(err => {
      console.log(err);
    });
  const book = await Book.find({ bookId: req.params.id })
    .then(result => {
      console.log(result.length);
      if (result.length == 0) {
        getBook(req.params.id, res);
      } else {
        res.send({
          _id: result[0]._id,
          title: result[0].title,
          bookId: result[0].bookId,
          averageScore: score
        });
      }
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

  console.log(score);
});

app.post('/books', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    bookId: Joi.string()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({ message: 'Bad request.' });
  }
  console.log(req.body);
  new Book({
    title: req.body.name,
    bookId: req.body.bookId
  })
    .save()
    .then(result => {
      res.status(200).json({ message: 'Success' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/users/:userid/borrow/:bookid', async (req, res) => {
  const userResult = await User.findById(req.params.userid).catch(err => {
    console.log(err);
  });
  console.log(userResult);
  const bookResult = await Book.find({ bookId: req.params.bookid }).catch(err => {
    console.log(err);
  });
  const borrowResult = await BorrowBook.find({ book: req.params.bookid }).catch(err => {
    console.log(err);
  });

  for (let i = 0; i < borrowResult.length; i++) {
    console.log(borrowResult[i].score);
    if (borrowResult[i].score == undefined) {
      res.status(404).json({ message: 'Book is already borrowed.' });
    }
  }
  if (userResult == null) {
    res.status(404).json({ message: 'User not found.' });
  }
  if (bookResult.length == 0) {
    res.status(404).json({ message: 'Book not found.' });
  }
  new BorrowBook({
    book: req.params.bookid,
    user: req.params.userid
  })
    .save()
    .then(result => {
      res.status(200).json({ message: 'Success' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/users/:userid/return/:bookid', async (req, res) => {
  const schema = Joi.object({
    score: Joi.number().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({ message: 'Bad request.' });
  }
  const userResult = await User.findById(req.params.userid).catch(err => {
    console.log(err);
  });
  console.log(userResult);
  const bookResult = await Book.find({ bookId: req.params.bookid }).catch(err => {
    console.log(err);
  });
  console.log(bookResult);
  if (userResult == null) {
    res.status(404).json({ message: 'User not found.' });
  }
  if (bookResult.length == 0) {
    res.status(404).json({ message: 'Book not found.' });
  }
  await BorrowBook.updateOne(
    {
      book: req.params.bookid,
      user: req.params.userid,
      score: undefined
    },
    {
      score: req.body.score
    },
    { upsert: true }
  )
    .then(result => {
      res.status(200).json({ message: 'Success' });
    })
    .catch(err => {
      console.log(err);
    });
});
app.listen(3000, function() {
  console.log('Node server is running..');
});

function getBook(bookId, res) {
  request('https://www.googleapis.com/books/v1/volumes?q=' + bookId, function(
    error,
    response,
    body
  ) {
    const library = JSON.parse(body).items;
    if (library != null) {
      for (let i = 0; i < library.length; i++) {
        const book = library[i].volumeInfo;
        const title = book.title;
        console.log(title);
        new Book({
          title: title,
          bookId: library[i].id
        })
          .save()
          .then(result => {
            console.log(result);
            res.send(result);
          })

          .catch(err => {
            console.log(err);
          });
      }
    } else {
      res.status(404).json({ message: 'Book not found.' });
    }
  });
}

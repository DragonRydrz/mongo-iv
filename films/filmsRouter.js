const express = require('express');

const Film = require('./Film.js');

const router = express.Router();

// add endpoints here

router
  .route('/')
  .get((req, res) => {
    Film.find()
      .then(films => {
        res.json(films);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  })
  .post((req, res) => {
    const { body } = req;
    Film.create(body)
      .then(response => {
        res.json(response);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

router
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    Film.findById(id)
      .populate('homeworld')
      .then(film => {
        if (film === null) {
          res.status(404).json({ message: 'Film ID does not exist.' });
        } else {
          res.json(film);
        }
      })
      .catch(err => {
        if (err.name === 'CastError') {
          res.status(422).json({ errorMessage: 'Invalid ID submitted.' });
        } else {
          res.status(500).json(err);
        }
      });
  })
  .put((req, res) => {
    const { id } = req.params;
    const { body } = req;
    Film.findByIdAndUpdate(id, body)
      .then(response => {
        Film.findById(id)
          .then(updated => res.json(updated))
          .catch(err => {
            res.status(500).json(err);
          });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  })
  .delete((req, res) => {
    const { id } = req.params;
    Film.findByIdAndRemove(id)
      .then(deleted => res.json(deleted))
      .catch(err => res.status(500).json(error));
  });
  
module.exports = router;

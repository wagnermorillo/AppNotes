const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('./tracing');
const {trace} = require('@opentelemetry/api');

require('dotenv').config();

const Notes = require('./database');
const updateRouter = require('./update-router');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/updatepage', updateRouter);
app.use((req, res, next) => {
  console.log(req.method + ' : ' + req.url);
  next();
});


app.use(bodyParser.json());

app.use((req, res, next) => {
  // Iniciar un span para esta solicitud
  const tracer = trace.getTracer('express-app'); // El nombre 'express-app' puede ser cualquier string que identifique tu app/servicio
  const span = tracer.startSpan('middleware-span');

  // Capturar la información deseada
  span.setAttribute('http.user_agent', req.headers['user-agent']);
  span.setAttribute('http.client_ip', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  span.setAttribute('http.query_params', JSON.stringify(req.query));
  span.setAttribute('http.request_body', JSON.stringify(req.body));

  // Asegurarse de finalizar el span cuando termine la solicitud
  res.on('finish', () => {
    span.end();
  });

  next();
});

app.get('/', (req, res, next) => {
  res.redirect('/index');
});

app
    .route('/notes-add')
    .get((req, res, next) => {
      res.render('notes-add');
    })
    .post((req, res, next) => {
      console.log(req.body);
      const Note = new Notes({});

      Note.title = req.body.title;
      Note.description = req.body.description;
      // save notes first
      Note.save((err, product) => {
        if (err) console.log(err);
        console.log(product);
      });
      res.redirect('/index');
    });

app.get('/index', (req, res, next) => {
  Notes.find({}).exec((err, document) => {
    if (err) console.log(err);
    const Data = [];
    document.forEach((value) => {
      Data.push(value);
    });
    res.render('view', {data: Data});
  });
});

app.get('/delete/:__id', (req, res, next) => {
  Notes.findByIdAndRemove(
      req.params.__id,
      {useFindAndModify: false},
      (err, document) => {
        if (err) console.log(err);
        console.log(document);
      },
  );
  res.redirect('/index');
});

app.get('/updatepage/:__id', (req, res) => {
  console.log('id for get request: ' + req.id);
  Notes.findById(req.id, (err, document) => {
    console.log(document);

    res.render('updatepage', {data: document});
  });
});

app.post('/updatepage', (req, res, next) => {
  console.log('id: ' + req.id);
  Notes.findByIdAndUpdate(
      req.id,
      {title: req.body.title, description: req.body.description},
      {useFindAndModify: false},
      (err, document) => {
        console.log('updated');
      },
  );
  res.redirect('/index');
  return next();
});

// CRUD operations for Notes schema
// Create
app.post('/api/note', (req, res, next) => {
  const {title, description} = req.body;
  const note = new Notes({title, description});
  note.save((err, note) => {
    if (err) return next(err);
    res.status(201).json({note});
  });
});

// Read
// Read by id
app.get('/api/note/:id', (req, res, next) => {
  const {id} = req.params;
  Notes.findById(id, (err, note) => {
    if (err) return next(err);
    res.status(201).json(note);
  });
});
// Read all
app.get('/api/note', (req, res, next) => {
  Notes.find({}, (err, notes) => {
    if (err) return next(err);
    res.status(201).json(notes);
  });
});

// Update
app.put('/api/note/:id', (req, res, next) => {
  const {id} = req.params;
  const {title, description} = req.body;
  Notes.findByIdAndUpdate(
      id,
      {title, description},
      {new: true},
      (err, document) => {
        if (err) return next(err);
        res.status(200).json(req.body);
      },
  );
});
// Delete
app.delete('/api/note/:id', (req, res, next) => {
  const {id} = req.params;
  Notes.findByIdAndRemove(id, {useFindAndModify: false}, (err, document) => {
    if (err) return next(err);
    res
        .status(201)
        .json({deleted: true, document, message: 'Note deleted successfully'});
  });
});

module.exports = app;

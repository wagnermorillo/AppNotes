// Cargar los datos de prueba en la base de datos
require('dotenv').config(); // Carga las variables de entorno desde .env se puede quitar
const fs = require('fs');
const mongoose = require('mongoose');
const Note = require('./database.js'); // Asegúrate de importar tu modelo de not

// Ruta al archivo notes.json
const notesFilePath = './notes.json';


const {MONGO_DB_USR, MONGO_DB_PWD, MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_NAME} =
  process.env;
const credentials = MONGO_DB_USR ? `${MONGO_DB_USR}:${MONGO_DB_PWD}@` : '';
const mongoURI = `mongodb://${credentials}${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;


mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log('Conexión a MongoDB exitosa');

      // Lee los datos del archivo notes.json
      const notesData = JSON.parse(fs.readFileSync(notesFilePath, 'utf-8'));

      // Inserta los datos en la base de datos
      Note.insertMany(notesData)
          .then(() => {
            console.log('Datos de prueba insertados con éxito');
          })
          .catch((error) => {
            console.error('Error al insertar datos de prueba:', error);
          })
          .finally(() => {
            // Cierra la conexión a MongoDB cuando haya terminado
            mongoose.connection.close();
          });
    })
    .catch((error) => {
      console.error('Error de conexión a MongoDB:', error);
    });

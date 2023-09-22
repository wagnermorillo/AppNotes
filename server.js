require('dotenv').config(); // Carga las variables de entorno desde .env se puede quitar
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;
const {MONGO_DB_USR, MONGO_DB_PWD, MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_NAME, MONGOURL} = process.env;
let mongoURI;
if (MONGOURL) {
  // Si MONGOURL está definida, úsala como la cadena de conexión
  mongoURI = MONGOURL;
} else {
  // Si MONGOURL no está definida, construye la cadena de conexión utilizando las variables individuales
  const credentials = MONGO_DB_USR ? `${MONGO_DB_USR}:${MONGO_DB_PWD}@` : '';
  mongoURI = `mongodb://${credentials}${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;
}

console.error(mongoURI);
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      app.listen(port, (arg) => {
        console.log(`Server started @ ${port}.`);
      });
    })
    .catch((err) => {
      console.log(err);
    });



// Han de configurar este archivo para correr en modo cluster
// con 4 procesos o más.
require('dotenv').config(); // Carga las variables de entorno desde .env se puede quitar
const cluster = require('cluster');
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app'); // Reemplaza './app' con la ubicación real de tu aplicación

const numCPUs = require('os').cpus().length; // Obtiene el número de núcleos de CPU disponibles

if (cluster.isMaster) {
  // Si es el proceso maestro, crea trabajadores adicionales
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Trabajador ${worker.process.pid} ha finalizado`);
  });
} else {
  // Si es un trabajador, inicia tu aplicación aquí

  const {MONGO_DB_USR, MONGO_DB_PWD, MONGO_DB_HOST, MONGO_DB_PORT} =
  process.env;
  const credentials = MONGO_DB_USR ? `${MONGO_DB_USR}:${MONGO_DB_PWD}@` : '';
  const mongoURI = `mongodb://${credentials}${MONGO_DB_HOST}:${MONGO_DB_PORT}/Nota`;

  // Actualiza con tus propios datos de conexión
  mongoose
      .connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
      // Inicia tu servidor HTTP
        const server = http.createServer(app);

        server.listen(3001, () => {
          console.log(`Servidor en el proceso ${process.pid} escuchando en el puerto 3001`);
        });
      })
      .catch((error) => {
        console.error(`Error de conexión a MongoDB en el proceso ${process.pid}: ${error}`);
        process.exit(1); // Finaliza el proceso en caso de error de conexión a MongoDB
      });
}

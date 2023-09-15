# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY . .

# Instala las dependencias de tu aplicación
RUN npm install

# Expone el puerto en el que tu aplicación escuchará
EXPOSE 3000

# Comando para iniciar tu aplicación
CMD ["npm", "start"]

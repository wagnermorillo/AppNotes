# establecer la imagen base
FROM node:18-alpine

# Crear un directorio para la aplicación
WORKDIR /usr/src/app/app-notas

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de archivos de la aplicación
COPY . .

# Exponer el puerto que usa la aplicación (por defecto Express usa el 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
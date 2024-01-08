# AppNotes

_Proyecto maduro, que tiene como funcionalidades la crear notas con titulos y texto para dar una descripcion de esta nota, perfecta para anotar recordatorios, fechas importantes entre otras cosas._

## Prerrequisitos 

_Antes de comenzar, asegúrate de tener instalados el siguiente requisito:_

Para instalación de la dependencias se abstiene, con hincapié en el factor 2 de dependecies, se encuentran enumeradas en el archivo "package.json", añadir de que se trata de un proyecto en las tecnologías de node.js y express.js y por ende en el lenguaje de programación javascript.

## env(config)
las variables de entorno necesarias para que funcione el programa son:

* MONGO_DB_USR
* MONGO_DB_PWD
* MONGO_DB_HOST
* MONGO_DB_PORT

Nota: este esta diseñado para usar el MongoDB Atlas en tal caso. Las cuales se encuentran en el archivo ".env" después de intalar las depencias necesarias.

## Servicios de apoyos
MongoDB es tomado como un servicio de apoyo, tomando en cuenta que este es como un recurso de se utiliza dentro del proyecto y pueda ser sustituido con facilidad.

## port
la aplicación esta expuesta por el puerto 3000

## Preview 
![Ejemplo de aplicación en uso](https://github.com/wagnermorillo/CI-CD/blob/main/ejemplo-funcional.gif)

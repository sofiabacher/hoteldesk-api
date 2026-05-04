# 🏨 HotelDesk - Sistema de Gestión Hotelera

HotelDesk es un sistema de gestión hotelera diseñado para la administración de usuarios, reservas y operaciones internas.

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MySQL
- API REST
- Arquitectura MVC
- React

## 📂 Funcionalidades principales

- Gestión de usuarios
- Gestión de reservas
- Operaciones CRUD
- Autenticación y control de acceso mediante JWT
- Interfaz de usuario para la gestión del sistema

## 🧠 Descripción técnica

El proyecto está desarrollado como una API REST, aplicando el patrón de arquitectura MVC para organizar la lógica del sistema.  
Se implementan operaciones CRUD para la gestión de datos y autenticación mediante JWT para el control de accesos.

## 🔐 Variables de entorno

Para ejecutar el proyecto es necesario crear un archivo `.env` en la raíz del backend con las siguientes variables:

  NODE_ENV=development
  PORT=3000
  
  DB_NAME=hoteldesk
  DB_USER=root
  DB_PASSWORD=
  DB_HOST=localhost
  DB_DIALECT=mysql
  DB_FORCE_SYNC=false
  
  BCRYPT_SALT_ROUNDS=10
  JWT_SECRET=tu_clave_secreta
  JWT_ACTIVATION_SECRET=activacionToken
  JWT_EXPIRES_IN=24h
  JWT_EMAIL_EXPIRES_IN=1h
  
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=tu_email@gmail.com
  EMAIL_PASS=tu_app_password
  EMAIL_FROM="HotelDesk <no-reply@hoteldesk.com>"  
  FRONTEND_URL=http://localhost:5173


Asegurate de configurar estos valores según tu entorno local.

## ▶️ Cómo ejecutar el proyecto

### Backend

1. Clonar el repositorio  
2. Instalar dependencias: npm install
3. Crear el archivo `.env` con las variables indicadas  
4. Ejecutar el servidor: npm start
   
### Frontend

1. Ir a la carpeta del frontend  
2. Instalar dependencias: npm install
3. Ejecutar la aplicación: npm run dev

## ⚠️ Estado del proyecto

Proyecto académico en desarrollo con fines de aprendizaje.

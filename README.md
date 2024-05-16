# Puppeteer Intro

Este proyecto utiliza Puppeteer para capturar y guardar elementos de una página web de seguimiento de contenedores. Además, utiliza Express para crear un servidor que maneja las solicitudes para capturar datos.

## Requisitos

- Node.js (versión 14 o superior)
- npm (gestor de paquetes de Node.js)

## Instalación

1. Clona este repositorio:

    ```sh
    git clone https://github.com/LeonardoHuelvas/App-tracker.git
    cd App-tracker
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

## Scripts

- `start`: Inicia el servidor.
- `dev`: Inicia el servidor con nodemon para recarga automática.

## Uso

1. Ejecuta el proyecto:

    ```sh
    npm start
    ```

2. Abre tu navegador y ve a `http://localhost:3000/getDataZIM?number=YOUR_NUMBER&type=YOUR_TYPE&sealine=YOUR_SEALINE` reemplazando `YOUR_NUMBER`, `YOUR_TYPE`, y `YOUR_SEALINE` con los valores correspondientes.

El servidor capturará y devolverá los datos de la página web de seguimiento de contenedores.

## Estructura del Proyecto

- `server.js`: Archivo principal que configura el servidor y maneja la lógica de captura de datos con Puppeteer.
- `lambda.js`: Contiene la función para capturar los datos de la página web utilizando Puppeteer.
- `netlify/functions/`: Directorio donde se colocan las funciones para Netlify.

## Dependencias

- `express`: Framework para crear el servidor.
- `express-validator`: Biblioteca para validar y sanitizar entradas.
- `helmet`: Middleware de seguridad para Express.
- `puppeteer`: Biblioteca para controlar el navegador Chromium.
- `puppeteer-core`: Versión ligera de Puppeteer para entornos serverless.
- `chrome-aws-lambda`: Biblioteca para usar Chromium en entornos serverless.

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama con tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube los cambios a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Crea un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Autor: Anner Arias 
Email: annerag@gmail.com

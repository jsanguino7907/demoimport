# Puppeteer Intro

Este proyecto utiliza Puppeteer para capturar y guardar elementos de una página web de seguimiento de contenedores. Además, utiliza Express para crear un servidor que maneja las solicitudes para capturar datos.

## Requisitos

- Node.js (versión 12 o superior)
- npm (gestor de paquetes de Node.js)

## Instalación

1. Clona este repositorio:

    ```sh
    git remote add origin https://github.com/LeonardoHuelvas/App-tracker.git
    cd puppeteer-intro
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

## Scripts

- `start`: Inicia el servidor.
- `dev`: Inicia el servidor con nodemon para recarga automática.

## Uso

1. Asegúrate de que el directorio `data` exista en el raíz del proyecto.
2. Ejecuta el proyecto:

    ```sh
    npm start
    ```

3. Abre tu navegador y ve a `http://localhost:3000/getDataZIM?number=YOUR_NUMBER&type=YOUR_TYPE&sealine=YOUR_SEALINE` reemplazando `YOUR_NUMBER`, `YOUR_TYPE`, y `YOUR_SEALINE` con los valores correspondientes.

El servidor capturará y guardará los datos de la página web de seguimiento de contenedores.

## Estructura del Proyecto

- `index.js`: Archivo principal que configura el servidor y maneja la lógica de captura de datos con Puppeteer.
- `data/`: Directorio donde se guardan las capturas de pantalla y archivos HTML.

## Dependencias

- `express`: Framework para crear el servidor.
- `html-pdf`: Biblioteca para convertir HTML a PDF.
- `puppeteer`: Biblioteca para controlar el navegador Chromium.

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

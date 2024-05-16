import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express();

// Habilitar CORS
app.use(cors());

const router = express.Router();

async function getDataZIM(number, type, sealine) {
    const url = `${process.env.SCRAPE_FUNCTION_URL}?number=${number}&type=${type}&sealine=${sealine}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error occurred while getting data from ZIM:", error);
        throw error;
    }
}

// Definir la ruta usando el router
router.get('/getDataZIM', async(req, res) => {
    const { number, type, sealine } = req.query;

    if (!number || !type || !sealine) {
        return res.status(400).send('Faltan parámetros de consulta requeridos: number, type, sealine');
    }

    try {
        const htmls = await getDataZIM(number, type, sealine);
        res.json(htmls);
    } catch (error) {
        console.error('Error en la ruta /getDataZIM:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Usar el router en la aplicación
app.use('/.netlify/functions/server', router);

// Exportar el manejador de serverless
export const handler = serverless(app);

// Iniciar el servidor localmente si no está en producción
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.use('/', router); // Configurar el router para que funcione localmente
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}
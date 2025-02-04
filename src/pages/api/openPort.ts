import { detectarTrama } from "@/app/cti-lib/tramaDeteccion";
import { NextApiRequest, NextApiResponse } from "next";
import { SerialPort } from "serialport";

const openPorts: { [key: string]: SerialPort } = {}; // Almacena los puertos abiertos

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { path } = req.query;

    if (!path || typeof path !== "string") {
      return res.status(400).json({ error: 'El parámetro "path" es obligatorio' });
    }

    try {

    // Construir la URL absoluta
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const host = req.headers.host;
      const absoluteUrl = `${protocol}://${host}/api/openPort?path=${encodeURIComponent(path)}`;
      console.log(`URL absoluta del WebSocket/SSE: ${absoluteUrl}`);

      // Configurar SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();


      // const simulatedData = `Simulated data at ${new Date().toISOString()}`;
      // console.log(`Enviando datos simulados: ${simulatedData}`);
      // res.write(`data: ${JSON.stringify({ data: simulatedData })}\n\n`); // Enviar datos simulados al cliente

      // // // **Agregar un intervalo para datos simulados**
      // setInterval(() => {
      //   const simulatedData = `Simulated data at ${new Date().toISOString()}`;
      //   console.log(`Enviando datos simulados: ${simulatedData}`);
      //   res.write(`data: ${JSON.stringify({ data: simulatedData })}\n\n`); // Enviar datos simulados al cliente
      // }, 3000);

      // // Verificar si el puerto ya está abierto
      if (openPorts[path]) {
        res.write(`data: {"message": "El puerto ya está abierto"}\n\n`);
        console.log(`El puerto ${path} ya está abierto.`);
        return;
      }

      console.log("Path open port: ", path);
      // Abrir el puerto serie
      const port = new SerialPort({
        path,
        baudRate: 921600, // Ajusta según tu dispositivo
        autoOpen: true,
      });

      openPorts[path] = port;

      console.log(`Puerto ${path} abierto y escuchando...`);

      // Leer datos del puerto serie
      // port.on("data", (data) => {
      //   const message = data.toString().trim();
      //   console.log(`Datos recibidos del puerto ${path}: ${message}`);
      //   res.write(`data: ${JSON.stringify({ data: message })}\n\n`);
      //   console.log(`Datos enviados al cliente: ${message}`);
      //   //
      // });

      port.on('readable', function () {
        // Declaras data como Buffer | null
        const data: Buffer | null = port.read();
        
        if (data !== null) {
          // Aquí ya estamos seguros de que data es un Buffer
          //res.write(`data: ${JSON.stringify({ data: data.toString('ascii') })}\n\n`);
          detectarTrama(data);

          //console.log('Data (ASCII):', data.toString('ascii'));
        }
      });


      // Manejar errores del puerto serie
      port.on("error", (err) => {
        console.error(`Error en el puerto ${path}:`, err.message);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      });

      // Cerrar la conexión si el cliente desconecta
      req.on("close", () => {
        console.log(`Conexión cerrada para el puerto ${path}`);
        //port.close();
        delete openPorts[path];
        res.end();
      });
    } catch (error) {
      console.error(`Error al abrir el puerto ${path}:`, error);
      res.status(500).json({ error: "No se pudo abrir el puerto." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }
}

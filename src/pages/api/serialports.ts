// Directorio: ./src/pages/api/serialports.ts

import { NextApiRequest, NextApiResponse } from 'next';
const { SerialPort } = require('serialport');

// Define la interfaz de los puertos
interface PortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  vendorId?: string;
  productId?: string;
}

// API Route para listar los puertos serie
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ports: PortInfo[] = await SerialPort.list();
    res.status(200).json(ports);
  } catch (error) {
    console.error('Error al listar los puertos serie.');
    res.status(500).json({ error: 'Error al listar los puertos serie' });
  }
}
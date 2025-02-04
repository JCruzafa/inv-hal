// Directorio: ./src/pages/api/serialports.ts

import { NextApiRequest, NextApiResponse } from 'next';
//const { SerialPort } = require('serialport');
import { SerialPort } from 'serialport';
import { detectarTrama } from '../../app/cti-lib/tramaDeteccion';

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



// // Función para listar puertos serie
// async function listSerialPorts() {
//   try {
//     const ports_console: PortInfo[] = await SerialPort.list(); // Tipar los puertos como un array de `PortInfo`
//     if (ports_console.length === 0) {
//       console.log('No se encontraron puertos serie.');
//     } else {
//       console.log('Puertos serie disponibles:');
//       ports_console.forEach((ports_console) => {
//         console.log(`- Path: ${ports_console.path}`);
//         if (ports_console.manufacturer) console.log(`  Manufacturer: ${ports_console.manufacturer}`);
//         if (ports_console.serialNumber) console.log(`  Serial Number: ${ports_console.serialNumber}`);
//         if (ports_console.vendorId) console.log(`  Vendor ID: ${ports_console.vendorId}`);
//         if (ports_console.productId) console.log(`  Product ID: ${ports_console.productId}`);
//       });
//     }
//   } catch (error) {
//     console.error('Error al listar los puertos serie.', error);
//   }
// }

// // Llamar a la función para listar los puertos
// listSerialPorts();

// // const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });
// const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 921600 });

// port.open(function (err:any) {
//     console.log('Error open: ')
//     if (err) {
//       return console.log('Error opening port: ', err.message)
//     }
  
//     // Because there's no callback to write, write errors will be emitted on the port:
//     // port.write('main screen turn on')
// })
  

// port.on('readable', function () {
//   // Declaras data como Buffer | null
//   const data: Buffer | null = port.read();
  
//   if (data !== null) {
//     // Aquí ya estamos seguros de que data es un Buffer
//     detectarTrama(data);
//     console.log('Data (ASCII):', data.toString('ascii'));
//   }
// })
const { SerialPort } = require('serialport');
//commit action
// Definimos la interfaz para los puertos aaaa
interface PortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  vendorId?: string;
  productId?: string;
}

// Función para listar puertos serie
async function listSerialPorts() {
  try {
    const ports: PortInfo[] = await SerialPort.list(); // Tipar los puertos como un array de `PortInfo`
    if (ports.length === 0) {
      console.log('No se encontraron puertos serie.');
    } else {
      console.log('Puertos serie disponibles:');
      ports.forEach((port) => {
        console.log(`- Path: ${port.path}`);
        if (port.manufacturer) console.log(`  Manufacturer: ${port.manufacturer}`);
        if (port.serialNumber) console.log(`  Serial Number: ${port.serialNumber}`);
        if (port.vendorId) console.log(`  Vendor ID: ${port.vendorId}`);
        if (port.productId) console.log(`  Product ID: ${port.productId}`);
      });
    }
  } catch (error) {
    console.error('Error al listar los puertos serie.', error);
  }
}

// Llamar a la función para listar los puertos
listSerialPorts();



const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

port.open(function (err:any) {
    console.log('Error open: ')
    if (err) {
      return console.log('Error opening port: ', err.message)
    }
  
    // Because there's no callback to write, write errors will be emitted on the port:
    // port.write('main screen turn on')
})
  

port.on('readable', function () {
  // Declaras data como Buffer | null
  const data: Buffer | null = port.read();
  
  if (data !== null) {
    // Aquí ya estamos seguros de que data es un Buffer
    console.log('Data (ASCII):', data.toString('ascii'));
  }
})
//import { procesarTrama } from './tramaProcesamiento';

import { calculateCRC16 } from "./calculateCRC";

const INICIO_TRAMA = Buffer.from([0xCC, 0xAA, 0xAA, 0xAA]);
const FINAL_TRAMA = Buffer.from([0xCC, 0xBB, 0xBB, 0xBB]);
const LONGITUD_CABECERA = 10; // Cabecera fija hasta Tamaño trama datos
const LONGITUD_CRC = 2; // CRC ocupa 2 bytes
 
/**
 * Detecta si una trama recibida cumple con la estructura válida.
 * Si es válida, la exporta para su procesamiento.
 * @param trama Buffer que contiene la trama completa.
 */

export function detectarTrama(trama: Buffer) {
  // Validar longitud mínima de la trama
  const longitudMinima = INICIO_TRAMA.length + LONGITUD_CABECERA + LONGITUD_CRC + FINAL_TRAMA.length;
  if (trama.length < longitudMinima) {
    //throw new Error('Trama demasiado corta');
    console.log('Trama demasiado corta');
    return;
  }

  // Validar inicio de trama
  if (!trama.subarray(0, INICIO_TRAMA.length).equals(INICIO_TRAMA)) {
    //throw new Error('Inicio de trama no válido');
    console.log('Inicio de trama no válido');
    return;
  }

  // Validar final de trama
  if (!trama.subarray(trama.length - FINAL_TRAMA.length).equals(FINAL_TRAMA)) {
    //throw new Error('Final de trama no válido');
    console.log('Final de trama no válido');
    return;
  }

  // Extraer y validar CRC
  const crcRecibido = trama.readUInt16LE(trama.length - FINAL_TRAMA.length - LONGITUD_CRC);
  const crcCalculado = calculateCRC16(trama.subarray(0, trama.length - LONGITUD_CRC - FINAL_TRAMA.length));
  if (crcCalculado !== crcRecibido) {
    //throw new Error('CRC no válido');
    console.log('CRC calculador', crcCalculado);
    console.log('CRC recibido', crcRecibido);
    console.log('CRC no válido');
    return;
  }

  console.log('Trama detectada');

  // Si la trama es válida, enviarla al procesamiento
  //procesarTrama(trama);
}


// const data = Buffer.from([0x01, 0x02, 0x03, 0x04]); // Datos de ejemplo
// detectarTrama(data);


// module.exports = {
//   detectarTrama
// };

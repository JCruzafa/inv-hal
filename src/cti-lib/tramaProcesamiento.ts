const INICIO_TRAMA = Buffer.from([0xCC, 0xAA, 0xAA, 0xAA]);
const LONGITUD_CABECERA = 13; // Cabecera fija hasta Tamaño trama datos

export interface TramaDecodificada {
  versionProtocolo: number;
  reserva: number;
  nodoOrigen: number;
  nodoDestino: number;
  tipoTrama: number;
  tipoMensaje: number;
  tamanoDatos: number;
  datos: Buffer;
}

/**
 * Procesa una trama previamente validada y decodifica sus campos.
 * @param trama Buffer que contiene la trama válida.
 * @returns Objeto con los datos decodificados.
 */
export function procesarTrama(trama: Buffer): TramaDecodificada {
  // Extraer y decodificar los campos de la cabecera
  const cabecera = trama.subarray(INICIO_TRAMA.length, INICIO_TRAMA.length + LONGITUD_CABECERA);
  const versionProtocolo = cabecera.readUInt8(0);
  const reserva = cabecera.readUInt8(1);
  const nodoOrigen = cabecera.readUInt16LE(2);
  const nodoDestino = cabecera.readUInt16LE(4);
  const tipoTrama = cabecera.readUInt8(6);
  const tipoMensaje = cabecera.readUInt8(7);
  const tamanoDatos = cabecera.readUInt16LE(8);

  // Extraer datos
  const datosInicio = INICIO_TRAMA.length + LONGITUD_CABECERA;
  const datos = trama.subarray(datosInicio, datosInicio + tamanoDatos);

  return {
    versionProtocolo,
    reserva,
    nodoOrigen,
    nodoDestino,
    tipoTrama,
    tipoMensaje,
    tamanoDatos,
    datos,
  };
}

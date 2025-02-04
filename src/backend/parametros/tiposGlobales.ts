
//Tipos de datos
export enum TP  {
     INTEGER,
     REAL,
     STRING,
     BOOLEAN,
     DATE,
     TIME,     
     DATETIME,
     LIST,     
} 

//Así funciona internamente el enum:
// export const INTEGER=0;
// export const REAL=1;
// export const STRING=2;
// export const BOOLEAN=3;
// export const DATE=4;
// export const TIME=5;
// export const DATETIME=6;
// export const LIST=7;

//Tipos de parámetros
export interface IParam {
     id:bigint, //bigint = long, double, int...
     tipo:TP, //Este es nuestro tipo creado
     min:number,
     max:number,
     valor:number,
     reset:number,
     tipoImportacion:number,
     nombre:string
}

//Estas dos interfaces no son valor:number ni tienen max y min, el resto de info es igual
export interface BParam {
     id:bigint,
     tipo:TP,
     valor:boolean,
     reset:number,
     tipoImportacion:number,
     nombre:string
}

export interface SParam {
     id:bigint,
     tipo:TP,
     valor:string,
     reset:number,
     tipoImportacion:number,
     nombre:string
}

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
   
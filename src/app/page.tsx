// "use client";
// import { useEffect, useState } from 'react';

// interface PortInfo {
//   path: string;
//   manufacturer?: string;
//   serialNumber?: string;
//   vendorId?: string;
//   productId?: string;
// }

// export default function Home() {


//   //! useState y useEffect son los hooks que más se usan, hay que poner "use client" para usar cualquier hook, cosas de frontend:
//   const [ports, setPorts] = useState<PortInfo[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchPorts() {
//       try {
//         const response = await fetch('/api/serialports');
//         if (!response.ok) {
//           throw new Error('Error al obtener los puertos serie');
//         }
//         const data: PortInfo[] = await response.json();
//         setPorts(data);
//       } catch (err) {
//         setError("Error con el FETCH");
//       }
//     }

//     fetchPorts();
//   }, []);



//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <h1 className="text-5xl font-bold">Puertos Serie</h1>
//         {error && <p className="text-red-500">Error: {error}</p>}
//         <ul>
//           {ports.length > 0 ? (ports.map((port, index) => (<li key={index}><strong>Path:</strong> {port.path}
//                 {port.manufacturer && <p><strong>Manufacturer:</strong> {port.manufacturer}</p>}
//                 {port.serialNumber && <p><strong>Serial Number:</strong> {port.serialNumber}</p>}
//                 {port.vendorId && <p><strong>Vendor ID:</strong> {port.vendorId}</p>}
//                 {port.productId && <p><strong>Product ID:</strong> {port.productId}</p>}
//               </li>))) : (<p>No se encontraron puertos serie.</p>)}
//         </ul>
//       </main>
//     </div>
//   );
// }
//
"use client";
import { useEffect, useState } from "react";

interface PortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  vendorId?: string;
  productId?: string;
}

export default function Home() {
  console.log("Renderizando componente Home");
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [listeningPort, setListeningPort] = useState<string | null>(null);
  const [consoleData, setConsoleData] = useState<string[]>([]);



  const fetchPorts = async () => {
    try {
      const response = await fetch("/api/serialports");
      if (!response.ok) {
        //throw new Error("Error al obtener los puertos serie");
      }
      const data: PortInfo[] = await response.json();
      console.log("Puertos obtenidos:", data); // Confirmar que los puertos se obtienen
      setPorts(data);
    } catch (err) {
      setError("Error al obtener los puertos serie.");
      console.error("Error en fetchPorts:", err);
    }
  };


  const openPortAndListen = (path: string) => {
    
    
    console.log("Abriendo conexión SSE para el puerto:", path);
    setListeningPort(path);
    setConsoleData([]); // Limpia la consola al abrir un nuevo puerto

    const connectionUrl = `/api/openPort?path=${path}`;
    console.log("Conexión SSE URL:", connectionUrl);
    const eventSource = new EventSource(connectionUrl);

    eventSource.onopen = () => {
      console.log(`Conexión SSE establecida con el puerto ${path}`);
    };

    // setInterval(() => {
    //   console.log(`intervalo `);
    //   eventSource.onmessage = (event) => {
    //     console.log("Evento SSE recibido:", event);
    //     try {
    //       const message = JSON.parse(event.data);
    //       if (message.data) {
    //         setConsoleData((prev) => [...prev, message.data]); // Agregar datos a la consola
    //       }
    //       if (message.error) {
    //         setError(message.error);
    //       }
    //     } catch (err) {
    //       console.error("Error procesando el mensaje SSE:", err);
    //     }
    //   };
      
    // }, 3000);
    eventSource.onmessage = (event) => {
      console.log("Evento SSE recibido:", event);
      try {
        const message = JSON.parse(event.data);
        if (message.data) {
          setConsoleData((prev) => [...prev, message.data]); // Agregar datos a la consola
        }
        if (message.error) {
          setError(message.error);
        }
      } catch (err) {
        console.error("Error procesando el mensaje SSE:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Error en la conexión SSE:", err);
      setError("Error en la conexión SSE");
      eventSource.close();
    };
  
  };

  return (
    <div className="min-h-screen p-8">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Puertos Serie</h1>
        {error && <p className="text-red-500">Error: {error}</p>}
        <button
          onClick={fetchPorts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Leer Puertos Serie
        </button>
        <ul>
          {ports.length > 0 ? (
            ports.map((port, index) => (
              <li key={index} className="border p-4 rounded mb-4">
                <p><strong>Path:</strong> {port.path}</p>
                {port.manufacturer && <p><strong>Fabricante:</strong> {port.manufacturer}</p>}
                <button
                  onClick={() => {
                    console.log("Se hizo clic en el botón para el puerto:", port.path);
                    openPortAndListen(port.path);
                  }}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={listeningPort === port.path}
                >
                  {listeningPort === port.path ? "Escuchando..." : "Abrir y Escuchar"}
                </button>
              </li>
            ))
          ) : (
            <p>No se encontraron puertos serie.</p>
          )}
        </ul>

        {/* Consola con scroll */}
        <div className="w-full max-w-3xl h-64 border bg-black text-white p-4 overflow-y-scroll">
          <h2 className="text-xl font-bold">Consola</h2>
          {consoleData.length > 0 ? (
            consoleData.map((line, index) => (
              <p key={index} className="text-sm">{line}</p>
            ))
          ) : (
            <p className="text-gray-500">No hay datos en la consola.</p>
          )}
        </div>
      </main>
    </div>
  );
}

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
import { useEffect, useState } from 'react';

interface PortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  vendorId?: string;
  productId?: string;
}

export default function Home() {
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPorts = async () => {
    try {
      const response = await fetch('/api/serialports');
      if (!response.ok) {
        throw new Error('Error al obtener los puertos serie');
      }
      const data: PortInfo[] = await response.json();
      setPorts(data);
    } catch (err) {
      setError('Error al obtener los puertos serie.');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-bold">Puertos Serie</h1>
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
              <li key={index}>
                <strong>Path:</strong> {port.path}
                {port.manufacturer && <p><strong>Manufacturer:</strong> {port.manufacturer}</p>}
                {port.serialNumber && <p><strong>Serial Number:</strong> {port.serialNumber}</p>}
                {port.vendorId && <p><strong>Vendor ID:</strong> {port.vendorId}</p>}
                {port.productId && <p><strong>Product ID:</strong> {port.productId}</p>}
              </li>
            ))
          ) : (
            <p>No se encontraron puertos serie.</p>
          )}
        </ul>
      </main>
    </div>
  );
}

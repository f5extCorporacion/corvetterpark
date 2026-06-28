// lib/generar-ticket.ts

export interface Ticket {
  barrascode: string;
  code: string;
  horaentrada: string;
  horasalida: string;
  type: string;
  fecha: string;
  estado: string;
  vehiculo?: string;
  placa?: string;
  espacio?: string;
  valor?: number;
}

export function generarTicket(): Ticket {
  const ahora = new Date();

  const horaentrada = ahora.toLocaleTimeString("es-CO", {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const fechaFormateada = ahora.toLocaleDateString("es-CO", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const generarUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  return {
    barrascode: Array.from({ length: 13 }, () =>
      Math.floor(Math.random() * 10)
    ).join(""),
    code: generarUUID().substring(0, 8).toUpperCase(),
    horaentrada,
    horasalida: "",
    type: "VEHÍCULO",
    fecha: fechaFormateada,
    estado: "active",
    vehiculo: "AUTOMÓVIL",
    placa: ``,
    espacio: `P-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
    valor: 0
  };
}
/*
--------------------------------
/*PLACA: ${ticket.placa}
VEHÍCULO: ${ticket.vehiculo}
TIPO: ${ticket.type}
ESPACIO: ${ticket.espacio} */
export function ticketParaImpresion(ticket: Ticket): string {
  return `
================================
    PARKING EXPRESS
    ${ticket.fecha}
--------------------------------
    TICKET DE INGRESO
    #${ticket.code}
--------------------------------
HORA INGRESO: ${ticket.horaentrada}
FECHA: ${ticket.fecha}
--------------------------------
${'*'.repeat(32)}
    CÓDIGO DE BARRAS
${ticket.barrascode}
${'*'.repeat(32)}
--------------------------------
ESTADO: ${ticket.estado === 'active' ? 'ACTIVO' : 'FINALIZADO'}
--------------------------------
    ¡GRACIAS POR SU VISITA!
================================
  `;
}
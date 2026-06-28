// app/generar/page.tsx
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { generarTicket } from '@/app/lib/generar-ticket';
import type { Ticket } from '@/app/lib/generar-ticket';
import MagicRings from "@/app/component/MagicRings";
const Barcode = lazy(() => import('react-barcode'));

export default function GenerarPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    setTicket(generarTicket());
  }, []);

  const generarNuevoTicket = () => {
    setTicket(generarTicket());
    setIsModalOpen(true);
  };

  const imprimirTicket = () => {
    setIsPrinting(true);
    
    setTimeout(() => {
      const printContent = document.getElementById('ticket-print');
      const originalContent = document.body.innerHTML;
      
      if (printContent) {
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      }
      setIsPrinting(false);
      setIsModalOpen(false);
    }, 300);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  // Mostrar loading hasta que esté en el cliente
  if (!ticket) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600">Generando ticket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center relative overflow-hidden">
      {/* MagicRings como fondo */}
      <div className="absolute inset-0 z-0">
        <MagicRings
          color="#FF3E00"
          colorTwo="#e43e14"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={10}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>
      
      {/* Contenido principal - encima del MagicRings */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <div className="text-center">
          {/* Logo o icono */}
          <div className="mb-8">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-[#FF3E00] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                      Corvette
                    </span>
                    <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
                      Park
                    </span>
                  </h1><p className="text-base-content/70 mt-2">Sistema de Parqueadero</p>
          </div>

          {/* Botón principal */}
          <button 
            onClick={generarNuevoTicket}
            className="bg-gradient-to-r from-[#FF3E00] btn-lg px-12 py-6 text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            🎫 Generar Ticket
          </button>

          <p className="text-sm text-base-content/50 mt-6">
            Haz clic para generar un nuevo ticket de parqueadero
          </p>
        </div>
      </div>

      {/* Modal con DaisyUI */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md p-0 overflow-hidden bg-base-100 relative z-20">
          {/* Header del Modal */}
          <div className="bg-gradient-to-r from-[#FF3E00] p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">🎫 Ticket Generado</h3>
            <button 
              onClick={cerrarModal}
              className="btn btn-ghost btn-sm btn-square text-primary-content hover:bg-primary-focus"
            >
              ✕
            </button>
          </div>

          {/* Contenido del Ticket */}
          <div id="ticket-print" className="p-6 bg-gradient-to-r from-[#FF3E00]">
            <div className="text-center border-b-2 border-dashed border-base-300 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-white">PARKING EXPRESS</h2>
              <p className="text-1xl text-base-content/50">{ticket.fecha}</p>
            </div>

            <div className="text-center mb-4">
              <div className="text-xs text-base-content/50">TICKET #</div>
              <div className="text-2xl font-bold text-white tracking-wider">
                {ticket.code}
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between border-b border-base-200 py-2">
                <span className="text-base-content/70">📍 Espacio</span>
                <span className="font-bold text-white">{ticket.espacio}</span>
              </div>
              <div className="flex justify-between border-b border-base-200 py-2">
                <span className="text-base-content/70">⏰ Ingreso</span>
                <span className="font-bold text-white">{ticket.horaentrada}</span>
              </div>
            </div>

            <div className="bg-base-200 rounded-lg p-4 my-4 text-center border-2 border-base-300">
              <div className="text-xs text-base-content/50 mb-2">📊 CÓDIGO DE BARRAS</div>
              <div className="flex justify-center">
                <Suspense fallback={
                  <div className="h-[60px] w-[200px] bg-base-300 animate-pulse rounded"></div>
                }>
                  <Barcode 
                    value={ticket.barrascode}
                    format="CODE128"
                    width={2}
                    height={60}
                    displayValue={true}
                    fontSize={14}
                    margin={5}
                    background="#f3f4f6"
                    lineColor="#1f2937"
                    className="bg-gradient-to-r from-[#FF3E00]"
                  />
                </Suspense>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className={`badge ${ticket.estado === 'active' ? 'badge-success' : 'badge-error'} badge-lg w-full py-3 text-sm`}>
                {ticket.estado === 'active' ? '✅ TICKET ACTIVO' : '❌ TICKET FINALIZADO'}
              </div>
            </div>

            <div className="border-t-2 border-dashed border-base-300 pt-4 text-center">
              <p className="text-xs text-base-content/50">
                {ticket.fecha} - {ticket.horaentrada}
              </p>
              <p className="text-sm font-bold text-primary mt-2">
                ¡Gracias por su visita!
              </p>
            </div>
          </div>

          {/* Footer del Modal - Botones de acción */}
          <div className="modal-action p-4 pt-0 gap-2 bg-gradient-to-r ">
            <button 
              onClick={cerrarModal}
              className="btn btn-ghost flex-1"
            >
              Cerrar
            </button>
            <button 
              onClick={imprimirTicket}
              disabled={isPrinting}
              className="btn flex-1"
              style={{ backgroundColor: '#FF3E00', borderColor: '#FF3E00', color: 'white' }}
            >
              {isPrinting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Imprimiendo...
                </>
              ) : (
                <>
                  🖨️ Imprimir
                </>
              )}
            </button>
          </div>
        </div>

        {/* Fondo del modal */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={cerrarModal}>close</button>
        </form>
      </dialog>
    </div>
  );
}
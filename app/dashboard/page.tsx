"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { securityPages, SecurityPage } from "../data/securityPages";
import * as Icons from "react-icons/fa";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import AdminProcess from "./adminprocess";
import CamLayout from "./cam/layout";
import CamPage from "./cam/CamPage";

// Tipos para DriveJS
interface DriverStep {
  element?: string;
  popover?: {
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
  onNext?: () => void;
  onPrev?: () => void;
}

interface DriverConfig {
  showProgress: boolean;
  steps: DriverStep[];
  onDestroyed?: () => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
}

// Mapeo de iconos con tipo
type IconMap = {
  [key: string]: React.ComponentType<any>;
};

const iconMap: IconMap = {
  FaServer: Icons.FaServer,
  FaShieldAlt: Icons.FaShieldAlt,
  FaGlobe: Icons.FaGlobe,
  FaLinux: Icons.FaLinux,
  FaCode: Icons.FaCode,
  FaNetworkWired: Icons.FaNetworkWired,
  FaBug: Icons.FaBug,
  FaSearch: Icons.FaSearch,
  FaPodcast: Icons.FaPodcast,
  FaNewspaper: Icons.FaNewspaper,
  FaBook: Icons.FaBook,
  FaMap: Icons.FaMap,
  FaEye: Icons.FaEye,
  FaUsers: Icons.FaUsers,
  FaSkull: Icons.FaSkull,
  FaHatCowboy: Icons.FaHatCowboy,
  FaGraduationCap: Icons.FaGraduationCap,
  FaDownload: Icons.FaDownload,
  FaDatabase: Icons.FaDatabase,
  FaTrophy: Icons.FaTrophy,
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const driverRef = useRef<any>(null);
  
  const itemsPerPage: number = 8;

  // Calcular índices para la paginación
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: SecurityPage[] = securityPages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages: number = Math.ceil(securityPages.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  // Inicializar DriveJS
  useEffect(() => {
    if (user) {
      // Definir los pasos del tour con tipos
      const tourSteps: DriverStep[] = [
        {
          element: '#dashboard-logo',
          popover: {
            title: '🛡️ Bienvenido a RangersRoot',
            description: 'Este es tu dashboard personal con recursos de seguridad informática.',
            position: 'bottom',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#resources-title',
          popover: {
            title: '📚 Recursos de Seguridad',
            description: 'Aquí encontrarás 20 recursos curados sobre hacking ético, ciberseguridad y herramientas.',
            position: 'bottom',
            side: 'bottom'
          }
        },
        {
          element: '#cards-grid',
          popover: {
            title: '🎯 Tarjetas de Recursos',
            description: 'Cada tarjeta muestra un recurso con su nombre, descripción y un ícono representativo.',
            position: 'top',
            side: 'top'
          }
        },
        {
          element: '.card:first-child',
          popover: {
            title: '📖 Detalles del Recurso',
            description: 'Haz clic en cualquier tarjeta para visitar el recurso en una nueva pestaña.',
            position: 'top',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '#pagination-controls',
          popover: {
            title: '📄 Paginación',
            description: 'Navega entre las páginas para ver más recursos. Actualmente hay 20 recursos disponibles.',
            position: 'top',
            side: 'top'
          }
        },
        {
          element: '#user-profile',
          popover: {
            title: '👤 Tu Perfil',
            description: `Hola ${user.name || 'Usuario'}, aquí puedes ver tu información y cerrar sesión.`,
            position: 'bottom',
            side: 'bottom',
            align: 'end'
          }
        }
      ];

      // Configuración de DriveJS con tipos
      const driverConfig: DriverConfig = {
        showProgress: true,
        steps: tourSteps,
        onDestroyed: () => {
          setIsTourActive(false);
        }
      };

      // Inicializar driver
      driverRef.current = driver(driverConfig);
    }

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [user]);

  // Función para iniciar el tour con tipo
  const startTour = (): void => {
    if (driverRef.current && !isTourActive) {
      setIsTourActive(true);
      driverRef.current.drive();
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-base-200" data-theme="forest">
      {/* Menú lateral con hover */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ícono flotante que siempre se ve */}
        <div className={`
          fixed left-4 top-20 z-50 cursor-pointer
          transition-all duration-300
          ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg hover:bg-primary-focus transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
        </div>

        {/* Menú que aparece al hover */}
        <aside className={`
          fixed left-0 top-0 h-full bg-base-100 shadow-xl z-40
          transition-all duration-300 ease-in-out overflow-hidden
          ${isHovered ? 'w-auto min-w-[200px]' : 'w-0'}
        `}>
          <div className="p-4 w-[200px]">
            <div id="dashboard-logo" className="mb-8 flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-content font-bold">RR</span>
              </div>
              <span className="text-xl font-bold">RangersRoot</span>
            </div>

            <ul className="menu gap-2">
              <li>
                <a className="hover:bg-primary hover:text-primary-content transition-colors rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Inicio
                </a>
              </li>
              <li>
                <a className="hover:bg-primary hover:text-primary-content transition-colors rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Recursos
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="navbar bg-base-100 shadow-lg px-4 lg:px-6">
          <div className="flex-1 flex items-center gap-4">
            <a className="btn btn-ghost text-xl" id="resources-title">RangersRoot</a>
            
            {/* Botón de Tour */}
            <button
              onClick={startTour}
              disabled={isTourActive}
              className="btn btn-ghost btn-sm gap-2 text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isTourActive ? 'Tour en curso...' : '🎯 Ver tour'}
            </button>
          </div>
          
          {/* Perfil de usuario */}
          <div className="dropdown dropdown-end" id="user-profile">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-2">
                {user?.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || "Avatar"} 
                    width={40} 
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full rounded-full">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user?.name || "Usuario"}</span>
              </li>
              <li>
                <span className="text-sm opacity-70">{user?.email}</span>
              </li>
              <div className="divider my-1"></div>
              <li onClick={logout}>
                <a className="text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </header>

        {/* Contenido principal - Cards */}
        <main className="flex-1 p-6 bg-base-200 overflow-y-auto">
          <CamPage/>
          <AdminProcess/>
          <div id="cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((page: SecurityPage) => {
              const IconComponent = iconMap[page.icon];
              return (
                <a
                  key={page.id}
                  href={page.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                >
                  <div className="card-body">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-2xl">
                        {IconComponent && <IconComponent />}
                      </div>
                      <h2 className="card-title text-lg">{page.name}</h2>
                    </div>
                    <p className="text-sm text-base-content/70 line-clamp-3">
                      {page.detail}
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <div className="badge badge-primary badge-sm">Visitar</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Paginación */}
          <div id="pagination-controls" className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm btn-ghost"
            >
              Anterior
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i: number) => i + 1).map((number: number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`btn btn-sm ${
                    currentPage === number
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-ghost"
            >
              Siguiente
            </button>
          </div>

          <div className="text-center mt-4 text-sm text-base-content/50">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, securityPages.length)} de {securityPages.length} recursos
          </div>
        </main>
      </div>
    </div>
  );
}

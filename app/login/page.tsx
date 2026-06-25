"use client";

import { useState, useEffect, useRef } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import HeaderMenu from "../header";
import MagicRings from "../component/MagicRings";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";

// ============================================
// TIPOS MANUALES PARA DRIVEJS
// ============================================

// Tipo para la posición del popover
type DriverPosition = 'top' | 'bottom' | 'left' | 'right';
type DriverAlign = 'start' | 'center' | 'end';

// Interfaz para el popover
interface DriverPopover {
  title: string;
  description: string;
  position?: DriverPosition;
  side?: DriverPosition;
  align?: DriverAlign;
}

// Interfaz para cada paso del tour
interface DriverStep {
  element?: string;
  popover?: DriverPopover;
  onNext?: () => void;
  onPrev?: () => void;
}

// Interfaz para la configuración de DriveJS
interface DriverConfig {
  showProgress: boolean;
  steps: DriverStep[];
  onDestroyed?: () => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onHighlightStarted?: () => void;
  onDeselected?: () => void;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function LoginPage() {
    const { data: session } = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isTourActive, setIsTourActive] = useState<boolean>(false);
    const driverRef = useRef<Driver | null>(null); // ✅ Usar el tipo Driver de la librería

    // Inicializar DriveJS
    useEffect(() => {
        // Definir los pasos del tour con tipos
        const tourSteps: DriverStep[] = [
            {
                element: '#brand-logo',
                popover: {
                    title: '🛡️ RangersRoot',
                    description: 'Bienvenido a la plataforma de seguridad informática y hacking ético.',
                    position: 'bottom',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#login-title',
                popover: {
                    title: '🔐 Acceso Seguro',
                    description: 'Para acceder al contenido exclusivo de seguridad, necesitas iniciar sesión.',
                    position: 'bottom',
                    side: 'bottom'
                }
            },
            {
                element: '#google-login-btn',
                popover: {
                    title: '🚀 Login con Google',
                    description: 'Haz clic aquí para iniciar sesión con tu cuenta de Google. Es rápido, seguro y no necesitas crear una contraseña nueva.',
                    position: 'bottom',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#tour-info',
                popover: {
                    title: '📋 ¿Qué obtienes?',
                    description: 'Acceso a recursos exclusivos de seguridad, tutoriales, herramientas y una comunidad de expertos.',
                    position: 'top',
                    side: 'top'
                }
            },
            {
                element: '#tour-cta',
                popover: {
                    title: '🎯 ¡Comienza ahora!',
                    description: 'Haz clic en "Continuar con Google" y únete a la comunidad RangersRoot.',
                    position: 'top',
                    side: 'top',
                    align: 'end'
                }
            }
        ];

        // Configuración con tipos
        const driverConfig: DriverConfig = {
            showProgress: true,
            steps: tourSteps,
            onDestroyed: () => {
                setIsTourActive(false);
            }
        };

        // ✅ Inicializar driver sin casteo forzado
        driverRef.current = driver(driverConfig);

        // Cleanup
        return () => {
            if (driverRef.current) {
                driverRef.current.destroy();
            }
        };
    }, []);

    // Función para iniciar el tour con tipos
    const startTour = (): void => {
        if (driverRef.current && !isTourActive) {
            setIsTourActive(true);
            driverRef.current.drive();
        }
    };

    // Función para manejar el login con email
    const handleEmailLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setIsSubmitting(false);

        if (!res || res.error) {
            setError("Email o contraseña incorrectos");
            return;
        }
    };

    // Si no hay sesión, mostrar el login
    if (!session) return (
        <div className="relative min-h-screen bg-base-200">
            {/* Navbar */}
            <header className="sticky top-0 z-[9999]">
                <HeaderMenu />
            </header>

            {/* Contenido */}
            <main className="relative z-10 flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
                <MagicRings
                    color="#A855F7"
                    colorTwo="#6366F1"
                    ringCount={6}
                    speed={1}
                    attenuation={10}
                    lineThickness={2}
                    baseRadius={0.35}
                    radiusStep={0.1}
                    scaleRate={0.1}
                    opacity={1}
                    blur={0}
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
                
                <div className="card lg:card-side bg-base-100/50 backdrop-blur-md shadow-2xl w-full max-w-6xl overflow-hidden">
                    {/* Left Side */}
                    <div className="bg-base-100/50 text-neutral-content lg:w-1/2 p-10 flex flex-col justify-between">
                        <div>
                            {/* Logo con ID para el tour */}
                            <div className="avatar placeholder mb-6" id="brand-logo">
                                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-xl w-16 h-16 flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="text-2xl font-bold">RR</span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold leading-tight" id="login-title">
                                🔐 Seguridad<br />
                                <span className="text-primary">Informática</span>
                            </h1>

                            <p className="mt-4 opacity-80 leading-relaxed">
                                Accede a recursos exclusivos de <span className="text-primary font-semibold">hacking ético</span>, 
                                <span className="text-secondary font-semibold"> ciberseguridad</span> y 
                                <span className="text-accent font-semibold"> desarrollo de software</span>.
                            </p>

                            {/* Información del tour */}
                            <div id="tour-info" className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                        🎯
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Contenido exclusivo para miembros</p>
                                        <p className="text-xs opacity-70">Tutoriales · Herramientas · Comunidad</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stats bg-base-100/50 text-base-content shadow mt-8">
                            <div className="stat">
                                <div className="stat-title">Recursos</div>
                                <div className="stat-value">20+</div>
                                <div className="stat-desc">↗︎ En crecimiento constante</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Miembros</div>
                                <div className="stat-value">1.2K</div>
                                <div className="stat-desc">↗︎ Comunidad activa</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="card-body lg:w-1/2 p-10">
                        <div className="max-w-md mx-auto w-full">
                            <h2 className="text-3xl font-bold" id="tour-cta">
                                Iniciar Sesión
                            </h2>

                            <p className="text-base-content/70 mt-2">
                                Únete a la comunidad RangersRoot
                            </p>

                            {/* Botón de Tour */}
                            <div className="mt-4">
                                <button
                                    onClick={startTour}
                                    disabled={isTourActive}
                                    className="btn btn-ghost btn-sm gap-2 text-primary"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {isTourActive ? 'Tour en curso...' : '🎯 Ver tour guiado'}
                                </button>
                            </div>

                            <div className="grid gap-3 mt-4">
                                {/* Botón de Google con ID para el tour */}
                                <button
                                    id="google-login-btn"
                                    className="btn btn-outline gap-2 hover:bg-primary hover:text-primary-content transition-all"
                                    onClick={() => signIn("google")}
                                >
                                    <FaGoogle className="text-xl" />
                                    Continuar con Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-base-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-base-100 px-2 text-base-content/50">
                                            Reconocimiento a frutinodev
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mensaje adicional sobre el login */}
                            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-green-500 text-sm">✓</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-primary">
                                            Login con Google disponible
                                        </p>
                                        <p className="text-xs text-base-content/60 mt-1">
                                            Haz clic en el botón de Google para acceder instantáneamente. 
                                            No necesitas crear una cuenta nueva.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

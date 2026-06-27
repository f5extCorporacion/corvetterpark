"use client";

import { useState, useEffect, useRef } from "react";
import { FaGoogle } from "react-icons/fa";
import HeaderMenu from "../header";
import MagicRings from "../component/MagicRings";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";

// ============================================
// TIPOS MANUALES PARA DRIVEJS
// ============================================

type DriverPosition = 'top' | 'bottom' | 'left' | 'right';
type DriverAlign = 'start' | 'center' | 'end';

interface DriverPopover {
  title: string;
  description: string;
  position?: DriverPosition;
  side?: DriverPosition;
  align?: DriverAlign;
}

interface DriverStep {
  element?: string;
  popover?: DriverPopover;
  onNext?: () => void;
  onPrev?: () => void;
}

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
    const driverRef = useRef<Driver | null>(null);

    // Inicializar DriveJS
    useEffect(() => {
        const tourSteps: DriverStep[] = [
            {
                element: '#brand-logo',
                popover: {
                    title: '🚗 CorvettePark',
                    description: 'Bienvenido a la plataforma tecnológica para estacionamientos inteligentes.',
                    position: 'bottom',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#login-title',
                popover: {
                    title: '🔐 Acceso al Sistema',
                    description: 'Inicia sesión para gestionar tu estacionamiento y acceder a todas las funcionalidades.',
                    position: 'bottom',
                    side: 'bottom'
                }
            },
            {
                element: '#google-login-btn',
                popover: {
                    title: '🚀 Login con Google',
                    description: 'Accede rápidamente con tu cuenta de Google. Seguro, rápido y sin complicaciones.',
                    position: 'bottom',
                    side: 'bottom',
                    align: 'start'
                }
            },
            {
                element: '#tour-info',
                popover: {
                    title: '📋 Beneficios del Sistema',
                    description: 'Gestión de plazas, pagos automatizados, control de accesos y reportes en tiempo real.',
                    position: 'top',
                    side: 'top'
                }
            },
            {
                element: '#tour-cta',
                popover: {
                    title: '🎯 ¡Comienza ahora!',
                    description: 'Haz clic en "Continuar con Google" y empieza a usar CorvettePark.',
                    position: 'top',
                    side: 'top',
                    align: 'end'
                }
            }
        ];

        const driverConfig: DriverConfig = {
            showProgress: true,
            steps: tourSteps,
            onDestroyed: () => {
                setIsTourActive(false);
            }
        };

        driverRef.current = driver(driverConfig);

        return () => {
            if (driverRef.current) {
                driverRef.current.destroy();
            }
        };
    }, []);

    const startTour = (): void => {
        if (driverRef.current && !isTourActive) {
            setIsTourActive(true);
            driverRef.current.drive();
        }
    };

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

    if (!session) return (
        <div className="relative min-h-screen bg-base-200">

            {/* Header */}
            <header className="sticky top-0 z-[9999]">
                <HeaderMenu />
            </header>

            {/* Contenido principal */}
            <main className="relative z-10 flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">

                {/* Fondo animado con blur /10 */}
                <div className="fixed inset-0 -z-10 pointer-events-none">
                    <MagicRings
                        color="#FF3E00"
                        colorTwo="#FF3E10"
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
                
                {/* Card principal */}
                <div className="card lg:card-side bg-base-200/20 backdrop-blur-md shadow-2xl w-full max-w-6xl overflow-hidden border border-base-300/30">

                    {/* Columna Izquierda - Info del producto */}
                    <div className="bg-base-100/30 text-neutral-content lg:w-1/2 p-10 flex flex-col justify-between">

                        <div>
                            {/* Logo */}
                            <div className="avatar placeholder mb-6" id="brand-logo">
                                <div className="bg-gradient-to-br from-[#FF3E00] to-orange-500 text-white rounded-xl w-16 h-16 flex items-center justify-center shadow-lg shadow-[#FF3E00]/20">
                                    <span className="text-2xl font-bold">CP</span>
                                </div>
                            </div>

                            {/* Título */}
                            <h1 className="text-4xl font-bold leading-tight" id="login-title">
                                <span className="bg-gradient-to-r from-[#FF3E00] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                    Corvette
                                </span>
                                <br />
                                <span className="text-white/90">Sistema de Estacionamiento</span>
                            </h1>

                            {/* Descripción */}
                            <p className="mt-4 text-white/70 leading-relaxed">
                                Solución tecnológica integral para la gestión de estacionamientos con 
                                <span className="text-[#FF3E00] font-semibold"> blockchain</span>, 
                                <span className="text-orange-400 font-semibold"> Linux</span> y 
                                <span className="text-amber-400 font-semibold"> tecnología de punta</span>.
                            </p>

                            {/* Beneficios */}
                            <div id="tour-info" className="mt-6 p-4 bg-[#FF3E00]/10 rounded-xl border border-[#FF3E00]/20 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#FF3E00]/20 rounded-full flex items-center justify-center text-[#FF3E00]">
                                        🚗
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white/90">Sistema inteligente de parkeo</p>
                                        <p className="text-xs text-white/50">Blockchain · IoT · Tiempo real</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="stats bg-base-100/30 backdrop-blur-sm text-white shadow mt-8 border border-white/10">
                            <div className="stat">
                                <div className="stat-title text-white/60">Plazas gestionadas</div>
                                <div className="stat-value text-white">500+</div>
                                <div className="stat-desc text-white/40">↗︎ En crecimiento</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title text-white/60">Usuarios activos</div>
                                <div className="stat-value text-white">2.5K</div>
                                <div className="stat-desc text-white/40">↗︎ Comunidad en expansión</div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Login */}
                    <div className="card-body lg:w-1/2 p-10">
                        <div className="max-w-md mx-auto w-full">

                            {/* Título login */}
                            <h2 className="text-3xl font-bold text-white" id="tour-cta">
                                Iniciar Sesión
                            </h2>
                            <p className="text-white/60 mt-2">
                                Accede a tu panel de control
                            </p>

                            {/* Botón tour */}
                            <div className="mt-4">
                                <button
                                    onClick={startTour}
                                    disabled={isTourActive}
                                    className="btn btn-ghost btn-sm gap-2 text-[#FF3E00] hover:text-[#FF3E00] hover:bg-[#FF3E00]/10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {isTourActive ? 'Tour en curso...' : '🎯 Ver tour guiado'}
                                </button>
                            </div>

                            {/* Botón Google */}
                            <div className="grid gap-3 mt-4">
                                <button
                                    id="google-login-btn"
                                    className="btn btn-outline gap-2 hover:bg-[#FF3E00] hover:text-white hover:border-[#FF3E00] transition-all border-white/20 text-white"
                                    onClick={() => signIn("google")}
                                >
                                    <FaGoogle className="text-xl" />
                                    Continuar con Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-base-100/20 backdrop-blur-sm px-2 text-white/40">
                                            Reconocimiento a frutinodev
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mensaje informativo */}
                            <div className="mt-6 p-4 bg-[#FF3E00]/10 rounded-xl border border-[#FF3E00]/20 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-green-400 text-sm">✓</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#FF3E00]">
                                            Acceso con Google disponible
                                        </p>
                                        <p className="text-xs text-white/50 mt-1">
                                            Haz clic en el botón de Google para acceder instantáneamente.
                                            Gestión de estacionamientos simplificada.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
'use client';

import HeaderMenu from "./header";
import MagicRings from "./component/MagicRings";
import Image from "next/image";
import LogoLoop from "./component/LogoLoop";
import {
  FaHackerNews,
  FaShieldAlt,
  FaKey,
  FaLock,
} from "react-icons/fa";
import {
  MdSecurity,
  MdDeveloperMode,
} from "react-icons/md";
import {
  GiBrain,
  GiCyberEye,
} from "react-icons/gi";

const techLogos = [
  { node: <FaHackerNews className="text-orange-500" size={40} />, title: "Hacker News", href: "#" },
  { node: <FaShieldAlt className="text-green-500" size={40} />, title: "Security", href: "#" },
  { node: <FaKey className="text-yellow-500" size={40} />, title: "Encryption", href: "#" },
  { node: <FaLock className="text-red-500" size={40} />, title: "Cybersecurity", href: "#" },
  { node: <MdSecurity className="text-blue-500" size={40} />, title: "Security", href: "#" },
  { node: <MdDeveloperMode className="text-purple-500" size={40} />, title: "Dev Mode", href: "#" },
  { node: <GiCyberEye className="text-cyan-500" size={40} />, title: "Cyber Eye", href: "#" },
  { node: <GiBrain className="text-pink-500" size={40} />, title: "AI Brain", href: "#" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">

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
          blur={10} // ← Cambiado a /10
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

      {/* Header SIEMPRE encima */}
      <div className="sticky top-0 z-[9999]">
        <HeaderMenu />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 flex flex-col justify-center gap-12">

        <div className="max-w-5xl mx-auto w-full">
          <div className="card bg-base-200/20 backdrop-blur-md shadow-2xl border border-base-300 overflow-hidden">

            {/* Grid layout para mejor distribución */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

              {/* Columna Izquierda - Imagen */}
              <figure className="relative min-h-[280px] md:min-h-[400px] bg-base-300/30 p-6 flex justify-center items-center">
                <div className="relative w-full max-w-[300px] h-[200px] md:h-[280px]">
                  <Image
                    src="/imagen1.png"
                    alt="CorvettePark"
                    fill
                    className="object-contain rounded-xl"
                    priority
                  />
                </div>
                {/* Badges flotantes sobre la imagen */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="badge badge-primary badge-sm gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    En desarrollo
                  </span>
                  <span className="badge badge-secondary badge-sm">v1.0</span>
                </div>
              </figure>

              {/* Columna Derecha - Contenido */}
              <div className="flex flex-col justify-center p-6 md:p-8 backdrop-blur-sm bg-base-100/10">

                {/* Título principal CORVETTE PARK */}
                <div className="mb-2">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-[#FF3E00] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                      Corvette
                    </span>
                    <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
                      Park
                    </span>
                  </h1>
                  <div className="h-1 w-24 bg-gradient-to-r from-[#FF3E00] to-orange-400 rounded-full mt-1"></div>
                </div>

                {/* Subtítulo */}
                <h2 className="text-lg md:text-xl font-semibold text-base-content/80 mt-1">
                  🚗 Solución Tecnológica para el Parkeo
                </h2>

                {/* Tags de tecnología */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge badge-outline badge-primary">Blockchain</span>
                  <span className="badge badge-outline badge-secondary">Linux</span>
                  <span className="badge badge-outline badge-accent">IoT</span>
                  <span className="badge badge-outline badge-info">🔒 Seguridad</span>
                  <span className="badge badge-outline badge-success">🐧 Open Source</span>
                </div>

                {/* Descripción */}
                <div className="py-4 space-y-3 text-base-content/80">
                  <p className="text-sm md:text-base leading-relaxed">
                    <span className="font-bold text-[#FF3E00]">CorvettePark</span> es una 
                    <span className="font-semibold text-primary"> aplicación tecnológica </span>
                    para el estacionamiento que integra 
                    <span className="font-semibold text-accent"> blockchain</span>, 
                    <span className="font-semibold text-secondary"> Linux</span> y 
                    <span className="font-semibold text-info"> tecnología de punta</span> 
                    para una experiencia segura y eficiente.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 bg-primary/5 rounded-lg p-2">
                      <span className="text-[#FF3E00]">⛓️</span>
                      <span>Blockchain</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/5 rounded-lg p-2">
                      <span className="text-[#FF3E00]">🐧</span>
                      <span>Linux</span>
                    </div>
                    <div className="flex items-center gap-2 bg-accent/5 rounded-lg p-2">
                      <span className="text-[#FF3E00]">📡</span>
                      <span>IoT</span>
                    </div>
                    <div className="flex items-center gap-2 bg-info/5 rounded-lg p-2">
                      <span className="text-[#FF3E00]">🛡️</span>
                      <span>Seguridad</span>
                    </div>
                  </div>
                </div>

                {/* CTA - Acceso con Google */}
                <div className="mt-2 p-3 bg-[#FF3E00]/10 border border-[#FF3E00]/20 rounded-xl backdrop-blur-sm hover:bg-[#FF3E00]/15 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF3E00]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#FF3E00]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#FF3E00]">
                        🚀 Acceso con Google
                      </p>
                      <p className="text-xs text-base-content/60">
                        Inicia sesión para acceder a contenido exclusivo
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Logo Loop */}
        <div className="w-full">
          <LogoLoop
            logos={techLogos}
            speed={100}
            direction="left"
            logoHeight={40}
            gap={60}
            hoverSpeed={0}
            scaleOnHover
            ariaLabel="Technology partners"
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200/50 backdrop-blur-sm rounded-t-xl relative z-10 border-t border-base-300/30">
        <p className="text-base-content/60">
          Copyright © {new Date().getFullYear()} - CorvettePark
        </p>
      </footer>
    </div>
  );
}
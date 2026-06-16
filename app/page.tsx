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

      {/* Fondo animado */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
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
      </div>

      {/* Header SIEMPRE encima */}
      <div className="sticky top-0 z-[9999]">
        <HeaderMenu />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 flex flex-col justify-between gap-12">

        <div className="max-w-4xl mx-auto w-full">
          <div className="card md:card-side bg-base-200/60 backdrop-blur-md shadow-2xl border border-base-300">

            <figure className="w-full md:w-2/5 min-h-[200px] relative bg-base-300/30 p-6 flex justify-center items-center">
              <Image
                src="/imagen12.png"
                alt="RangersRoot"
                width={250}
                height={150}
                className="object-contain rounded-xl"
                priority
              />
            </figure>

            <div className="card-body md:w-3/5">
              <h1 className="card-title text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bienvenido a RangersRoot
              </h1>

              <p className="py-4 text-base-content/80">
                Creadores de mundos paralelos y economías multimillonarias
                donde todos somos iguales.

                iremos actualizando esta web esta en construción el login con google ya lo puedes probar hacer click en login  (continue con  google)
              </p>
              

              <div className="card-actions justify-end">
                <button className="btn btn-primary">
                  en creacion
                </button>

                <button className="btn btn-outline btn-secondary">
                  en creacion
                </button>
              </div>
            </div>
          </div>
        </div>

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

      <footer className="footer footer-center p-10 bg-base-200 rounded-t-xl relative z-10">
        <p>
          Copyright © {new Date().getFullYear()} - RangersRoot
        </p>
      </footer>
    </div>
  );
}

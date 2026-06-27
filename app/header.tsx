'use client'
import Link from "next/link";
export default function HeaderMenu() {
  
  return (
    <div className="navbar bg-base-200 shadow-md">
      <div className="navbar-start ps-4">
        <Link href="/" className="text-lg font-bold">
          <span className="text-[#FF3E00]">CORVETTE</span>PARK
        </Link>
      </div>

      <div className="navbar-end px-2">
        <div className="flex items-stretch gap-2">

          {/* Home */}
          <a
             href="/"
            className="btn btn-ghost rounded-btn"
          >
            Home
          </a>

          {/* Login */}
          <a
            href="/login"
            className="btn btn-ghost  rounded-btn"
          >
            Login
          </a>

        </div>
      </div>
    </div>
  );
}
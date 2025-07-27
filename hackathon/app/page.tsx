"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
  const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
  if (!interBubble) return;

  const rect = interBubble.getBoundingClientRect();
  const offsetX = rect.width / 2;
  const offsetY = rect.height / 2;

  let curX = 0;
  let curY = 0;
  let tgX = 0;
  let tgY = 0;

  function move() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;

    interBubble.style.transform = `translate(${Math.round(curX - offsetX)}px, ${Math.round(curY - offsetY)}px)`;

    requestAnimationFrame(move);
  }

  const handleMouseMove = (event: MouseEvent) => {
    tgX = event.clientX;
    tgY = event.clientY;
  };

  window.addEventListener('mousemove', handleMouseMove);
  move();

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
}, []);
  return (
<div className="relative flex flex-col gap-[32px] row-start-2 items-center sm:items-start gradient-bg">
  <div className="relative flex flex-col items-center justify-center bg-cover bg-center w-full h-screen">
    
    {/* Gradient Background Layer - z-0 (behind everything) */}
    <div className="gradients-container absolute inset-0 z-0">
      <div className="g1"></div>
      <div className="g2"></div>
      <div className="g3"></div>
      <div className="g4"></div>
      <div className="g5"></div>
    </div>

    {/* Main content - z-10 (on top) */}
    <div className="relative z-10 flex flex-col items-center justify-center gap-3">
      <p className="text-9xl justify-center flex p-0 text-[#1a1a40]">
        AutoMate
      </p>
      <p className="text-2xl justify-center flex font-[Poppins] text-[#1a1a40]">
        Part picking made easy
      </p>
    </div>

    {/* Button */}
   <div className="relative z-10 mt-14">
    <Link href="/searchpage">
      <button className="bg-[#6159d0] text-white text-xl px-6 py-3 rounded-full shadow-lg hover:bg-[#5149b0] transition duration-300">
        Get started
      </button>
    </Link>
  </div>

  {/* Interactive blob */}
  <div className="interactive fixed top-0 left-0 w-32 h-32 rounded-full bg-green-500 pointer-events-none z-50" />

  {/* Background Image */}
  <div className="absolute inset-0 pointer-events-none z-0">
    <img src="/icons/air-conditioner.svg" className="floating-icon float1" />
    <img src="/icons/exhaust.svg" className="floating-icon float2" />
    <img src="/icons/steering-wheel-car.svg" className="floating-icon float3" />
    <img src="/icons/dashboard.svg" className="floating-icon float4" />
  </div>

  </div>
</div>

  );
}

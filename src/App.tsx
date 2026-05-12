import Flipbook from "./components/Flipbook";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="h-screen w-screen bg-[#fafdff] text-slate-900 selection:bg-orange-500/30 overflow-hidden fixed inset-0 font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden text-black/5">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/40 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/40 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full w-full overflow-hidden px-4">
        <Flipbook />
      </main>
    </div>
  );
}


"use client";

export default function ValueCard({
  icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-black/80 border border-red-900/70 rounded-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.65)] flex flex-col h-full">

      <div className="flex items-center gap-3 mb-3">
        <div className="text-red-400 text-2xl">{icon}</div>
        <h4 className="font-oswald text-lg tracking-wide">{title}</h4>
      </div>

      <p className="text-white/70 text-sm font-inter flex-1">{text}</p>

      <div className="mt-4 h-[1px] bg-gradient-to-r from-wn-gold/60 via-red-500/60 to-transparent" />
      
    </div>
  );
}

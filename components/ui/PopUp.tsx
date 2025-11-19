"use client";

export default function Popup({
  visible,
  onClose,
  title = "Success!",
  message = "",
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-[999] flex items-center justify-center 
        bg-black/60 backdrop-blur-sm 
        animate-fadeIn
      "
    >
      <div
        className="
          bg-wn-card 
          border border-wn-gold/40 
          rounded-2xl 
          p-6 w-[90%] max-w-sm 
          shadow-[0_0_30px_rgba(228,181,0,0.25)]
          animate-slideUp
        "
      >
        <h3 className="text-xl font-oswald text-wn-gold mb-2">{title}</h3>
        <p className="text-white/80 text-sm font-inter leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className="
            mt-6 w-full py-2.5 rounded-xl 
            bg-wn-gold text-black font-semibold 
            hover:bg-wn-gold/90 transition
          "
        >
          Close
        </button>
      </div>
    </div>
  );
}

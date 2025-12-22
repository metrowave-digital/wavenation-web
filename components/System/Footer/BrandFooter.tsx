// components/System/Footer/SiteFooter.tsx
import WNLogo from "@/components/ui/WNLogo";

export default function BrandFooter() {
  return (
    <footer className="mt-24 pt-12 border-t border-white/10 text-white/70 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        {/* BRAND ROW */}
        <div className="flex flex-col items-center gap-4 text-center">
          <WNLogo size={36} />
          <p className="text-sm opacity-70">
            Amplify Your Vibe.
          </p>
        </div>

        {/* COPYRIGHT — LOCKED TO BOTTOM */}
        <div className="mt-10 text-center text-xs opacity-50">
          ©{" "}
          <span suppressHydrationWarning>
            {new Date().getFullYear()}
          </span>{" "}
          MetroWave Media Group · wavenation.media
        </div>
      </div>
    </footer>
  );
}

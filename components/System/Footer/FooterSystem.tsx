import FooterNav from "./FooterNav";
import BrandFooter from "./BrandFooter";
import LegalFooter from "./LegalFooter";

export default function FooterSystem() {
  return (
    <footer className="bg-wn-black border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <FooterNav />
        <BrandFooter />
        <LegalFooter />
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="w-full py-4 bg-white border-t text-center text-xs text-gray-400">
      &copy; {new Date().getFullYear()} <span className="font-semibold text-violet-600">NerPulse</span> — <b>e-DPVN</b> — Tous droits réservés.
    </footer>
  );
}

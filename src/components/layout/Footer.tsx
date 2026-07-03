export function Footer() {
  return (
    <footer className="border-t border-bordersoft bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-bold">🥗 ProteinBox</h3>
          <p className="mt-2 text-sm text-textsecond">Healthy protein breakfasts, delivered fresh every morning.</p>
        </div>
        <div>
          <h4 className="font-display font-bold text-textprimary">Quick Links</h4>
          <ul className="mt-2 space-y-1 text-sm text-textsecond">
            <li><a href="/" className="hover:text-brand-green">Home</a></li>
            <li><a href="/#plans" className="hover:text-brand-green">Plans</a></li>
            <li><a href="/#how" className="hover:text-brand-green">How it works</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-textprimary">Plans</h4>
          <ul className="mt-2 space-y-1 text-sm text-textsecond">
            <li>Veg Protein Box</li>
            <li>Non-Veg Protein Box</li>
            <li>High Protein Fitness Box</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-textprimary">Contact</h4>
          <ul className="mt-2 space-y-1 text-sm text-textsecond">
            <li>📞 +91 8297364002</li>
            <li>✉️ hello@proteinbox.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bordersoft py-4 text-center text-xs text-textsecond">
        © {new Date().getFullYear()} ProteinBox — Made with 💚 for healthy India
      </div>
    </footer>
  );
}
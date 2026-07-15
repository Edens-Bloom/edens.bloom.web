const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-8 text-sm text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Eden&apos;s Bloom Store. Crafted for
          florals, gifting, and special occasions.
        </p>
        <div className="flex gap-4">
          <a href="/about" className="hover:text-slate-900">
            About
          </a>
          <a href="/cart" className="hover:text-slate-900">
            Cart
          </a>
          <a href="/login" className="hover:text-slate-900">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

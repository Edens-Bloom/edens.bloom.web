"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
  { href: "/login", label: "Admin" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-lg font-semibold text-rose-700">
            EB
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">
              Eden&apos;s Bloom
            </p>
            <p className="text-sm text-slate-500">Boutique florist</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-white hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

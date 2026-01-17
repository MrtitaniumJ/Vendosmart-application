import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/upload", label: "Upload" },
    { path: "/table", label: "Table" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <span className="text-xs sm:text-sm font-bold text-white">V</span>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity blur-xl -z-10"></div>
                </div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Vendosmart
                </h1>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "text-slate-900 bg-slate-100 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <p className="text-xs text-slate-500 text-center">
            Built for <span className="font-semibold text-slate-700">Proqsmart</span> assignment
          </p>
        </div>
      </footer>
    </div>
  );
}

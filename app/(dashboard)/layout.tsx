import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header with theme toggle */}
        <header className="sticky top-0 z-40 border-b bg-white dark:bg-zinc-950 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-zinc-950/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Mobile menu button could go here */}
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold md:hidden text-zinc-900 dark:text-white">
                Lokay Share
              </h2>
            </div>
            
            {/* Theme toggle on the right */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

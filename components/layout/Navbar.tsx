"use client";

interface NavbarProps {
  onMenuToggle: () => void;
  userName?: string;
}

export function Navbar({ onMenuToggle, userName = "Admin" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Page title */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
      </div>

      {/* Right: User + Actions */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Notifications"
        >
          🔔
        </button>
        <button
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Settings"
        >
          ⚙️
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}

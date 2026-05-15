import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, CheckSquare, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: CreditCard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-sidebar-background border-r border-sidebar-border min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Admin</h1>
        <p className="text-sm text-sidebar-foreground/60">Management Panel</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};

export default AdminSidebar;

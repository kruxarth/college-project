import { Link } from 'react-router-dom';
import { Bell, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import * as fs from '@/services/firestore';
import { useState, useEffect } from 'react';
import { NotificationPanel } from './NotificationPanel';

export function Navbar() {
  const { currentUser, user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser) {
        try {
          const notifications = await fs.getNotificationsForUser(currentUser.id);
          setUnreadCount(notifications.filter(n => !n.isRead).length);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    };

    loadNotifications();
  }, [currentUser]);

  if (!currentUser || !user) return null;

  const handleLogout = () => {
    logout();
  };

  const navLinks = user.role === 'donor' ? [
    { to: '/donor/dashboard', label: 'Dashboard' },
    { to: '/donor/create-donation', label: 'Create Donation' },
    { to: '/donor/donations', label: 'My Donations' },
  ] : [
    { to: '/ngo/dashboard', label: 'Dashboard' },
    { to: '/ngo/browse', label: 'Browse Donations' },
    { to: '/ngo/my-claims', label: 'My Claims' },
  ];

  return (
    <nav className="border-b bg-card shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
               <span className="bg-gradient-to-r from-raspberry-red to-mango-orange bg-clip-text text-transparent">
                Nourish
              </span>
            </Link>
            <div className="hidden md:flex gap-1">
              {navLinks.map(link => (
                <Button key={link.to} variant="ghost" asChild>
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationPanel 
              userId={currentUser.id} 
              unreadCount={unreadCount}
              onUpdate={async () => {
                try {
                  const notifications = await fs.getNotificationsForUser(currentUser.id);
                  setUnreadCount(notifications.filter(n => !n.isRead).length);
                } catch (error) {
                  console.error('Error updating notifications:', error);
                }
              }}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.fullName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/${user.role}/profile`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

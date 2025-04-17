import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { Menu, X, User, Settings, LogOut, Users, Calendar, FileText, Stethoscope, DollarSign, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return 'U';
    const names = user.displayName.split(' ');
    if (names.length === 1) return names[0][0];
    return `${names[0][0]}${names[names.length - 1][0]}`;
  };

  // Navigation links for non-logged-in users
  const publicNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
  ];

  // Navigation links for logged-in users
  const privateNavLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/medical-records', label: 'Medical Records' },
    { to: '/prescriptions', label: 'Prescriptions' },
    { to: '/invoices', label: 'Invoices' },
    { to: '/inventory', label: 'Inventory' },
  ];

  // Choose which links to display based on authentication status
  const navLinks = user ? privateNavLinks : publicNavLinks;

  // Navigation items for dropdown menu
  const accountNavItems = [
    { 
      icon: <User className="mr-2 h-4 w-4" />, 
      label: 'Profile', 
      to: '/profile'
    },
    { 
      icon: <Settings className="mr-2 h-4 w-4" />, 
      label: 'Settings', 
      to: '/settings'
    },
    { 
      icon: <LogOut className="mr-2 h-4 w-4" />, 
      label: 'Sign out', 
      to: '#',
      onClick: signOut
    },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary flex items-center">
                <Stethoscope className="h-6 w-6 mr-2" />
                PureCare
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-foreground hover:text-primary hover:border-primary transition duration-150 ease-in-out"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.displayName || user.email || 'User'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountNavItems.map((item, index) => (
                    <DropdownMenuItem key={index} asChild>
                      {item.onClick ? (
                        <button 
                          onClick={item.onClick} 
                          className="w-full flex items-center cursor-pointer"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ) : (
                        <Link to={item.to} className="flex items-center w-full">
                          {item.icon}
                          {item.label}
                        </Link>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="py-2 space-y-1">
          {/* Dynamic Mobile Navigation Links */}
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label === 'Dashboard' && (
                <div className="flex items-center">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {link.label === 'Patients' && (
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {link.label === 'Appointments' && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {link.label === 'Medical Records' && (
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {link.label === 'Prescriptions' && (
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {link.label === 'Invoices' && (
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {link.label === 'Inventory' && (
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              )}
              {!['Dashboard', 'Patients', 'Appointments', 'Medical Records', 'Prescriptions', 'Invoices', 'Inventory'].includes(link.label) && link.label}
            </Link>
          ))}
          
          <div className="pt-4 pb-3 border-t border-border">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Users, 
  Calendar, 
  FileText, 
  Heart, 
  DollarSign, 
  Package, 
  Home, 
  PieChart, 
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

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
    { to: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { to: '/features', label: 'Features', icon: <Star className="h-4 w-4" /> },
    { to: '/pricing', label: 'Pricing', icon: <DollarSign className="h-4 w-4" /> },
  ];

  // Navigation links for logged-in users
  const privateNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <PieChart className="h-4 w-4" /> },
    { to: '/patients', label: 'Patients', icon: <Users className="h-4 w-4" /> },
    { to: '/appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" /> },
    { to: '/medical-records', label: 'Medical Records', icon: <FileText className="h-4 w-4" /> },
    { to: '/prescriptions', label: 'Prescriptions', icon: <FileText className="h-4 w-4" /> },
    { to: '/invoices', label: 'Invoices', icon: <DollarSign className="h-4 w-4" /> },
    { to: '/inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
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

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary flex items-center">
                <Heart className="h-6 w-6 mr-2 rainbow-heart" fill="currentColor" />
                PureCare
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out",
                    isActiveLink(link.to) 
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground hover:text-primary hover:border-primary"
                  )}
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
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none hover:bg-accent/50 transition-colors"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[85%] sm:max-w-md p-0 border-l shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="bg-primary/5 p-6">
                    <div className="flex items-center">
                      <Link 
                        to="/" 
                        className="text-xl font-bold text-primary flex items-center" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Heart className="h-7 w-7 mr-2 rainbow-heart" fill="currentColor" />
                        <span className="text-gradient">PureCare</span>
                      </Link>
                    </div>
                    
                    {user && (
                      <div className="mt-6 flex items-center">
                        <Avatar className="h-12 w-12 mr-4 ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary/10">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="bg-primary/20 text-primary">{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.displayName || 'User'}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{user.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Main content */}
                  <div className="flex-1 overflow-auto py-6 px-4">
                    <div className="space-y-6">
                      {/* Navigation section */}
                      <div>
                        <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">Navigation</h3>
                        <nav className="space-y-1">
                          {navLinks.map((link) => (
                            <Link 
                              key={link.to}
                              to={link.to} 
                              className={cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                                isActiveLink(link.to)
                                  ? "bg-primary/10 text-primary" 
                                  : "text-foreground hover:bg-accent/60 hover:text-foreground"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className={cn(
                                "mr-3 flex-shrink-0",
                                isActiveLink(link.to) ? "text-primary" : "text-muted-foreground"
                              )}>
                                {link.icon}
                              </span>
                              <span>{link.label}</span>
                              {isActiveLink(link.to) && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>
                              )}
                            </Link>
                          ))}
                        </nav>
                      </div>
                      
                      {/* Account section */}
                      {user && (
                        <div>
                          <Separator className="my-4" />
                          <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">Account</h3>
                          <nav className="space-y-1">
                            <Link 
                              to="/profile" 
                              className={cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                                isActiveLink('/profile')
                                  ? "bg-primary/10 text-primary" 
                                  : "text-foreground hover:bg-accent/60 hover:text-foreground"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className={cn(
                                "mr-3 flex-shrink-0",
                                isActiveLink('/profile') ? "text-primary" : "text-muted-foreground"
                              )}>
                                <User className="h-4 w-4" />
                              </span>
                              <span>Profile</span>
                            </Link>
                            
                            <Link 
                              to="/settings" 
                              className={cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                                isActiveLink('/settings')
                                  ? "bg-primary/10 text-primary" 
                                  : "text-foreground hover:bg-accent/60 hover:text-foreground"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className={cn(
                                "mr-3 flex-shrink-0",
                                isActiveLink('/settings') ? "text-primary" : "text-muted-foreground"
                              )}>
                                <Settings className="h-4 w-4" />
                              </span>
                              <span>Settings</span>
                            </Link>
                            
                            <button 
                              onClick={() => {
                                signOut();
                                setIsMenuOpen(false);
                              }}
                              className="w-full flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-foreground hover:bg-accent/60 transition-colors"
                            >
                              <span className="mr-3 flex-shrink-0 text-muted-foreground">
                                <LogOut className="h-4 w-4" />
                              </span>
                              <span>Sign out</span>
                            </button>
                          </nav>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  {!user && (
                    <div className="p-6 bg-muted/30 border-t">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-2">Join PureCare to access all features</p>
                        <Button asChild className="w-full mb-2">
                          <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                            Sign up
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                            Sign in
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// Add this to your global CSS
const styles = `
.text-gradient {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes rainbow {
  0% { color: #FF0000; } /* Bright Red */
  3.33% { color: #FF1100; }
  6.66% { color: #FF3700; }
  10% { color: #FF5E00; } /* Orange-Red */
  13.33% { color: #FF7F00; } /* Dark Orange */
  16.66% { color: #FFA500; } /* Orange */
  20% { color: #FFCC00; } /* Orange-Yellow */
  23.33% { color: #FFFF00; } /* Yellow */
  26.66% { color: #CCFF00; } /* Yellow-Green */
  30% { color: #99FF00; }
  33.33% { color: #66FF00; } /* Lime */
  36.66% { color: #33FF00; }
  40% { color: #00FF00; } /* Green */
  43.33% { color: #00FF33; }
  46.66% { color: #00FF66; } /* Mint */
  50% { color: #00FF99; }
  53.33% { color: #00FFCC; } /* Turquoise */
  56.66% { color: #00FFFF; } /* Cyan */
  60% { color: #00CCFF; } /* Light Blue */
  63.33% { color: #0099FF; }
  66.66% { color: #0066FF; } /* Blue */
  70% { color: #0033FF; }
  73.33% { color: #0000FF; } /* Deep Blue */
  76.66% { color: #3300FF; } /* Indigo */
  80% { color: #6600FF; } /* Violet */
  83.33% { color: #9900FF; } /* Purple */
  86.66% { color: #CC00FF; } /* Magenta */
  90% { color: #FF00FF; } /* Pink */
  93.33% { color: #FF00CC; }
  96.66% { color: #FF0099; } /* Hot Pink */
  100% { color: #FF0000; } /* Back to Red */
}

.rainbow-heart {
  animation: rainbow 8s linear infinite;
}

/* Style the built-in close button */
[data-radix-sheet-content] > button {
  top: 1.5rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 9999px;
  opacity: 1;
  transition: background-color 0.2s ease;
}

[data-radix-sheet-content] > button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

[data-radix-sheet-content] > button > svg {
  width: 1rem;
  height: 1rem;
}
`;

// Add a style tag to the document if it doesn't already exist
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

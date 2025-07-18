
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Bitcoin, 
  LineChart, 
  LogOut, 
  User, 
  LogIn, 
  Menu, 
  Newspaper,
  Currency,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CurrencyConverter from './CurrencyConverter';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showConverter, setShowConverter] = React.useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: <LineChart className="h-5 w-5" /> },
    { name: 'Portfolio', href: '/portfolio', icon: <Bitcoin className="h-5 w-5" /> },
    { name: 'News', href: '/news', icon: <Newspaper className="h-5 w-5" /> },
    { name: 'Admin', href: '/admin', icon: <Settings className="h-5 w-5" /> },
  ];
  
  const isActivePath = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow glass border-r border-white/5 overflow-y-auto">
          <div className="flex items-center px-4 py-6">
            <Link to="/" className="flex items-center space-x-2">
              <Bitcoin className="h-8 w-8 text-primary" />
              <span className="text-xl font-medium">CryptoTrack</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActivePath(item.href)
                    ? 'bg-secondary text-white'
                    : 'text-white/70 hover:bg-secondary/50 hover:text-white'
                } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => setShowConverter(!showConverter)}
              className="w-full text-white/70 hover:bg-secondary/50 hover:text-white group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200"
            >
              <Currency className="h-5 w-5" />
              <span className="ml-3">Currency Converter</span>
            </button>
          </nav>
          <div className="flex-shrink-0 flex border-t border-white/5 p-4">
            {isAuthenticated ? (
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-secondary rounded-full p-1">
                    <User className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-white/70 truncate max-w-[120px]">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center justify-center w-full px-4 py-2 bg-primary/70 hover:bg-primary rounded-md text-white transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-background px-4 md:hidden">
        <Link to="/" className="flex items-center space-x-2">
          <Bitcoin className="h-8 w-8 text-primary" />
          <span className="text-xl font-medium">CryptoTrack</span>
        </Link>
        
        <div className="flex flex-1 justify-end">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-white/70">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass border-r border-white/5 p-0">
              <div className="flex h-16 shrink-0 items-center px-6">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Bitcoin className="h-8 w-8 text-primary" />
                  <span className="text-xl font-medium">CryptoTrack</span>
                </Link>
              </div>
              <nav className="flex flex-col px-6 py-6 gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActivePath(item.href)
                        ? 'bg-secondary text-white'
                        : 'text-white/70 hover:bg-secondary/50 hover:text-white'
                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setShowConverter(!showConverter);
                    setIsOpen(false);
                  }}
                  className="text-white/70 hover:bg-secondary/50 hover:text-white group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200"
                >
                  <Currency className="h-5 w-5" />
                  <span className="ml-3">Currency Converter</span>
                </button>
                {isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    className="mt-4 justify-start text-white/70" 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Link
                    to="/login"
                    className="mt-4 flex items-center px-3 py-3 text-sm font-medium rounded-md bg-primary/70 hover:bg-primary text-white transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Currency Converter Dialog */}
      {showConverter && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowConverter(false)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CurrencyConverter />
            <div className="flex justify-center mt-4">
              <Button variant="secondary" onClick={() => setShowConverter(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="py-6 px-4 sm:px-6 md:px-8 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

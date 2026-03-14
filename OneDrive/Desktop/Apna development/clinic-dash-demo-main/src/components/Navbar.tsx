import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Menu, X, Heart, Moon, Sun, CreditCard, LogIn, LogOut, FileText, ClipboardList, MessageSquare, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
// Visiting Card Image Import
import visitingCardImage from '@/assets/visiting-card.png';
// Notification Bell Component
import NotificationBell from '@/components/NotificationBell';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Visiting Card Modal State
  const [showVisitingCard, setShowVisitingCard] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const { isAuthenticated, isOtpVerified, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Chat' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/consultation-request', label: 'Consult/Consultation' },
    { to: '/settings', label: 'Settings' },
  ];

  // Protected links shown only after full verification
  const protectedLinks = (isAuthenticated && isOtpVerified) ? [
    { to: '/medical-profile', label: 'My Profile', icon: User },
    { to: '/medical-form', label: 'Update Health', icon: ClipboardList },
    { to: '/medical-search', label: 'Medical Search', icon: Search },
    { to: '/my-consultations', label: 'My Consultations', icon: MessageSquare },
    { to: '/my-reports', label: 'My Reports', icon: FileText },
  ] : [];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-soft group-hover:shadow-hover transition-all duration-300">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Medi<span className="text-primary">Care</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {[...navLinks, ...protectedLinks].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.to)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons & Logout */}
            <div className="flex items-center gap-2">
              {/* Desktop Auth Button */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="rounded-lg gap-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-lg gap-2 text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>

              {/* Notification Bell */}
              <NotificationBell />

              {/* Visiting Card Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVisitingCard(!showVisitingCard)}
                className="rounded-lg gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex"
              >
                <CreditCard className="h-4 w-4" />
                <span>Visiting Card</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                className="rounded-lg"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
              }`}
          >
            <div className="flex flex-col gap-1 pt-2">
              {[...navLinks, ...protectedLinks].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.to)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 pt-2 border-t border-border/50">
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start rounded-lg gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="w-full justify-start rounded-lg gap-3 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Visiting Card Modal - Rendered via Portal outside nav */}
      <VisitingCardModal
        isOpen={showVisitingCard}
        onClose={() => setShowVisitingCard(false)}
      />
    </>
  );
};

/* Visiting Card Modal Component - Fixed Centering */
const VisitingCardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm shadow-2xl"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      {/* Visiting Card Container - Relative positioned, flexbox centered */}
      <div
        className="relative w-[90%] max-w-[420px] animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={visitingCardImage}
          alt="Visiting Card - Rishi Dange"
          className="w-full h-auto rounded-xl shadow-2xl border border-white/10"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors border border-border"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Navbar;

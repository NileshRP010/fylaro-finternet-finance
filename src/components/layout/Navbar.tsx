import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Wallet,
  Menu,
  Search,
  Sun,
  Moon,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useWallet } from "@/hooks/useWallet";
import { useLanguage } from "@/contexts/LanguageContext";
import arbitrumIcon from "/logos/logo-symbol.svg";
import arbitrumSepoliaIcon from "/logos/logo-symbol.svg";
import { WalletConnectModal } from "@/components/features/WalletConnectModal";
import SearchModal from "@/components/features/SearchModal";
import LanguageSelector from "@/components/features/LanguageSelector";
import NotificationsPopover from "@/components/features/NotificationsPopover";
import { toast } from "sonner";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { 
    isConnected, 
    address, 
    isConnecting, 
    disconnectWallet, 
    formatAddress,
    isOnArbitrum,
    isOnArbitrumSepolia,
    currentNetwork,
    switchToArbitrum,
    switchToArbitrumSepolia
  } = useWallet();

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-smooth">
              <img src="/src/assets/fylaro-logo-icon.png" alt="Fylaro Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-foreground">Fylaro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/marketplace" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('navbar.marketplace')}
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('navbar.dashboard')}
            </Link>
            <Link to="/portfolio" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('navbar.portfolio')}
            </Link>
            <Link to="/trading" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('navbar.trading')}
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex navbar-button"
              onClick={() => setIsSearchModalOpen(true)}
              title="Search (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="navbar-button"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            <NotificationsPopover />

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10">
                      <img 
                        src={isOnArbitrum ? arbitrumIcon : arbitrumSepoliaIcon} 
                        alt="Network" 
                        className="w-5 h-5 mr-2" 
                      />
                      {currentNetwork}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem 
                      className="flex items-center space-x-2 cursor-pointer" 
                      onClick={switchToArbitrum}
                    >
                      <img src={arbitrumIcon} alt="Arbitrum" className="w-5 h-5" />
                      <span>Arbitrum</span>
                      {isOnArbitrum && <span className="ml-auto text-xs text-green-500">Connected</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={switchToArbitrumSepolia}
                    >
                      <img src={arbitrumSepoliaIcon} alt="Arbitrum Sepolia" className="w-5 h-5" />
                      <span>Arbitrum Sepolia</span>
                      {isOnArbitrumSepolia && <span className="ml-auto text-xs text-green-500">Connected</span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  className="border-primary/30 text-foreground hover:bg-primary/10"
                  onClick={disconnectWallet}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {formatAddress(address)}
                </Button>
              </div>
            ) : (
              <Button 
                className="glow"
                onClick={() => setIsWalletModalOpen(true)}
                disabled={isConnecting}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? t('navbar.connecting') : t('navbar.connectWallet')}
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="lg:hidden navbar-button">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
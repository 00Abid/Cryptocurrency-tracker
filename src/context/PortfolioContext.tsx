
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface PortfolioItem {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface PortfolioContextType {
  portfolio: PortfolioItem[];
  addToPortfolio: (item: Omit<PortfolioItem, 'id'>) => void;
  removeFromPortfolio: (id: string) => void;
  updatePortfolioItem: (id: string, updates: Partial<Omit<PortfolioItem, 'id'>>) => void;
  getTotalValue: (currentPrices: Record<string, number>) => number;
  getTotalInvestment: () => number;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Load portfolio from localStorage if user is authenticated
    if (isAuthenticated) {
      const savedPortfolio = localStorage.getItem('portfolio');
      if (savedPortfolio) {
        try {
          setPortfolio(JSON.parse(savedPortfolio));
        } catch (error) {
          console.error('Failed to parse saved portfolio', error);
        }
      }
    } else {
      // Clear portfolio if user is not authenticated
      setPortfolio([]);
    }
  }, [isAuthenticated]);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && portfolio.length > 0) {
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }
  }, [portfolio, isAuthenticated]);

  const addToPortfolio = (item: Omit<PortfolioItem, 'id'>) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage your portfolio');
      return;
    }
    
    const newItem: PortfolioItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    
    setPortfolio(prev => [...prev, newItem]);
    toast.success(`Added ${item.amount} ${item.symbol.toUpperCase()} to your portfolio`);
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from portfolio');
  };

  const updatePortfolioItem = (id: string, updates: Partial<Omit<PortfolioItem, 'id'>>) => {
    setPortfolio(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    toast.success('Portfolio updated');
  };

  const getTotalValue = (currentPrices: Record<string, number>): number => {
    return portfolio.reduce((total, item) => {
      const currentPrice = currentPrices[item.coinId] || 0;
      return total + (item.amount * currentPrice);
    }, 0);
  };

  const getTotalInvestment = (): number => {
    return portfolio.reduce((total, item) => {
      return total + (item.amount * item.purchasePrice);
    }, 0);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addToPortfolio,
        removeFromPortfolio,
        updatePortfolioItem,
        getTotalValue,
        getTotalInvestment
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

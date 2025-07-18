
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePortfolio, PortfolioItem } from '@/context/PortfolioContext';
import { getTopCoins, formatCurrency, formatNumber } from '@/lib/api';
import Layout from '@/components/Layout';
import PortfolioSummary from '@/components/PortfolioSummary';
import PriceChart from '@/components/PriceChart';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Trash } from 'lucide-react';

const Portfolio = () => {
  const { isAuthenticated } = useAuth();
  const { portfolio, removeFromPortfolio } = usePortfolio();
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  
  const { data: marketData } = useQuery({
    queryKey: ['marketData'],
    queryFn: () => getTopCoins(100),
    enabled: isAuthenticated,
  });
  
  useEffect(() => {
    if (marketData) {
      const priceMap: Record<string, number> = {};
      marketData.forEach((coin: any) => {
        priceMap[coin.id] = coin.current_price;
      });
      setCurrentPrices(priceMap);
    }
  }, [marketData]);
  
  // Generate chart data for portfolio value over time (mock data for demo)
  const generateMockPortfolioHistory = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create a slightly random increase/decrease pattern
      const randomFactor = 0.98 + Math.random() * 0.04; // 0.98 to 1.02
      const baseValue = 10000 * (1 + (30 - i) * 0.01); // Slight uptrend over time
      
      data.push({
        timestamp: date.getTime(),
        price: baseValue * randomFactor,
      });
    }
    
    return data;
  };
  
  const portfolioHistory = generateMockPortfolioHistory();
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Portfolio Tracking</h1>
          <p className="text-white/70 mb-6">
            Please sign in to view and manage your cryptocurrency portfolio
          </p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
        
        {portfolio.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h2 className="text-xl font-medium mb-2">Your portfolio is empty</h2>
              <p className="text-white/70 mb-6">
                Start by adding cryptocurrencies to track your investments
              </p>
              <Link to="/">
                <Button>Browse Cryptocurrencies</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <PortfolioSummary currentPrices={currentPrices} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <PriceChart 
                  data={portfolioHistory}
                  coinName="Portfolio Value"
                  timeframe="30d"
                  color="#4f46e5"
                />
              </div>
              
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>
                    Distribution of your investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.map((item) => {
                      const currentPrice = currentPrices[item.coinId] || 0;
                      const currentValue = item.amount * currentPrice;
                      const totalValue = portfolio.reduce((sum, p) => {
                        return sum + (p.amount * (currentPrices[p.coinId] || 0));
                      }, 0);
                      
                      const percentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-2">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm">{percentage.toFixed(1)}%</div>
                            </div>
                            <div className="bg-secondary/50 h-2 rounded overflow-hidden">
                              <div 
                                className="bg-primary h-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Portfolio Holdings</CardTitle>
                <CardDescription>
                  Detailed view of your cryptocurrency investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Purchase Price</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead>Profit/Loss</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolio.map((item: PortfolioItem) => {
                        const currentPrice = currentPrices[item.coinId] || 0;
                        const totalInvestment = item.amount * item.purchasePrice;
                        const currentValue = item.amount * currentPrice;
                        const profitLoss = currentValue - totalInvestment;
                        const profitLossPercentage = totalInvestment > 0 
                          ? (profitLoss / totalInvestment) * 100 
                          : 0;
                        const isProfitable = profitLoss >= 0;
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-6 h-6 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">
                                    <Link to={`/coin/${item.coinId}`} className="hover:text-primary">
                                      {item.name}
                                    </Link>
                                  </div>
                                  <div className="text-xs text-white/60 uppercase">{item.symbol}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatNumber(item.amount)}</TableCell>
                            <TableCell>{formatCurrency(item.purchasePrice)}</TableCell>
                            <TableCell>{formatCurrency(currentPrice)}</TableCell>
                            <TableCell>{formatCurrency(currentValue)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className={isProfitable ? 'text-green-400' : 'text-red-400'}>
                                  {formatCurrency(profitLoss)}
                                </span>
                                <div className="flex items-center text-xs">
                                  {isProfitable ? (
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-1 text-red-400" />
                                  )}
                                  <span className={isProfitable ? 'text-green-400' : 'text-red-400'}>
                                    {Math.abs(profitLossPercentage).toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeFromPortfolio(item.id)}
                              >
                                <Trash className="h-4 w-4 text-white/70" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Portfolio;

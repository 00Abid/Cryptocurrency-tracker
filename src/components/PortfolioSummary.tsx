
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { usePortfolio } from '@/context/PortfolioContext';
import { formatCurrency } from '@/lib/api';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioSummaryProps {
  currentPrices: Record<string, number>;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ currentPrices }) => {
  const { portfolio, getTotalValue, getTotalInvestment } = usePortfolio();
  
  const totalValue = getTotalValue(currentPrices);
  const totalInvestment = getTotalInvestment();
  const profitLoss = totalValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0 
    ? (profitLoss / totalInvestment) * 100 
    : 0;
  
  const isProfitable = profitLoss >= 0;
  
  if (portfolio.length === 0) {
    return null;
  }
  
  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription>
          Overview of your crypto investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Total Value</span>
            <span className="text-2xl font-semibold mt-1">{formatCurrency(totalValue)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Total Investment</span>
            <span className="text-2xl font-semibold mt-1">{formatCurrency(totalInvestment)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Profit/Loss</span>
            <div className="flex items-baseline mt-1">
              <span className={`text-2xl font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(profitLoss)}
              </span>
              <div className={`flex items-center ml-2 ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {isProfitable ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">{Math.abs(profitLossPercentage).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;

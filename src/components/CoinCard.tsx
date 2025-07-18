
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/api';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoinCardProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image: string;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
  };
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const isPriceUp = coin.price_change_percentage_24h >= 0;

  return (
    <Link to={`/coin/${coin.id}`}>
      <Card className="glass-card h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] border-white/10">
        <div className="flex flex-col p-4">
          <div className="flex items-center mb-3">
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="w-8 h-8 mr-3 rounded-full"
              loading="lazy"
            />
            <div className="flex flex-col">
              <div className="font-medium">{coin.name}</div>
              <div className="text-sm text-white/60 uppercase">{coin.symbol}</div>
            </div>
          </div>
          
          <div className="mt-1">
            <div className="text-xl font-semibold">{formatCurrency(coin.current_price)}</div>
            <div className={`flex items-center text-sm mt-1 ${
              isPriceUp ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPriceUp ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div>
              <div className="text-white/60">Market Cap</div>
              <div className="font-medium">{formatNumber(coin.market_cap)}</div>
            </div>
            <div>
              <div className="text-white/60">Volume (24h)</div>
              <div className="font-medium">{formatNumber(coin.total_volume)}</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CoinCard;

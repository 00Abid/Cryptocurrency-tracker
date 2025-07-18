
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCoinDetails, getCoinHistory, formatCurrency, formatNumber } from '@/lib/api';
import Layout from '@/components/Layout';
import PriceChart from '@/components/PriceChart';
import { usePortfolio } from '@/context/PortfolioContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

const CoinDetail = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const { isAuthenticated } = useAuth();
  const { addToPortfolio } = usePortfolio();
  const [amount, setAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: coin, isLoading: coinLoading } = useQuery({
    queryKey: ['coinDetail', coinId],
    queryFn: () => getCoinDetails(coinId as string),
    enabled: !!coinId,
  });
  
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['coinHistory', coinId],
    queryFn: () => getCoinHistory(coinId as string, 7),
    enabled: !!coinId,
  });
  
  const handleAddToPortfolio = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }
    
    addToPortfolio({
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image.small,
      amount: Number(amount),
      purchasePrice: coin.market_data.current_price.usd,
      purchaseDate: new Date().toISOString(),
    });
    
    setAmount('');
    setIsDialogOpen(false);
  };
  
  const chartData = React.useMemo(() => {
    if (!history || !history.prices) return [];
    
    return history.prices.map((price: [number, number]) => ({
      timestamp: price[0],
      price: price[1],
    }));
  }, [history]);
  
  const isPriceUp = coin?.market_data?.price_change_percentage_24h >= 0;
  
  if (coinLoading || historyLoading) {
    return (
      <Layout>
        <div className="mb-6 flex items-center">
          <Link to="/" className="flex items-center text-white/70 hover:text-white transition-colors mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </Layout>
    );
  }
  
  if (!coin) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Coin not found</h2>
          <p className="mb-6">The cryptocurrency you're looking for doesn't exist or couldn't be loaded.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white/70 hover:text-white transition-colors mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <div className="flex items-center">
              <img 
                src={coin.image.small} 
                alt={coin.name} 
                className="w-8 h-8 mr-3"
              />
              <h1 className="text-2xl font-bold">{coin.name}</h1>
              <span className="ml-2 text-white/60 text-lg uppercase">{coin.symbol}</span>
            </div>
          </div>
          
          {isAuthenticated && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add to Portfolio</Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle>Add {coin.name} to Portfolio</DialogTitle>
                  <DialogDescription>
                    Enter the amount of {coin.symbol.toUpperCase()} you want to add to your portfolio.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Current Price:</span>
                      <span className="font-medium">{formatCurrency(coin.market_data.current_price.usd)}</span>
                    </div>
                    <Input
                      type="number"
                      placeholder={`Amount of ${coin.symbol.toUpperCase()}`}
                      min="0"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-secondary/50"
                    />
                    {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                      <div className="flex items-center justify-between mt-2">
                        <span>Total Value:</span>
                        <span className="font-medium">
                          {formatCurrency(Number(amount) * coin.market_data.current_price.usd)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleAddToPortfolio}
                    disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
                  >
                    Add to Portfolio
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {chartData.length > 0 && (
              <PriceChart 
                data={chartData} 
                coinName={coin.name} 
                timeframe="7d" 
                color="dynamic" 
              />
            )}
          </div>
          
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Price Information</CardTitle>
              <CardDescription>
                Current market data for {coin.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-white/60 text-sm">Current Price</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(coin.market_data.current_price.usd)}
                  </div>
                  <div className={`flex items-center text-sm mt-1 ${
                    isPriceUp ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPriceUp ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">Market Cap</div>
                    <div className="font-medium">
                      {formatNumber(coin.market_data.market_cap.usd)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Volume (24h)</div>
                    <div className="font-medium">
                      {formatNumber(coin.market_data.total_volume.usd)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">24h High</div>
                    <div className="font-medium">
                      {formatCurrency(coin.market_data.high_24h.usd)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">24h Low</div>
                    <div className="font-medium">
                      {formatCurrency(coin.market_data.low_24h.usd)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">All-Time High</div>
                    <div className="font-medium">
                      {formatCurrency(coin.market_data.ath.usd)}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">All-Time Low</div>
                    <div className="font-medium">
                      {formatCurrency(coin.market_data.atl.usd)}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>About {coin.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-sm prose prose-invert max-w-none opacity-80 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: coin.description.en.split('. ').slice(0, 4).join('. ') + '.' 
                }}
              />
            </CardContent>
            <CardFooter>
              <a 
                href={coin.links.homepage[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Official Website
              </a>
            </CardFooter>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Market Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">Market Cap Rank</div>
                    <div className="font-medium">#{coin.market_cap_rank}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Price Change (7d)</div>
                    <div className={`font-medium ${
                      coin.market_data.price_change_percentage_7d >= 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {coin.market_data.price_change_percentage_7d.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Price Change (30d)</div>
                    <div className={`font-medium ${
                      coin.market_data.price_change_percentage_30d >= 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {coin.market_data.price_change_percentage_30d.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Price Change (1y)</div>
                    <div className={`font-medium ${
                      coin.market_data.price_change_percentage_1y >= 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {coin.market_data.price_change_percentage_1y?.toFixed(2) || 'N/A'}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-white/60 text-sm mb-1">Circulating Supply</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {formatNumber(coin.market_data.circulating_supply)} {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-sm">
                      {coin.market_data.max_supply 
                        ? `${((coin.market_data.circulating_supply / coin.market_data.max_supply) * 100).toFixed(2)}% of max supply`
                        : 'No max supply'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CoinDetail;

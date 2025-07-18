
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopCoins } from '@/lib/api';
import Layout from '@/components/Layout';
import CoinCard from '@/components/CoinCard';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: coins, isLoading, error } = useQuery({
    queryKey: ['topCoins'],
    queryFn: () => getTopCoins(100),
  });
  
  const [filteredCoins, setFilteredCoins] = useState(coins || []);
  
  useEffect(() => {
    if (coins) {
      if (searchTerm.trim() === '') {
        setFilteredCoins(coins);
      } else {
        const filtered = coins.filter(
          (coin: any) =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCoins(filtered);
      }
    }
  }, [coins, searchTerm]);
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Cryptocurrency Dashboard</h1>
        
        <Card className="mb-8 glass-card border-white/10">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>
              Track prices and market data for the top cryptocurrencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                className="pl-10 bg-secondary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="glass-card border-white/10">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 mt-2" />
                      <Skeleton className="h-4 w-16" />
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Skeleton className="h-3 w-16 mb-1" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <div>
                          <Skeleton className="h-3 w-16 mb-1" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400">Failed to load cryptocurrency data</p>
                <p className="text-sm text-white/70 mt-2">
                  Please try again later or check your internet connection
                </p>
              </div>
            ) : filteredCoins.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg">No coins found matching "{searchTerm}"</p>
                <p className="text-sm text-white/70 mt-2">
                  Try a different search term or check out the top coins
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCoins.map((coin: any) => (
                  <div key={coin.id} className="animate-slide-in">
                    <CoinCard coin={coin} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;

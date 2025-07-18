
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, Search, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatNumber } from '@/lib/api';

// Sample bookmarked coins data
const initialBookmarks = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 52367.89, change24h: 2.5, marketCap: 995432456789 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2812.45, change24h: -1.2, marketCap: 337560987000 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 147.83, change24h: 5.7, marketCap: 63457890000 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.54, change24h: 0.8, marketCap: 19230450000 },
];

const BookmarkedCoins = () => {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(coin => coin.id !== id));
    toast({
      title: "Bookmark Removed",
      description: "The coin has been removed from your bookmarks"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Your Bookmarked Coins</h2>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
      </div>

      <Card className="glass-card border-white/10 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookmarks.length > 0 ? (
                filteredBookmarks.map(coin => (
                  <TableRow key={coin.id} className="hover:bg-secondary/20">
                    <TableCell className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(coin.price)}</TableCell>
                    <TableCell>
                      <span className={coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatNumber(coin.marketCap)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveBookmark(coin.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Bookmark className="h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">No bookmarked coins found</p>
                      <p className="text-sm text-muted-foreground/70">
                        {searchTerm ? "Try a different search term" : "Add coins to your bookmarks from the main page"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookmarkedCoins;

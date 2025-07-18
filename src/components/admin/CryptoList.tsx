
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Star, Edit, Trash2, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialCryptos = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', featured: true },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', featured: true },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', featured: false },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', featured: true },
  { id: 'solana', name: 'Solana', symbol: 'SOL', featured: true },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', featured: false },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', featured: false },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', featured: false },
];

const CryptoList = () => {
  const [cryptos, setCryptos] = useState(initialCryptos);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCrypto, setEditingCrypto] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSymbol, setEditSymbol] = useState('');
  const { toast } = useToast();

  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleFeatured = (id: string) => {
    setCryptos(cryptos.map(crypto => 
      crypto.id === id ? { ...crypto, featured: !crypto.featured } : crypto
    ));
    
    const targetCrypto = cryptos.find(crypto => crypto.id === id);
    const newStatus = !targetCrypto?.featured;
    
    toast({
      title: `${targetCrypto?.name} Updated`,
      description: newStatus 
        ? "Added to featured cryptocurrencies" 
        : "Removed from featured cryptocurrencies",
    });
  };

  const handleEdit = (crypto: typeof cryptos[0]) => {
    setEditingCrypto(crypto.id);
    setEditName(crypto.name);
    setEditSymbol(crypto.symbol);
  };

  const handleSaveEdit = (id: string) => {
    setCryptos(cryptos.map(crypto => 
      crypto.id === id 
        ? { ...crypto, name: editName, symbol: editSymbol } 
        : crypto
    ));
    setEditingCrypto(null);
    toast({
      title: "Cryptocurrency Updated",
      description: "The cryptocurrency has been updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingCrypto(null);
  };

  const handleDelete = (id: string) => {
    setCryptos(cryptos.filter(crypto => crypto.id !== id));
    toast({
      title: "Cryptocurrency Removed",
      description: "The cryptocurrency has been removed from the list",
    });
  };

  const handleAddCrypto = () => {
    const newId = `crypto-${Date.now()}`;
    const newCrypto = {
      id: newId,
      name: 'New Cryptocurrency',
      symbol: 'XXX',
      featured: false
    };
    
    setCryptos([...cryptos, newCrypto]);
    setEditingCrypto(newId);
    setEditName(newCrypto.name);
    setEditSymbol(newCrypto.symbol);
    
    toast({
      title: "New Cryptocurrency Added",
      description: "Please edit the details of the new cryptocurrency",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-secondary/50"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleAddCrypto} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Cryptocurrency
        </Button>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCryptos.length > 0 ? (
              filteredCryptos.map(crypto => (
                <TableRow key={crypto.id} className="hover:bg-secondary/20">
                  <TableCell>
                    {editingCrypto === crypto.id ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-secondary/50" />
                    ) : (
                      crypto.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCrypto === crypto.id ? (
                      <Input value={editSymbol} onChange={(e) => setEditSymbol(e.target.value)} className="bg-secondary/50" />
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-secondary/30">{crypto.symbol}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(crypto.id)}
                      className={`px-2 py-1 rounded ${crypto.featured ? 'text-amber-400' : 'text-white/50'}`}
                    >
                      <Star className={`h-5 w-5 ${crypto.featured ? 'fill-amber-400' : ''}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {editingCrypto === crypto.id ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(crypto.id)}>
                          <Check className="h-4 w-4 text-green-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 text-red-400" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(crypto)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(crypto.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No cryptocurrencies found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CryptoList;

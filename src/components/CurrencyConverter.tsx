import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, RefreshCw } from 'lucide-react';

// Sample exchange rates (in a real app, these would come from an API)
const exchangeRates = {
  BTC: { USD: 60000, EUR: 55000, GBP: 48000, JPY: 6500000, INR: 5000000 },
  ETH: { USD: 3000, EUR: 2750, GBP: 2400, JPY: 325000, INR: 250000 },
  ADA: { USD: 1.2, EUR: 1.1, GBP: 0.95, JPY: 130, INR: 100 },
  SOL: { USD: 120, EUR: 110, GBP: 95, JPY: 13000, INR: 10000 },
  DOT: { USD: 20, EUR: 18, GBP: 16, JPY: 2200, INR: 1700 },
  DOGE: { USD: 0.12, EUR: 0.11, GBP: 0.09, JPY: 13, INR: 10 },
};

const cryptos = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'DOGE'];
const fiats = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API request
    setTimeout(() => {
      try {
        let convertedAmount = 0;
        const numericAmount = parseFloat(amount);

        // Check if converting from crypto to fiat
        if (cryptos.includes(fromCurrency) && fiats.includes(toCurrency)) {
          convertedAmount = numericAmount * exchangeRates[fromCurrency as keyof typeof exchangeRates][toCurrency as keyof typeof exchangeRates['BTC']];
        } 
        // Converting from fiat to crypto
        else if (fiats.includes(fromCurrency) && cryptos.includes(toCurrency)) {
          const rate = exchangeRates[toCurrency as keyof typeof exchangeRates][fromCurrency as keyof typeof exchangeRates['BTC']];
          convertedAmount = numericAmount / rate;
        }
        // Crypto to crypto conversion
        else if (cryptos.includes(fromCurrency) && cryptos.includes(toCurrency)) {
          const fromInUSD = numericAmount * exchangeRates[fromCurrency as keyof typeof exchangeRates].USD;
          convertedAmount = fromInUSD / exchangeRates[toCurrency as keyof typeof exchangeRates].USD;
        }
        // Fiat to fiat conversion (using USD as intermediary)
        else {
          const fromRate = exchangeRates.BTC[fromCurrency as keyof typeof exchangeRates['BTC']];
          const toRate = exchangeRates.BTC[toCurrency as keyof typeof exchangeRates['BTC']];
          convertedAmount = numericAmount * (toRate / fromRate);
        }

        // Format result based on the type of currency
        let formattedResult;
        if (fiats.includes(toCurrency)) {
          formattedResult = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: toCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(convertedAmount);
        } else {
          // For crypto, show more decimal places
          formattedResult = `${convertedAmount.toFixed(8)} ${toCurrency}`;
        }

        setResult(formattedResult);
        setIsLoading(false);
      } catch (error) {
        console.error('Conversion error:', error);
        toast({
          title: "Conversion Error",
          description: "An error occurred during conversion. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 800);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // Clear the result when currencies are swapped
    setResult('');
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>
          Convert between cryptocurrencies and fiat currencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-sm font-medium mb-2 block text-white/70">Amount</label>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="bg-secondary/50"
                placeholder="Enter amount"
              />
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label className="text-sm font-medium mb-2 block text-white/70">From</label>
              <select
                className="w-full p-2 rounded-md bg-secondary/50 border border-white/10"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                <optgroup label="Cryptocurrencies">
                  {cryptos.map(crypto => (
                    <option key={`from-${crypto}`} value={crypto}>{crypto}</option>
                  ))}
                </optgroup>
                <optgroup label="Fiat Currencies">
                  {fiats.map(fiat => (
                    <option key={`from-${fiat}`} value={fiat}>{fiat}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label className="text-sm font-medium mb-2 block text-white/70">To</label>
              <select
                className="w-full p-2 rounded-md bg-secondary/50 border border-white/10"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                <optgroup label="Cryptocurrencies">
                  {cryptos.map(crypto => (
                    <option key={`to-${crypto}`} value={crypto}>{crypto}</option>
                  ))}
                </optgroup>
                <optgroup label="Fiat Currencies">
                  {fiats.map(fiat => (
                    <option key={`to-${fiat}`} value={fiat}>{fiat}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          
          <div className="flex justify-center my-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSwapCurrencies}
              className="rounded-full p-2"
            >
              <ArrowRight className="h-5 w-5 rotate-90" />
            </Button>
          </div>
          
          <Button 
            onClick={convertCurrency} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                Converting...
              </>
            ) : (
              'Convert'
            )}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
              <p className="text-sm text-white/70">Converted Amount</p>
              <p className="text-xl font-semibold mt-1">{result}</p>
              <p className="text-xs text-white/50 mt-2">
                Exchange rates are for demonstration purposes
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

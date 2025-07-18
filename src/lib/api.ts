
// Base URL for CoinGecko API
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetch top cryptocurrencies
export async function getTopCoins(limit = 50) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h,7d`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch top coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw error;
  }
}

// Search for cryptocurrencies
export async function searchCoins(query: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
}

// Get detailed information for a specific coin
export async function getCoinDetails(coinId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${coinId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    throw error;
  }
}

// Get historical price data for a coin
export async function getCoinHistory(coinId: string, days = 7) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history for ${coinId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    throw error;
  }
}

// Get exchange rates between cryptocurrencies and fiat currencies
export async function getExchangeRates() {
  try {
    const response = await fetch(`${API_BASE_URL}/exchange_rates`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

// Get cryptocurrency news (in a real app, this would connect to a news API)
export async function getCryptoNews() {
  try {
    // This is a placeholder - in a real app, this would fetch from a news API
    // Simulating an API response with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          articles: [
            // Sample articles would be returned here
          ]
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    throw error;
  }
}

// Get system performance metrics (for admin dashboard)
export async function getSystemMetrics() {
  try {
    // This is a placeholder - in a real app, this would fetch from a backend API
    // Simulating an API response with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          cpu: 42,
          memory: 58,
          requests: 2400,
          database: 128
        });
      }, 800);
    });
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    throw error;
  }
}

// Format large numbers in a readable way
export function formatNumber(num: number): string {
  if (num === null || num === undefined) return 'N/A';
  
  if (num === 0) return '0';
  
  if (Math.abs(num) < 1) {
    return num.toFixed(6).replace(/\.?0+$/, '');
  }
  
  if (Math.abs(num) < 1000) {
    return num.toFixed(2).replace(/\.?0+$/, '');
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2
  });
  
  return formatter.format(num);
}

// Format currency with proper symbols
export function formatCurrency(amount: number, currency = 'USD'): string {
  const currencyOptions: {[key: string]: {currency: string, locale: string}} = {
    USD: { currency: 'USD', locale: 'en-US' },
    EUR: { currency: 'EUR', locale: 'de-DE' },
    GBP: { currency: 'GBP', locale: 'en-GB' },
    JPY: { currency: 'JPY', locale: 'ja-JP' },
    INR: { currency: 'INR', locale: 'en-IN' }
  };

  const options = currencyOptions[currency] || currencyOptions.USD;
  
  return new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currency,
    minimumFractionDigits: amount >= 1 ? 2 : 6,
    maximumFractionDigits: amount >= 1 ? 2 : 6,
  }).format(amount);
}

// Calculate percentage change between two values
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Convert between cryptocurrencies and fiat currencies
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, rates: any): number {
  // Implementation would depend on the structure of the rates object
  // This is a placeholder
  return amount * 1.5;
}

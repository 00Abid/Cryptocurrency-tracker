
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import NewsCard, { NewsItem } from '@/components/NewsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Newspaper, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Sample news data (in a real app, this would come from an API)
const sampleNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin Surges Past $60,000 Amid Growing Institutional Adoption',
    url: 'https://example.com/bitcoin-surges',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop',
    source: 'CryptoNews',
    publishedAt: '2023-04-02T14:30:00Z',
    summary: 'Bitcoin has broken through the $60,000 mark once again as institutional investors continue to show interest in the cryptocurrency market.'
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Upgrade Set to Launch Next Month, Promising Improved Scalability',
    url: 'https://example.com/ethereum-upgrade',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop',
    source: 'BlockchainInsider',
    publishedAt: '2023-04-01T09:15:00Z',
    summary: 'The much-anticipated Ethereum 2.0 upgrade is scheduled for release next month, promising significant improvements in network scalability and energy efficiency.'
  },
  {
    id: '3',
    title: 'Regulatory Clarity Coming for Crypto Industry as New Framework Proposed',
    url: 'https://example.com/crypto-regulations',
    imageUrl: 'https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?w=800&auto=format&fit=crop',
    source: 'CryptoDaily',
    publishedAt: '2023-03-30T16:45:00Z',
    summary: 'A new regulatory framework for cryptocurrencies has been proposed by lawmakers, potentially bringing much-needed clarity to the evolving industry.'
  },
  {
    id: '4',
    title: 'NFT Market Rebounds as New Collections Break Sales Records',
    url: 'https://example.com/nft-rebound',
    imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&auto=format&fit=crop',
    source: 'NFTWorld',
    publishedAt: '2023-03-29T11:20:00Z',
    summary: 'The NFT market is showing signs of recovery after a period of declining interest, with several new collections breaking sales records in recent weeks.'
  },
  {
    id: '5',
    title: 'DeFi Protocols Reach New Milestone with $100 Billion in Total Value Locked',
    url: 'https://example.com/defi-milestone',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop',
    source: 'DeFiPulse',
    publishedAt: '2023-03-28T08:10:00Z',
    summary: 'Decentralized finance protocols have collectively reached a new milestone, with the total value locked in DeFi platforms exceeding $100 billion for the first time.'
  },
  {
    id: '6',
    title: 'Major Bank Announces Cryptocurrency Custody Service for Institutional Clients',
    url: 'https://example.com/bank-custody',
    imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&auto=format&fit=crop',
    source: 'FinancialTimes',
    publishedAt: '2023-03-27T14:50:00Z',
    summary: 'A major global bank has announced the launch of a cryptocurrency custody service tailored for institutional clients, marking another step in the mainstream adoption of digital assets.'
  },
];

// Mock fetching news function (in a real app, this would be an API call)
const fetchNews = async (): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return sampleNewsData;
};

const fetchTrendingNews = async (): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return a subset of the sample data as "trending"
  return sampleNewsData.slice(0, 3);
};

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: allNews, isLoading: allNewsLoading } = useQuery({
    queryKey: ['cryptoNews', 'all'],
    queryFn: fetchNews,
  });
  
  const { data: trendingNews, isLoading: trendingNewsLoading } = useQuery({
    queryKey: ['cryptoNews', 'trending'],
    queryFn: fetchTrendingNews,
  });
  
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  
  useEffect(() => {
    if (activeTab === 'all' && allNews) {
      if (searchTerm.trim() === '') {
        setFilteredNews(allNews);
      } else {
        const filtered = allNews.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.source.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNews(filtered);
      }
    } else if (activeTab === 'trending' && trendingNews) {
      if (searchTerm.trim() === '') {
        setFilteredNews(trendingNews);
      } else {
        const filtered = trendingNews.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.source.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNews(filtered);
      }
    }
  }, [searchTerm, activeTab, allNews, trendingNews]);
  
  const isLoading = (activeTab === 'all' && allNewsLoading) || 
                     (activeTab === 'trending' && trendingNewsLoading);
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Cryptocurrency News</h1>
        
        <Card className="mb-8 glass-card border-white/10">
          <CardHeader>
            <CardTitle>Latest News</CardTitle>
            <CardDescription>
              Stay updated with the latest cryptocurrency news and developments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  className="pl-10 bg-secondary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    All News
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="glass-card border-white/10">
                          <div className="p-0">
                            <Skeleton className="h-48 w-full rounded-t-lg" />
                            <div className="p-4 space-y-3">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : filteredNews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-lg">No news found matching "{searchTerm}"</p>
                      <p className="text-sm text-white/70 mt-2">
                        Try a different search term or check out trending news
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNews.map((news) => (
                        <div key={news.id} className="animate-slide-in">
                          <NewsCard news={news} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="trending">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="glass-card border-white/10">
                          <div className="p-0">
                            <Skeleton className="h-48 w-full rounded-t-lg" />
                            <div className="p-4 space-y-3">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : filteredNews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-lg">No trending news found matching "{searchTerm}"</p>
                      <p className="text-sm text-white/70 mt-2">
                        Try a different search term or check out all news
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNews.map((news) => (
                        <div key={news.id} className="animate-slide-in">
                          <NewsCard news={news} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default News;

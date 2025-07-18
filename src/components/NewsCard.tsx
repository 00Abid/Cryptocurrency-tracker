
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ExternalLink } from 'lucide-react';
import { formatDistance } from 'date-fns';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  summary: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  // Calculate relative time from publication date
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <Card className="glass-card border-white/10 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-xs font-medium px-2 py-1 rounded bg-white/20 backdrop-blur-sm">
            {news.source}
          </span>
        </div>
      </div>
      
      <CardHeader className="py-4 px-4">
        <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="px-4 py-0 flex-grow">
        <p className="text-sm text-white/70 line-clamp-3 mb-4">
          {news.summary}
        </p>
      </CardContent>
      
      <div className="p-4 mt-auto border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center text-xs text-white/60">
          <Calendar className="h-3 w-3 mr-1" />
          {getRelativeTime(news.publishedAt)}
        </div>
        <a 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary text-xs flex items-center hover:underline"
        >
          Read more <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </Card>
  );
};

export default NewsCard;

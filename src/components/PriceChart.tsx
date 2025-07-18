
import React from 'react';
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceChartProps {
  data: Array<{ timestamp: number; price: number }>;
  coinName: string;
  timeframe?: string;
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  coinName, 
  timeframe = '7d', 
  color = "#4f46e5" 
}) => {
  // Process data for chart
  const chartData = data.map(point => ({
    time: new Date(point.timestamp).toLocaleDateString(),
    price: point.price,
  }));

  // Calculate if price is up or down
  const isPriceUp = chartData.length >= 2 && 
    chartData[chartData.length - 1].price >= chartData[0].price;

  // Dynamic chart color
  const lineColor = isPriceUp ? "#22c55e" : "#ef4444";
  const actualColor = color === "dynamic" ? lineColor : color;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg text-sm">
          <p className="font-medium">{payload[0].payload.time}</p>
          <p className="text-white">
            Price: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card overflow-hidden border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-base">
          {coinName} Price Chart
          <span className="text-sm bg-secondary px-2 py-1 rounded-md">
            {timeframe}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 w-full px-1">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={actualColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={actualColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickFormatter={(value, index) => {
                  // Show fewer ticks for better readability
                  return index % Math.ceil(chartData.length / 5) === 0 ? value : '';
                }}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={actualColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: actualColor, strokeWidth: 0 }}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;

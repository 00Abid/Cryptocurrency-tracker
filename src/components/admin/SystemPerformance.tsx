
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowDown, ArrowUp, Database, HardDrive, Server, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample performance data
const performanceData = [
  { time: '00:00', cpu: 25, memory: 40, requests: 120 },
  { time: '04:00', cpu: 30, memory: 45, requests: 150 },
  { time: '08:00', cpu: 70, memory: 65, requests: 350 },
  { time: '12:00', cpu: 85, memory: 75, requests: 420 },
  { time: '16:00', cpu: 65, memory: 60, requests: 280 },
  { time: '20:00', cpu: 40, memory: 50, requests: 220 },
  { time: '24:00', cpu: 20, memory: 40, requests: 100 },
];

const SystemPerformance = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="CPU Usage" 
          value="42%" 
          trend="down" 
          trendValue="8%" 
          icon={<Cpu className="h-5 w-5" />} 
        />
        <MetricCard 
          title="Memory Usage" 
          value="58%" 
          trend="up" 
          trendValue="12%" 
          icon={<HardDrive className="h-5 w-5" />} 
        />
        <MetricCard 
          title="API Requests" 
          value="2.4k" 
          trend="up" 
          trendValue="24%" 
          icon={<Activity className="h-5 w-5" />} 
        />
        <MetricCard 
          title="Database Size" 
          value="128MB" 
          trend="up" 
          trendValue="5%" 
          icon={<Database className="h-5 w-5" />} 
        />
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">System Performance Trends (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30,41,59,0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                  name="CPU (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                  name="Memory (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                  name="Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServerStatus />
        <MaintenanceInfo />
      </div>
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon 
}: { 
  title: string; 
  value: string; 
  trend: 'up' | 'down'; 
  trendValue: string;
  icon: React.ReactNode;
}) => {
  return (
    <Card className="glass-card border-white/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-white/70">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-white/5">{icon}</div>
        </div>
        <div className="mt-3 flex items-center">
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4 text-red-400 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 text-green-400 mr-1" />
          )}
          <span className={`text-sm ${trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
            {trendValue} from yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const ServerStatus = () => {
  const servers = [
    { name: 'API Server', status: 'Operational', load: 42 },
    { name: 'Database Server', status: 'Operational', load: 38 },
    { name: 'Cache Server', status: 'Operational', load: 27 },
    { name: 'WebSocket Server', status: 'Maintenance', load: 0 },
  ];

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5" />
          Server Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {servers.map((server) => (
            <div key={server.name} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{server.name}</p>
                <p className={`text-sm ${server.status === 'Operational' ? 'text-green-400' : 'text-amber-400'}`}>
                  {server.status}
                </p>
              </div>
              {server.status === 'Operational' ? (
                <div className="w-24">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${server.load}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-white/70 text-right mt-1">{server.load}% load</p>
                </div>
              ) : (
                <span className="text-xs py-1 px-2 rounded-full bg-amber-400/20 text-amber-400">
                  Scheduled Maintenance
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MaintenanceInfo = () => {
  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border border-white/10 rounded-md bg-white/5">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Database Optimization</h4>
              <span className="text-xs py-1 px-2 rounded-full bg-blue-400/20 text-blue-400">
                Scheduled
              </span>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Performance optimization for the main database cluster
            </p>
            <p className="text-xs text-white/50">April 15, 2023 • 02:00 - 04:00 UTC</p>
          </div>
          
          <div className="p-4 border border-white/10 rounded-md bg-white/5">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">API Server Upgrade</h4>
              <span className="text-xs py-1 px-2 rounded-full bg-purple-400/20 text-purple-400">
                Planned
              </span>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Upgrading API servers to the latest version
            </p>
            <p className="text-xs text-white/50">April 22, 2023 • 01:00 - 03:00 UTC</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPerformance;

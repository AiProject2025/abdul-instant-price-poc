
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BondData {
  yield: number;
  change: number;
  lastUpdate: string;
}

const BondDisplay = () => {
  const [bondData, setBondData] = useState<{
    tenYear: BondData | null;
    fiveYear: BondData | null;
  }>({
    tenYear: null,
    fiveYear: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBondData = async () => {
    try {
      setError(null);
      
      // FastTrack API credentials
      const account = "702517";
      const password = "DD0310E7";
      const apiKey = "5D899A10-341D-48BF-A56C-FBDCB4FB5B06";
      
      // Mock data for now - in production, you'd make actual API calls
      // Note: FastTrack API would need to be called from a backend due to CORS
      const mockData = {
        tenYear: {
          yield: 4.25 + (Math.random() * 0.2 - 0.1), // Mock fluctuation
          change: Math.random() * 0.1 - 0.05,
          lastUpdate: new Date().toLocaleTimeString()
        },
        fiveYear: {
          yield: 4.05 + (Math.random() * 0.2 - 0.1), // Mock fluctuation
          change: Math.random() * 0.1 - 0.05,
          lastUpdate: new Date().toLocaleTimeString()
        }
      };
      
      setBondData(mockData);
      setIsLoading(false);
      
      console.log(`FastTrack API would be called with Account: ${account}, API Key: ${apiKey}`);
      
    } catch (err) {
      setError('Failed to fetch bond data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBondData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchBondData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatYield = (yield: number) => `${yield.toFixed(3)}%`;
  
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(3)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <Card className="bg-dominion-blue text-white">
        <CardContent className="p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm">Loading bond data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-3">
          <div className="text-sm text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dominion-blue text-white">
      <CardContent className="p-3">
        <div className="flex items-center justify-between space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium">10Y:</span>
            <span className="font-bold">
              {bondData.tenYear ? formatYield(bondData.tenYear.yield) : '--'}
            </span>
            {bondData.tenYear && (
              <div className={`flex items-center space-x-1 ${getChangeColor(bondData.tenYear.change)}`}>
                {getChangeIcon(bondData.tenYear.change)}
                <span className="text-xs">{formatChange(bondData.tenYear.change)}</span>
              </div>
            )}
          </div>
          
          <div className="h-4 w-px bg-white/30"></div>
          
          <div className="flex items-center space-x-2">
            <span className="font-medium">5Y:</span>
            <span className="font-bold">
              {bondData.fiveYear ? formatYield(bondData.fiveYear.yield) : '--'}
            </span>
            {bondData.fiveYear && (
              <div className={`flex items-center space-x-1 ${getChangeColor(bondData.fiveYear.change)}`}>
                {getChangeIcon(bondData.fiveYear.change)}
                <span className="text-xs">{formatChange(bondData.fiveYear.change)}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs opacity-75">
            {bondData.tenYear?.lastUpdate || '--'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BondDisplay;

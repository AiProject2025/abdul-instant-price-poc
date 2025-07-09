import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientSearchProps {
  onClientSelect: (client: ClientInfo) => void;
  onCreateNew: () => void;
}

interface ClientInfo {
  name: string;
  address: string;
  lastQuoteDate?: string;
  totalQuotes?: number;
}

const ClientSearch = ({ onClientSelect, onCreateNew }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ClientInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data - in real app this would come from API/database
  const mockClients: ClientInfo[] = [
    {
      name: "John Smith",
      address: "123 Main St, Baltimore, MD 21201",
      lastQuoteDate: "2024-01-15",
      totalQuotes: 3
    },
    {
      name: "Sarah Johnson",
      address: "456 Oak Ave, Annapolis, MD 21401",
      lastQuoteDate: "2024-01-10",
      totalQuotes: 1
    },
    {
      name: "Michael Brown",
      address: "789 Pine Rd, Frederick, MD 21701",
      lastQuoteDate: "2024-01-08",
      totalQuotes: 5
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mb-8">
      <CardHeader className="text-center">
        <Search className="h-12 w-12 text-dominion-blue mx-auto mb-4" />
        <CardTitle className="text-dominion-blue">Search Existing Clients</CardTitle>
        <CardDescription>
          Search by client name or property address to load previous information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by client name or property address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-dominion-blue hover:bg-dominion-blue/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h4 className="font-medium text-dominion-blue">Search Results:</h4>
            {searchResults.map((client, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onClientSelect(client)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-dominion-blue" />
                      <span className="font-medium text-dominion-blue">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{client.address}</span>
                    </div>
                    <div className="flex gap-2">
                      {client.lastQuoteDate && (
                        <Badge variant="secondary" className="text-xs">
                          Last quote: {new Date(client.lastQuoteDate).toLocaleDateString()}
                        </Badge>
                      )}
                      {client.totalQuotes && (
                        <Badge variant="outline" className="text-xs">
                          {client.totalQuotes} quote{client.totalQuotes !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-4 text-gray-500">
            No clients found matching "{searchTerm}"
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <Button 
          onClick={onCreateNew}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Client Quote
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientSearch;
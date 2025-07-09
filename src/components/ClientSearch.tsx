import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClients, ClientWithProperties } from "@/hooks/useClients";

interface ClientSearchProps {
  onClientSelect: (client: ClientWithProperties) => void;
}

const ClientSearch = ({ onClientSelect }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading, error, searchClients } = useClients();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    await searchClients(searchTerm);
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
            disabled={loading}
            className="bg-dominion-blue hover:bg-dominion-blue/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {clients.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h4 className="font-medium text-dominion-blue">Search Results:</h4>
            {clients.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onClientSelect(client)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-dominion-blue" />
                      <span className="font-medium text-dominion-blue">{client.name}</span>
                    </div>
                    
                    {client.properties.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {client.properties.map((property) => (
                          <div key={property.id} className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{property.address}</span>
                            {property.property_type && (
                              <Badge variant="outline" className="text-xs">
                                {property.property_type}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {client.lastQuoteDate && (
                        <Badge variant="secondary" className="text-xs">
                          Last quote: {new Date(client.lastQuoteDate).toLocaleDateString()}
                        </Badge>
                      )}
                      {client.totalQuotes > 0 && (
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

        {searchTerm && clients.length === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            No clients found matching "{searchTerm}"
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500">
            Error: {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSearch;
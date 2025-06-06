
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { statesAndCounties } from '@/utils/locationData';

interface StateCountySelectorProps {
  selectedState?: string;
  selectedCounty?: string;
  onStateChange: (state: string) => void;
  onCountyChange: (county: string) => void;
  stateError?: string;
  countyError?: string;
}

const StateCountySelector: React.FC<StateCountySelectorProps> = ({
  selectedState,
  selectedCounty,
  onStateChange,
  onCountyChange,
  stateError,
  countyError
}) => {
  const states = Object.keys(statesAndCounties).sort();
  const counties = selectedState ? statesAndCounties[selectedState] || [] : [];

  const handleStateChange = (value: string) => {
    onStateChange(value);
    // Clear county when state changes
    onCountyChange('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <FormLabel>Property State *</FormLabel>
        <Select value={selectedState} onValueChange={handleStateChange}>
          <FormControl>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto">
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {stateError && <FormMessage>{stateError}</FormMessage>}
      </FormItem>

      <FormItem>
        <FormLabel>Property County *</FormLabel>
        <Select 
          value={selectedCounty} 
          onValueChange={onCountyChange}
          disabled={!selectedState}
        >
          <FormControl>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={selectedState ? "Select county" : "Select state first"} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto">
            {counties.map((county) => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {countyError && <FormMessage>{countyError}</FormMessage>}
      </FormItem>
    </div>
  );
};

export default StateCountySelector;

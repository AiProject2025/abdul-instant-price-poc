
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { statesAndCounties, statesWithAbbreviations, stateAbbreviations } from '@/utils/locationData';

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
  // Find the full state name from abbreviation for counties lookup
  const getStateNameFromAbbreviation = (abbreviation: string) => {
    return Object.keys(stateAbbreviations).find(name => stateAbbreviations[name] === abbreviation) || '';
  };

  const fullStateName = selectedState ? getStateNameFromAbbreviation(selectedState) : '';
  const counties = fullStateName ? statesAndCounties[fullStateName] || [] : [];

  const handleStateChange = (value: string) => {
    onStateChange(value); // This will be the abbreviation (e.g., "TX")
    // Clear county when state changes
    onCountyChange('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Property State *</label>
        <Select value={selectedState} onValueChange={handleStateChange}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
            {statesWithAbbreviations.map((state) => (
              <SelectItem key={state.abbreviation} value={state.abbreviation}>
                {state.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {stateError && (
          <p className="text-sm font-medium text-red-600">{stateError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Property County *</label>
        <Select 
          value={selectedCounty} 
          onValueChange={onCountyChange}
          disabled={!selectedState}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder={fullStateName ? "Select county" : "Select state first"} />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
            {counties.map((county) => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {countyError && (
          <p className="text-sm font-medium text-red-600">{countyError}</p>
        )}
      </div>
    </div>
  );
};

export default StateCountySelector;

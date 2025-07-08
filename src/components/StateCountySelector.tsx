
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { statesAndCounties, statesWithAbbreviations, stateAbbreviations } from '@/utils/locationData';
import { lookupCountyByZipCode, isValidZipCode } from '@/utils/zipCodeLookup';

interface StateCountySelectorProps {
  selectedState?: string;
  selectedCounty?: string;
  selectedZipCode?: string;
  onStateChange: (state: string) => void;
  onCountyChange: (county: string) => void;
  onZipCodeChange: (zipCode: string) => void;
  stateError?: string;
  countyError?: string;
  zipCodeError?: string;
}

const StateCountySelector: React.FC<StateCountySelectorProps> = ({
  selectedState,
  selectedCounty,
  selectedZipCode,
  onStateChange,
  onCountyChange,
  onZipCodeChange,
  stateError,
  countyError,
  zipCodeError
}) => {
  const [zipCodeInput, setZipCodeInput] = useState(selectedZipCode || '');

  // Handle zip code changes and auto-populate state/county
  const handleZipCodeChange = (value: string) => {
    setZipCodeInput(value);
    onZipCodeChange(value);
    
    // Auto-populate state and county for valid zip codes
    if (value.length === 5) {
      const locationData = lookupCountyByZipCode(value);
      if (locationData) {
        onStateChange(locationData.state);
        onCountyChange(locationData.county);
      }
    }
  };

  // Update zip code input when selectedZipCode prop changes
  useEffect(() => {
    if (selectedZipCode !== undefined) {
      setZipCodeInput(selectedZipCode);
    }
  }, [selectedZipCode]);
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Property Zip Code *
          <span className="text-xs text-gray-500 ml-1">(Auto-fills State & County)</span>
        </label>
        <Input
          type="text"
          value={zipCodeInput}
          onChange={(e) => handleZipCodeChange(e.target.value)}
          placeholder="Enter zip code"
          className="bg-white"
          maxLength={5}
        />
        {zipCodeError && (
          <p className="text-sm font-medium text-red-600">{zipCodeError}</p>
        )}
        {zipCodeInput.length >= 5 && !isValidZipCode(zipCodeInput) && (
          <p className="text-sm font-medium text-orange-600">
            Zip code not found in database - please select state and county manually
          </p>
        )}
      </div>
    </div>
  );
};

export default StateCountySelector;

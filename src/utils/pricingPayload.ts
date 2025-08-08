export const transformFormDataForAPI = (formData: any) => {
  // Helper function to normalize text values to lowercase with hyphens
  const normalizeTextValue = (value: string) => {
    if (!value) return '';
    return value.toString().toLowerCase().replace(/\s+/g, '-');
  };

  // Helper function to ensure numeric value is converted to string
  const normalizeNumericValue = (value: any) => {
    if (!value) return '0';
    const numValue = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    return isNaN(numValue) ? '0' : numValue.toString();
  };

  // Calculate total rental income
  const calculateTotalRental = () => {
    const units = parseInt(formData.numberOfUnits) || 0;
    let total = 0;

    for (let i = 1; i <= units; i++) {
      const rent = parseFloat(formData[`unit${i}Rent`]) || 0;
      total += rent;
    }

    // If unit rents are not set but a combined marketRent is provided, use it
    if (total === 0 && formData.marketRent) {
      const combined = parseFloat(formData.marketRent.toString().replace(/[^0-9.-]/g, '')) || 0;
      return combined.toString();
    }

    return total.toString();
  };

  // Calculate total rehab cost
  const calculateRehabCost = () => {
    if (formData.loanPurpose === 'Purchase') {
      return normalizeNumericValue(formData.estimatedRehabCost);
    } else {
      const spent = parseFloat(formData.rehabCostSpent) || 0;
      const needed = parseFloat(formData.rehabCostNeeded) || 0;
      return (spent + needed).toString();
    }
  };

  // Transform to API format with normalization
  const apiData: any = {
    // Personal Info (text fields to lowercase)
    firstName: formData.firstName?.toLowerCase() || '',
    lastName: formData.lastName?.toLowerCase() || '',
    phone: formData.phone || '',
    email: formData.email?.toLowerCase() || '',
    yourCompany: formData.yourCompany?.toLowerCase() || '',
    usCitizen: normalizeTextValue(formData.usCitizen),
    borrower_type: normalizeTextValue(formData.closingType),

    // Subject Property Address (text fields to lowercase)
    address: formData.streetAddress?.toLowerCase() || '',
    city: formData.city?.toLowerCase() || '',
    state: formData.propertyState?.toLowerCase() || '', // Already abbreviation
    zip_code: formData.zipCode || '',
    county: formData.propertyCounty?.toLowerCase() || '',

    // Loan Purpose (normalize dropdown values)
    loan_purpose: normalizeTextValue(formData.loanPurpose),

    // Cross Collateral Information
    cross_collateral_loan: normalizeTextValue(formData.crossCollateralLoan),
    number_of_properties: normalizeNumericValue(formData.numberOfProperties),

    // Property Details (normalize dropdown values)
    property_type: normalizeTextValue(formData.propertyType),
    property_condition: normalizeTextValue(formData.propertyCondition),
    rural: normalizeTextValue(formData.rural),
    declining_market: normalizeTextValue(formData.decliningMarket),
    interest_only: normalizeTextValue(formData.interestOnly),
    number_of_units: formData.numberOfUnits || '1',
    number_of_leased_units: normalizeNumericValue(formData.numberOfLeasedUnits),
    has_vacant_units: normalizeTextValue(formData.hasVacantUnits),
    number_of_vacant_units: normalizeNumericValue(formData.numberOfVacantUnits),

    // Loan Details
    desired_ltv: normalizeNumericValue(formData.desiredLTV),
    desired_closing_date: formData.desiredClosingDate || '',
    interest_reserves: normalizeTextValue(formData.interestReserves),

    // Calculated Rental Income
    market_rent: calculateTotalRental(),

    // Property Details
    total_square_feet: normalizeNumericValue(formData.totalSquareFeet),

    // Annual Property Expenses (numeric values)
    annual_taxes: normalizeNumericValue(formData.annualTaxes),
    annual_insurance: normalizeNumericValue(formData.annualInsurance),
    annual_association_fees: normalizeNumericValue(formData.annualAssociationFees),
    annual_flood_insurance: normalizeNumericValue(formData.annualFloodInsurance),

    // Final Details
    decision_credit_score: normalizeNumericValue(formData.creditScore),

    // Rehab Cost
    rehab_cost: calculateRehabCost()
  };

  // Add conditional fields based on property type
  if (formData.propertyType === 'Condominium') {
    apiData['condo_approval_type'] = normalizeTextValue(formData.condoApprovalType);
  }

  // Add conditional fields based on number of units
  if (parseInt(formData.numberOfUnits) >= 2) {
    apiData['isNonconfirming'] = normalizeTextValue(formData.nonconformingUnits);
  }

  if (parseInt(formData.numberOfUnits) >= 5) {
    apiData['total_net_operation_income'] = normalizeNumericValue(formData.totalNetOperationIncome);
  }

  // Add lease information
  if (formData.leaseInPlace) {
    apiData['lease_in_place'] = normalizeTextValue(formData.leaseInPlace);
    if (formData.leaseInPlace === 'Yes') {
      apiData['lease_structure'] = normalizeTextValue(formData.leaseStructure);
      apiData['section_8'] = normalizeTextValue(formData.section8Lease);
      apiData['str_rental_history'] = normalizeTextValue(formData.strRentalHistory);
    }
  }

  // Add loan purpose specific fields
  if (formData.loanPurpose === 'Purchase') {
    apiData['purchase_price'] = normalizeNumericValue(formData.purchasePrice);
    if (formData.hasPurchaseContract) {
      apiData['has_purchase_contract'] = normalizeTextValue(formData.hasPurchaseContract);
      if (formData.hasPurchaseContract === 'Yes') {
        apiData['purchase_contract_close_date'] = formData.purchaseContractCloseDate || '';
      }
    }
  } else if (formData.loanPurpose === 'Refinance') {
    apiData['refinance_type'] = normalizeTextValue(formData.refinanceType);
    apiData['purchase_price'] = normalizeNumericValue(formData.purchasePrice);
    apiData['date_purchased'] = formData.datePurchased || '';
    apiData['market_value'] = normalizeNumericValue(formData.marketValue);
    if (formData.hasMortgage) {
      apiData['has_mortgage'] = normalizeTextValue(formData.hasMortgage);
      if (formData.hasMortgage === 'Yes') {
        apiData['mortgage_payoff'] = normalizeNumericValue(formData.mortgagePayoff);
      }
    }
  }

  return apiData;
};

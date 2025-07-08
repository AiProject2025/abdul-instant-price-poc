// Zip code to county mapping data
const zipCodeToCountyMap: Record<string, { state: string; county: string }> = {
  // Alabama
  "01001": { state: "AL", county: "Autauga County" },
  "01003": { state: "AL", county: "Baldwin County" },
  "01005": { state: "AL", county: "Barbour County" },
  "01007": { state: "AL", county: "Bibb County" },
  "01009": { state: "AL", county: "Blount County" },
  "01011": { state: "AL", county: "Bullock County" },
  "01013": { state: "AL", county: "Butler County" },
  "01015": { state: "AL", county: "Calhoun County" },
  "01017": { state: "AL", county: "Chambers County" },
  "01019": { state: "AL", county: "Cherokee County" },
  "01021": { state: "AL", county: "Chilton County" },
  "01023": { state: "AL", county: "Choctaw County" },
  "01025": { state: "AL", county: "Clarke County" },
  "01027": { state: "AL", county: "Clay County" },
  "01029": { state: "AL", county: "Cleburne County" },
  "01031": { state: "AL", county: "Coffee County" },
  "01033": { state: "AL", county: "Colbert County" },
  "01035": { state: "AL", county: "Conecuh County" },
  "01037": { state: "AL", county: "Coosa County" },
  "01039": { state: "AL", county: "Covington County" },
  "01041": { state: "AL", county: "Crenshaw County" },
  "01043": { state: "AL", county: "Cullman County" },
  "01045": { state: "AL", county: "Dale County" },
  "01047": { state: "AL", county: "Dallas County" },
  "01049": { state: "AL", county: "DeKalb County" },
  "01051": { state: "AL", county: "Elmore County" },
  "01053": { state: "AL", county: "Escambia County" },
  "01055": { state: "AL", county: "Etowah County" },
  "01057": { state: "AL", county: "Fayette County" },
  "01059": { state: "AL", county: "Franklin County" },
  "01061": { state: "AL", county: "Geneva County" },
  "01063": { state: "AL", county: "Greene County" },
  "01065": { state: "AL", county: "Hale County" },
  "01067": { state: "AL", county: "Henry County" },
  "01069": { state: "AL", county: "Houston County" },
  "01071": { state: "AL", county: "Jackson County" },
  "01073": { state: "AL", county: "Jefferson County" },
  "01075": { state: "AL", county: "Lamar County" },
  "01077": { state: "AL", county: "Lauderdale County" },
  "01079": { state: "AL", county: "Lawrence County" },
  "01081": { state: "AL", county: "Lee County" },
  "01083": { state: "AL", county: "Limestone County" },
  "01085": { state: "AL", county: "Lowndes County" },
  "01087": { state: "AL", county: "Macon County" },
  "01089": { state: "AL", county: "Madison County" },
  "01091": { state: "AL", county: "Marengo County" },
  "01093": { state: "AL", county: "Marion County" },
  "01095": { state: "AL", county: "Marshall County" },
  "01097": { state: "AL", county: "Mobile County" },
  "01099": { state: "AL", county: "Monroe County" },
  "01101": { state: "AL", county: "Montgomery County" },
  "01103": { state: "AL", county: "Morgan County" },
  "01105": { state: "AL", county: "Perry County" },
  "01107": { state: "AL", county: "Pickens County" },
  "01109": { state: "AL", county: "Pike County" },
  "01111": { state: "AL", county: "Randolph County" },
  "01113": { state: "AL", county: "Russell County" },
  "01115": { state: "AL", county: "St. Clair County" },
  "01117": { state: "AL", county: "Shelby County" },
  "01119": { state: "AL", county: "Sumter County" },
  "01121": { state: "AL", county: "Talladega County" },
  "01123": { state: "AL", county: "Tallapoosa County" },
  "01125": { state: "AL", county: "Tuscaloosa County" },
  "01127": { state: "AL", county: "Walker County" },
  "01129": { state: "AL", county: "Washington County" },
  "01131": { state: "AL", county: "Wilcox County" },
  "01133": { state: "AL", county: "Winston County" },
  
  // New York - Adding the most common NYC zip codes for testing
  "10001": { state: "NY", county: "New York County" }, // Manhattan
  "10002": { state: "NY", county: "New York County" },
  "10003": { state: "NY", county: "New York County" },
  "10004": { state: "NY", county: "New York County" },
  "10005": { state: "NY", county: "New York County" },
  "10006": { state: "NY", county: "New York County" },
  "10007": { state: "NY", county: "New York County" },
  "10008": { state: "NY", county: "New York County" },
  "10009": { state: "NY", county: "New York County" },
  "10010": { state: "NY", county: "New York County" },
  "10011": { state: "NY", county: "New York County" },
  "10012": { state: "NY", county: "New York County" },
  "10013": { state: "NY", county: "New York County" },
  "10014": { state: "NY", county: "New York County" },
  "10016": { state: "NY", county: "New York County" },
  "10017": { state: "NY", county: "New York County" },
  "10018": { state: "NY", county: "New York County" },
  "10019": { state: "NY", county: "New York County" },
  "10020": { state: "NY", county: "New York County" },
  "10021": { state: "NY", county: "New York County" },
  "10022": { state: "NY", county: "New York County" },
  "10023": { state: "NY", county: "New York County" },
  "10024": { state: "NY", county: "New York County" },
  "10025": { state: "NY", county: "New York County" },
  "10026": { state: "NY", county: "New York County" },
  "10027": { state: "NY", county: "New York County" },
  "10028": { state: "NY", county: "New York County" },
  "10029": { state: "NY", county: "New York County" },
  "10030": { state: "NY", county: "New York County" },
  "10031": { state: "NY", county: "New York County" },
  "10032": { state: "NY", county: "New York County" },
  "10033": { state: "NY", county: "New York County" },
  "10034": { state: "NY", county: "New York County" },
  "10035": { state: "NY", county: "New York County" },
  "10036": { state: "NY", county: "New York County" },
  "10037": { state: "NY", county: "New York County" },
  "10038": { state: "NY", county: "New York County" },
  "10039": { state: "NY", county: "New York County" },
  "10040": { state: "NY", county: "New York County" },
  
  // Bronx
  "10451": { state: "NY", county: "Bronx County" },
  "10452": { state: "NY", county: "Bronx County" },
  "10453": { state: "NY", county: "Bronx County" },
  "10454": { state: "NY", county: "Bronx County" },
  "10455": { state: "NY", county: "Bronx County" },
  "10456": { state: "NY", county: "Bronx County" },
  "10457": { state: "NY", county: "Bronx County" },
  "10458": { state: "NY", county: "Bronx County" },
  "10459": { state: "NY", county: "Bronx County" },
  "10460": { state: "NY", county: "Bronx County" },
  "10461": { state: "NY", county: "Bronx County" },
  "10462": { state: "NY", county: "Bronx County" },
  "10463": { state: "NY", county: "Bronx County" },
  "10464": { state: "NY", county: "Bronx County" },
  "10465": { state: "NY", county: "Bronx County" },
  "10466": { state: "NY", county: "Bronx County" },
  "10467": { state: "NY", county: "Bronx County" },
  "10468": { state: "NY", county: "Bronx County" },
  "10469": { state: "NY", county: "Bronx County" },
  "10470": { state: "NY", county: "Bronx County" },
  "10471": { state: "NY", county: "Bronx County" },
  "10472": { state: "NY", county: "Bronx County" },
  "10473": { state: "NY", county: "Bronx County" },
  "10474": { state: "NY", county: "Bronx County" },
  "10475": { state: "NY", county: "Bronx County" },
  
  // Maryland - Adding some common MD zip codes
  "21001": { state: "MD", county: "Baltimore County" },
  "21005": { state: "MD", county: "Baltimore County" },
  "21009": { state: "MD", county: "Baltimore County" },
  "21010": { state: "MD", county: "Baltimore County" },
  "21013": { state: "MD", county: "Baltimore County" },
  "21014": { state: "MD", county: "Baltimore County" },
  "21015": { state: "MD", county: "Harford County" }, // Bel Air
  "21017": { state: "MD", county: "Baltimore County" },
  "21018": { state: "MD", county: "Baltimore County" },
  "21030": { state: "MD", county: "Baltimore County" },
  "21031": { state: "MD", county: "Baltimore County" },
  "21040": { state: "MD", county: "Baltimore County" },
  "21041": { state: "MD", county: "Baltimore County" },
  "21042": { state: "MD", county: "Howard County" },
  "21043": { state: "MD", county: "Howard County" },
  "21044": { state: "MD", county: "Howard County" },
  "21045": { state: "MD", county: "Howard County" },
  "21046": { state: "MD", county: "Baltimore County" },
  
  // Add a few more common states for testing
  "90210": { state: "CA", county: "Los Angeles County" }, // Beverly Hills
  "90211": { state: "CA", county: "Los Angeles County" },
  "90212": { state: "CA", county: "Los Angeles County" },
  "94102": { state: "CA", county: "San Francisco County" }, // San Francisco
  "94103": { state: "CA", county: "San Francisco County" },
  "94104": { state: "CA", county: "San Francisco County" },
  
  "33101": { state: "FL", county: "Miami-Dade County" }, // Miami
  "33102": { state: "FL", county: "Miami-Dade County" },
  "33109": { state: "FL", county: "Miami-Dade County" },
  "33139": { state: "FL", county: "Miami-Dade County" },
  
  "75201": { state: "TX", county: "Dallas County" }, // Dallas
  "75202": { state: "TX", county: "Dallas County" },
  "75203": { state: "TX", county: "Dallas County" },
  "77001": { state: "TX", county: "Harris County" }, // Houston
  "77002": { state: "TX", county: "Harris County" },
  "77003": { state: "TX", county: "Harris County" }
};

/**
 * Looks up county and state information based on zip code
 * @param zipCode - The zip code to look up (as string)
 * @returns Object with state abbreviation and county name, or null if not found
 */
export const lookupCountyByZipCode = (zipCode: string): { state: string; county: string } | null => {
  // Remove any spaces and ensure it's a string
  const cleanZipCode = zipCode.replace(/\s/g, '');
  
  // For 5-digit zip codes, pad with leading zeros if needed
  const paddedZipCode = cleanZipCode.padStart(5, '0');
  
  return zipCodeToCountyMap[paddedZipCode] || null;
};

/**
 * Validates if a zip code exists in our database
 * @param zipCode - The zip code to validate
 * @returns boolean indicating if the zip code is valid
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const cleanZipCode = zipCode.replace(/\s/g, '');
  const paddedZipCode = cleanZipCode.padStart(5, '0');
  return zipCodeToCountyMap.hasOwnProperty(paddedZipCode);
};

/**
 * Gets all zip codes for a given state and county combination
 * @param state - State abbreviation (e.g., "AL")
 * @param county - County name (e.g., "Jefferson")
 * @returns Array of zip codes for that state/county combination
 */
export const getZipCodesForCounty = (state: string, county: string): string[] => {
  return Object.entries(zipCodeToCountyMap)
    .filter(([_, data]) => data.state === state && data.county === county)
    .map(([zipCode, _]) => zipCode);
};
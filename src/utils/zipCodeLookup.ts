// Zip code to county mapping data
// Note: This is a partial dataset - you may need to provide the complete dataset
const zipCodeToCountyMap: Record<string, { state: string; county: string }> = {
  // Alabama
  "01001": { state: "AL", county: "Autauga" },
  "01003": { state: "AL", county: "Baldwin" },
  "01005": { state: "AL", county: "Barbour" },
  "01007": { state: "AL", county: "Bibb" },
  "01009": { state: "AL", county: "Blount" },
  "01011": { state: "AL", county: "Bullock" },
  "01013": { state: "AL", county: "Butler" },
  "01015": { state: "AL", county: "Calhoun" },
  "01017": { state: "AL", county: "Chambers" },
  "01019": { state: "AL", county: "Cherokee" },
  "01021": { state: "AL", county: "Chilton" },
  "01023": { state: "AL", county: "Choctaw" },
  "01025": { state: "AL", county: "Clarke" },
  "01027": { state: "AL", county: "Clay" },
  "01029": { state: "AL", county: "Cleburne" },
  "01031": { state: "AL", county: "Coffee" },
  "01033": { state: "AL", county: "Colbert" },
  "01035": { state: "AL", county: "Conecuh" },
  "01037": { state: "AL", county: "Coosa" },
  "01039": { state: "AL", county: "Covington" },
  "01041": { state: "AL", county: "Crenshaw" },
  "01043": { state: "AL", county: "Cullman" },
  "01045": { state: "AL", county: "Dale" },
  "01047": { state: "AL", county: "Dallas" },
  "01049": { state: "AL", county: "DeKalb" },
  "01051": { state: "AL", county: "Elmore" },
  "01053": { state: "AL", county: "Escambia" },
  "01055": { state: "AL", county: "Etowah" },
  "01057": { state: "AL", county: "Fayette" },
  "01059": { state: "AL", county: "Franklin" },
  "01061": { state: "AL", county: "Geneva" },
  "01063": { state: "AL", county: "Greene" },
  "01065": { state: "AL", county: "Hale" },
  "01067": { state: "AL", county: "Henry" },
  "01069": { state: "AL", county: "Houston" },
  "01071": { state: "AL", county: "Jackson" },
  "01073": { state: "AL", county: "Jefferson" },
  "01075": { state: "AL", county: "Lamar" },
  "01077": { state: "AL", county: "Lauderdale" },
  "01079": { state: "AL", county: "Lawrence" },
  "01081": { state: "AL", county: "Lee" },
  "01083": { state: "AL", county: "Limestone" },
  "01085": { state: "AL", county: "Lowndes" },
  "01087": { state: "AL", county: "Macon" },
  "01089": { state: "AL", county: "Madison" },
  "01091": { state: "AL", county: "Marengo" },
  "01093": { state: "AL", county: "Marion" },
  "01095": { state: "AL", county: "Marshall" },
  "01097": { state: "AL", county: "Mobile" },
  "01099": { state: "AL", county: "Monroe" },
  "01101": { state: "AL", county: "Montgomery" },
  "01103": { state: "AL", county: "Morgan" },
  "01105": { state: "AL", county: "Perry" },
  "01107": { state: "AL", county: "Pickens" },
  "01109": { state: "AL", county: "Pike" },
  "01111": { state: "AL", county: "Randolph" },
  "01113": { state: "AL", county: "Russell" },
  "01115": { state: "AL", county: "St. Clair" },
  "01117": { state: "AL", county: "Shelby" },
  "01119": { state: "AL", county: "Sumter" },
  "01121": { state: "AL", county: "Talladega" },
  "01123": { state: "AL", county: "Tallapoosa" },
  "01125": { state: "AL", county: "Tuscaloosa" },
  "01127": { state: "AL", county: "Walker" },
  "01129": { state: "AL", county: "Washington" },
  "01131": { state: "AL", county: "Wilcox" },
  "01133": { state: "AL", county: "Winston" },
  
  // Alaska
  "02013": { state: "AK", county: "Aleutians East Borough" },
  "02016": { state: "AK", county: "Aleutians West Census Area" },
  "02020": { state: "AK", county: "Anchorage Municipality" },
  "02050": { state: "AK", county: "Bethel Census Area" },
  "02060": { state: "AK", county: "Bristol Bay Borough" },
  "02068": { state: "AK", county: "Denali Borough" },
  "02070": { state: "AK", county: "Dillingham Census Area" },
  "02090": { state: "AK", county: "Fairbanks North Star Borough" },
  "02100": { state: "AK", county: "Haines Borough" },
  "02105": { state: "AK", county: "Hoonah-Angoon Census Area" },
  "02110": { state: "AK", county: "Juneau City and Borough" },
  "02122": { state: "AK", county: "Kenai Peninsula Borough" },
  "02130": { state: "AK", county: "Ketchikan Gateway Borough" },
  "02150": { state: "AK", county: "Kodiak Island Borough" },
  "02158": { state: "AK", county: "Kusilvak Census Area" },
  "02164": { state: "AK", county: "Lake and Peninsula Borough" },
  "02170": { state: "AK", county: "Matanuska-Susitna Borough" },
  "02180": { state: "AK", county: "Nome Census Area" },
  "02185": { state: "AK", county: "North Slope Borough" },
  "02188": { state: "AK", county: "Northwest Arctic Borough" },
  "02195": { state: "AK", county: "Petersburg Borough" },
  "02198": { state: "AK", county: "Prince of Wales-Hyder Census Area" },
  "02200": { state: "AK", county: "Sitka City and Borough" },
  "02210": { state: "AK", county: "Skagway Municipality" },
  "02240": { state: "AK", county: "Southeast Fairbanks Census Area" },
  "02261": { state: "AK", county: "Valdez-Cordova Census Area" },
  "02275": { state: "AK", county: "Wrangell City and Borough" },
  "02282": { state: "AK", county: "Yakutat City and Borough" },
  "02290": { state: "AK", county: "Yukon-Koyukuk Census Area" },
  
  // Arizona
  "04001": { state: "AZ", county: "Apache" },
  "04003": { state: "AZ", county: "Cochise" },
  "04005": { state: "AZ", county: "Coconino" },
  "04007": { state: "AZ", county: "Gila" },
  "04009": { state: "AZ", county: "Graham" },
  "04011": { state: "AZ", county: "Greenlee" },
  "04012": { state: "AZ", county: "La Paz" },
  "04013": { state: "AZ", county: "Maricopa" },
  "04015": { state: "AZ", county: "Mohave" },
  "04017": { state: "AZ", county: "Navajo" },
  "04019": { state: "AZ", county: "Pima" },
  "04021": { state: "AZ", county: "Pinal" },
  "04023": { state: "AZ", county: "Santa Cruz" },
  "04025": { state: "AZ", county: "Yavapai" },
  "04027": { state: "AZ", county: "Yuma" },
  
  // Add more states as needed...
  // Note: The provided list seems to cut off at Mississippi. You'll need to provide the complete dataset.
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
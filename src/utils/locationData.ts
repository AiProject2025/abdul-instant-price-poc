
// State abbreviations mapping
export const stateAbbreviations: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

// States with their display names (name + abbreviation)
export const statesWithAbbreviations = Object.keys(stateAbbreviations).map(stateName => ({
  name: stateName,
  abbreviation: stateAbbreviations[stateName],
  displayName: `${stateName} (${stateAbbreviations[stateName]})`
}));

export const statesAndCounties: Record<string, string[]> = {
  "Alabama": ["Autauga", "Baldwin", "Barbour", "Bibb", "Blount", "Bullock", "Butler", "Calhoun", "Chambers", "Cherokee"],
  "Alaska": ["Aleutians East", "Aleutians West", "Anchorage", "Bethel", "Bristol Bay", "Denali", "Dillingham", "Fairbanks North Star"],
  "Arizona": ["Apache", "Cochise", "Coconino", "Gila", "Graham", "Greenlee", "La Paz", "Maricopa", "Mohave", "Navajo"],
  "Arkansas": ["Arkansas", "Ashley", "Baxter", "Benton", "Boone", "Bradley", "Calhoun", "Carroll", "Chicot", "Clark"],
  "California": ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno"],
  "Colorado": ["Adams", "Alamosa", "Arapahoe", "Archuleta", "Baca", "Bent", "Boulder", "Broomfield", "Chaffee", "Cheyenne"],
  "Connecticut": ["Fairfield", "Hartford", "Litchfield", "Middlesex", "New Haven", "New London", "Tolland", "Windham"],
  "Delaware": ["Kent", "New Castle", "Sussex"],
  "Florida": ["Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun", "Charlotte", "Citrus", "Clay"],
  "Georgia": ["Appling", "Atkinson", "Bacon", "Baker", "Baldwin", "Banks", "Barrow", "Bartow", "Ben Hill", "Berrien"],
  "Hawaii": ["Hawaii", "Honolulu", "Kalawao", "Kauai", "Maui"],
  "Idaho": ["Ada", "Adams", "Bannock", "Bear Lake", "Benewah", "Bingham", "Blaine", "Boise", "Bonner", "Bonneville"],
  "Illinois": ["Adams", "Alexander", "Bond", "Boone", "Brown", "Bureau", "Calhoun", "Carroll", "Cass", "Champaign"],
  "Indiana": ["Adams", "Allen", "Bartholomew", "Benton", "Blackford", "Boone", "Brown", "Carroll", "Cass", "Clark"],
  "Iowa": ["Adair", "Adams", "Allamakee", "Appanoose", "Audubon", "Benton", "Black Hawk", "Boone", "Bremer", "Buchanan"],
  "Kansas": ["Allen", "Anderson", "Atchison", "Barber", "Barton", "Bourbon", "Brown", "Butler", "Chase", "Chautauqua"],
  "Kentucky": ["Adair", "Allen", "Anderson", "Ballard", "Barren", "Bath", "Bell", "Boone", "Bourbon", "Boyd", "Boyle", "Bracken", "Breathitt", "Breckinridge", "Bullitt", "Butler", "Caldwell", "Calloway", "Campbell", "Carlisle", "Carroll", "Carter", "Casey", "Christian", "Clark", "Clay", "Clinton", "Crittenden", "Cumberland", "Daviess", "Edmonson", "Elliott", "Estill", "Fayette", "Fleming", "Floyd", "Franklin", "Fulton", "Gallatin", "Garrard", "Grant", "Graves", "Grayson", "Green", "Greenup", "Hancock", "Hardin", "Harlan", "Harrison", "Hart", "Henderson", "Henry", "Hickman", "Hopkins", "Jackson", "Jefferson", "Jessamine", "Johnson", "Kenton", "Knott", "Knox", "Larue", "Laurel", "Lawrence", "Lee", "Leslie", "Letcher", "Lewis", "Lincoln", "Livingston", "Logan", "Lyon", "McCracken", "McCreary", "McLean", "Madison", "Magoffin", "Marion", "Marshall", "Martin", "Mason", "Meade", "Menifee", "Mercer", "Metcalfe", "Monroe", "Montgomery", "Morgan", "Muhlenberg", "Nelson", "Nicholas", "Ohio", "Oldham", "Owen", "Owsley", "Pendleton", "Perry", "Pike", "Powell", "Pulaski", "Robertson", "Rockcastle", "Rowan", "Russell", "Scott", "Shelby", "Simpson", "Spencer", "Taylor", "Todd", "Trigg", "Trimble", "Union", "Warren", "Washington", "Wayne", "Webster", "Whitley", "Wolfe", "Woodford"],
  "Louisiana": ["Acadia", "Allen", "Ascension", "Assumption", "Avoyelles", "Beauregard", "Bienville", "Bossier", "Caddo", "Calcasieu"],
  "Maine": ["Androscoggin", "Aroostook", "Cumberland", "Franklin", "Hancock", "Kennebec", "Knox", "Lincoln", "Oxford", "Penobscot"],
  "Maryland": ["Allegany", "Anne Arundel", "Baltimore", "Calvert", "Caroline", "Carroll", "Cecil", "Charles", "Dorchester", "Frederick", "Garrett", "Harford", "Howard", "Kent", "Montgomery", "Prince George's", "Queen Anne's", "Somerset", "St. Mary's", "Talbot", "Washington", "Wicomico", "Worcester"],
  "Massachusetts": ["Barnstable", "Berkshire", "Bristol", "Dukes", "Essex", "Franklin", "Hampden", "Hampshire", "Middlesex", "Nantucket"],
  "Michigan": ["Alcona", "Alger", "Allegan", "Alpena", "Antrim", "Arenac", "Baraga", "Barry", "Bay", "Benzie"],
  "Minnesota": ["Aitkin", "Anoka", "Becker", "Beltrami", "Benton", "Big Stone", "Blue Earth", "Brown", "Carlton", "Carver"],
  "Mississippi": ["Adams", "Alcorn", "Amite", "Attala", "Benton", "Bolivar", "Calhoun", "Carroll", "Chickasaw", "Choctaw"],
  "Missouri": ["Adair", "Andrew", "Atchison", "Audrain", "Barry", "Barton", "Bates", "Benton", "Bollinger", "Boone"],
  "Montana": ["Beaverhead", "Big Horn", "Blaine", "Broadwater", "Carbon", "Carter", "Cascade", "Chouteau", "Custer", "Daniels"],
  "Nebraska": ["Adams", "Antelope", "Arthur", "Banner", "Blaine", "Boone", "Box Butte", "Boyd", "Brown", "Buffalo"],
  "Nevada": ["Carson City", "Churchill", "Clark", "Douglas", "Elko", "Esmeralda", "Eureka", "Humboldt", "Lander", "Lincoln"],
  "New Hampshire": ["Belknap", "Carroll", "Cheshire", "Coos", "Grafton", "Hillsborough", "Merrimack", "Rockingham", "Strafford", "Sullivan"],
  "New Jersey": ["Atlantic", "Bergen", "Burlington", "Camden", "Cape May", "Cumberland", "Essex", "Gloucester", "Hudson", "Hunterdon"],
  "New Mexico": ["Bernalillo", "Catron", "Chaves", "Cibola", "Colfax", "Curry", "De Baca", "Dona Ana", "Eddy", "Grant"],
  "New York": ["Albany", "Allegany", "Bronx", "Broome", "Cattaraugus", "Cayuga", "Chautauqua", "Chemung", "Chenango", "Clinton"],
  "North Carolina": ["Alamance", "Alexander", "Alleghany", "Anson", "Ashe", "Avery", "Beaufort", "Bertie", "Bladen", "Brunswick"],
  "North Dakota": ["Adams", "Barnes", "Benson", "Billings", "Bottineau", "Bowman", "Burke", "Burleigh", "Cass", "Cavalier"],
  "Ohio": ["Adams", "Allen", "Ashland", "Ashtabula", "Athens", "Auglaize", "Belmont", "Brown", "Butler", "Carroll"],
  "Oklahoma": ["Adair", "Alfalfa", "Atoka", "Beaver", "Beckham", "Blaine", "Bryan", "Caddo", "Canadian", "Carter"],
  "Oregon": ["Baker", "Benton", "Clackamas", "Clatsop", "Columbia", "Coos", "Crook", "Curry", "Deschutes", "Douglas"],
  "Pennsylvania": ["Adams", "Allegheny", "Armstrong", "Beaver", "Bedford", "Berks", "Blair", "Bradford", "Bucks", "Butler"],
  "Rhode Island": ["Bristol", "Kent", "Newport", "Providence", "Washington"],
  "South Carolina": ["Abbeville", "Aiken", "Allendale", "Anderson", "Bamberg", "Barnwell", "Beaufort", "Berkeley", "Calhoun", "Charleston"],
  "South Dakota": ["Aurora", "Beadle", "Bennett", "Bon Homme", "Brookings", "Brown", "Brule", "Buffalo", "Butte", "Campbell"],
  "Tennessee": ["Anderson", "Bedford", "Benton", "Bledsoe", "Blount", "Bradley", "Campbell", "Cannon", "Carroll", "Carter"],
  "Texas": ["Anderson", "Andrews", "Angelina", "Aransas", "Archer", "Armstrong", "Atascosa", "Austin", "Bailey", "Bandera"],
  "Utah": ["Beaver", "Box Elder", "Cache", "Carbon", "Daggett", "Davis", "Duchesne", "Emery", "Garfield", "Grand"],
  "Vermont": ["Addison", "Bennington", "Caledonia", "Chittenden", "Essex", "Franklin", "Grand Isle", "Lamoille", "Orange", "Orleans"],
  "Virginia": ["Accomack", "Albemarle", "Alleghany", "Amelia", "Amherst", "Appomattox", "Arlington", "Augusta", "Bath", "Bedford"],
  "Washington": ["Adams", "Asotin", "Benton", "Chelan", "Clallam", "Clark", "Columbia", "Cowlitz", "Douglas", "Ferry"],
  "West Virginia": ["Barbour", "Berkeley", "Boone", "Braxton", "Brooke", "Cabell", "Calhoun", "Clay", "Doddridge", "Fayette"],
  "Wisconsin": ["Adams", "Ashland", "Barron", "Bayfield", "Brown", "Buffalo", "Burnett", "Calumet", "Chippewa", "Clark"],
  "Wyoming": ["Albany", "Big Horn", "Campbell", "Carbon", "Converse", "Crook", "Fremont", "Goshen", "Hot Springs", "Johnson"]
};

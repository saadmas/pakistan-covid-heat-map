document.addEventListener("DOMContentLoaded", main);

function main() {
  fillProvinceColors();
  addMouseOvers();
  addMouseOuts();
}

const regionPopulations = {
  sindh: 47886051,
  punjab: 110012615,
  kpk: 35525047,
  balochistan: 12344408,
  gilgit: 1900000,
  kashmir: 4045366,
  islamabad: 1014825,
  pakistan: 207774520,
};


// async function getPakData() {
//      const pakCovidData = await getCovidData.fetchCovidData();
//      return pakCovidData;
// }

// Actual function that will calculate ratio and get color for each province using live data
// async function getColorByLocation(location) {
//     const covidData = await getPakData();
//     const locationCases = parseInt(covidData["total"][location]["cases"].replace(",", ""));
//     const pakTotalCases = parseInt(covidData["total"]["pakistan"]["cases"].replace(",", ""));
//     const ratio = locationCases/pakTotalCases;
//     const color = colorShade(ratio);
//     return color;
// }


//Actual function that will update heat map based on live data
// async function updateHeatMap() {
//     $(document).ready(function() {
//         $("#PK-BA").css("fill", await getColorByLocation("balochistan"));
//         $("#PK-GB").css("fill", await getColorByLocation("gilgit"));
//         $("#PK-IS").css("fill", await getColorByLocation("islamabad"));
//         $("#PK-JK").css("fill", await getColorByLocation("kashmir"));
//         $("#PK-KP").css("fill", await getColorByLocation("kp"));
//         $("#PK-PB").css("fill", await getColorByLocation("punjab"));
//         $("#PK-SD").css("fill", await getColorByLocation("sindh"));
//         $("#PK-TA").css("fill", await getColorByLocation("kp"));
//     });
// }

function colorShade(ratio) {
  switch (true) {
    case (ratio >= 0.35):
      return "#800000";
    case (ratio >= 0.3):
      return "#B30000";
    case (ratio >= 0.25):
      return "#D21616";
    case (ratio >= 0.2):
      return "#E84040";
    case (ratio >= 0.15):
      return "#E14848";
    case (ratio >= 0.1):
      return "#FF6666";
    default:
      return "#FF9999";
  }
}

function fillProvinceColors() {
  $("#PK-BA").css("fill", getColorByLocation(9475));
  $("#PK-GB").css("fill", getColorByLocation(1288));
  $("#PK-IS").css("fill", getColorByLocation(10912));
  $("#PK-JK").css("fill", getColorByLocation(845));
  $("#PK-KP").css("fill", getColorByLocation(21997));
  $("#PK-PB").css("fill", getColorByLocation(66943));
  $("#PK-SD").css("fill", getColorByLocation(69628));
  $("#PK-TA").css("fill", getColorByLocation(21997));
}

function addMouseOvers() {
  $("#PK-BA").mousemove((e) => displayProvinceTooltip('balochistan', 9475, e));
  $("#PK-GB").mousemove((e) => displayProvinceTooltip('gilgit', 1288, e));
  $("#PK-IS").mousemove((e) => displayProvinceTooltip('islamabad', 10912, e));
  $("#PK-JK").mousemove((e) => displayProvinceTooltip('kashmir', 845, e));
  $("#PK-KP").mousemove((e) => displayProvinceTooltip('kpk', 21997, e));
  $("#PK-PB").mousemove((e) => displayProvinceTooltip('punjab', 66943, e));
  $("#PK-SD").mousemove((e) => displayProvinceTooltip('sindh', 69628, e));
  $("#PK-TA").mousemove((e) => displayProvinceTooltip('kpk', 21997, e));
}

function addMouseOuts() {
  $("#PK-BA").mouseout(hideTooltip);
  $("#PK-GB").mouseout(hideTooltip);
  $("#PK-IS").mouseout(hideTooltip);
  $("#PK-JK").mouseout(hideTooltip);
  $("#PK-KP").mouseout(hideTooltip);
  $("#PK-PB").mouseout(hideTooltip);
  $("#PK-SD").mouseout(hideTooltip);
  $("#PK-TA").mouseout(hideTooltip);
}

function hideTooltip(e) {
  $(".province-tooltip").hide();
}

function displayProvinceTooltip(provinceKey, cases, e) {
  const provinceName = mapProvinceKeyToName(provinceKey);
  const provinceNameHtml = `${provinceName}<hr/>`
  $('.province-tooltip-name').html(provinceNameHtml);

  const provinceCovidInfo = getProvinceCovidInfo(cases, provinceKey);
  $('.province-tooltip-cases').html(provinceCovidInfo);

  $(".province-tooltip").css({
    top: (e.pageY - 100) + "px",
    left: (e.pageX - 30) + "px"
  });

  $(".province-tooltip").show();
}

function getProvinceCovidInfo(cases, provinceKey) {
  const numCases = getNumberWithCommas(cases);
  const provincePopulation = regionPopulations[provinceKey];
  const populationInfected = getPopulationInfected(cases, provincePopulation);
  const provinceCovidInfo = `Cases: ${numCases} <br/>
    Population Infected: ${populationInfected}%
    `;
  return provinceCovidInfo;
}

function mapProvinceKeyToName(provinceKey) {
  switch (provinceKey) {
    case 'balochistan':
      return 'Balochistan';
    case 'gilgit':
      return 'Gilgit-Baltistan';
    case 'kashmir':
      return 'Azad Kashmir';
    case 'kpk':
      return 'Khyber Pakhtunkhwa';
    case 'punjab':
      return 'Punjab';
    case 'sindh':
      return 'Sindh';
    case 'islamabad':
      return 'Islamabad';
  }
}

function getPopulationInfected(cases, population) {
  let populationInfected = (cases / population) * 100;

  if (getDecimalCount(populationInfected) > 0) {
    const numZeroes = getNumberOfZeroDecimals(populationInfected);
    const fracDigits = numZeroes === 0 ? 2 : numZeroes + 1;
    populationInfected = populationInfected.toFixed(fracDigits);
  }

  return populationInfected;
}

function getMortalityRate(cases, deaths) {
  let mortalityRate = (deaths / cases) * 100;

  if (getDecimalCount(mortalityRate) > 0) {
    mortalityRate = mortalityRate.toFixed(2);
  }

  return mortalityRate;
}

function getRecoveryRate(cases, recoveries) {
  let recoveryRate = (recoveries / cases) * 100;

  if (getDecimalCount(recoveryRate) > 0) {
    recoveryRate = recoveryRate.toFixed(2);
  }

  return recoveryRate;
}

function getNumberWithCommas(num) {
  if (!num) {
    return '0';
  }

  if (num.toString().length < 5) {
    return num.toString();

  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getDecimalCount(num) {
  if (!num) {
    return 0;
  }

  if (Math.floor(num) === num) {
    return 0;
  }

  return num.toString().split(".")[1].length || 0;
}

function getNumberOfZeroDecimals(num) {
  if (Math.floor(num) === num) {
    return 0;
  }

  const afterDp = num.toString().split(".")[1];
  let zeroCount = 0;

  for (const val of afterDp) {
    if (val === '0') {
      zeroCount++;
    } else {
      break;
    }
  }

  return zeroCount;
}

// Temporary function used to get color using current data
function getColorByLocation(currentLocationData) {
  const ratio = currentLocationData / 181088;
  const color = colorShade(ratio);
  return color;
}

// Temporary function to update heat map based on current data
function updateHeatMap() {
  $(document).ready(onReady);
}


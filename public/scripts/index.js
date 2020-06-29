document.addEventListener("DOMContentLoaded", main);

async function main() {
  const rawRes = await fetch('https://life-first-pak-covid-heat-map.et.r.appspot.com/covid-data');
  const covidData = await rawRes.json();
  fillProvinceColors(covidData.total);
  addMouseOvers(covidData.total);
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

function fillProvinceColors(covidData) {
  $("#PK-BA").css("fill", getColorByLocation(covidData, "balochistan"));
  $("#PK-GB").css("fill", getColorByLocation(covidData, "gilgit"));
  $("#PK-IS").css("fill", getColorByLocation(covidData, "islamabad"));
  $("#PK-JK").css("fill", getColorByLocation(covidData, "kashmir"));
  $("#PK-KP").css("fill", getColorByLocation(covidData, "kp"));
  $("#PK-PB").css("fill", getColorByLocation(covidData, "punjab"));
  $("#PK-SD").css("fill", getColorByLocation(covidData, "sindh"));
  $("#PK-TA").css("fill", getColorByLocation(covidData, "kp"));
}

function getColorByLocation(covidData, location) {
  const locationCases = Number(covidData[location]["cases"].replace(",", ""));
  const pakTotalCases = Number(covidData["pakistan"]["cases"].replace(",", ""));
  const ratio = locationCases / pakTotalCases;
  const color = colorShade(ratio);
  return color;
}

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

function addMouseOvers(covidData) {
  const { balochistan, gilgit, islamabad, kashmir, kp, punjab, sindh } = covidData;
  $("#PK-BA").mousemove((e) => displayProvinceTooltip('balochistan', balochistan.cases, e));
  $("#PK-GB").mousemove((e) => displayProvinceTooltip('gilgit', gilgit.cases, e));
  $("#PK-IS").mousemove((e) => displayProvinceTooltip('islamabad', islamabad.cases, e));
  $("#PK-JK").mousemove((e) => displayProvinceTooltip('kashmir', kashmir.cases, e));
  $("#PK-KP").mousemove((e) => displayProvinceTooltip('kpk', kp.cases, e));
  $("#PK-PB").mousemove((e) => displayProvinceTooltip('punjab', punjab.cases, e));
  $("#PK-SD").mousemove((e) => displayProvinceTooltip('sindh', sindh.cases, e));
  $("#PK-TA").mousemove((e) => displayProvinceTooltip('kpk', kp.cases, e));
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

  let top = e.pageY - 100;
  let left = e.pageX - 30;
  const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  if (deviceWidth < 500) {
    top += 30;
  }

  $(".province-tooltip").css({
    top: `${top}px`,
    left: `${left}px`
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

function getPopulationInfected(casesStr, population) {
  const cases = Number(casesStr.replace(",", ""))
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

const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// covid data format
const READ_ONLY_COVID_DATA = {
  total: {
    punjab: { cases: 0 },
    sindh: { cases: 0 },
    kp: { cases: 0 },
    balochistan: { cases: 0 },
    gilgit: { cases: 0 },
    kashmir: { cases: 0 },
    islamabad: { cases: 0 },
    pakistan: {
      cases: 0,
      deaths: 0,
      recoveries: 0
    }
  }
};

async function fetchCovidData() {
  const response = await fetch('https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data/Pakistan_medical_cases');
  const text = await response.text();
  const { document } = new JSDOM(text).window;
  const covidData = parseCovidDataFromDocument(document);
  return covidData;
}

function parseCovidDataFromDocument(document) {
  const table = document.querySelector('.wikitable');
  const rows = [...table.querySelectorAll('tr')];
  const totalCountRow = rows[rows.length - 5];
  const totalCountCells = [...totalCountRow.querySelectorAll('th')];
  const provincesData = getProvincesData(totalCountCells);
  const countryData = getCountryData(totalCountCells);
  return {
    total: {
      ...provincesData,
      ...countryData
    }
  };
}

function getCountryData(totalCountCells) {
  const pakistanCases = getCaseCount(totalCountCells[8]);
  const pakistanDeaths = getCaseCount(totalCountCells[9]);
  const pakistanRecoveries = getCaseCount(totalCountCells[10]);
  return {
    pakistan: {
      cases: pakistanCases,
      deaths: pakistanDeaths,
      recoveries: pakistanRecoveries
    }
  };
}

function getProvincesData(totalCountCells) {
  const punjabCases = getCaseCount(totalCountCells[1]);
  const sindhCases = getCaseCount(totalCountCells[2]);
  const kpCases = getCaseCount(totalCountCells[3]);
  const balochistanCases = getCaseCount(totalCountCells[4]);
  const gilgitCases = getCaseCount(totalCountCells[5]);
  const kashmirCases = getCaseCount(totalCountCells[6]);
  const islamabadCases = getCaseCount(totalCountCells[7]);
  return {
    punjab: { cases: punjabCases },
    sindh: { cases: sindhCases },
    kp: { cases: kpCases },
    balochistan: { cases: balochistanCases },
    gilgit: { cases: gilgitCases },
    kashmir: { cases: kashmirCases },
    islamabad: { cases: islamabadCases },
  };
}

function getCaseCount(cell) {
  return cell.textContent.trim();
}

module.exports = { fetchCovidData };
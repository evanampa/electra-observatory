import { translate } from "./translation.js";

// Ανάκτηση δεδομένων από JSON αρχεία
async function fetchData() {
  const loader = document.getElementById("loader");
  const myDiv = document.getElementById("myDiv");

  loader.style.display = "block";
  myDiv.style.display = "none";

  try {
    const [resultsResponse, namesResponse, partiesEU] = await Promise.all([
      fetch("../db/js_file.json"),
      fetch("../db/js_file2.json"),
      fetch("../db/partiesEU.json")
    ]);

    if (!resultsResponse.ok || !namesResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const resultsData = await resultsResponse.json();
    const namesData = await namesResponse.json();
    const partiesData = await partiesEU.json();

    const partyNameMapping = createPartyMapping(namesData.data);
    const greeceParties = Object.values(partiesData.greece[0]);

    updateTable(resultsData.party, partyNameMapping, greeceParties);
    updatePercentBars(resultsData.party, partyNameMapping);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loader.style.display = "none";
    myDiv.style.display = "block";
  }
}

// Δημιουργία mapping από PARTY_ID σε shortName
function createPartyMapping(namesData) {
  const mapping = {};
  namesData.forEach((party) => {
    mapping[party.id] = party.shortName;
  });
  return mapping;
}

// Ενημέρωση πίνακα
function updateTable(data, partyNameMapping, greeceParties) {
  const tableBody = document.getElementById("table-body");
  tableBody.innerhtml = "";

  const filteredData = data.filter((row) => row.Edres !== 0);
  filteredData.forEach((row, index) => {
    const partyName = partyNameMapping[row.PARTY_ID];
    const value = greeceParties[index];

    const newRow = document.createElement("tr");
    newRow.innerhtml = `
      <td>${partyName}</td>
      <td>${row.Edres}</td>
      <td>${row.VOTES}</td>
      <td>${value}</td>

    `;
    tableBody.appendChild(newRow);
  });
}

// Ενημέρωση μπαρών ποσοστών
function updatePercentBars(data, partyNameMapping) {
  const percentContainer = document.querySelector(".data2 .data-percent");
  percentContainer.innerhtml = "";

  const filteredData = data.filter((row) => row.Edres !== 0);

  filteredData.forEach((row, index) => {
    const progressColor = getPartyColor(index);
    const progressWidth = row.Perc;
    const name = partyNameMapping[row.PARTY_ID];

    const percentBar = document.createElement("div");
    percentBar.className = "percent-bars";
    percentBar.innerhtml = `
      <div class="name">
        <div class="label">${name}</div>
        <div class="percentage">${row.Perc.toFixed(2)}%</div>
      </div>
      <div class="bar">
        <div class="progress" style="background-color: ${progressColor}; width: ${progressWidth}%"></div>
      </div>
    `;
    percentContainer.appendChild(percentBar);
  });
}

// Απόδοση χρώματος στα κόμματα
function getPartyColor(index) {
  return index % 2 === 0 ? "#000099" : "#0066ff";
}

// Αλλαγή γλώσσας και ανακατεύθυνση
async function setupLanguage() {
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang") || "en";

  await translate(language);

  document.getElementById("redirectLink").href = `../html/homepage.html?lang=${language}`;

  const electionsLink = document.getElementById("elections");
  electionsLink.href = `../html/eu-election.html?lang=${language}`;
  
  const optionLang = document.querySelector(".lang-option");
  optionLang.id = language === "en" ? "gr" : "en";

  optionLang.addEventListener("click", () => {
    const newLang = language === "en" ? "gr" : "en";
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("lang", newLang);
    window.location.href = newUrl;
  });
}

// Ρυθμίσεις counters
function setupCounters() {
  const config = {
    amountMales: 231,
    amountFemales: 69,
    increment: 1,
    counterSpeed: 20,
  };

  let i = 0;
  const counterMales = document.querySelector(".males .counter-container .number");
  const counterFemales = document.querySelector(".females .counter-container .number");

  const interval = setInterval(() => {
    if (i < config.amountMales) {
      i += config.increment;
      counterMales.innerText = i;
    } else {
      counterMales.innerText = config.amountMales;
    }

    if (i < config.amountFemales) {
      counterFemales.innerText = i;
    } else {
      counterFemales.innerText = config.amountFemales;
    }

    if (i >= config.amountMales && i >= config.amountFemales) {
      clearInterval(interval);
    }
  }, config.counterSpeed);
}

// Ρύθμιση επιλογών χωρών
function setupCountrySelection() {
  const params = new URLSearchParams(window.location.search);
  const currentLanguage = params.get("lang");

  const countryOptions = document.querySelectorAll(".countries-option");

  countryOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedId = option.id;
      if (selectedId) {
        const targetPage = getCountryPage(selectedId);
        if (targetPage) {
          window.location.href = `${targetPage}?lang=${currentLanguage}`;
        } else {
          alert("Invalid country selection.");
        }
      } else {
        alert("Please select a valid country.");
      }
    });
  });
}

function getCountryPage(countryId) {
  const pages = {
    austria: "../html/austriapage.html",
    belgium: "../html/belgiumpage.html",
    denmark: "../html/denmarkpage.html",
    estonia: "../html/estoniapage.html",
    finland: "../html/finlandpage.html",
    france: "../html/francepage.html",
    greece: "../html/greecepage.html",
    sweden: "../html/swedenpage.html",
  };
  return pages[countryId];
}

// Αρχικοποίηση
window.onload = async () => {
  await setupLanguage();
  await fetchData();
  setupCounters();
  setupCountrySelection();
};

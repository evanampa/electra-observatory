import { translate } from "./translation.js";

async function fetchData() {
  // Εμφάνιση του loader ενώ φορτώνουν τα δεδομένα
  document.getElementById("loader").style.display = "block";
  document.getElementById("myDiv").style.display = "none";

  try {
    const response = await fetch("../db/austria/austria/spiders/austria-data.json");
    const partiesEU = await fetch("../db/partiesEU.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const partiesData = await partiesEU.json();

    const tableBody = document.getElementById("table-body");
    tableBody.innerhtml = ""; // Εκκαθάριση της υπάρχουσας λίστας

    // Φιλτράρισμα των δεδομένων (μόνο όσα έχουν `seats`)
    const filteredData = data.filter((row) => row.Mandates !== "0");
    const austriaParties = Object.values(partiesData.austria[0]);

    filteredData.sort( (p1, p2) => {
      if (p1.Mandates < p2.Mandates) return 1;
      if (p1.Mandates > p2.Mandates) return -1;
      return 0;
    });
    
    let txt = "";
    filteredData.forEach(myFunction);
    
    function myFunction(value) {
      txt += value.Party + " " + value.Mandates + "<br>"; 
    }

    filteredData.forEach((row, index) => {
      const value = austriaParties[index];

      const newRow = document.createElement("tr");
      newRow.innerhtml = `
        <td>${row.Party}</td>
        <td style="justify-content: center; display:flex;">${row.Mandates}</td>
        <td>${row.Voices}</td>
        <td>${value}</td>
      `;
      tableBody.appendChild(newRow);
    });

    const percentContainer = document.querySelector(".data2 .data-percent");
    percentContainer.innerhtml = ""; // Καθαρίζουμε την υπάρχουσα λίστα
    let i = 1; 

    filteredData.forEach((row) => {
      const percentBar = document.createElement("div");
      percentBar.className = "percent-bars";

      // Ρύθμιση τιμών
      const progressColor = getPartyColor(i);  
      const progressWidth = row.Percent; 

      const newWidth = progressWidth.replace(",", ".");
      console.log(newWidth);
      percentBar.innerhtml = `
        <div class="name">
          <div class="label">${row.Short}</div>
          <div class="percentage">${row.Percent}</div>
        </div>
        <div class="bar">
          <div class="progress" style="background-color: ${progressColor}; width: ${newWidth.replace(
        " ",
        ""
      )}"></div>
        </div>
      `;

      percentContainer.appendChild(percentBar);
      i++;
    });

    // Χρώματα για τα κόμματα
    function getPartyColor(index) {
      if (index % 2 == 0) {
        return "#ff9966";
      } else {
        return "#990000";
      }
    }

    // Αν δεν υπάρχουν δεδομένα, εμφάνιση μηνύματος
    if (filteredData.length === 0) {
      const noDataRow = document.createElement("tr");
      noDataRow.innerhtml = '<td colspan="4">No data available</td>';
      tableBody.appendChild(noDataRow);
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  } finally {
    // Απόκρυψη loader και εμφάνιση περιεχομένου
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
  }
}

// Εκκίνηση της διαδικασίας φόρτωσης δεδομένων
window.onload = fetchData;

document.addEventListener("DOMContentLoaded", async () => {
  // Απόκτηση της παραμέτρου `lang` από το URL
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang") || "en"; // Default γλώσσα

  // Μετάφραση του περιεχομένου
  await translate(language);

  const redirectLink = document.getElementById("redirectLink");
  redirectLink.href = `../html/homepage.html?lang=${language}`;

  const electionsLink = document.getElementById("elections");
  electionsLink.href = `../html/eu-election.html?lang=${language}`;

  // Αλλαγή του ID για τη σωστή επιλογή γλώσσας
  const optionLang = document.querySelector(".lang-option");
  optionLang.id = language === "en" ? "gr" : "en";

  // Προσθήκη event για αλλαγή γλώσσας
  optionLang.addEventListener("click", () => {
    const newLang = language === "en" ? "gr" : "en";
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("lang", newLang); // Ενημέρωση παραμέτρου
    window.location.href = newUrl; // Ανακατεύθυνση με τη νέα γλώσσα
  });

  const config = {
    amountMales: 117,
    amountFemales: 66,
    increment: 1,
    counterSpeed: 30,
  };
  let counterMales = document.querySelector(
    ".males .counter-container .number"
  );
  let counterFemales = document.querySelector(
    ".females .counter-container .number"
  );

  let i = 0;
  setInterval(() => {
    if (i < config.amountMales) {
      i += config.increment;
      counterMales.innerText = i;
    } else {
      counterMales.innerText = config.amountMales;
    }

    if (i < config.amountFemales) {
      i += config.increment;
      counterFemales.innerText = i;
    } else {
      counterFemales.innerText = config.amountFemales;
    }
  }, config.counterSpeed);

  const currentLanguage = params.get("lang");  

  const countryOptions = document.querySelectorAll(".countries-option");

  countryOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedId = option.id; // Παίρνουμε το `id` του επιλεγμένου στοιχείου

      if (selectedId) {
        let targetPage;
        switch (selectedId) {
          case "austria":
            targetPage = "../html/austriapage.html";
            break;
          case "belgium":
            targetPage = "../html/belgiumpage.html";
            break;
          case "denmark":
            targetPage = "../html/denmarkpage.html";
            break;
          case "estonia":
            targetPage = "../html/estoniapage.html";
            break;
          case "finland":
            targetPage = "../html/finlandpage.html";
            break;
          case "france":
            targetPage = "../html/francepage.html";
            break;
          case "greece":
            targetPage = "../html/greecepage.html";
            break;
          case "sweden":
            targetPage = "../html/swedenpage.html";
            break;
          default:
            alert("Invalid country selection.");
            return;
        }

        // Ανακατεύθυνση στη σελίδα με την επιλεγμένη γλώσσα
        const redirectUrl = `${targetPage}?lang=${currentLanguage}`;
        window.location.href = redirectUrl;
      } else {
        alert("Please select a valid country.");
      }
    });
  });
  
});
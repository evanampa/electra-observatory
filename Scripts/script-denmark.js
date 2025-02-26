import { translate } from "./translation.js";

async function fetchData() {
  // Εμφάνιση του loader ενώ φορτώνουν τα δεδομένα
  document.getElementById("loader").style.display = "block";
  document.getElementById("myDiv").style.display = "none";

  try {
    const response = await fetch(
      "../db/denmark/denmark/spiders/denmark-data.json"
    );
    const partiesEU = await fetch("../db/partiesEU.json");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const partiesData = await partiesEU.json();

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Εκκαθάριση της υπάρχουσας λίστας

    // Φιλτράρισμα των δεδομένων (μόνο όσα έχουν `seats`)
    const filteredData = data.filter((row) => row.votes !== "Antal");
    const denmarkParties = Object.values(partiesData.denmark[0]);

    filteredData.sort((p1, p2) => {
      const votes1 = parseInt(p1.votes.replace(/\./g, ""), 10);
      const votes2 = parseInt(p2.votes.replace(/\./g, ""), 10);
      return votes2 - votes1;
    });

    let txt = "";
    filteredData.forEach((value) => {
      txt += `${value.name}: ${value.votes}<br>`;
    });

    filteredData.forEach((row, index) => {
      row.name = row.name.replace(/^[A-ZÆØÅ]\.\s*/, ""); // Αφαίρεση περιττών γραμμάτων

      const value = denmarkParties[index];
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${row.name}</td>
        <td>${row.votes}</td>
        <td>${value}</td>

      `;
      tableBody.appendChild(newRow);
    });

    const percentContainer = document.querySelector(".data2 .data-percent");
    percentContainer.innerHTML = "";
    let i = 1;

    filteredData.forEach((row) => {
      const percentBar = document.createElement("div");
      percentBar.className = "percent-bars";

      // Ρύθμιση τιμών
      const progressColor = getPartyColor(i);
      const progressWidth = row.percentage;

      const newWidth = progressWidth.replace(",", ".");
      console.log(newWidth);
      percentBar.innerHTML = `
        <div class="name">
          <div class="label">${row.name}</div>
          <div class="percentage">${row.percentage}</div>
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
        return "#ff9900";
      } else {
        return "#990000";
      }
    }

    // Αν δεν υπάρχουν δεδομένα, εμφάνιση μηνύματος
    if (filteredData.length === 0) {
      const noDataRow = document.createElement("tr");
      noDataRow.innerHTML = '<td colspan="4">No data available</td>';
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
  redirectLink.href = `../Html/homepage.html?lang=${language}`;

  const electionsLink = document.getElementById("elections");
  electionsLink.href = `../Html/eu-election.html?lang=${language}`;

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
    amountMales: 101,
    amountFemales: 78,
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
            targetPage = "../Html/austriapage.html";
            break;
          case "belgium":
            targetPage = "../Html/belgiumpage.html";
            break;
          case "denmark":
            targetPage = "../Html/denmarkpage.html";
            break;
          case "estonia":
            targetPage = "../Html/estoniapage.html";
            break;
          case "finland":
            targetPage = "../Html/finlandpage.html";
            break;
          case "france":
            targetPage = "../Html/francepage.html";
            break;
          case "greece":
            targetPage = "../Html/greecepage.html";
            break;
          case "sweden":
            targetPage = "../Html/swedenpage.html";
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

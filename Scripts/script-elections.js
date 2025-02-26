import { translate } from "./translation.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Απόκτηση της παραμέτρου `lang` από το URL
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang") || "en"; // Default γλώσσα

  // Μετάφραση του περιεχομένου
  await translate(language);

  const redirectLink = document.getElementById("redirectLink");
  redirectLink.href = `../html/homepage.html?lang=${language}`;

  const electionLink = document.getElementById("elections");
  electionLink.href = `../html/eu-election.html?lang=${language}`;

  // Αλλαγή του ID για τη σωστή επιλογή γλώσσας
  const optionLang = document.querySelector(".lang-option");
  optionLang.id = language === "en" ? "gr" : "en";

  // Προσθήκη event για αλλαγή γλώσσας
  optionLang.addEventListener("click", () => {
    const newLang = language === "en" ? "gr" : "en";
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("lang", newLang || "en"); // Ενημέρωση παραμέτρου
    window.location.href = newUrl; // Ανακατεύθυνση με τη νέα γλώσσα
  });

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
        const redirectUrl = `${targetPage}?lang=${currentLanguage || "en"}`;
        window.location.href = redirectUrl;
      } else {
        alert("Please select a valid country.");
      }
    });
  });

  const response = await fetch("../db/europe/europe/spiders/europe-data.json");

  const response2 = await fetch(
    "../db/europe/europe/spiders/countries-data.json"
  );

  const data = await response.json();
  const data2 = await response2.json();

  const parties = [];
  const fullnames = [];
  const percents = [];
  const seats = [];
  let i = 0;

  data.forEach((row) => {
    parties[i] = row.short;
    fullnames[i] = row.name;
    percents[i] = row.percent.replace("%", "");
    seats[i] = row.seats;
    i++;
  });

  const partiesContainer = document.querySelector(".container1 .Parties");

  data.forEach((row) => {
    const parties_map = document.createElement("div");
    parties_map.innerhtml = `
    <div class="namesContainer">
      <p style= "font-weight: bold;">${row.short}: </p>
      <p>${row.name}</p>
    </div>
    `;
    partiesContainer.appendChild(parties_map);
  });

  const table = document.querySelector(".container3 table tr");

  const countries = document.createElement("th");
  countries.innerhtml = `
    <div>
      <span data-translate="COUNTRIES"></span>
    </div>
    `;
  table.appendChild(countries);

  await translate(language);

  data.forEach((row) => {
    const partiesOfCountries = document.createElement("th");
    partiesOfCountries.innerhtml = `
    <div>
      <span>${row.short}</span>
    </div>
    `;
    table.appendChild(partiesOfCountries);
  });

  const total = document.createElement("th");
  total.innerhtml = `
  <div>
    <span data-translate="Total"></span>
  </div>
  `;
  table.appendChild(total);

  await translate(language);

  const tableBody = document.querySelector(".container3 table tbody");

  data2.forEach((row) => {
    const countriesSeats = document.createElement("tr");

    if (row.country_name == null) {
      row.country_name = "Total";
    }
    countriesSeats.innerhtml = `
    <td data-translate="${row.country_name}"></td>
    <td>${row.epp}</td>
    <td>${row.snd}</td>
    <td>${row.pfe}</td>
    <td>${row.ecr}</td>
    <td>${row.renew_europe}</td>
    <td>${row.greens_efa}</td>
    <td>${row.the_left}</td>
    <td>${row.esn}</td>
    <td>${row.ni}</td>
    <td style="font-weight: bolder;">${row.total_seats}</td>
    `;
    tableBody.appendChild(countriesSeats);
  });
  await translate(language);

  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: parties,
      datasets: [
        {
          data: percents,
          backgroundColor: [
            "rgba(60, 60, 150, 0.7)",
            "rgba(100, 149, 237, 0.7)",
            "rgba(255, 223, 0, 0.7)",
            "rgba(176, 196, 222, 0.7)",
            "rgba(30, 30, 90, 0.7)",
            "rgba(255, 194, 77, 0.7)",
            "rgba(143, 188, 143, 0.7)",
            "rgba(217, 190, 44, 0.7)",
            "rgba(176, 196, 222, 0.7)",
          ],
          borderColor: [
            "rgba(60, 60, 150, 1)",
            "rgba(100, 149, 237, 1)",
            "rgba(255, 223, 0, 1)",
            "rgba(176, 196, 222, 1)",
            "rgba(30, 30, 90, 1)",
            "rgba(255, 194, 77, 1)",
            "rgba(143, 188, 143, 1)",
            "rgba(217, 190, 44, 1)",
            "rgba(176, 196, 222, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      layout: {
        padding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      },
      plugins: {
        legend: {
          position: "left", // Moves the legend to the right
          labels: {
            boxWidth: 20, // Size of the color box
            padding: 10, // Space between items
          },
        },
      },
    },
  });

  const ctx2 = document.getElementById("myChart2");

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: parties,
      datasets: [
        {
          data: seats,
          backgroundColor: [
            "rgba(60, 60, 150, 0.7)",
            "rgba(100, 149, 237, 0.7)",
            "rgba(255, 223, 0, 0.7)",
            "rgba(176, 196, 222, 0.7)",
            "rgba(30, 30, 90, 0.7)",
            "rgba(255, 194, 77, 0.7)",
            "rgba(143, 188, 143, 0.7)",
            "rgba(217, 190, 44, 0.7)",
            "rgba(176, 196, 222, 0.7)",
          ],
          borderColor: [
            "rgba(60, 60, 150, 1)",
            "rgba(100, 149, 237, 1)",
            "rgba(255, 223, 0, 1)",
            "rgba(176, 196, 222, 1)",
            "rgba(30, 30, 90, 1)",
            "rgba(255, 194, 77, 1)",
            "rgba(143, 188, 143, 1)",
            "rgba(217, 190, 44, 1)",
            "rgba(176, 196, 222, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Disables the legend
        },
      },
    },
  });
});

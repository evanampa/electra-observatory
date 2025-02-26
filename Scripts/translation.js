async function translate(language) {
  try {
    // Φόρτωσε το JSON αρχείο
    const response = await fetch(`../${language}.json`);
    const translations = await response.json();

    // Ενημέρωσε τα στοιχεία με το data-translate
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[key]) {
        element.innerText = translations[key];
      }
    });

    // Ενημέρωση του header με βάση τη γλώσσα
    const selectedLang = document.querySelector(".selected-lang");
    const optionLang = document.querySelector(".lang-option");
    const flagImg = selectedLang.querySelector("img");

    if (language === "en") {
      selectedLang.id = "eng";
      optionLang.id = "gr";
      selectedLang.innerhtml =
        '<img src="../img/united-kingdom.png" alt="UK Flag" /> English';
      optionLang.innerhtml = '<img src="../img/greece.png" alt="Greek Flag" /> Greek';
      flagImg.src = "../img/united-kingdom.png";
    } else if (language === "gr") {
      selectedLang.id = "gr";
      optionLang.id = "eng";
      selectedLang.innerhtml =
        '<img src="../img/greece.png" alt="Greek Flag" /> Ελληνικά';
      optionLang.innerhtml =
        '<img src="../img/united-kingdom.png" alt="UK Flag" /> Αγγλικά';
      flagImg.src = "../img/greece.png";
    }
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

export { translate };

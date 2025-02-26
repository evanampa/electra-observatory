let currentLanguage = "";
import { translate } from "./translation.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Απόκτηση της παραμέτρου `lang` από το URL
    const params = new URLSearchParams(window.location.search);
    currentLanguage = params.get("lang") || "en"; // Default γλώσσα

    // Μετάφραση του περιεχομένου
    await translate(currentLanguage);

    //Διαχείριση αλλαγής γλώσσας
    const optionLang = document.querySelector(".lang-option");
    optionLang.addEventListener("click", async () => {
      const nextLanguage = optionLang.id === "gr" ? "gr" : "en";
      currentLanguage = nextLanguage; // Ενημερώνουμε την τρέχουσα γλώσσα
      await translate(nextLanguage); // Μετάφραση για τη νέα γλώσσα
    });

    const homepageLink = document.getElementById("homepage");
    
    homepageLink.addEventListener("click", function (){
      homepageLink.href = `../html/homepage.html?lang=${currentLanguage}`;
      window.location.href = homepageLink;
    });

    const electionLink = document.getElementById("electionRedirect");

    electionLink.addEventListener("click", function (){
      electionLink.href = `../html/eu-election.html?lang=${currentLanguage}`;
      window.location.href = electionLink;
    });

    const redirectButton = document.getElementById("redirectButton");
    const countriesDropdown = document.getElementById("countries");

    redirectButton.addEventListener("click", function () {
      const selectedValue = countriesDropdown.value;

      if (selectedValue) {
        switch (selectedValue) {
          case "austria":
            const austriaPage = "../html/austriapage.html";
            const austriaUrl = `${austriaPage}?lang=${currentLanguage}`;
            window.location.href = austriaUrl;
            break;
          case "belgium":
            const belgiumPage = "../html/belgiumpage.html";
            const belgiumUrl = `${belgiumPage}?lang=${currentLanguage}`;
            window.location.href = belgiumUrl;
            break;
          case "denmark":
            const denmarkPage = "../html/denmarkpage.html";
            const denmarkUrl = `${denmarkPage}?lang=${currentLanguage}`;
            window.location.href = denmarkUrl;
            break;
          case "estonia":
            const estoniaPage = "../html/estoniapage.html";
            const estoniaUrl = `${estoniaPage}?lang=${currentLanguage}`;
            window.location.href = estoniaUrl;
            break;
          case "finland":
            const finlandPage = "../html/finlandpage.html";
            const finlandUrl = `${finlandPage}?lang=${currentLanguage}`;
            window.location.href = finlandUrl;
            break;
          case "france":
            const francePage = "../html/francepage.html";
            const franceUrl = `${francePage}?lang=${currentLanguage}`;
            window.location.href = franceUrl;
            break;
          case "greece":
            const greecePage = "../html/greecepage.html";
            const greeceUrl = `${greecePage}?lang=${currentLanguage}`;
            window.location.href = greeceUrl;
            break;
          case "sweden":
            const swedenPage = "../html/swedenpage.html";
            const swedenUrl = `${swedenPage}?lang=${currentLanguage}`;
            window.location.href = swedenUrl;
            break;
          default:
            alert("Please select a valid country");
            break;
        }
      } else {
        alert("Please select a valid country");
      }
    });

    // Διαχείριση δυναμικών εικόνων
    const imageElements = document.querySelectorAll(".dynamic-image");
    const imagesFolder = "../img/random/"; // Διαδρομή για τις εικόνες
    const imageCount = 41; // Συνολικός αριθμός εικόνων
    let availableImages = Array.from({ length: imageCount }, (_, i) => i + 1);

    const getRandomUniqueImage = () => {
      if (availableImages.length === 0) {
        availableImages = Array.from({ length: imageCount }, (_, i) => i + 1);
      }
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const selectedImage = availableImages[randomIndex];
      availableImages.splice(randomIndex, 1);
      return `${imagesFolder}image${selectedImage}.jpg`;
    };

    const changeImage = (imageElement) => {
      const newImage = getRandomUniqueImage();
      //imageElement.style.opacity = 0; // Fade out
      setTimeout(() => {
        imageElement.src = newImage;
        //imageElement.style.opacity = 1; // Fade in
      },500);
    };

    imageElements.forEach((imageElement) => {
      imageElement.src = getRandomUniqueImage();
      setInterval(() => changeImage(imageElement), 5000);
    });

    // Animation για το Canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let radius = 50;
    let rotationAngle = 0;
    const zoomSpeed = 0.3;
    const minRadius = 50;
    const maxRadius = 70;
    let zoomingIn = true;

    class Particle {
      constructor(angle) {
        this.size = 8;
        this.color = "yellow";
        this.angle = angle;
      }

      update() {
        const x =
          canvas.width / 2 + radius * Math.cos(this.angle + rotationAngle);
        const y =
          canvas.height / 2 + radius * Math.sin(this.angle + rotationAngle);
        this.x = x;
        this.y = y;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        this.drawStar(this.x, this.y, 5, this.size, this.size / 2);
        ctx.closePath();
        ctx.fill();
      }

      drawStar(x, y, points, outerRadius, innerRadius) {
        let angle = Math.PI / points;
        ctx.moveTo(x + outerRadius, y);
        for (let i = 0; i < 2 * points; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          ctx.lineTo(
            x + radius * Math.cos(i * angle),
            y + radius * Math.sin(i * angle)
          );
        }
      }
    }

    const particlesArray = [];
    const numStars = 12;

    const initializeParticles = () => {
      particlesArray.length = 0;
      const angleIncrement = (2 * Math.PI) / numStars;
      for (let i = 0; i < numStars; i++) {
        const angle = i * angleIncrement;
        particlesArray.push(new Particle(angle));
      }
    };

    const handleParticles = () => {
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();

      if (zoomingIn) {
        radius += zoomSpeed;
        if (radius >= maxRadius) zoomingIn = false;
      } else {
        radius -= zoomSpeed;
        if (radius <= minRadius) zoomingIn = true;
      }

      rotationAngle += 0.01;
      requestAnimationFrame(animate);
    };

    initializeParticles();
    animate();

    // Μετάβαση από το Canvas στο κύριο περιεχόμενο
    const mainContent = document.getElementById("mainContent");
    setTimeout(() => {
      canvas.style.opacity = 0; // Fade out το Canvas
      setTimeout(() => {
        mainContent.style.display = "block"; // Εμφάνιση του κυρίου περιεχομένου
        setTimeout(() => {
          mainContent.style.opacity = 1; // Fade in του κυρίου περιεχομένου
        }, 50);
      }, 400);
    }, 3000);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

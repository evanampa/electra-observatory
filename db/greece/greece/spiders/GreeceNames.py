import scrapy
import re
import json

class GreecenamesSpider(scrapy.Spider):
    name = "GreeceNames"
    allowed_domains = ["ekloges-prev.singularlogic.eu"]
    start_urls = ["https://ekloges-prev.singularlogic.eu/2023/june/v/home/dist/model.el.js?v=X7VHqy4Pu5KO_DpzsYV7OXT2It1VuPJUf4abUhJI6ws"]

    def parse(self, response):
        # Διαβάζουμε το περιεχόμενο του JavaScript αρχείου
        javascript_code = response.text

        # Βελτιωμένο regex για να πιάσουμε το αντικείμενο E μέχρι το κλείσιμο του
        # Εξασφαλίζουμε ότι λαμβάνουμε μόνο το αντικείμενο `E` που κλείνει με ακριβώς μια κλειστή αγκύλη
        e_pattern = re.compile(r'E\s*=\s*(\{.*?\})(?=\s*;)', re.DOTALL)

        # Εντοπισμός του αντικειμένου E
        match = e_pattern.search(javascript_code)

        if match:
            # Εξαγωγή του περιεχομένου του E
            e_content = match.group(1)

            # Αποθήκευση στο αρχείο JSON χωρίς αλλαγές
            file_name = 'e_content.json'
            with open(file_name, 'w', encoding='utf-8') as f:
                json.dump(e_content, f, ensure_ascii=False, indent=4)
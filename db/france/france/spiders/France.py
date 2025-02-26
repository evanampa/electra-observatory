import scrapy


class FranceSpider(scrapy.Spider):
    name = "France"
    allowed_domains = ["www.archives-resultats-elections.interieur.gouv.fr"]
    start_urls = ["https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/ensemble_geographique/index.php"]

    def parse(self, response):
        combined_data = {}

        # Select rows from the tables
        rows_1 = response.xpath("(//table)[4]//tbody/tr")
        rows_2 = response.xpath("(//table)[2]//tbody/tr")

        # Helper function to add data to the dictionary
        def add_data(row):
            party = row.xpath("td[1]/text()").get().strip()
            voice = int(row.xpath("td[2]/text()").get().strip().replace(" ", ""))
            percentage = float(row.xpath("td[3]/text()").get().strip().replace(",", "."))
            seats = int(row.xpath("td[5]/text()").get().strip())

            if party not in combined_data:
                combined_data[party] = {
                    'party': party,
                    'voice': 0,
                    'percentage': 0.0,
                    'seats': 0
                }

            # Aggregate the data
            combined_data[party]['voice'] += voice
            combined_data[party]['percentage'] += percentage
            combined_data[party]['seats'] += seats

        # Process both tables
        for row in rows_1:
            add_data(row)

        for row in rows_2:
            add_data(row)

        # Yield combined results
        for party, data in combined_data.items():
            yield {
                'party': data['party'],
                'voice': data['voice'],
                'percentage': f"{data['percentage']:.2f}",  # Adjust if needed
                'seats': data['seats'],
            }


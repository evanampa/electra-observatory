import json
import scrapy


class FinlandSpider(scrapy.Spider):
    name = "Finland"
    allowed_domains = ["tulospalvelu.vaalit.fi"]
    start_urls = ["https://tulospalvelu.vaalit.fi/EKV-2023/en/tulos_kokomaa.html"]

    def parse(self, response):
        # Find all rows in the table
        rows = response.xpath('//table[contains(@class, "tulosPuolueTaulu")]/tbody/tr')
        self.logger.info(f'Found {len(rows)} rows')

        results = []  # List to hold all election results

        # Extract data from each row
        for row in rows:
            party_name = row.xpath('td[@class="tulosPuolue"]/text()').get()
            votes = row.xpath('td[@class="colorGrey puoAan"]/text()').get()
            percentage = row.xpath('td[@class="colorGrey puoPros"]/text()').get()
            seats = row.xpath('td[@class="colorGrey puoPaik"]/text()').get()

            if party_name and votes and percentage and seats:
                result = {
                    'Party': party_name.strip(),
                    'Votes': votes.strip(),
                    'Percentage': percentage.strip(),
                    'Seats': seats.strip()
                }
                results.append(result)
            else:
                self.logger.warning('Missing data in row: ' + row.get())

        # Save results to a JSON file if any data was collected
        if results:
            with open('finland-data.json', 'w', encoding='utf-8') as json_file:
                json.dump(results, json_file, ensure_ascii=False, indent=4)
            self.logger.info(f'Saved results to results.json')
        else:
            self.logger.warning('No data extracted, finland-data.json will be empty')


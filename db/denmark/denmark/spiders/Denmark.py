import scrapy


import scrapy

class DenmarkSpider(scrapy.Spider):
    name = "Denmark"
    allowed_domains = ["www.dst.dk"]
    start_urls = ["https://www.dst.dk/valg/Valg1968094/valgopg/valgopgHL.htm"]

    def parse(self, response):
        # Find all rows in the table
        rows = response.xpath('//table[@class="valgopg_tabel"]/tr')

        # Extract data from each row
        for row in rows:
            name = row.xpath('td[1]/text()').get()
            votes = row.xpath('td[2]/text()').get()
            percentage = row.xpath('td[3]/text()').get()

            # Check if values are found before logging
            if name is not None and votes is not None and percentage is not None:
                name = name.strip()
                votes = votes.strip()
                percentage = percentage.strip()

                self.logger.info(f'Name: {name}, Votes: {votes}, Percentage: {percentage}')
                
                # Yielding the data as a dictionary
                yield {
                    'name': name,
                    'votes': votes,
                    'percentage': percentage,
                }


import scrapy


class EstoniaSpider(scrapy.Spider):
    name = "Estonia"
    allowed_domains = ["rk2023.valimised.ee"]
    start_urls = ["https://rk2023.valimised.ee/en/election-result/index.html"]

    def parse(self, response):
        # Get all rows in the table
        rows = response.xpath('//table[@class="table elect-party mb-0"]/tbody/tr')

        for row in rows:
            # Extract the party name
            party = row.xpath('./td[@class="text-right" and @translate="no"]/text()').get(default='').strip()

            # Extract the vote count
            votes = row.xpath('./td[@class="text-right"]/strong/text()').get(default='').strip()

            # Extract only the first percentage
            percentage = row.xpath('./td[@class="align-items-center results"]//p/text()').get(default='').strip()

            # Extract the mandate count
            mandates = row.xpath('./td[@class="text-left"]/strong/text()').get(default='').strip()

            # If a valid party name exists, yield the result
            if party:
                yield {
                    'party': party,
                    'votes': votes,
                    'percentage': percentage,  # Only the first percentage
                    'mandates': mandates
                }

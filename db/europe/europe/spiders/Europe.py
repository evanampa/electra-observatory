import scrapy


class EuropeSpider(scrapy.Spider):
    name = "Europe"
    allowed_domains = ["results.elections.europa.eu"]
    start_urls = ["https://results.elections.europa.eu/en/european-results/2024-2029/"]


    def parse(self, response):
        # Set to keep track of already seen short names
        seen_short_names = set()

        table = response.xpath('//table[contains(@class, "breakdown-table-with-internal-borders")]')

        for row in table.xpath('.//tr[contains(@class, "breakdown-table--row")]'):
            short_name = row.xpath('.//td[contains(@class, "breakdown-table--column-1")]//strong[@class="breakdown-table--group-acronym"]/text()').get()
            
            if short_name and short_name in seen_short_names:
                # Skip this row if the short name has already been seen
                continue

            seen_short_names.add(short_name)

            full_name = row.xpath('.//td[contains(@class, "breakdown-table--column-1")]//span[@class="breakdown-table--separator"]/following-sibling::text()').get()
            seats = row.xpath('.//td[contains(@class, "breakdown-table--column-2")][1]/strong/text()').get()
            percent = row.xpath('.//td[contains(@class, "breakdown-table--column-2")][2]/strong/text()').get()
            
            yield {
                'short': short_name.strip() if short_name else '',
                'name': full_name.strip() if full_name else '',
                'seats': seats.strip() if seats else '0',
                'percent': percent.strip() if percent else '0%',
            }

import scrapy

class BelgiumSpider(scrapy.Spider):
    name = "Belgium"
    allowed_domains = ["wahlergebnisse.belgium.be"]
    start_urls = ["https://wahlergebnisse.belgium.be/de/election-results/abgeordnetenkammer/2019/k%C3%B6nigreich/223373"]

    def parse(self, response):
        # Extracting desired data
        results = response.css('.row-candidate')
        for result in results:
            party = result.xpath('.//div[@class="col-12 col-md-4"]/strong/following-sibling::text()').get().strip()
            seats = result.xpath('.//div[contains(strong, "Anzahl Sitze")]/strong/following-sibling::text()').get()
            if seats:
                seats = seats.strip()
            votes = result.xpath('.//div[contains(strong, "Anzahl Stimmen")]/strong/following-sibling::text()').get().strip()
            percentage = result.css('.row-candidate span.badge-primary::text').get().strip()

            yield {
                'party': party,
                'seats': seats,
                'votes': votes,
                'percentage': percentage
            }

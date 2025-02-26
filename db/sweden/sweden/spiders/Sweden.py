import scrapy


class SwedenSpider(scrapy.Spider):
    name = "Sweden"
    allowed_domains = ["www.val.se"]
    start_urls = ["https://www.val.se/servicelankar/otherlanguages/englishengelska/electionresults/electionresults2022.4.14c1f613181ed0043d5583f.html"]

    def parse(self, response):
        # Select the rows in the table (excluding the header)
        rows = response.xpath('//table/tbody/tr')

        for row in rows:
            # Extract data for each column (party, share of votes, and seats)
            party = row.xpath('td[1]/p/text()').get().strip()
            share_of_votes = row.xpath('td[2]/p/text()').get().strip()
            seats = row.xpath('td[3]/p/text()').get().strip()

            yield {
                'Party': party,
                'Votes': share_of_votes,
                'Seats': seats
            }


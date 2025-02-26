import logging
import scrapy


class CountriesSpider(scrapy.Spider):
    name = "Countries"
    allowed_domains = ["results.elections.europa.eu"]
    start_urls = ["https://results.elections.europa.eu/en/seats-political-group-country/2024-2029/"]

    def parse(self, response):
        rows = response.xpath("//tbody[@id='seats-political-group-base-table']/tr")  # Get all rows
        for row in rows:
            # Extract country name
            country_name = row.xpath(".//th[@scope='row']/a/span[@class='seats-all--long seats-all--long--country-name']/text()").get()
            
            # Extract the seat counts for each group
            epp_seats = row.xpath(".//td[1]/span/text()").get() or '0'
            s_and_d_seats = row.xpath(".//td[2]/span/text()").get() or '0'
            pfe_seats = row.xpath(".//td[3]/span/text()").get() or '0'
            ecr_seats = row.xpath(".//td[4]/span/text()").get() or '0'
            renew_europe_seats = row.xpath(".//td[5]/span/text()").get() or '0'
            greens_efa_seats = row.xpath(".//td[6]/span/text()").get() or '0'
            the_left_seats = row.xpath(".//td[7]/span/text()").get() or '0'
            esn_seats = row.xpath(".//td[8]/span/text()").get() or '0'
            ni_seats = row.xpath(".//td[9]/span/text()").get() or '0'
            
            # Extract total seats
            total_seats = row.xpath(".//td[10]/strong/text()").get()

            yield {
                'country_name': country_name,
                'epp': epp_seats,
                'snd': s_and_d_seats,
                'pfe': pfe_seats,
                'ecr': ecr_seats,
                'renew_europe': renew_europe_seats,
                'greens_efa': greens_efa_seats,
                'the_left': the_left_seats,
                'esn': esn_seats,
                'ni': ni_seats,
                'total_seats': total_seats
            }

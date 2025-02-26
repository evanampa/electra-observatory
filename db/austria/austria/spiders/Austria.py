import scrapy


class AustriaSpider(scrapy.Spider):
    name = "Austria"
    allowed_domains = ["www.bmi.gv.at"]
    start_urls = ["https://www.bmi.gv.at/412/Nationalratswahlen/Nationalratswahl_2024/start.aspx#pk_00"]

    def parse(self, response):
        for row in response.xpath('//table//tr'):
            # Extract table data cells (td) within each row
            cells = row.xpath('.//td/text()').getall()
            
            # If cells were found, yield the data
            if cells:
                yield {
                    'Party': cells[0],
                    'Short': cells[1],
                    'Voices': cells[2],
                    'Percent': cells[3],
                    'Mandates': cells[4]
                }

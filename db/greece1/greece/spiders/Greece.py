import scrapy
import json

class GreeceSpider(scrapy.Spider):
    name = 'Greece'
    allowed_domains = ['https://ekloges-prev.singularlogic.eu/']

    def start_requests(self):
        url = 'https://ekloges-prev.singularlogic.eu/2023/june/dyn1/v/epik_1.js'
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        json_data = json.loads(response.body)
        file_name = 'js_file.json'  # Specify the file name here
        with open(file_name, 'w') as f:
            json.dump(json_data, f)
        self.log(f'File {file_name} saved.')

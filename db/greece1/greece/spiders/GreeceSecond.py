import scrapy
import re
import csv
import json

class GreeceSecondSpider(scrapy.Spider):
    name = "GreeceSecond"
    allowed_domains = ["ekloges-prev.singularlogic.eu"]
    start_urls = ['https://ekloges-prev.singularlogic.eu/2023/june/v/home/dist/model.el.js?v=X7VHqy4Pu5KO_DpzsYV7OXT2It1VuPJUf4abUhJI6ws']

    def parse(self, response):
        # Parsing the JavaScript file to extract the data
        javascript_code = response.text

        # Define regular expression to extract data
        data_pattern = re.compile(r'\{id:(\d+),name:"([^"]+)",shortName:"([^"]+)"')

        # Extracting data using regular expression
        data = []
        for match in data_pattern.finditer(javascript_code):
            obj_id = match.group(1)
            name = match.group(2)
            short_name = match.group(3)
            data.append((obj_id, name, short_name))

        data_dict = {
            "data": [
                {"id": obj_id, "name": name, "shortName": short_name}
                for obj_id, name, short_name in data
            ]
        }
        # Saving the extracted data to a CSV file
        #file_name = 'js_file2.csv'
        #with open(file_name, 'w', newline='', encoding='utf-8') as f:
        ##    writer = csv.writer(f)
         #   writer.writerow(['id', 'name', 'shortName'])
          #  writer.writerows(data)




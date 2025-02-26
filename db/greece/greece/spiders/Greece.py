import scrapy
import json
import csv

class GreeceSpider(scrapy.Spider):
    name = 'Greece'
    allowed_domains = ['ekloges-prev.singularlogic.eu']

    def start_requests(self):
        url = 'https://ekloges-prev.singularlogic.eu/2023/june/dyn1/v/epik_1.js'
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        # Decode the response body to ensure it's read correctly
        json_data = json.loads(response.body.decode('utf-8'))
        
        # Specify the CSV file name here
        csv_file_name = 'greece-data.csv'
        
        # Extracting the 'party' data
        parties = json_data.get('party', [])
        
        # Define the CSV column headers
        csv_headers = ['EPIK_ID', 'PARTY_ID', 'VOTES', 'Perc', 'TakesEdres', 'Edres', 'EdresEpik', 'Rank']
        
        # Writing to CSV
        with open(csv_file_name, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=csv_headers)
            writer.writeheader()
            for party in parties:
                writer.writerow(party)
        
        self.log(f'CSV file {csv_file_name} saved.')

        # Print log message to console for debugging purposes
        print(f'CSV file {csv_file_name} saved.')

import scrapy
import scrapy_selenium
from scrapy_selenium import SeleniumRequest
import pandas as pd
import re

import csv
import xlrd
import codecs
from datetime import datetime
import dateutil.parser as dparser
import calendar


# Class for defining how your spider is gonna work~!
class ChromeExtensionsMeta(scrapy.Spider):
    # Name of this spider
    name = 'chrome666_extensions'
    start_urls = ['https://www.chrome666.com/']
    headers = {
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.378"

    }

    # PREPARATION for Start Requests
    # before parsing
    def start_requests(self):
        # List of urls for crawling
        urls = []
        # Path to keywords.csv
        # path_keywords_csv = './malicious_ext_crawler/spiders/all_keywords.csv'
        path_keywords_xlsx='./malicious_ext_crawler/spiders/short_keywords_Chinese.xlsx'

        # READ and GENERATE urls with keywords
        # in this part, have to change the excel file to one column format
        workbook = xlrd.open_workbook(path_keywords_xlsx)
        worksheet=workbook.sheet_by_index(0)
        data=worksheet.col_values(0)

        # with open(path_keywords_csv, mode='r', encoding='utf-8-sig') as csv_file:
        #     data = csv.reader(csv_file)
            
        for row_keyword in data:
            combined_keyword_url = 'https://www.chrome666.com/?s=%s' % row_keyword
            urls.append(combined_keyword_url)
        # SEND and REQUEST the urls using selenium driver/chrome
        for url in urls:
            yield scrapy_selenium.SeleniumRequest(url=url, callback=self.parse, headers=self.headers)

    # PARSING the data from pages
    # @response :response from selenium requests
    def parse(self, response):
        # get full response
        extensions = response.css('article')
        # get extension details
        for extension in extensions:
            # Extract metadata of each extensions

            name_origin = extension.css('header > h2 > a::attr(title)').get()
            name=name_origin

            download_btn=extension.css('div > a::attr(href)').get()
            if download_btn is not None:
                download_link=download_btn
            else:
                download_link='null'
            
            # get the meta info
            # last_updated=extension.css('').get()
            # creator=extension.css('').get()
            last_updated='2020-00-00'
            creator='chrome666'

            rating=-1
            download_numbers=-1

            yield {
                'platform': "chrome666",
                "download_link": download_link,
                'name': name,
                'rating': rating,
                'download_numbers': download_numbers,
                'creator': creator,
                'last_updated': last_updated,
                'reviews': []  # as a empty list if there is no valid reviews
            }
        # NEXT PAGE and repeat parse method.
        next_page = response.css('div.pagination > ul > li.next-page > a::attr(href)').get()
        if next_page is not None:
            yield scrapy_selenium.SeleniumRequest(url=next_page, callback=self.parse, headers=self.headers)

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
class GugeExtensionsMeta(scrapy.Spider):
    # Name of this spider
    name = 'guge_extensions'
    start_urls = ['https://www.gugeapps.net']
    headers = {
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.378"

    }

    # PREPARATION for Start Requests
    # before parsing
    def start_requests(self):
        # List of urls for crawling
        urls = []
        # Path to keywords.csv
        path_keywords_csv = './malicious_ext_crawler/spiders/all_keywords.csv'

        path_keywords_xlsx='./malicious_ext_crawler/spiders/short_keywords_Chinese.xlsx'

        # READ and GENERATE urls with keywords
        # in this part, have to change the excel file to one column format
        workbook = xlrd.open_workbook(path_keywords_xlsx)
        worksheet=workbook.sheet_by_index(0)
        data=worksheet.col_values(0)


        # # READ and GENERATE urls with keywords
        # with open(path_keywords_csv, mode='r', encoding='utf-8-sig') as csv_file:
        #     data = csv.reader(csv_file)

        for row_keyword in data:
            combined_keyword_url = 'https://www.gugeapps.net/webstore/search?key=%s' % row_keyword
            urls.append(combined_keyword_url)
        # SEND and REQUEST the urls using selenium driver/chrome
        for url in urls:
            yield scrapy_selenium.SeleniumRequest(url=url, callback=self.parse, headers=self.headers)

    # PARSING the data from pages
    # @response :response from selenium requests
    def parse(self, response):
        # get full response
        extensions = response.css('a.a-d-na.a-d.webstore-test-wall-title.a-d-zc.Xd.dd')
        # get extension details
        for extension in extensions:
            # Extract metadata of each extensions

            name = extension.css('div.a-na-d-w::text').get()
            creator=extension.css('span.oc::text').get()
            details_link = extension.css('a.h-Ja-d-Ac.a-u::attr(href)').get()

            if details_link is not None:
                details_link = response.urljoin(details_link)
                yield scrapy_selenium.SeleniumRequest(url=details_link, callback=self.parse_extension, cb_kwargs={'name': name, 'creator': creator}, headers=self.headers)

        # NEXT PAGE and repeat parse method.
        # next_page = response.css('a.hidden-text::attr("href")').get()
        # if next_page is not None:
        #     next_page = response.urljoin(next_page)
        #     yield scrapy_selenium.SeleniumRequest(url=next_page, callback=self.parse, headers=self.headers)

    # PARSING extensions
    # @parameters take parameters that are parsed data from previous request
    def parse_extension(self, response, name, creator):

        user_number_origin=response.css('span.e-f-ih::attr(title)').get()
        user_number=user_number_origin[:-3]
        user_number.replace(',','')

        # Example data format of rating: 平均评分为3.45544
        rating_origin = response.css('div.KnRoYd-N-k::attr(title)').get()
        rating=rating_origin[5:9]

        download_numbers=-1
        formated_last_updated='0000-00-00'

        last_updated=response.css('#home > div.container > div > div:nth-child(2) > div.col-lg-6.col-sm-4 > div > span:nth-child(4)::text').get()
        
        download_link=response.css('div.g-c-R.webstore-test-button-label > a::attr(href)').get()

        # For extensions that dont have reviews (no reviews_links)
        yield {
            'platform': "opera",
            "download_link": download_link,
            'name': name,
            'rating': rating,
            'download_numbers': download_numbers,
            'creator': creator,
            'last_updated': last_updated,
            'reviews': []  # as a empty list if there is no valid reviews
        }

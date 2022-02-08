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
class HuajiaExtensionsMeta(scrapy.Spider):
    # Name of this spider
    name = 'huajia_extensions'
    start_urls = ['https://huajiakeji.com']
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
            combined_keyword_url = 'https://huajiakeji.com/search/%s' % row_keyword
            urls.append(combined_keyword_url)
        # SEND and REQUEST the urls using selenium driver/chrome
        for url in urls:
            yield scrapy_selenium.SeleniumRequest(url=url, callback=self.parse, headers=self.headers)

    # PARSING the data from pages
    # @response :response from selenium requests
    def parse(self, response):
        # get full response
        extensions = response.css('div.content-wrap > div > article')
        # get extension details
        for extension in extensions:
            # Extract metadata of each extensions

            name = extension.css('div > h3 > a::text').get()
            rating_origin=extension.css('span.stars > img::attr(alt)').get()
            rating=rating_origin[:3]

            details_link = extension.css('div > h3 > a::attr(href)').get()

            if details_link is not None:
                details_link = response.urljoin(details_link)
                yield scrapy_selenium.SeleniumRequest(url=details_link, callback=self.parse_extension, cb_kwargs={'name': name,'rating':rating}, headers=self.headers)


    # PARSING extensions
    # @parameters take parameters that are parsed data from previous request
    def parse_extension(self, response, name,rating):

        creator_css = response.css('h2.h-byline')
        creator = creator_css.css('a::text').get()

        download_numbers=-1

        formated_last_updated='0000-00-00'
        last_updated_origin=response.css('div.article-time > span:nth-child(1) > time::text').get()
        tmp=re.split(r'[/:\s]\s*',last_updated_origin)
        formated_last_updated='%s-%s-%s' % (tmp[0],tmp[1],tmp[2])

        download_link = response.css('#main > div > div.content-wrap > div > article > section.article-entry > div.article-content > p:nth-child(5) > a::attr(href)').get()

        # reviews_list = [] # Store reviews list and void repeating in parse reviews
        # store previous parsed data as a dictionary

        # For extensions that dont have reviews (no reviews_links)
        yield {
            'platform': "huajia",
            "download_link": download_link,
            'name': name,
            'rating': rating,
            'download_numbers': download_numbers,
            'creator': creator,
            'last_updated': formated_last_updated,
            'reviews': []  # as a empty list if there is no valid reviews
        }

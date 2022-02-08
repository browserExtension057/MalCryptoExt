import scrapy
import scrapy_selenium
from scrapy_selenium import SeleniumRequest
from selenium import webdriver
import pandas as pd
import re

import csv
import codecs
from datetime import datetime
import dateutil.parser as dparser
import calendar


# Class for defining how your spider is gonna work~!
class CrxExtensionsMeta(scrapy.Spider):
    # Name of this spider
    name = 'crx_extensions'
    start_urls = ['https://www.crx4chrome.com/']
    headers = {
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.378"

    }

    def __init__(self):
        self.driver=webdriver.Chrome()
    # PREPARATION for Start Requests
    # before parsing
    def start_requests(self):
        # List of urls for crawling
        urls = []
        # Path to keywords.csv
        path_keywords_csv = './malicious_ext_crawler/spiders/short_keywords.csv'
        # READ and GENERATE urls with keywords
        with open(path_keywords_csv, mode='r', encoding='utf-8-sig') as csv_file:
            data = csv.reader(csv_file)
            for row_keyword in data:
                combined_keyword_url = 'https://www.crx4chrome.com/s.php?s=%s' % row_keyword[0]
                urls.append(combined_keyword_url)
        # SEND and REQUEST the urls using selenium driver/chrome
        for url in urls:
            yield scrapy_selenium.SeleniumRequest(url=url, callback=self.parse, headers=self.headers,cb_kwargs={'url':url})

    # PARSING the data from pages
    # @response :response from selenium requests
    def parse(self, response,url):
        # # get full response
        # extensions = response.css('div.gsc-expansionArea')
        # # get extension details
        # for extension in extensions:
        #     # Extract metadata of each extensions
        #     detail_link=extension.css('a::attr(data-ctorig').get()

        #     # There are two possible of the detail link
        #     # one is https://www.crx4chrome.com/crx/215645/
        #     # another one is https://www.crx4chrome.com/extensions/gannpgaobkkhmpomoijebaigcapoeebl/
        #     tmp=re.split(r'[.:/\s]\s*',detail_link)
        #     # Example tmp data is ['https','','','www','domain1','com',...]
        #     if tmp[6]=='crx':
        #         yield scrapy_selenium.SeleniumRequest(url=detail_link,callback=self.parse_detail, headers=self.headers)
        #     elif tmp[6]=='extensions':
        #         yield scrapy_selenium.SeleniumRequest(url=detail_link,callback=self.parse_mid, headers=self.headers)
        #     else: 
        #         return
            
        # NEXT PAGE and repeat parse method.
        self.driver.get(url)
        next_pages = self.driver.find_element_by_xpath('//*[@id="___gcse_0"]/div/div/div/div[5]/div[2]/div[1]/div/div[2]/div')
        for next_page in next_pages:
            next_page.click()

            extensions = self.driver.find_elements_by_css_selector('div.gsc-expansionArea')
            # get extension details
            for extension in extensions:
                # Extract metadata of each extensions
                detail_link=extension.find_elements_by_css_selector('a').get_attribute("data-ctorig")

                # There are two possible of the detail link
                # one is https://www.crx4chrome.com/crx/215645/
                # another one is https://www.crx4chrome.com/extensions/gannpgaobkkhmpomoijebaigcapoeebl/
                tmp=re.split(r'[.:/\s]\s*',detail_link)
                # Example tmp data is ['https','','','www','domain1','com',...]
                if tmp[6]=='crx':
                    yield scrapy_selenium.SeleniumRequest(url=detail_link,callback=self.parse_detail, headers=self.headers)
                elif tmp[6]=='extensions':
                    yield scrapy_selenium.SeleniumRequest(url=detail_link,callback=self.parse_mid, headers=self.headers)
                else: 
                    return
            

    # PARSING middle step
    def parse_mid(self,response):
        # Example data: /crx/222343
        detail_path=response.css('#blocks-left > div.post-content > div > div.speca > div:nth-child(1) > strong > a::attr("href")').get()
        detail_link='https://www.crx4chrome.com'+detail_path

        yield scrapy_selenium.SeleniumRequest(url=detail_link,callback=self.parse_detail,headers=self.headers)


    # PARSING details
    # @response :response from selenium requests
    def parse_detail(self,response):
        download_link=response.css('#blocks-left > div > div > blockquote:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span > a::attr("href")').get()
        name=response.css('#blocks-left > div > div > div.post-top > div.post-title > h1::text').get()

        last_updated_origin=response.css('#blocks-left > div > div > div.post-top > div.post-title > p:nth-child(3) > span::text').get()
        # Example data: Updated: July 24, 2020
        last_updated=last_updated_origin[9:]
        date_list=re.split(r'[.;,\s]\s*',last_updated)
        month_num=list(calendar.month_name).index(date_list[0])
        # yyyy-mm-dd
        formated_last_updated='%s-%s-%s' % (date_list[2],month_num,date_list[1])

        crx_name_origin=response.css('#blocks-left > div > div > blockquote:nth-child(13) > div > p:nth-child(1)').get()
        # Example data: dot Crx File: ***id****-version-www.Crx4Chrome.com.crx
        tmp=re.split(r'(?:-|:|\s)\s*',crx_name_origin)
        id=tmp[3]
        version=tmp[4]

        rating_origin=response.css('#blocks-left > div > div > div.post-top > div.post-title > p:nth-child(2) > img::attr("title")').get()
        # Example data: 690 votes, average: 3.59 out of 5
        tmp=re.split(r'(?:,|:|\s)\s*',rating_origin)
        rating=tmp[3]
    

        creator="null"
        download_numbers=-1


        yield {
            'platform': "Crx4Chrome",
            "download_link": download_link,
            'name': name,
            'id':id,
            'version':version,
            'rating': rating,
            'download_numbers': download_numbers,
            'creator': creator,
            'last_updated': formated_last_updated,
            'reviews': []  # as a empty list if there is no valid reviews
        }

import scrapy
import scrapy_selenium
from scrapy_selenium import SeleniumRequest
import pandas as pd
import re
import json
import csv
# For beautiful soup using
from bs4 import BeautifulSoup
import requests

import dateutil.parser as dparser
import datetime

import sys



class ChromeExtensions(scrapy.Spider):
    # Name of this spider
    name = 'chrome_extensions'
    # start_urls = ['https://chrome.google.com/webstore/search/ledger?hl=en']
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Length": "0",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
        #"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
    theFileName='_[-1]'

    def __init__(self, ExportFile=None,*args, **kwargs):
        self.theFileName=ExportFile

    def start_requests(self):
        # list of crawled_extensions
        list_crawled_ext = []
        # list of urls
        urls = []
        # Path to keywords.csv
        path_keywords_csv = 'malicious_ext_crawler/spiders/all_keywords_with_anagram.csv'
        # path_keywords_csv = 'malicious_ext_crawler/spiders/test_keywords.csv'
        # READ and GENERATE urls with keywords 
        with open(path_keywords_csv, mode='r', encoding='utf-8-sig') as csv_file:
            data = csv.reader(csv_file)
            for row_keyword in data:
                url1 = 'https://chrome.google.com/webstore/ajax/item?hl=en&gl=SG&pv=20201016&mce=atf%2Cpii%2Crtr%2Crlb%2Cgtc%2Chcn%2Csvp%2Cwtd%2Chap%2Cnma%2Cdpb%2Car2%2Crp2%2Cutb%2Chbh%2Cc3d%2Cncr%2Chns%2Cctm%2Cac%2Chot%2Chsf%2Cmac%2Cepb%2Cfcf%2Crma&count=100&category=extensions&searchTerm='
                url2 = '%s&sortBy=0&container=CHROME&_reqid=13579&rt=j' % row_keyword[0]
                combined_keyword_url = url1+url2
                urls.append(combined_keyword_url)
        # SEND and REQUEST the urls using selenium driver/chrome
        for url in urls:
            print("********"+url+'\n')
            request_temp = scrapy.Request(url, method='POST', callback=self.parseapi, headers = self.headers, cb_kwargs={'list_crawled_ext':list_crawled_ext})
        
            yield request_temp

    def parseapi(self, response, list_crawled_ext):
        raw_data = response.body.decode("utf-8")
        removed = raw_data.replace(')]}\'','')
        data = json.loads(removed)
        # Get the list of extensions
        list_extensions = data[0][1][1]
        
        
        # 20 for each request
        for each_extension in list_extensions:

            id_ex = each_extension[0]
            key = each_extension[61]
            name = each_extension[1]
            creator = each_extension[2]
            rating = each_extension[12]
            user_numbers = re.findall("[-+]?\d*\,?\d+|\d+", each_extension[23])
            details_link = each_extension[37]
            introduction=each_extension[6]
            record_time=str(datetime.datetime.now())
            if details_link is not None:
                # details_link = response.urljoin(details_link)
                r = requests.get(details_link)
                soup = BeautifulSoup(r.content, 'html.parser')
                # title = soup.title.text
                last_updated = soup.find('span', class_='C-b-p-D-Xe h-C-b-p-D-xh-hh').text
 
                formated_last_updated = dparser.parse(last_updated,fuzzy=True)

            
            # previous_data["id_ex"] = id_ex
            ext = {
                'platform': "chrome",
                'id': id_ex,
                'key': key,
                'name': name,
                'rating': rating,
                'user_numbers': user_numbers[0],
                'creator': creator,
                'last_updated': formated_last_updated.strftime('%Y-%m-%d 00:00:00'),
                'record_time':record_time,
                'introduction':introduction,
            }

            list_crawled_ext.append(ext)

            # Export all
        name_exported_file = 'data/chrome/full_list/chrome_ext_data%s.json' % self.theFileName
        with open(name_exported_file, 'w') as jsonfile:
                json.dump(list_crawled_ext, jsonfile, indent=2)

        
    
    
    
 
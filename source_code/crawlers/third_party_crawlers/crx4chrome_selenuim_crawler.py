import selenium
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import json
import datetime
import csv
import re
import xlrd
import time

# Add one extension to the output list
# Write JSON file
def addOneExtIntoFile(item,output_file):
    print('add one extension info to the file')
    file_path=output_file
    tmp_list=[]

    # In this case, the file must be undefined or not null(size is not 0)
    # Otherwise, error will occur
    try:
        with open(file_path,'r') as f:
            tmp_list=json.load(f)
    except:
        print("the file size is 0")

    # Add item
    tmp_list.append(item)

    with open(file_path,'w') as f:
        json.dump(tmp_list,f)
    
def handleHistoryExt(url,output_file):
    print('start to handle history extension')  
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    subdriver=webdriver.Chrome(chrome_options=option)
    subdriver.get(url)
    subelements=WebDriverWait(subdriver,10).until(EC.presence_of_element_located((By.TAG_NAME,'body')))

    sub_url=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/div[4]/ol/li[1]/p[1]/strong/a').get_attribute('href')
    full_url='https://crx4chrome.com'+sub_url
    subdriver.close()
    handleCurrentExt(full_url,output_file)

def handleAppExt(url,output_file):
    print('start to handle history extension')  
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    subdriver=webdriver.Chrome(chrome_options=option)
    subdriver.get(url)
    subelements=WebDriverWait(subdriver,10).until(EC.presence_of_element_located((By.TAG_NAME,'body')))

    sub_url=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div[1]/div/div[5]/div[1]/strong/a').get_attribute('href')
    full_url='https://crx4chrome.com'+sub_url
    subdriver.close()
    handleCurrentExt(sub_url,output_file)

def handleCurrentExt(url,output_file):
    print('start to handle current extension')
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    subdriver=webdriver.Chrome(chrome_options=option)
    subdriver.get(url)
    subelements=WebDriverWait(subdriver,10).until(EC.presence_of_element_located((By.TAG_NAME,'body')))

    download_link=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/blockquote[1]/div[1]/div[1]/div[2]/span/a').get_attribute('href')

    intro=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/div[5]/p[1]').text
    crx_name_origin=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/blockquote[3]/div/p[1]').text
    tmp=re.split(r'(?:-|:|\s)\s*',crx_name_origin)
    title=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/div[1]/div[2]/h1').get_attribute('title')
    name=title
    id=tmp[3]
    version=tmp[4]
    rating_origin=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/div[1]/div[2]/p[1]/img').get_attribute('title')
    # Example data: 690 votes, average: 3.59 out of 5
    tmp=re.split(r'(?:,|:|\s)\s*',rating_origin)
    rating=tmp[3]

    origin_last_updated=subelements.find_element_by_xpath('//*[@id="blocks-left"]/div/div/div[1]/div[2]/p[2]/span').text
    # data format: Updated: July 24, 2020
    tmp=re.split(r':',origin_last_updated)
    formated_last_updated=tmp[1]

    creator="null"
    download_numbers=-1

    item={
        'platform': "Crx4Chrome",
        "download_link": download_link,
        'name': name,
        'id':id,
        'version':version,
        'rating': rating,
        'download_numbers': download_numbers,
        'creator': creator,
        'last_updated': formated_last_updated,
        'intro': intro,
        'reviews': []  # as a empty list if there is no valid reviews
    }

    subdriver.close()
    addOneExtIntoFile(item,output_file)

def handleOnePage(extensions,output_file):
    print('start to handle one page')
    print('number of extensions in this page',len(extensions))
    # print(extensions)
    for extension in extensions:
        # print('handle one extension')
        try:
            detail_url=extension.find_element_by_css_selector('a.gs-title').get_attribute('data-ctorig')
        except Exception as e:
            print('errors occur while handling one extension:',e)
            continue
        print('the url of one extension:',detail_url)

        # there are three situations: jump to download page; jump to history page
        url_ele=re.split(r'[.:/\s]\s*',detail_url)
        # print(url_ele)
        if (url_ele[6]=='hisotry')&(len(url_ele)==9):
            # history extension
            try:
                handleHistoryExt(detail_url,output_file)
            except Exception as e:
                print(e)
        elif (url_ele[6]=='crx')&(len(url_ele)==9):
            # current extension
            try:
                handleCurrentExt(detail_url,output_file)
            except Exception as e:
                print(e)
        elif (url_ele[6]=='apps')&(len(url_ele)==9):
            # app page extension
            try:
                handleAppExt(detail_url,output_file)
            except Exception as e:
                print(e)
        else:
            print('error with detial url')


def start(url,count):

    print('start to handle one keyword')
    output_file='./others_crawler/malicious_ext_crawler/data/full_list/crx_ext_[%s].json' % count
    

    # The chrome driver is located in /usr/local/bin
    # Make the chrome run in the back by setting the option
    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    driver=webdriver.Chrome(chrome_options=option)
    driver.get(url)

    # Handle the first page
    extensions=WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CLASS_NAME,'gsc-results.gsc-webResult')))
    # print('extensions include originally: ',extensions.text)
    extensions=extensions.find_elements_by_class_name('gsc-webResult.gsc-result')
    print('extensions include: ',extensions[0].text)
    handleOnePage(extensions,output_file)
    pages=driver.find_elements_by_class_name('gsc-cursor-page')
    page_num=len(pages)

    # get the html of the search result list
    for i in range(page_num-1):
        print('---------now is in the page:',i)
        pages=driver.find_elements_by_class_name('gsc-cursor-page')
        print('number of pages of this keyword:',len(pages))
        if i>=len(pages):
            break
        try:
            nextPage=pages[i]
            nextPage.click()
            time.sleep(3)
            # Find the list of extensions
            
            items=WebDriverWait(driver,30).until(EC.presence_of_element_located((By.CLASS_NAME,'gsc-results.gsc-webResult')))
            tmp=WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CLASS_NAME,'gsc-cursor-page')))
            extensions=items.find_elements_by_class_name('gsc-webResult.gsc-result')
            print(extensions[0].text)
            handleOnePage(extensions,output_file)
        except Exception as e:
            print('error occurs when handling the next page, Error:',e)

    driver.close()

def init(completed_count):
    count=completed_count
    # It's the same as the init()
    urls = []
    path_keywords_xlsx='./others_crawler/malicious_ext_crawler/spiders/short_keywords_Chinese.xlsx'

    # READ and GENERATE urls with keywords
    # in this part, have to change the excel file to one column format
    workbook = xlrd.open_workbook(path_keywords_xlsx)
    worksheet=workbook.sheet_by_index(0)
    data=worksheet.col_values(0)
    for row_keyword in data:
        combined_keyword_url = 'https://www.crx4chrome.com/s.php?s=%s' % row_keyword
        urls.append(combined_keyword_url)

    count_num=0
    for theUrl in urls:
        count_num=count_num+1
        if count_num<12:
            continue
        print('********** the searching url is',theUrl)
        start(theUrl,count)

# if __name__ == "__main__":

#     # It's the same as the init()
#     urls = []
#     path_keywords_xlsx='./others_crawler/malicious_ext_crawler/spiders/short_keywords_Chinese.xlsx'

#     # READ and GENERATE urls with keywords
#     # in this part, have to change the excel file to one column format
#     workbook = xlrd.open_workbook(path_keywords_xlsx)
#     worksheet=workbook.sheet_by_index(0)
#     data=worksheet.col_values(0)
#     for row_keyword in data:
#         combined_keyword_url = 'https://www.crx4chrome.com/s.php?s=%s' % row_keyword
#         urls.append(combined_keyword_url)

#     count_num=0
#     for theUrl in urls:
#         count_num=count_num+1
#         if count_num<20:
#             continue
#         print('********** the searching url is',theUrl)
#         start(theUrl,3)

browser = webdriver.Chrome()
browser.get('https://www.google.com')
# start('https://www.google.com',1)
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.parse import urlparse
from urlextract import URLExtract
from tldextract import extract
import os
import re
import json


def ReadPage(url):
  websiteurl=url
  html=urlopen(websiteurl).read()
  return html.decode('utf-8')

def extractURL(string):
  extractor = URLExtract()
  urls = extractor.find_urls(string)
  urls=list({}.fromkeys(urls).keys())
  return urls

def scanpage(url):
  websiteurl=url
  html=urlopen(websiteurl).read()
  extractor = URLExtract()
  urls = extractor.find_urls(html.decode('utf-8'))
  urls=list({}.fromkeys(urls).keys())
  return urls

def classficationhttp(list):
  httpresult = []
  others = []
  if list == None or len(list) == 0:
    return()
  for lookup in list:
    if lookup[0:4] == 'http':
      httpresult.append(lookup)
    else:
      others.append(lookup)
  return (httpresult,others)

def getallhtmlfilepath(path):
  import os
  path123=[]
  g = os.walk(path)
  for path,dir_list,file_list in g:
      for file_name in file_list:
        if os.path.splitext(file_name)[1] == '.html':
          path123.append(os.path.join(path, file_name) )
  return path123

def read_file_as_str(file_path):
    if not os.path.isfile(file_path):
        raise TypeError(file_path + " does not exist")
    try:
        all_the_text = open(file_path).read()
    except:
        print('cannot open the file')
        all_the_text = ""
    # print type(all_the_text)
    return all_the_text

def finddomin(string):
  # url = re.findall('https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', string)
  extractor = URLExtract()
  urls = extractor.find_urls(string)
  urls=list({}.fromkeys(urls).keys())
  domains=[extract(item) for item in urls]
  return domains

def filter_domain(URLS):
  domains=[]
  for url in URLS:
    domain=urlparse(url).netloc
    domains.append(domain)
  domains=list(set(domains))
  return domains

def printProgress(iteration, total, prefix='', suffix='', decimals=1, barLength=100):
    """
    Call in a loop to create a terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        barLength   - Optional  : character length of bar (Int)
    """
    import sys
    formatStr = "{0:." + str(decimals) + "f}"
    percent = formatStr.format(100 * (iteration / float(total)))
    filledLength = int(round(barLength * iteration / float(total)))
    bar = '#' * filledLength + '-' * (barLength - filledLength)
    sys.stdout.write('\r%s |%s| %s%s %s' % (prefix, bar, percent, '%', suffix)),
    if iteration == total:
        sys.stdout.write('\n')
    sys.stdout.flush()

def start():
    extensionfolder = '/Users/a057/Documents/malicious_extensions_mixed/unzip'
    jsonpath = './result/url_result.json' 
    print("============start===========")
    f_list = os.listdir(extensionfolder)
    print(str(len(f_list)) + ' folders found')
    result = []
    foldernum = 0
    for foldername in f_list:
      foldernum += 1
      print("current folder: " + str(foldernum) + ' total folder: ' + str(len(f_list)))
      printProgress(foldernum, len(f_list), prefix='Progress:', suffix='Complete', barLength=50)
      floderpath = extensionfolder + '/' + foldername
      allhtmlpath = getallhtmlfilepath(floderpath)
      # f_list = os.listdir(path)
      worked = 0
      noneurlfound = 0
      # print(allhtmlpath)
      withhttpurls = []
      otherurls = []
      for path in allhtmlpath: 
        worked += 1
        string = read_file_as_str(path)
        URLS = extractURL(string)
        # domain = finddomin(string)
        
        if len(URLS) == 0:
          noneurlfound += 1
          continue
        withhttp , others = classficationhttp(URLS)
        withhttpurls= withhttpurls+ withhttp
        otherurls=otherurls+ others

      domain=filter_domain(withhttpurls)
      x = {'id':foldername, 'httpurl':withhttpurls,'domain':domain, 'urlwithouthttp':otherurls}
      result.append(x)
      # with open(jsonpath,'w') as f:
        # json.dump(x,f)
        # print(withhttpurls)
      # print(noneurlfound)
    with open(jsonpath,'w') as f:
      json.dump(result,f)
    print("============finished===========")

if __name__=='__main__':
    start()
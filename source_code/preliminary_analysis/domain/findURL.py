import blacklist
import re
# import url
import json

def find_url():
    unique_url='./unique_urls.json'
    with open(unique_url,'r') as f:
        urls=json.load(f)
    suspicious=[]
    for item in urls:
        for black in blacklist.blacklist:
            # print(item)
            # print(black)
            black='.'+black
            if re.match(black,item) is not None:
                suspicious.append(item)
                print(item)
    return suspicious
    
def getExtId(suspicious):
    chrome_ext='./url_chrome.json'
    with open(chrome_ext,'r') as f:
        extensions=json.load(f)
    sus_ext=[]
    for item in suspicious:
        for ext in extensions:
            if item in ext['httpurl'] or item in ext['domain']:
                sus_ext.append(ext['id'])
                print(ext['id'])
    return sus_ext


# suspicious=find_url()

f = open("../spliturl.txt")
suspicious = f.read().splitlines()

# print(suspicious)
sus_ext=getExtId(suspicious)
print(sus_ext)

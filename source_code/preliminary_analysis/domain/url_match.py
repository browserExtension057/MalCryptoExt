import json

def extract_suspicious_url():
    chrome_path='./url_chrome.json'
    firefox_path='./url_firefox.json'
    with open(chrome_path,'r') as f:
        chrome_url=json.load(f)
    with open(firefox_path,'r') as f:
        firefox_url=json.load(f)
    
    # handle chrome url
    # match keywords: login, logout, wallet
    for ext in chrome_url:
        id=ext['id']
        matched_url=[]
        for url in ext['httpurl'] + ext['domain'] + ext['urlwithouthttp']:
            if 'login' in url:
                matched_url.append(url)
        
    
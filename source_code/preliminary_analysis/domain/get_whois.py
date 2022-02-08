import requests
import json
import time

from urllib.parse import urlparse

def get_malicious_list():
    urls=[]
    with open('./malicious_url.txt','r') as f:
        urls=f.readlines()
    urls=[url.split('\n')[0] for url in urls]
    return urls

def get_whois(urls):
    # print(domains)
    res=[]
    count=0
    for url in urls:
        count+=1
        # if count<=77:
        #     continue
        print(url)
        # parts=urlparse(url)
        # domain=parts.netloc
        domain=url
        key='5e079afad8014d66802d5999f76df647'
        source = 'https://apidatav2.chinaz.com/single/whois?key=%s&domain=%s'%(key,domain)

        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"}
        r = requests.get(source,headers=headers).text

        res.append({"url":url,"domain":domain,"whois":r})
        # break
    print(res)
    return res

def write_json(path,data):
    with open(path,'w') as f:
        json.dump(data,f)

def read_whois():
    whois=[]
    with open('./whois_result.json','r') as f:
        whois=json.load(f)
    return whois

def transfer_to_csv(data):
    header=['url','suffix','domain','ContactPerson','Registrar','Email','Phone','CreationDate','ExpirationDate','WhoisServer','DnsServer','DomainStatus']
    rows=[]
    for item in data:
        import tldextract
        suffix=tldextract.extract(item['domain']).suffix
        print(suffix)
        if item['whois']['StateCode']!=1:
            row=[item['url'],suffix,item['domain'],"null","null","null","null","null","null","null","null","null"]
        else:
            row=[item['url'],suffix,item['domain'],item['whois']['Result']['ContactPerson'],item['whois']['Result']['Registrar'],item['whois']['Result']['Email'],
            item['whois']['Result']['Phone'],item['whois']['Result']['CreationDate'],item['whois']['Result']['ExpirationDate'],item['whois']['Result']['WhoisServer'],
            item['whois']['Result']['DnsServer'],item['whois']['Result']['DomainStatus']]
        rows.append(row)
    import csv
    with open('./domain_info_2.csv','w')as f:
        f_csv = csv.writer(f)
        f_csv.writerow(header)
        f_csv.writerows(rows)
        
if __name__=='__main__':
    # urls=get_malicious_list()
    # res=get_whois(urls)
    # write_json('./whois_result.json',res)
    data=read_whois()
    transfer_to_csv(data)
    
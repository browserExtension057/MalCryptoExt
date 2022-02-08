import json
import csv
from xml import dom
import dns.resolver


def remove_duplicate(file_path):
    tmp=[]
    tmpdomain=[]
    tmpurl=[]
    with open(file_path,'r') as f:
       tmp=json.load(f)
    for item in tmp:
        tmpurl += item["httpurl"]
        tmpurl += item["urlwithouthttp"]
        tmpdomain += item["domain"]
    res_url=[]
    res_domain=[]
    for item in tmpurl:
        if item not in res_url:
            res_url.append(item)
    for item in tmpdomain:
        if item not in res_domain:
            res_domain.append(item)

    res=res_url + res_domain
    new_file='./unique_urls.json'
    with open(new_file,'w') as f:
        json.dump(res,f)

def find_id_by_url(url):
    file_path='./url_chrome.json'
    with open(file_path,'r') as f:
       tmp=json.load(f)
    id=[]
    for item in tmp:
        if item in item["httpurl"] or item["urlwithouthttp"] or item["domain"]:
            id.append()
    return id

def write_csv(file_path,header,csv_data):
    with open(file_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(csv_data)

def read_csv(file_path):
    content = []
    with open(file_path, 'r') as f:
        f_csv = csv.reader(f)
        i = 0
        for row in f_csv:
            if i != 0:
                content.append(row)
            i += 1
    return content

def convert_json_raw_data_to_csv(file_path1,file_path2):
    with open(file_path1,'r') as f:
        raw_data=json.load(f)
    csv_data=[]
    for ext in raw_data:
        id=ext['id']
        domains=ext['domain']
        for dom in domains:
            tmp=[id,dom]
            csv_data.append(tmp)
    
    # save csv file
    header=['id','domain']
    write_csv(file_path2,header,csv_data)

def get_cname_by_domain(domain):
    try:
        answers = dns.resolver.resolve(domain, 'CNAME')
    except:
        print('no cname for',domain)
        return []
    print(answers.qname, 'anwser', len(answers))
    cname=[]
    for rdata in answers:
        cname.append(rdata.target)
        # print(' cname target address:', rdata.target)
    return cname

if __name__=='__main__':
    # convert_json_raw_data_to_csv('./result/url_result.json','./result/domain.csv')
    content=read_csv('./result/domain.csv')
    res=[]
    print(len(content),len(content[0]))
    for item in content:
        domain=item[1]
        cnames=get_cname_by_domain(domain)
        if len(cnames)!=0:
            for cname in cnames:
                tmp=item+[cname]
                res.append(tmp)
        else:
            tmp=item+['N/A']
            res.append(tmp)
    write_csv('./result/all_cnames.csv',[],res)

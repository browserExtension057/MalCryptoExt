import json
import os
import csv
import shutil

# get the rating and downloads from the raw crawler's data
# search by the id or name
# only the extension identified with chromeID or FirefoxID can be counted
def get_rating_by_id(id):
    rating=0
    for item in list:
        if item['id']==id:
            res=item['rating']
            rating=int(res.replace(',',''))
            break
    return rating

def get_downloads_by_id(id,list):
    for item in list:
        if item['id']==id:
            res=item['user_numbers']
            res=int(res.replace(',',''))
            return res
    return -1

# input is the unique list of extensions
def cal_avg_rating(data):
    count=0
    sum=0
    greater_than_3=0
    less_than_3=0

    for item in data:
        sum+=int(item['rating'])
        count+=1
        if int(item['rating'])>=3:
            greater_than_3+=1
        else:
            less_than_3+=1
    return [sum/count,greater_than_3,less_than_3]

# input is the unique list of extensions
def cal_avg_downloads(data):
    data=[]
    count=0
    sum=0
    greater_than_100=0
    less_than_100=0

    for item in data:
        sum+=int(item['user_numbers'].replace(',',''))
        count+=1
        if int(item['user_numbers'].replace(',',''))>=100:
            greater_than_100+=1
        else:
            less_than_100+=1
    return [sum/count,greater_than_100,less_than_100]

# save in the json
def save_json(file,content):
    with open(file,'w') as f:
        json.dump(content,f)

# read from the json
def read_json(file_path):
    res_list=[]
    with open(file_path,'r') as f:
        res_list=json.load(f)
    return res_list

# save in the csv
def save_csv(file_path,header,rows):
    with open(file_path,'w') as f:
        f_csv=csv.writer(f)
        f_csv.writeHeader(header)
        f_csv.writeRows(rows)

# read the data from the csv
def read_csv(file_path):
    label=[]
    data1=[]
    data2=[]
    with open(file_path,'r') as csvfile:
        csvreader = csv.reader(csvfile)
        for item in csvreader:
            
            label.append(item[0])
            data1.append(item[1])
            data2.append(item[2])
    return [label,data1,data2]

def move_ext_to_folder(ext_list,src_path,dest_path):
    low_list=ext_list

    for item in low_list:
        
        if os.path.exists(src_path):
            shutil.copy(src_path,dest_path)
        else:
            print('cannot find extension:',item['id'])


def draw_graph(file_path):
    [label,data1,data2]=read_csv(file_path)

    from matplotlib import pyplot as plt
        
    # 绘制散点图用scatter函数
    plt.scatter(data1, data2 ,color='b',label='Line One')
    # plt.scatter(x1, y1 ,color='r',label='Line Two')
    
    plt.title('Distribution of Rating and Downloads')
    plt.ylabel('downloads')
    plt.xlabel('rating')
    plt.legend()
    plt.show()
    
# calculate the rating and downloads by each malicious type
def calculate_rating_downloads_by_malicious_type():
    
    malicious_type=['Phishing','Mining','Scam','Adware','Gambling_Porn','Vulnerable']
    verified_path=''
    res=[]
    for item in malicious_type:
        malicious_file=verified_path+item
        malicious_ext=os.listdir(malicious_file)
        for ext in malicious_ext:
            # get the rating and downloads fromt he raw data
            rating=get_rating_by_id(ext)
            downloads=get_downloads_by_id(ext)
            
            tmp={
                "ext_id":ext,
                'malicious_type':item,
                'rating':rating,
                'downloads':downloads,
            }
            res.append(tmp)
    
    # store the data in json and csv file format
    json_path='./rating_download_res.json'
    save_json(json_path,res)
    
def remove_duplicate(raw_list):
    res_list=[]
    for item in raw_list:
        reached=False
        for res_item in res_list:
            if res_item['id']==item['id']:
                reached=True
                # print("remove duplicated",res_item['id'])
                break
        if not reached:
            res_list.append(item)
    return res_list

def low_rating_num(input,val):
    count=0
    for item in input:
        if float(item['rating'])<=val:
            count+=1
    return count

def low_downloads_num(input,val):
    count=0
    for item in input:
        downloads=int(item['user_numbers'].replace(',',''))
        if downloads<=val:
            count+=1
    return count

def low_rating_or_downloads_num(input,val_rating,val_down):
    count=0
    for item in input:
        downloads=int(item['user_numbers'].replace(',',''))
        # for firefox and chrome
        rating=item['rating']

        # for opera data
        # rating=float(item['rating'])

        if downloads<=val_down or rating<=val_rating:
            count+=1
    return count

if __name__=="__main__":

    '''
    raw_data_file='./copied_chrome_full_list_2021_01.json'
    raw_list=read_json(raw_data_file)

    res_list=remove_duplicate(raw_list)
    # save_json(removed_duplicated_file,res_list)
    low_rating=low_rating_num(res_list,2)
    low_downloads=low_downloads_num(res_list,100)
    low_rating_download=low_rating_or_downloads_num(res_list,2,100)
    print(low_rating)
    print(low_downloads)
    print(low_rating_download)
    print(len(raw_list))
    print(len(res_list))
    '''

    draw_graph('./rating_download_malicious.csv')



        

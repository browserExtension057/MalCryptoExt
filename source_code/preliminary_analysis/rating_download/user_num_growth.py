import json
import os
import matplotlib.pyplot as plt

def gen_changing_ana_low_list(total, browser, low_file,raw_folder,isfilter):
    if isfilter:
        result_file = './%s_changing_filter.json' % browser
    else:    
        result_file = './%s_changing.json' % browser

    change_list = []
    low_list=[]
    with open(low_file, 'r') as f:
        low_list = json.load(f)
    
    for index in range(total):
        # print('we are handling file at:',index)

        if isfilter:
            ext_data = raw_folder+'%s_ext_data_[%s]FILTER_KEYWORDS.json' % (
                browser, index)
        else:    
            ext_data = raw_folder+'%s_ext_data_[%s].json' % (browser, index)
        ext_data_list = []
        with open(ext_data, 'r') as f:
            ext_data_list = json.load(f)

        for ext_item in ext_data_list:
            if ext_item in low_list:
                id = ext_item['id']
                exist = 0
                for i in change_list:
                    if i['id'] == id:
                        # there is record for the extension
                        # add info to this item
                        
                        rating_tmp = {
                            'time': index,
                            'rate': ext_item['rating']
                        }
                        download_tmp = {
                            'time': index,
                            'download_numbers': int(ext_item['user_numbers'])
                        }
                        i['rating_change'].append(rating_tmp)
                        i['download_change'].append(download_tmp)
                        if ext_item['last_updated'] != i['update_change'][-1]:
                            # it has been updated recently
                            print('found a recent update extension:',id)
                            i['update_change'].append(ext_item['last_updated'])
                        exist = 1
                        break
                if exist == 0:
                    # no record for this extension
                    # it's a new extension
                    # create a new record for this item
                    
                    rate_changing_list = [
                        {
                            'time': index,
                            'rate': ext_item['rating']
                        }
                    ]
                    download_changing_list = [
                        {
                            'time': index,
                            'download_numbers': int(ext_item['user_numbers'])
                        }
                    ]

                    new_list = {
                        'key': ext_item['key'],
                        'id':id,
                        'name': ext_item['name'],
                        # "download_link": ext_item['download_link'],
                        "creator": ext_item['creator'],
                        'rating_change': rate_changing_list,
                        'download_change': download_changing_list,
                        'update_change': [ext_item['last_updated']]
                    }
                    change_list.append(new_list)
    with open(result_file,'w') as f:
        json.dump(change_list,f)
    
def gen_changing_ana(total, browser,raw_folder,isfilter):
    if isfilter:
        result_file = './%s_changing_filter.json' % browser
    else:    
        result_file = './%s_changing.json' % browser

    change_list = []
    if os.path.exists(result_file):
        with open(result_file, 'r') as f:
            change_list = json.load(f)
    
    for index in range(total):
        # print('we are handling file at:',index)

        if isfilter:
            ext_data = raw_folder+'%s_ext_data_[%s]FILTER_KEYWORDS.json' % (
                browser, index)
        else:    
            ext_data = raw_folder+'%s_ext_data_[%s].json' % (browser, index)
        ext_data_list = []
        with open(ext_data, 'r') as f:
            ext_data_list = json.load(f)

        for ext_item in ext_data_list:
            key = ext_item['key']
            exist = 0
            for i in change_list:
                if i['key'] == key:
                    # there is record for the extension
                    # add info to this item
                    
                    rating_tmp = {
                        'time': index,
                        'rate': ext_item['rating']
                    }
                    download_tmp = {
                        'time': index,
                        'download_numbers': ext_item['user_numbers']
                    }
                    i['rating_change'].append(rating_tmp)
                    i['download_change'].append(download_tmp)
                    if ext_item['last_updated'] != i['update_change'][-1]:
                        # it has been updated recently
                        print('found a recent update extension:',key)
                        i['update_change'].append(ext_item['last_updated'])
                    exist = 1
                    break
            if exist == 0:
                # no record for this extension
                # it's a new extension
                # create a new record for this item
                
                rate_changing_list = [
                    {
                        'time': index,
                        'rate': ext_item['rating']
                    }
                ]
                download_changing_list = [
                    {
                        'time': index,
                        'download_numbers': ext_item['user_numbers']
                    }
                ]

                new_list = {
                    'key': key,
                    'name': ext_item['name'],
                    "download_link": ext_item['download_link'],
                    "creator": ext_item['creator'],
                    'rating_change': rate_changing_list,
                    'download_change': download_changing_list,
                    'update_change': [ext_item['last_updated']]
                }
                change_list.append(new_list)

    with open(result_file,'w') as f:
        json.dump(change_list,f)

def get_download_growth(browser,isfilter):
    if isfilter:
        result_file = './%s_changing_filter.json' % browser
    else:    
        result_file = './%s_changing.json' % browser

    result_list=[]
    with open(result_file,'r') as f:
        result_list=json.load(f)

    total_ext=len(result_list)

    plt.figure(figsize=(20,8),dpi=80)
    count=0
    for i in result_list:
        count=count+1
        if count>0:
            x=[]
            y=[]
            for down_item in i['download_change']:
                x.append(down_item['time'])
                y.append(down_item['download_numbers'])

            print(len(y))
            plt.plot(x,y,label=i['name'])
            try:
                print(i['name'])
            except:
                print('can\'t print the name')
            # if len(y)==153:
            #     plt.plot(x,y,label=i['name'])
            # else:
            #     print(i['name'])

        # if count==24:
        #     break

    # plt.legend(loc='upper left')
    plt.yticks([])
    plt.xlabel('time')
    plt.ylabel('download numbers')
    plt.title('The Growth of the Download Number of Low Rate Extensions in Chrome from 12.2020 to 02.2021')
    plt.show()
    print('total number of extensions had been tracked:',total_ext) 

def get_rate_changing(browser,isfilter):
    if isfilter:
        result_file = './%s_changing_filter.json' % browser
    else:    
        result_file = './%s_changing.json' % browser

    result_list=[]
    with open(result_file,'r') as f:
        result_list=json.load(f)

    total_ext=len(result_list)

    plt.figure(figsize=(20,8),dpi=80)
    count=0
    for i in result_list:
        count=count+1
        if count>0:
            x=[]
            y=[]
            for down_item in i['rating_change']:
                x.append(down_item['time'])
                y.append(down_item['rate'])

            print(len(y))
            plt.plot(x,y,label=i['name'])
            try:
                print(i['name'])
            except:
                print('can\'t print the name')
            # if len(y)==153:
            #     plt.plot(x,y,label=i['name'])
            # else:
            #     print(i['name'])

        # if count==5:
        #     break

    # plt.legend(loc='upper left')
    plt.yticks([])
    plt.xlabel('time')
    plt.ylabel('rating')
    plt.title('The changing of the rating of Benight Extensions in Opera from 12.2020 to 02.2021')
    print('total number of extensions had been tracked:',total_ext) 
    plt.show()

if __name__ == '__main__':
    browser = 'chrome'
    raw_folder = './full_list/'
    total = 24
    isfilter=1

    low_file='./chrome_low_rate_and_download.json'
    # generate analysis tmp data from raw data
    # gen_changing_ana_low_list(total, browser,low_file,raw_folder,isfilter)
    
    # find the growth of download number
    # get_download_growth(browser,isfilter)

    # find the changing of the rating
    # get_rate_changing(browser,isfilter)

    # filter by rating and download_numbers
    # index=23
    # low_rate=[]
    # low_download=[]
    # low_rate_and_download=[]
    # ext_data = raw_folder+'%s_ext_data_[%s]FILTER_KEYWORDS.json' % (
    #             browser, index)
    # ext_data_list=[]

    # low_rate_num=0
    # low_down_num=0
    # low_rate_down_num=0
    # with open(ext_data,'r') as f:
    #     ext_data_list=json.load(f)
    # for item in ext_data_list:
    #     rate=float(item['rating'])
    #     download=int(item['user_numbers'].replace(',',''))

    #     if rate<3.0:
    #         # It's a low rate extension
    #         low_rate.append(item)
    #         low_rate_num = low_rate_num+1
    #     if download<300:
    #         low_download.append(item)
    #         low_down_num=low_down_num+1

    #     if rate<3.0 and download<300:
    #         low_rate_and_download.append(item)
    #         low_rate_down_num=low_rate_down_num+1
    
    # low_rate_file='./%s_low_rate.json' % browser
    # low_download_file='./%s_low_download.json' % browser
    # low_rate_and_download_file='./%s_low_rate_and_download.json' % browser

    # with open(low_rate_file,'w') as f:
    #     json.dump(low_rate,f)

    # with open(low_download_file,'w') as f:
    #     json.dump(low_download,f)

    # with open(low_rate_and_download_file,'w') as f:
    #     json.dump(low_rate_and_download,f)

    # print('low_rate:',low_rate_num)
    # print('low_download',low_down_num)
    # print('low_rate_download',low_rate_down_num)
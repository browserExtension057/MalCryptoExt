import os
import json
import csv
chrome_api_name=["accessibilityFeatures","action","alarms","bookmarks","browserAction","browsingData",
                "certificateProvider","commands","contentSettings","contextMenus","cookies","debugger",
                "declarativeContent","declarativeNetRequest","desktopCapture","inspectedWindow","network",
                "devtools.panels","panels","documentScan","downloads","deviceAttributes","hardwarePlatform",
                "enterprise.networkingAttributes","networkingAttributes","enterprise.platformKeys",
                "platformKeys","events","extension","extensionTypes","fileBrowserHandler","fileSystemProvider",
                "fontSettings","gcm","history","i18n","identity","idle","input.ime","instanceID","loginState",
                "management","notifications","omnibox","pageAction","pageCapture","permissions","platformKeys",
                "power","printerProvider","printing","printingMetrics","privacy","proxy","runtime","scripting",
                "search","sessions","storage","system.cpu","system.display","system.memory","system.storage",
                "tabCapture","tabGroups","tabs","topSites","tts","ttsEngine","types","vpnProvider","wallpaper",
                "webNavigation","webRequest","windows"]

chrome_other_api=["declarativeWebRequest","automation","processes","signedInDevices","app.runtime",
                "app.window","appviewTag","audio","bluetooth","bluetoothLowEnergy","bluetoothSocket",
                "browser","clipboard","fileSystem","hid","mdns","mediaGalleries","serial","socket",
                "sockets.tcp","sockets.tcpServer","sockets.udp","syncFileSystem","system.network","usb",
                "webviewTag"]

# length of all_chrome_api is 101
all_chrome_api=chrome_api_name+chrome_other_api

def get_AST(file_path):
    AST=[]
    with open(file_path,'r') as f:
        AST=json.load(f)
    return AST

def count_type(AST):
    #calculate the number of types in the ast
    block_num=len(AST['program']['body'])
    empty_state=0
    print('number of the program blocks: '+str(block_num))
    for item in AST['program']['body']:
        # handle each block respectively
        block_type=item['type']

        if block_type=='VariableDeclaration':
            block_declaration=item['declarations']
            for decla_item in block_declaration:
                decla_item_id=decla_item['id']

        elif block_type=='ExpressionStatement':
            block_expression=item['expression']

        elif block_type=='EmptyStatement':
            # do nothing
            empty_state +=1
        else:
            print('not achieved statement: '+item['type'])

def stat_type(path):
    types=[]
    res_names=[]
    res={}
    try:
        with open(path,'r') as f:
            types=json.load(f)
        for item in types:
            if item['type'] not in res_names:
                res_names.append(item['type'])
                res[item['type']]=1
            else:
                res[item['type']]+=1

        return res
    except:
        print('cannot get type from file: ',path)
        return []
        

def traverseAllCalleeFile(dir_path):
    traverselist = []
    callee_func_name=[]
    func_count={}
    repeat_at_least_once=[]
    for home, dirs, files in os.walk(dir_path):
        for filename in files:
            # 文件名列表，包含完整路径
            # print(os.path.join(home,filename))
            # print(home)
            # print(filename[-19:])
            if filename[-19:]=='_purify_callee.json':
                # print(os.path.join(home,filename))
                res=[]

                # res stores all the callee function info and number
                # callee_func_name stores all the callee function name
                with open(os.path.join(home,filename),'r') as f:
                    funcs=json.load(f)
                for func in funcs:
                    if func["name"] not in callee_func_name:
                        callee_func_name.append(func["name"])
                        func_count[func["name"]]=1
                    else:
                        repeat_at_least_once.append(func["name"])
                        func_count[func["name"]]+=1
                        # print('repeat function name:',func["name"])
                    res.append(func)
                
                # store the statistic into another json file
                ext_name=home.split('/')[-1]
                js_name=filename[:-19]
                # print(tmp_name)
                tmp={'ext_name':ext_name,'file_name':js_name,'types':res}
                traverselist.append(tmp)
                # print(res)
    return [traverselist,callee_func_name,repeat_at_least_once,func_count]

def save_json(path,data):
    with open(path,'w') as f:
        json.dump(data,f)


def save_func_csv(path,data,headers):
    
    rows=[]
    total=0
    zero_count=0
    for item in data:
        func_num_list=[]

        for func_name in headers:
            tmp=0
            # count1=0
            # count2=len(headers)
            for type_name in item['types']:
                # if type_name["name"]=='refreshMine':
                #     print("hint the point",func_name,type_name)
                if func_name==type_name["name"]:
                    tmp=type_name["num"]
                    
                    # print(type_name["num"])
                    
                    total = total +tmp
                    break
            if tmp==0:
                zero_count=zero_count+1
            func_num_list.append(tmp)
        tmp_list=[item['ext_name'],item['file_name']]+func_num_list
        rows.append(tmp_list)

    with open(path,'w') as f:
        f_csv=csv.writer(f)
        f_csv.writerow(["Extension_Name","JS_File_Name"]+headers)
        f_csv.writerows(rows)

def convert_calle(data):
    res=[]
    for item in data:
        types={}
        for type in item['types']:
            types[type['name']]=type['num']
        item['types']=types
        res.append(item)
    return res

def convert_to_ext_unit(path,list,headers):
    res=[]
    reached_ext=[]
    headers=['setTimeout','clearTimeout','parseInt','parseFloat','isNaN','define','clear','Interval','setInterval','Object','Function','decodeURIComponent','encodeURIComponent','Array',
            'isFinite','String','Number']
    
    for item in list:
        id=item['ext_name']
        if id not in reached_ext:
            reached_ext.append(id)
            item_file=[]
            for subfile in list:
                if subfile['ext_name']==id:
                    item_file.append(subfile)

            # get the full list of files for each extensions
            nums=[0]*len(headers)
            for jsfile in item_file:
                for index,ii in enumerate(headers):
                    print(index,ii)
                    nums[index]+=jsfile['types'][ii] if ii in jsfile['types'] else 0

            rows=[jsfile['ext_name']]+nums
            res.append(rows)
        else:
            continue
    with open(path,'w') as f:
        f_csv=csv.writer(f)
        f_csv.writerow(headers)
        f_csv.writerows(res)


def handle_all_callee():
    global all_chrome_api
    subtype='scam'
    # [traverselist,callee_func_name]=traverseAllCalleeFile('/Users/a057/Downloads/chrome/ClearJS')
    callee_path='./dataset/all_malicious/%s/clearJS' % subtype
    [traverselist,callee_func_name,repeat_at_least_once,func_count]=traverseAllCalleeFile(callee_path)
    
    print(traverselist)
    print(callee_func_name)
    repeat_without_duplicate=list(set(repeat_at_least_once))
    print(len(repeat_at_least_once))
    print(len(repeat_without_duplicate))
    repeat_multiple_times=[]
    for item in callee_func_name:
        if func_count[item]>=1:
            repeat_multiple_times.append(item)
    print(len(repeat_multiple_times))
    print(repeat_multiple_times)
    save_json('./dataset/all_malicious/%s_callee_funcs.json' % subtype,convert_calle(traverselist))

    # save_func_csv('./dataset/prepare/benign_callee_funcs_func_all.csv',traverselist,list(repeat_multiple_times))
    with open('./dataset/all_malicious/%s_callee_funcs.json' % subtype,'r') as f:
        traverselist=json.load(f)
    convert_to_ext_unit('./dataset/all_malicious/%s_callee_funcs.csv' % subtype,traverselist,list(repeat_multiple_times))
    
if __name__=='__main__':
    handle_all_callee()
    # for item in all_chrome_api:     
    #     print(item)

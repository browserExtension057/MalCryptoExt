import os
import time
import json
import requests
import csv
import shutil
import datetime

engine_list = ["ALYac", "APEX", "AVG", "Acronis", "Ad-Aware", "AegisLab", "AhnLab-V3",
               "Alibaba", "Antiy-AVL", "Arcabit", "Avast", "Avast-Mobile", "Avira",
               "Baidu", "BitDefender", "BitDefenderFalx", "BitDefenderTheta", "Bkav",
               "CAT-QuickHeal", "CMC", "ClamAV", "Comodo", "CrowdStrike", "Cybereason",
               "Cylance", "Cynet", "Cyren", "DrWeb", "ESET-NOD32", "Elastic", "Emsisoft",
               "F-Secure", "FireEye", "Fortinet", "GData", "Gridinsoft", "Ikarus",
               "Jiangmin", "K7AntiVirus", "K7GW", "Kaspersky", "Kingsoft", "MAX",
               "Malwarebytes", "MaxSecure", "McAfee", "McAfee-GW-Edition", "MicroWorld-eScan",
               "Microsoft", "NANO-Antivirus", "Paloalto", "Panda", "Qihoo-360", "Rising",
               "SUPERAntiSpyware", "Sangfor", "SentinelOne", "Sophos", "Symantec",
               "SymantecMobileInsight", "TACHYON", "Tencent", "TotalDefense", "Trapmine",
               "TrendMicro", "TrendMicro-HouseCall", "Trustlook", "VBA32", "VIPRE",
               "ViRobot", "Webroot", "Yandex", "Zillya", "ZoneAlarm", "Zoner", "eGambit"]

# apikey = 'db0959b5ccd6730fa42f5af8e8591a3cab85db2300ca98f7f68a1526228a98dd'
apikey='cc4f0dd6e11be4c49f27c7947fc6536b05873a1d2f0b92f8d7075167072847cf'
def scanByFilePath(file_path, file_id):
    
    myheaders = {
        'x-apikey': apikey
    }
    scan_url = 'https://www.virustotal.com/api/v3/files'
    myfiles = {'file': (file_path, open(file_path, 'rb'))}
    analysis = requests.post(scan_url, headers=myheaders, files=myfiles)

    # print(analysis.text)
    analysis_json = json.loads(analysis.text)
    tmp = {
        'name': file_id,
        'id': analysis_json["data"]["id"]
    }
    return tmp

def scanByUrl(url, file_id):
    
    myheaders = {
        'x-apikey': apikey
    }
    scan_url = 'https://www.virustotal.com/api/v3/urls'
    myfiles = {'url': url}
    analysis = requests.post(scan_url, headers=myheaders, form=myfiles)

    # print(analysis.text)
    analysis_json = json.loads(analysis.text)
    tmp = {
        'name': file_id,
        'id': analysis_json["data"]["id"]
    }
    return tmp

def scanByDir(src_folder, output_file):
    myheaders = {
        'x-apikey': apikey
    }
    scan_url = 'https://www.virustotal.com/api/v3/files'

    file_list = os.listdir(src_folder)

    # store the analysis id
    output_list = []
    file_list.sort()
    for i in file_list:
        if (i == '.DS_Store')|(i=='log.txt'):
            continue
        file_path = src_folder+i

        print("scan file:", file_path)

        # scan the file and get the result
        myfiles = {'file': (file_path, open(file_path, 'rb'))}
        try:
            analysis = requests.post(
                scan_url, headers=myheaders, files=myfiles)

            # print(analysis.text)
            analysis_json = json.loads(analysis.text)
            [ext_name, ext] = os.path.splitext(i)
            tmp = {
                'name': ext_name,
                'id': analysis_json["data"]["id"]
            }
            output_list.append(tmp)
            print(tmp["id"])
            # print("start to wait...")
            time.sleep(15)
        except:
            print("error occurs while scanning, stop early")
            break

    with open(output_file, 'w') as f:
        json.dump(output_list, f)
    print("updated scan_result_id file")


def storeOriginResult(id, res, origin_result_path):
    tmp_list = []
    if os.path.exists(origin_result_path):
        with open(origin_result_path, "r") as json_file:
            tmp_list = json.load(json_file)
    tmp_list.append(res)
    with open(origin_result_path, "w") as json_file:
        json.dump(tmp_list, json_file)


def handleOriginResult(id, res_json, malicious_folder):
    engine_res = res_json["data"]["attributes"]["results"]
    stats_res=res_json['data']['attributes']['stats']
    vul_count = 0
    # store the engine info where the result is not null
    res_list_csv = [id]
    mid_list_json = []
    for engine in engine_list:
        try:
            res = engine_res[engine]["result"]
        except:
            res_list_csv.append(' ')
            continue
        if res != None:
            # the result is not null
            # add into result list
            vul_count = vul_count+1
            engine_res[engine]["name"] = engine
            mid_list_json.append(engine_res[engine])
            print("in extension:", id, "find bug in:", engine, "output:", res)

    tmp_json = {
        'id': id,
        'result': mid_list_json
    }

    if ((vul_count == 0) & (stats_res['suspicious']==0) & (stats_res['malicious']==0)):
        print("no error in extension: ", id)
    else:
        # copy the file to malicious folder
        try:
            srcPath = src_folder+id+'.crx'
            dstPath = malicious_folder+id+'.crx'
            shutil.copyfile(srcPath, dstPath)
        except:
            print('some errors occurs while copying file')
        

    return tmp_json


def getAnalysisResult(result_id_list, origin_result_path):
    myheaders = {
        'x-apikey': apikey
    }

    print("start to get analysis result...")
    for i in result_id_list:
        theID = i.strip('\n')
        res_url = "https://www.virustotal.com/api/v3/analyses/%s" % theID
        result = requests.get(res_url, headers=myheaders)
        res_str = result.text
        null = ''
        res_json = json.loads(res_str)

        # store the origin result
        print("store the analysis result...",theID)
        storeOriginResult(theID, res_json, origin_result_path)

        # print("wait...")
        # time.sleep(10)


def getResultID(output_file):
    result_id_list = []
    tmp = []
    if 0 != os.path.getsize(output_file):
        with open(output_file, "r") as json_file:
            tmp = json.load(json_file)
    for item in tmp:
        result_id_list.append(item['id'])
    return result_id_list

def getExtIDbyScanID(scan_result_id_file,scan_id):
    with open(scan_result_id_file,'r') as f:
        tmp=json.load(f)
    for item in tmp:
        if item['id']==scan_id:
            #find the extension id and return
            return item['name']
    return 'null'

'''
malicious_folder: move the malicious detected by VT to this directory
output_file: scan result id file with result in json format
origin_result_path: output file with origin result in json format
result_file: final result file in json format
'''
def startScanByDir(src_folder,malicious_folder,output_file,origin_result_path,result_file):
    # malicious_folder = './malicious'
    # output_file = './scan_result_id.json' 
    # origin_result_path = './analysis_result_origin.json'
    # result_file = './analysis_result.json' 
    
    scanByDir(src_folder, output_file)

    result_id_list = getResultID(output_file)
    getAnalysisResult(result_id_list, origin_result_path)

    origin_list = []
    if os.path.exists(origin_result_path):
        with open(origin_result_path, 'r') as f:
            origin_list = json.load(f)
    else:
        print("no file needs to be scanned in this round")

    # the file stores handled analysis result
    handled_result = []
    for item in origin_list:
        item_json = item
        try:
            theID=getExtIDbyScanID(output_file,item_json['data']['id'])
            tmp_json = handleOriginResult(
            theID, item_json, malicious_folder)
            handled_result.append(tmp_json)
        except:
            print("out of quato limitation")
        
        

    with open(result_file, 'w') as f:
        json.dump(handled_result, f)

if __name__ == "__main__":
    malicious_folder = './malicious/'
    output_file = './result_part_2022/scan_result_id.json' 
    origin_result_path = './result_part_2022/analysis_result_origin.json'
    result_file = './result_part_2022/analysis_result.json' 
    src_folder='/Users/a057/Documents/malicious_extensions_mixed/zip/'
    startScanByDir(src_folder,malicious_folder,output_file,origin_result_path,result_file)
    

# null=''
# scan_res={
#     "data": {
#         "attributes": {
#             "date": 1607875360,
#             "results": {
#                 "ALYac": {
#                     "category": "undetected",malicious
#                     "engine_name": "ALYac",
#                     "engine_update": "20201213",
#                     "engine_version": "1.1.1.5",
#                     "method": "blacklist",
#                     "result": "null"
#                 },
#             },
#             "stats": {
#                 "confirmed-timeout": 0,
#                 "failure": 0,
#                 "harmless": 0,
#                 "malicious": 0,
#                 "suspicious": 0,
#                 "timeout": 0,
#                 "type-unsupported": 16,
#                 "undetected": 60
#             },
#             "status": "completed"
#         },
#         "id": "MTk0NTc3YTdlMjBiZGNjN2FmYmI3MThmNTAyYzEzNGM6MTYwNzg3NTM2MA==",
#         "type": "analysis"
#     },
#     "meta": {
#         "file_info": {
#             "md5": "194577a7e20bdcc7afbb718f502c134c",
#             "name": "chrome_web_store_crawler/chrome_data_analysis/data/current/.DS_Store",
#             "sha1": "df2fbeb1400acda0909a32c1cf6bf492f1121e07",
#             "sha256": "d65165279105ca6773180500688df4bdc69a2c7b771752f0a46ef120b7fd8ec3",
#             "size": 6148
#         }
#     }
# }

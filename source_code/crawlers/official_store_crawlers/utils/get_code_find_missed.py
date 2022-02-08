import time
import datetime

import json

import dateutil.parser as dparser

import os
import shutil
import urllib.request
import ssl
ssl._create_default_https_context = ssl._create_unverified_context


def find_missed(new_file, old_file):
    """Find missed extensions in the new list.
    Args:
        new_file: file path of the new extension list 
        old_file: file path of the last extension list
    Returns:
        missed_item:
        missed_id:
    """
    new_list = []
    old_list = []
    missed_item = []
    missed_id = []
    with open(new_file) as json_file:
        new_list = json.load(json_file)
    with open(old_file) as json_file:
        old_list = json.load(json_file)
    for item in old_list:
        item_id = item["id"]
        isMissed = True
        for new_item in new_list:
            if new_item["id"] == item_id:
                isMissed = False
                break
        if isMissed:
            missed_item.append(item)
            missed_id.append(item_id)
    return [missed_item, missed_id]

# store missed App list in '/missed.json'


def handle_missed_list(missed_item, missed_file):
    current_time = datetime.datetime.now()
    missed_list = []

    for item in missed_item:
        item["missed_date"] = current_time.strftime("%Y-%m-%d %H:%M:%S")

    if os.path.exists(missed_file):
        with open(missed_file, 'r') as json_file:
            missed_list = json.load(json_file)
        for i in missed_item:
            missed_list.append(i)
    else:
        missed_list = missed_item

    with open(missed_file, "w") as json_file:
        json.dump(missed_list, json_file)

# move missed App source code from '/recent' to 'missed'


def handle_missed_file(missed_id, missed_dir, recent_dir, scan_dir,log_file, browser):
    if browser == 'firefox':
        ext = '.xpi'
    else:
        ext = '.crx'
    for item_id in missed_id:
        srcpath = recent_dir+'/'+item_id+ext
        despath = missed_dir+'/'+item_id+ext
        try:
            shutil.move(srcpath, despath)
            print("handle_missed_file: success move:",
                  item_id, file=open(log_file, 'a'))
        except:
            try:
                srcpath = scan_dir+'/'+item_id+ext
                shutil.move(srcpath, despath)
                print("handle_missed_file: success move:",
                    item_id, file=open(log_file, 'a'))
            except:
                print("handle_missed_file: no file ",
                    item_id, file=open(log_file, 'a'))


def find_new_add(new_file, old_file):
    new_list = []
    old_list = []
    new_item = []
    new_id = []
    with open(new_file) as json_file:
        new_list = json.load(json_file)
    with open(old_file) as json_file:
        old_list = json.load(json_file)
    for item in new_list:
        item_id = item["id"]
        item_update = item["last_updated"]
        isnew = True
        for old_item in old_list:
            if old_item["id"] == item_id and old_item["last_updated"] == item_update:
                isnew = False
                break
        if isnew:
            new_item.append(item)
            new_id.append(item_id)
    return [new_item, new_id]


def download_new_add_ext(new_add_item, current_dir, browser, log_file):
    num = 0
    suc = 0
    for item in new_add_item:
        # download the extension from chrom web store
        id = item['id']
        try:
            # download extension from the website
            if browser == 'chrome':
                result = _DownloadCrxFromCws(id, current_dir, log_file)
            elif browser == 'firefox':
                link = item['download_link']
                result = _DownloadXPIFromFws(id, link, current_dir, log_file)
            else:
                link = item['download_link']
                result = _DownloadCrxFromOtherws(
                    id, link, current_dir, log_file)

            if result == False:
                num = num+1
                print('Empty file total: ', num)
            else:
                suc = suc+1
        except Exception as e:
            print('download failed:', id, 'Exception:', e)
            print('download failed:', id, file=open(log_file, "a"))
    print("download successful total number:", suc, file=open(log_file, "a"))
    print('Empty file total number: ', num, file=open(log_file, "a"))


def _DownloadCrxFromCws(ext_id, dst, log_file):
    """Downloads CRX specified from Chrome Web Store.
    Retrieves CRX (Chrome extension file) specified by ext_id from Chrome Web
    Store, into directory specified by dst.
    Args:
        ext_id: id of extension to retrieve.
        dst: directory to download CRX into
    Returns:
        Returns local path to downloaded CRX.
        If download fails, return None.
    """
    dst_path = os.path.join(dst, '%s.crx' % ext_id)
    cws_url = ('https://clients2.google.com/service/update2/crx?response='
               'redirect&os=mac&arch=x64&os_arch=x86_64&nacl_arch=x86-64&'
               'prod=chromecrx&prodchannel=&prodversion=88.0.4324.146&lang=en-US&acceptformat=crx3&x=id%%3D'
               '%s%%26installsource%%3D'
               'ondemand%%26uc' % ext_id)
    req = urllib.request.urlopen(cws_url)
    res = req.read()
    if req.getcode() != 200:
        print('download failed: ', ext_id)
        print('download failed: ', ext_id, file=open(log_file, "a"))
        return False
    #   print(res)
    with open(dst_path, 'wb') as f:
        f.write(res)
    print('download successful: ', ext_id)
    # print('download successful: ', ext_id, file=open(log_file,"a"))
    return True


def _DownloadXPIFromFws(ext_id, link, dst, log_file):
    """Downloads XPI specified from Chrome Web Store.
    Retrieves XPI (Chrome extension file) specified by ext_id from Firefox Web Store
    Store, into directory specified by dst.
    Args:
        ext_id: id of extension to retrieve.
        dst: directory to download XPI into
    Returns:
        Returns local path to downloaded XPI.
        If download fails, return None.
    """
    dst_path = os.path.join(dst, '%s.xpi' % ext_id)
    headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',

    }
    req0 = urllib.request.Request(url=link, headers=headers)
    req = urllib.request.urlopen(url=req0, timeout=10)
    res = req.read()
    if req.getcode() != 200:
        print('download failed: ', ext_id, 'the code:', req.getcode())
        print('download failed: ', ext_id, file=open("./firefox_log.txt", "a"))
        return False
    #   print(res)
    with open(dst_path, 'wb') as f:
        f.write(res)
    print('download successful: ', ext_id)
    return True


def _DownloadCrxFromOtherws(ext_key, link, dst, log_file):
    """Downloads CRX specified from Other Web Store.
    Args:
        ext_id: id of extension to retrieve.
        dst: directory to download CRX into
    Returns:
        Returns local path to downloaded CRX.
        If download fails, return None.
    """
    dst_path = os.path.join(dst, '%s.crx' % ext_key)
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.378"

    }
    print(link)
    req0 = urllib.request.Request(url=link, headers=headers)
    req = urllib.request.urlopen(url=req0, timeout=10)
    res = req.read()
    if req.getcode() != 200:
        print('download failed: ', ext_key, 'the code:', req.getcode())
        print('download failed: ', ext_key, file=open("./opera_log.txt", "a"))
        return False
    #   print(res)
    with open(dst_path, 'wb') as f:
        f.write(res)
    print('download successful: ', ext_key)
    return True


def delta_time(deltadays):
    current_date = datetime.date.today()
    past_list = []
    for i in range(deltadays):
        tmp = i+1
        past_time = current_date-datetime.timedelta(days=tmp)
        past_list.append(past_time)
    return past_list

# get recent released App list


def recent_release(new_file, delta):
    past_list = delta_time(delta)
    new_released = []
    with open(new_file) as json_file:
        new_list = json.load(json_file)
    for item in new_list:
        i_time = dparser.parse(item["last_updated"], fuzzy=True)
        i_date = datetime.date(i_time.year, i_time.month, i_time.day)
        if i_date in past_list:
            # new released
            new_released.append(item)
    return new_released


def recent_all_release(new_file):
    with open(new_file) as json_file:
        new_list = json.load(json_file)
    return new_list

# update recent_release.json
# browser can be chrome, firefox, opera


def missed_all_app(new_file, count, browser):

    log_file = 'log/%s_log_%s.txt' % (browser,count)
    missed_file = 'data/%s/missed/missed.json' % browser
    missed_dir = 'data/%s/missed' % browser
    current_dir = 'data/%s/current' % browser
    scan_dir = 'data/%s/scan' % browser

    last_file = ''
    if(count != 0):
        num = count-1
        last_file = 'data/%s/full_list/%s_ext_data_[%s]FILTER_KEYWORDS.json' % (
            browser, browser, num)
        [missed_item, missed_id] = find_missed(new_file, last_file)
        handle_missed_list(missed_item, missed_file)
        handle_missed_file(missed_id, missed_dir,
                           current_dir, scan_dir,log_file, browser)
        # print(missed_id)
        [new_add_item, new_add_id] = find_new_add(new_file, last_file)
    else:
        new_add_item = recent_all_release(new_file)
    download_new_add_ext(new_add_item, scan_dir, browser, log_file)


if __name__ == "__main__":
    browser = 'chrome'
    missed_all_app(
        'data/%s/full_list/%s_ext_data_[0]FILTER_KEYWORDS.json' % (browser, browser), 0, browser)

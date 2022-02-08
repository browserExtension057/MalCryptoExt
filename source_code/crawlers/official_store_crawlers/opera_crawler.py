import datetime  
import os
import sys
import subprocess

import utils.get_code_find_missed as get_code_find_missed
import utils.scan_ext_file as scan_ext_file
import utils.data_utils as data_utils

############################### RUN BOT
def crawler_start(completed_count,log_file):

    browser='opera'
    csv_columns = ['platform', 'id', 'download_link','key','name', 'rating', 'user_numbers', 'creator', 'last_updated', 'reviews','introduction','record_time']

    name_exported_file = 'data/opera/full_list/opera_ext_data_[%s].json' % completed_count
    name_exported_file_after_running_bot = 'data/opera/full_list/opera_ext_data_[%s]' % completed_count
    dirpath = os.path.dirname(os.path.abspath(__file__))
    sys.path.append(dirpath)
    os.chdir(dirpath)

    print("I'm working...",datetime.datetime.now())
    # printing time and bot to log file
    print("+++++++++++++++++++++++++++++++++++++++++++++++++", file=open(log_file, "a"))

    print("Started program at", datetime.datetime.now(), file=open(log_file, "a"))
    print("And completed_count=", completed_count, file=open(log_file, "a"))

    print("*Bot is working....", file=open(log_file, "a"))

    ######RUN-BOT
    # run scrapy through command line
    # print to std out the result for debugging comment this if you want.
    result = subprocess.run(['scrapy', 'crawl', 'opera_extensions', '-o', name_exported_file ], stdout=subprocess.PIPE)
    # after run bot run filter using keyword
    print("*Bot finished....", file=open(log_file, "a"))


    ######POST-PROCESSING
    
    print("Run FILTER using keywords....", file=open(log_file, "a"))
    # this variable includes url and name of the corresponding exported file from the bot each time
    
    data_utils.filter_keywords(name_exported_file_after_running_bot, name_exported_file_after_running_bot)
    print("FILTER using keywords finished", file=open(log_file, "a"))

    print("Run 8 latest months filter", file=open(log_file, "a"))
    #print("Running latest months filter....", file=open("log.txt", "a"))
    # name of the result after filtering using keywords
    name_exported_file_after_running_bot_csv = name_exported_file_after_running_bot + 'FILTER_KEYWORDS' + '.json'
    y_1 = data_utils.processing_latest_months(name_exported_file_after_running_bot_csv)
    print("Finished latest months filter", file=open(log_file, "a"))

    print("Exporting csvvvvvv....", file=open(log_file, "a"))
    data_utils.export_csv(y_1[1],name_exported_file_after_running_bot + "FILTER_DATE" + '.csv',csv_columns)
    print("Exporting csvvvvvv is finished....", file=open(log_file, "a"))

    # find missed app
    print("Finding missed app....", file=open(log_file, "a"))
    get_code_find_missed.missed_all_app(name_exported_file_after_running_bot_csv,completed_count,browser)
    print("Updated missed.json and recent.json", file=open(log_file, "a"))
    print("Updated /missed", file=open(log_file, "a"))

    '''
    # scan new added apps
    print("Scanning new app....", file=open(log_file, "a"))
    scan_ext_file.startScan(completed_count,browser)
    print("Finished scanning", file=open(log_file, "a"))
    '''

    # increase completed_count
    print("Increased completed_count", file=open(log_file, "a"))

    print("Finished the WHOLE process at", datetime.datetime.now(), file=open(log_file, "a"))
    print("Started to wait 8 hours at", datetime.datetime.now(), file=open(log_file, "a"))
  
    # print a newline between each time after running bot.
    print("+++++++++++++++++++++++++++++++++++++++++++++++++\n", file=open(log_file, "a"))


if __name__=='__main__':
    completed_count=sys.argv[1]
    log_file='log/opera_log_%s.txt' % completed_count
    crawler_start(int(completed_count),log_file)
       
        
import json
import dateutil.parser as dparser
import re
import csv

######## Remove duplicates
# remove duplicates def
# Remove duplicates
def remove_dup_list_dic(test_list):
     # remove duplicates
    res_list = [] 
    for i in range(len(test_list)): 
        if test_list[i] not in test_list[i + 1:]: 
            res_list.append(test_list[i])

    return res_list


# Export csv
# return csv and remove dups
def export_csv(filter_cleaned_data,csv_file,csv_columns):
   
    final_data = remove_dup_list_dic(filter_cleaned_data)

    with open(csv_file, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in final_data:
            writer.writerow(data)


# return 8 latest month result and remove dups(from Jan to Aug)
def processing_latest_months(input_file):
    data = []
    last_8_months = [0, 0, 0, 0, 0, 0, 0, 0]

    with open(input_file) as json_file:
        data_dict = json.load(json_file)

        # Removing duplicates
        clean_data = remove_dup_list_dic(data_dict)


        for p in clean_data:

            date_type = dparser.parse(p["last_updated"],fuzzy=True)
            # 2020 and 2021
            if (date_type.year == 2020):
                data.append(p)
            if (date_type.year == 2021):
                data.append(p)

    y_units = last_8_months

    result = [y_units, data]
    return result




################# CLEANER after run BOT- CRAWLER (using keywords)
# find substring without case sensitives
def f_wo_case(substring, main_string):

    if re.search(substring, main_string, re.IGNORECASE):
        return True

    return False
# This will filter the result from crawler one more time by using popular keywords
# para
def filter_keywords(input_file, output_file):
    cleaned_data = []
    # with open('combined.json') as json_file:
    #     data_dict = json.load(json_file)
    input_file = input_file + '.json'
    with open(input_file) as json_file:
        data_dict = json.load(json_file)

    for each in data_dict:

        # date_type = dparser.parse(each["last_updated"],fuzzy=True)
        ####### Using key filters
        key = each["key"]
        common_words_filters_key = (key.find("bit") != -1 or key.find("coin") != -1 or key.find("wallet") != -1 or key.find("exchange") != -1 or key.find("token") != -1 or \
                key.find("ether") != -1 or key.find("currency") != -1 or key.find("exchange") != -1 or key.find("crypto") != -1 or \
                key.find("chain") != -1 or key.find("cash") != -1 or key.find("transaction") != -1 or key.find("bank") != -1 or \
                key.find("pay") != -1 or key.find("money") != -1 or key.find("card") != -1 or key.find("card") != -1 or \
                key.find("binance") != -1 or key.find("ledger") != -1 or key.find("ledger") != -1 or key.find("trezor") != -1 or key.find("trezor") != -1 )

        filters_key = ( common_words_filters_key and (key.find("theme") == -1) )

        ######## Using name filters
        name = each["name"]     
        # Reason for excluding them because Firefox has a bac search engine that cannt effectively classify theme and extensions
        common_words_filters_name = (f_wo_case("bit", name) == True or f_wo_case("coin", name) == True or f_wo_case("wallet", name) == True or f_wo_case("exchange", name) == True or f_wo_case("token", name) == True or \
                f_wo_case("ether", name) == True or f_wo_case("currency", name) == True or f_wo_case("exchange", name) == True or f_wo_case("crypto", name) == True or \
                f_wo_case("chain", name) == True or f_wo_case("cash", name) == True or f_wo_case("transaction", name) == True or f_wo_case("bank", name) == True or \
                f_wo_case("pay", name) == True or f_wo_case("money", name) == True or f_wo_case("card", name) == True or f_wo_case("bit", name) == True or \
                f_wo_case("nance", name) == True or f_wo_case("ledger", name) == True or f_wo_case("trezor", name) == True) 

        filters_name =  common_words_filters_name
        
        ######## Using name filters
        
        intro = each["introduction"]     
        # Reason for excluding them because Firefox has a bac search engine that cannt effectively classify theme and extensions
        common_words_filters_intro = (f_wo_case("bit", intro) == True or f_wo_case("coin", intro) == True or f_wo_case("wallet", intro) == True or f_wo_case("exchange", intro) == True or f_wo_case("token", intro) == True or \
                f_wo_case("ether", intro) == True or f_wo_case("currency", intro) == True or f_wo_case("exchange", intro) == True or f_wo_case("crypto", intro) == True or \
                f_wo_case("chain", intro) == True or f_wo_case("cash", intro) == True or f_wo_case("transaction", intro) == True or f_wo_case("bank", intro) == True or \
                f_wo_case("pay", intro) == True or f_wo_case("money", intro) == True or f_wo_case("card", intro) == True or f_wo_case("bit", intro) == True or \
                f_wo_case("nance", intro) == True or f_wo_case("ledger", intro) == True or f_wo_case("trezor", intro) == True) 

        filters_intro =  common_words_filters_intro 

        ####### combining name and key filters by OR
        filters = filters_key or filters_name or filters_intro
        
        if (filters):
            cleaned_data.append(each)

    # EXPORT JSON
    output_file = output_file + 'FILTER_KEYWORDS' + '.json'
    with open(output_file, 'w') as cleaned_json:
        json.dump(cleaned_data, cleaned_json)

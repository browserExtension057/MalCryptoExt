import os
import json
import csv

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


def convert_to_ext_unit(path,list):
    res=[]
    reached_ext=[]

    for item in list:
        id=item['ext_name']
        if id not in reached_ext:
            reached_ext.append(id)
            item_file=[]
            for subfile in list:
                if subfile['ext_name']==id:
                    item_file.append(subfile)

            # get the full list of files for each extensions
            num_str=0
            num_pun=0
            num_key=0
            num_iden=0
            num_num=0
            num_bool=0
            num_reg=0
            num_null=0
            num_temp=0
            for jsfile in item_file:
                num_str+=jsfile['types']['String'] if 'String' in jsfile['types'] else 0
                num_pun+=jsfile['types']["Punctuator"] if 'Punctuator' in jsfile['types'] else 0
                num_key+=jsfile['types']["Keyword"] if 'Keyword' in jsfile['types'] else 0
                num_iden+=jsfile['types']['Identifier'] if 'Identifier' in jsfile['types'] else 0
                num_num+=jsfile['types']['Numeric'] if 'Numeric' in jsfile['types'] else 0
                num_bool+=jsfile['types']['Boolean'] if 'Boolean' in jsfile['types'] else 0
                num_reg+=jsfile['types']['RegularExpression'] if 'RegularExpression' in jsfile['types'] else 0
                num_null+=jsfile['types']['Null'] if 'Null' in jsfile['types'] else 0
                num_temp+=jsfile['types']['Template'] if 'Template' in jsfile['types'] else 0

            rows=[jsfile['ext_name'],num_str,num_pun,num_key,num_iden,num_num,num_bool,num_reg,num_null,num_temp]
            res.append(rows)
        else:
            continue
    headers=["Extension","String","Punctuator","Keyword","Identifier","Numeric","Boolean","RegularExpression","Null","Template"]
    with open(path,'w') as f:
        f_csv=csv.writer(f)
        f_csv.writerow(headers)
        f_csv.writerows(res)

def traverseFile(dir_path):
    traverselist = []
    for home, dirs, files in os.walk(dir_path):
        for filename in files:
            # 文件名列表，包含完整路径
            if filename[-9:]=='type.json' and filename[-12:]!='.j_type.json':
                print(os.path.join(home,filename))
                res=stat_type(os.path.join(home,filename))
                # store the statistic into another json file
                tmp_name=home.split('/')[-1]
                # print(tmp_name)
                tmp={'ext_name':tmp_name,'file_name':filename[:-10],'types':res}
                traverselist.append(tmp)
                # print(res)
    return traverselist

def save_json(path,data):
    with open(path,'w') as f:
        json.dump(data,f)

def save_csv(path,data):
    headers=["Extension","Filename","String","Punctuator","Keyword","Identifier","Numeric","Boolean","RegularExpression","Null","Template"]
    rows=[]
    for item in data:
        
        num_str=item['types']['String'] if 'String' in item['types'] else 0
        num_pun=item['types']["Punctuator"] if 'Punctuator' in item['types'] else 0
        num_key=item['types']["Keyword"] if 'Keyword' in item['types'] else 0
        num_iden=item['types']['Identifier'] if 'Identifier' in item['types'] else 0
        num_num=item['types']['Numeric'] if 'Numeric' in item['types'] else 0
        num_bool=item['types']['Boolean'] if 'Boolean' in item['types'] else 0
        num_reg=item['types']['RegularExpression'] if 'RegularExpression' in item['types'] else 0
        num_null=item['types']['Null'] if 'Null' in item['types'] else 0
        num_temp=item['types']['Template'] if 'Template' in item['types'] else 0

        tmp=[item['ext_name'],item['file_name'],num_str,num_pun,num_key,num_iden,num_num,num_bool,num_reg,num_null,num_temp]
        rows.append(tmp)

    with open(path,'w') as f:
        f_csv=csv.writer(f)
        f_csv.writerow(headers)
        f_csv.writerows(rows)

if __name__=='__main__':
    subtype='scam'
    traverselist=traverseFile('./dataset/all_malicious/%s/clearJS' % subtype)
    # print(traverselist)
    save_json('./dataset/all_malicious/%s_variable_types.json' % subtype,traverselist)

    with open('./dataset/all_malicious/%s_variable_types.json' % subtype,'r') as f:
        traverselist=json.load(f)
    convert_to_ext_unit('./dataset/all_malicious/%s_variable_types.csv' % subtype,traverselist)
    # save_csv('./malicious_all_type_info.csv',traverselist)


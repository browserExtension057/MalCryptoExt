import csv
import numpy

# input the data ready for training
# output the data after normalization


def get_csv_header(file_path):
    tmp = []
    with open(file_path, 'r') as f:
        f_csv = csv.reader(f)
        for row in f_csv:
            tmp.append(row)
    tmp = numpy.array(tmp)
    return tmp[0]


def read_csv(file_path):
    label = []
    data = []
    tmp = []
    with open(file_path, 'r') as f:
        f_csv = csv.reader(f)
        for row in f_csv:
            tmp.append(row)
    count=0
    for item in tmp:
        count+=1
        if count==1:
            # first line
            continue
        label.append(item[0])
        data.append(item[1:])
    return [label,data]

    tmp = numpy.array(tmp)
    label = tmp[1:, 0]
    data = tmp[:, 1:]
    return [label, data]


def write_csv(file_path, label, data, header):
    with open(file_path, "w") as csvfile:
        writer = csv.writer(csvfile)

        # 先写入columns_name
        writer.writerow(header)
        # 写入多行用writerows
        for i in range(len(data)):
            line = [label[i]]+data[i]
            writer.writerow(line)


def do_normal(file_path,new_file_path):
    
    [label, raw_data] = read_csv(file_path)
    new_data = []
    # print(type(raw_data))
    # print(raw_data)
    header = raw_data[0]
    for item in raw_data[1:]:
        # print(item)
        # print(len(item))
        item = [int(i) if i!='' else 0 for i in item]
        biggest = int(sum(item))
        # print(biggest)
        item = numpy.array([int(char_sing) for char_sing in item])
        # print(type(biggest))
        if biggest != 0:
            tmp = numpy.around(item/biggest, 8)
        else:
            tmp = item
        new_data.append(tmp.tolist())

    # print(new_data)
    # print(type(new_data))
    write_csv(new_file_path, label, new_data, header)


def get_calle_name():
    header1=['permission','cookies','webRequest','<all_urls>','file://*','tabs','http://*/*','https://*/*','storage','webnavigation','webRequestblocking','activeTab']

    header2 = ["Extension", "Filename", "String", "Punctuator", "Keyword",
               "Identifier", "Numeric", "Boolean", "RegularExpression", "Null", "Template"]
    header3 = ['setTimeout', 'clearTimeout', 'parseInt', 'parseFloat', 'isNaN', 'define', 'clear', 'Interval', 'setInterval', 'Object', 'Function', 'decodeURIComponent', 'encodeURIComponent', 'Array',
               'isFinite', 'String', 'Number']
    retA = [i for i in header1 if i in header2]
    return retA


def combine_all_features(file1,file2,file3,output_file):
    header1=['cookies','webRequest','<all_urls>','file://*','tabs','http://*/*','https://*/*','storage','webnavigation','webRequestblocking','activeTab']

    header2 = [ "String", "Punctuator", "Keyword",
               "Identifier", "Numeric", "Boolean", "RegularExpression", "Null", "Template"]
    header3 = ['setTimeout', 'clearTimeout', 'parseInt', 'parseFloat', 'isNaN', 'define', 'clear', 'Interval', 'setInterval', 'Object', 'Function', 'decodeURIComponent', 'encodeURIComponent', 'Array',
               'isFinite', 'String', 'Number']

    [label1, raw_data1] = read_csv(file1)
    [label2, raw_data2] = read_csv(file2)
    [label3, raw_data3] = read_csv(file3)
    
    final_label=list(set(label2).intersection(label1,label3))
    res=[]
    for ext in final_label:
        tmp=raw_data1[label1.index(ext)]+raw_data2[label2.index(ext)]+raw_data3[label3.index(ext)]
        # tmp1=list(raw_data1[numpy.where(label1==ext)])
        # tmp2=list(raw_data2[numpy.where(label2==ext)])
        # tmp3=list(raw_data3[numpy.where(label3==ext)])
        # tmp=tmp1+tmp2+tmp3
        res.append(tmp)
    header=['']+header1+header2+header3
    write_csv(output_file,final_label,res,header)

if __name__ == '__main__':
    file_path = 'dataset/300_benign_callee_funcs.csv'
    new_file_path = 'dataset/300_benign_callee_funcs_normal.csv'
    do_normal(file_path,new_file_path)
    # get_calle_name()
    # file1='dataset/300_benign_permission_normal.csv'
    # file2='dataset/300_benign_variable_types_normal.csv'
    # file3='dataset/300_benign_callee_funcs_normal.csv'
    # output_file='dataset/300_benign_all_features.csv'
    # combine_all_features(file1,file2,file3,output_file)

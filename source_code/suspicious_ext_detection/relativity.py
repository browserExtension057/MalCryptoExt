import normalization
import numpy
import csv
import json

def fisher(label,data,threshold):
    [r1,r2,r3,r4]=make_table(label,data,threshold)
    odds=(r1/r2)/(r3/r4)
    rr=(r1/(r1+r2))/(r3/(r3+r4))
    return [odds,rr]

def make_table(label,data,threshold):
    r1=0
    r2=0
    r3=0
    r4=0
    for i in range(len(data)):
        if label[i]==1 and data[i]>=threshold:
            r1+=1
        if label[i]==0 and data[i]>=threshold:
            r3+=1
        if label[i]==1 and data[i]<threshold:
            r2+=1
        if label[i]==0 and data[i]<threshold:
            r4+=1
    if r1==0 or r2==0 or r3==0 or r4==0:
        r1+=0.5
        r2+=0.5
        r3+=0.5
        r4+=0.5
    # print(r1,r2,r3,r4)
    return [r1,r2,r3,r4]

def get_threshould(tmp_data):
    input=tmp_data
    # threshold=numpy.median(input)
    threshold=numpy.mean(input)

    return threshold
def save_csv_without_pd(csv_file,header,csv_data):
    with open(csv_file,"w") as csvfile: 
        writer = csv.writer(csvfile)

        #先写入columns_name
        writer.writerow(header)
        #写入多行用writerows
        writer.writerows(csv_data)

if __name__ == '__main__':
    file='./TypeFunctionData/func_type_relative.csv'
    [label,data]=normalization.read_csv(file)
    label=numpy.array(label).astype(numpy.float64)
    data=numpy.array(data).astype(numpy.float64)
    types_name=["String","Punctuator","Keyword","Identifier","Numeric","Boolean","RegularExpression","Null","Template"]
    funcs_name=['setTimeout', 'clearTimeout', 'parseInt', 'parseFloat', 'isNaN', 'define', 'clearInterval', 'setInterval', 'Object', 'Function', 'decodeURIComponent', 'encodeURIComponent', 'Array', 'isFinite', 'String', 'Number']
    features_name=types_name+funcs_name
    odds_list=[]
    risk_list=[]
    for index,item in enumerate(features_name):
        # print(index,item)
        tmp_data=data[:,index]
        # print(tmp_data)
        threshold=get_threshould(tmp_data)
        # print(threshold)
        [odds,rr]=fisher(label,tmp_data,threshold)
        print(odds,rr)
        odds_list.append(odds)
        risk_list.append(rr)
    
    csv_file='./or_rr.csv'
    csv_data=[odds_list,risk_list]
    save_csv_without_pd(csv_file,features_name,csv_data)
    

import json
import subprocess
import os
import xlwt

def unzip():
    # upzip the crx file
    folder='/Users/a057/Desktop/Extension Source Code/benign'
    # command to unzip
    # $unzip [origin file path] -d [new path]
    # unzip_folder='/Users/a057/Desktop/Extension Source Code/AllUnzip/'
    unzip_folder='/Users/a057/Desktop/Extension Source Code/Unzip_benign/'

    for root, subdirs, files in os.walk(folder):
        for filename in files:
            if '.crx' or '.xpi' in filename:
                file_path=os.path.join(root, filename)
                unzip_file_path=os.path.join(unzip_folder,filename.split('.')[0])
                subprocess.run(['unzip',file_path,'-d',unzip_file_path])

if __name__ == "__main__":

    # unzip()
    unzip_folder='./dataset/300_benign/unzip'
    permission_file='./300_benign_permission.xls'

    permission_items=[]
    permission_list=['permission','cookies','webRequest','<all_urls>','file://*','tabs','http://*/*','https://*/*','storage','webnavigation','webRequestblocking','activeTab']

    # all extensions have been unzipped into AllUnzip folder
    # get and analyze the manifest.json file of each extension
    for root, subdirs, files in os.walk(unzip_folder):
        for file in files:
            if 'manifest.json' in file:
                # analyze the manifest file
                file_path=os.path.join(root,file)
                with open(file_path,'rb') as f:
                    try:
                        tmp=f.read().decode('ascii')
                            
                        meta_data=json.loads(tmp)
                    except:
                        print(file_path)
                        break
                id=root.split('/')[-1]
                try:
                    name=meta_data['name']
                except:
                    print('there is a extension who does not have name %s' % file)
                    name='no name'
                
                try:
                    version=meta_data['version']
                except:
                    version=''
                perm_item=[]

                try:
                    permissions=meta_data['permissions']
                except:
                    print('there is no permissions in one extension')
                    perm_item.append(id)
                    perm_item.append(name)
                    permission_items.append(perm_item)
                    continue

                # for perm in permissions:
                #     if perm not in permission_list and len(permission_list)<250:
                #         permission_list.append(perm)
                perm_item.append(id)
                perm_item.append(name)
                for item in permission_list:
                    if item in permissions:
                        perm_item.append(1)
                    else:
                        perm_item.append(0)

                permission_items.append(perm_item)
                # write new row to the permission excel file
                # update column element

    # Have read all manifest files
    # Write the result to the xlsx file        
    workbook=xlwt.Workbook()
    worksheet=workbook.add_sheet('sheet1',cell_overwrite_ok=True)
    for i in range(len(permission_list)):
        try:
            worksheet.write(0,i+1,permission_list[i])
        except:
            worksheet.write(0,i+1,'error')
    # worksheet.write(permission_list)
    for i in range(len(permission_items)):
        for j in range(len(permission_items[i])):
            try:
                worksheet.write(i+1,j,permission_items[i][j])
            except:
                worksheet.write(i+1,j,'error')
        # worksheet.writerow(permission_items[i])
    workbook.save(permission_file)


    

            
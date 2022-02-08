from logging import StringTemplateStyle
import os
import json
import subprocess
import signal
import tkinter
from tkinter import *
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

DATE="5_19"

current_index = 0

def handle_extension(extension_driver):
    # do sth like pressing buttons
    return True
def get_default_page_path(path_to_extension):
    manifest_path=path_to_extension+'manifest.json'
    with open(manifest_path,'r') as f:
    	settings=json.load(f)
    try:
    	default_path=settings["browser_action"]["default_popup"]
    except:
    	print("there is no initial popup page")
    	default_path=""
    return default_path

def start_extension(path_to_extension):
    chrome_options = Options()
    chrome_options.add_argument('load-extension=' + path_to_extension)
    chrome_options.add_experimental_option("detach", True)
    chrome_options.add_experimental_option('excludeSwitches', ['enable-automation']) 

    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.create_options()
    # open the manager page of the chrome extension
    driver.get("chrome://extensions/")
    driver.switch_to.window(driver.window_handles[0])
    
    # get the real id of the extension
    element=driver.find_element_by_css_selector("extensions-manager")
    #print(element.get_attribute('innerHTML'))
    shadow_root1 = driver.execute_script('return arguments[0].shadowRoot', element)
    element1=shadow_root1.find_element_by_css_selector("cr-view-manager")
    element2=shadow_root1.find_element_by_css_selector("extensions-item-list")
    shadow_root2 = driver.execute_script('return arguments[0].shadowRoot', element2)
    element3=shadow_root2.find_element_by_id("container")
    element4=element3.find_element_by_id("content-wrapper")
    element5=element4.find_element_by_class_name("items-container")
    element6=element5.find_element_by_css_selector('extensions-item')
     
    extension_id=element6.get_attribute('id')
    
    # get the initial page of the extension
    # extension_id="***"
    popup_page=get_default_page_path(path_to_extension)
    if popup_page=="":
        print("there is no popup page")
        return

    initial_page="chrome-extension://"+extension_id+'/'+popup_page
    
    # start the mitmproxy
    # the script for the mitmproxy mitm_req_res.py should be in the same path as the current file
    # mitm=subprocess.run('mitmproxy -s mitm_req_res.py' + ' ' + DATE + ' ' + extension_id, shell=True)
    # start the test automatically
    driver.get(initial_page)
    # Shandle_extension(driver)
    # driver.close()
    
    # close the mitmproxy by CTL_C signal
    # mitm.send_signal(signal.SIGINT)
def mainGUIinterface(folder_list):
    global current_index
    current_index = folder_list.index('hcfhemgkgbfonoagglgjcjhaolkacoec')
    extension_folder = './unzip'
    foldername = folder_list[current_index]
    path_to_extension = extension_folder+'/'+foldername+'/'
    start_extension(path_to_extension=path_to_extension)
    def prev():
        print('prev')
        global current_index
        current_index = current_index - 1
        foldername1 = folder_list[current_index]
        path_to_extension1 = extension_folder+'/'+foldername1+'/'
        start_extension(path_to_extension=path_to_extension1)
    def next():
        print('next')
        global current_index
        current_index += 1
        foldername1 = folder_list[current_index]
        path_to_extension1 = extension_folder+'/'+foldername1+'/'
        start_extension(path_to_extension=path_to_extension1)
        current_number.set(str(current_index))
        current_name.set(foldername1)
    mainUserInterfaceWindow = tkinter.Tk()
    mainUserInterfaceWindow.title("selection tool")
    mainUserInterfaceWindow.geometry("500x200")
    # mainUserInterfaceWindowmainframe = tkinter.Frame(mainUserInterfaceWindow)
    # mainUserInterfaceWindowmainframe.pack()
    # mainUserInterfaceWindowleftframe = tkinter.Frame(mainUserInterfaceWindowmainframe)
    # mainUserInterfaceWindowrightframe = tkinter.Frame(mainUserInterfaceWindowmainframe)
    current_number = tkinter.StringVar()
    current_name = tkinter.StringVar()
    selectioncountmainlabel = tkinter.Label(mainUserInterfaceWindow, text="count: ")
    selectioncountcurrentnumber = tkinter.Label(mainUserInterfaceWindow,textvariable=current_number)
    selectioncounttotalnumber = tkinter.Label(mainUserInterfaceWindow,text="")
    currentnamemainlable = tkinter.Label(mainUserInterfaceWindow,text="current name: ")
    currentnamedispalylabel = tkinter.Label(mainUserInterfaceWindow,textvariable=current_name)

    selectioncountmainlabel.pack()
    selectioncountcurrentnumber.pack()
    selectioncounttotalnumber.pack()
    currentnamemainlable.pack()
    currentnamedispalylabel.pack()


    ###Buttoms
    prevbuttom = tkinter.Button(mainUserInterfaceWindow,text="prev",command=prev)
    nextbuttom = tkinter.Button(mainUserInterfaceWindow,text="next",command=next)

    prevbuttom.pack()
    nextbuttom.pack()


    mainUserInterfaceWindow.mainloop()

def init():
    extension_folder = './unzip'
    print("============start===========")
    f_list = os.listdir(extension_folder)
    print(str(len(f_list)) + ' folders found')
    result = []
    foldernum = 0
    check = False
    f_list.sort()
    return f_list
    for foldername in f_list:
        result.append(foldername)
    for foldername in f_list:
        # handle each extension respectively
        if foldername == 'acpiodlfenhddlhbdignnkmdknjfpmop':
            check = True
        if check==True:
            path_to_extension = extension_folder+'/'+foldername+'/'
            start_extension(path_to_extension=path_to_extension)
            break
        #foldernum += 1
        #print("current folder: " + str(foldernum) + ' total folder: ' + str(len(f_list)))

        # for test
        #break

if __name__=='__main__':
    #mainGUIinterface()
    flist = init()
    mainGUIinterface(flist)

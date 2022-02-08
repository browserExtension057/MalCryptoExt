"""
    script for mitmproxy
    record all the http resquest and response through the proxy
    set package filter
    usage:
        $ mitmproxy -s <path of this file>
    author: Ling Yuxi
    date: April 22
"""

from mitmproxy import http, ctx
from multiprocessing import Lock
import json
import datetime
import csv

class Filter:
    def __init__(self, filter_info):
        self.log_info = ""
        self.response_log_info = ""
        self.json_info=[]
        self.response_json_info=[]
        self.mutex = Lock()
        self.filter_info = filter_info
        self.switch_on = False
        self.modify_response_file = ""
        self.ext_name = "Test"
        self.date="4_22"
        self.request_log_file = "data/%s_request_%s.txt" % (self.date,self.ext_name)
        self.request_csv_file = "data/%s_request_%s.csv" % (self.date,self.ext_name)
        self.request_json_file="data/%s_request_%s.json" % (self.date,self.ext_name)
        self.response_log_file = "data/%s_reponse_%s.txt" % (self.date,self.ext_name)
        self.response_csv_file = "data/%s_reponse_%s.csv" % (self.date,self.ext_name)
        self.response_json_file="data/%s_response_%s.json" % (self.date,self.ext_name)
        head = ['TIME', 'METHOD', 'HOST', 'URL',
                'QUERY STRING', 'FORM', 'STATUS CODE', 'RESPONSE']
        with open(self.request_csv_file, 'a') as cf:
            writer = csv.writer(cf)
            writer.writerow(head)

    def log(self, info):
        self.log_info += f"{info}\n"

    def response_log(self, info):
        self.response_log_info += f"{info}\n"

    def write_request_log(self, mode="w+"):
        self.mutex.acquire()
        with open(self.request_log_file, mode) as f:
            f.write(self.log_info)
        self.mutex.release()

    def write_response_log(self, mode="w+"):
        self.mutex.acquire()
        with open(self.response_log_file, mode) as f:
            f.write(self.response_log_info)
        self.mutex.release()

    def write_request_json(self, mode="w+"):
        self.mutex.acquire()
        with open(self.request_json_file,mode) as f:
            json.dump(self.json_info,f)
        self.mutex.release()

    def write_response_json(self, mode="w+"):
        self.mutex.acquire()
        with open(self.response_json_file,mode) as f:
            json.dump(self.response_json_info,f)
        self.mutex.release()

    def is_target_flow(self, flow: http.HTTPFlow):
        return True

    def modify_response(self, flow: http.HTTPFlow):
        if self.switch_on and self.modify_response_file:
            with open(self.modify_response_file, "r") as f:
                flow.response.content = f.read().encode()
        return flow

    def request(self, flow: http.HTTPFlow):
        if self.is_target_flow(flow):
            info_set = []
            self.log_info = ""
            current = datetime.datetime.now()
            timestr = current.strftime("%Y-%m-%d %H:%M:%S")
            self.log(f"——TIME——\n{timestr}")
            self.log(f"——METHOD——\n{flow.request.method}")
            self.log(f"——HOST——\n{flow.request.pretty_host}")
            self.log(f"——URL——\n{flow.request.pretty_url}")
            info_set.append(timestr)
            info_set.append(flow.request.method)
            info_set.append(flow.request.pretty_host)
            info_set.append(flow.request.pretty_url)
            query=[]
            form=[]
            if flow.request.query:
                query = [i + ":" + flow.request.query[i] +
                         "\n" for i in flow.request.query]
                self.log(f"——QUERY STRING——\n{''.join(query)}")
                info_set.append(''.join(query))
            else:
                info_set.append(" ")
            
            if flow.request.urlencoded_form:
                form = [i + ":" + flow.request.urlencoded_form[i] +
                        "\n" for i in flow.request.urlencoded_form]
                self.log(f"——FORM——\n{''.join(form)}")
                info_set.append(''.join(form))
            else:
                info_set.append(" ")

            self.log("\n")
            with open(self.request_csv_file, 'a') as cf:
                writer = csv.writer(cf)
                writer.writerow(info_set)
            self.write_request_log(mode="a")
            json_item={"time":timestr,"method":flow.request.method,"host":flow.request.pretty_host,"url":flow.request.pretty_url,"query":''.join(query),"form":''.join(form)}
            self.json_info.append(json_item)
            self.write_request_json()

    def response(self, flow: http.HTTPFlow):
        if self.is_target_flow(flow):
            info_set = []
            self.response_log_info = ""
            current = datetime.datetime.now()
            timestr = current.strftime("%Y-%m-%d %H:%M:%S")
            self.response_log(f"——TIME——\n{timestr}")
            # self.response_log(f"——CODE——\n{flow.response.code}")
            self.response_log(f"——HEADERS——\n{flow.response.headers}")
            content=flow.response.content
            self.response_log(f"——CONTENT——\n{content}")
            
            info_set.append(timestr)
            # info_set.append(flow.response.code)
            info_set.append(flow.response.headers)
            info_set.append(flow.response.content)
            # info_set.append(flow.response)

            self.response_log("\n")
            with open(self.response_csv_file, 'a') as cf:
                writer = csv.writer(cf)
                writer.writerow(info_set)
            self.write_response_log(mode="a")

            if len(content)>200:
                content=str(content)[0:200]+"..."
            info_json={"time":timestr,"headers":str(flow.response.headers),"content":str(content)}
            self.response_json_info.append(info_json)  
            self.write_response_json()       


filter_info = [
    {
        "str_in_url": "test",
        "log_file": "test_log.txt",
        "switch_on": True,
        "response_file": "test_response.txt",
    }
]
addons = [
    Filter(filter_info)
]

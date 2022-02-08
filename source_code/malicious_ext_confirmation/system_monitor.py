#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# @copyright: A kind bro from CSDN

import os
import getpass
import psutil
import time
import logging
import smtplib
from email.mime.text import MIMEText
from email.header import Header
 
 
 
def getCPUState(interval=1):
	''' function of Get CPU State '''
	cpuCount = psutil.cpu_count()
	cpuPercent = psutil.cpu_percent(interval)
	return("Logic CPU: %s; CPU: %s%%" % (str(cpuCount), str(cpuPercent)), str(cpuPercent))   
	pass
 
 
def getMemoryState():
	''' function of GetMemory '''
	phymem = psutil.virtual_memory()
	usedmem = int(phymem.used / 1024 / 1024 )
	totalmem = int(phymem.total / 1024 / 1024)
	phymemPercent = "{:.2f}".format(float(usedmem/totalmem * 100))
	return("Memory used: %sM; Memory total: %sM; Memory percent: %s%%" % (str(usedmem), str(totalmem), str(phymemPercent)))
	pass
 
 
def getDiskState():
	''' function of disk state '''
	diskinfo=psutil.disk_usage('/')
	disktotal = int(diskinfo.total / 1024 / 1024 / 1024)
	diskused = int(diskinfo.used/1024/1024/1024)
	diskfree = int(diskinfo.free/1024/1024/1024)
	return("Disk total: %sG; Disk used: %sG; Disk free: %sG" % (str(disktotal), str(diskused), str(diskfree)))
	pass
 
 
def getProcessState():
	''' function of proscess state '''
	pid = psutil.pids() 
	for k,i in enumerate(pid): 
	    try: 
	        proc  = psutil.Process(i) 
	        print(k,i,"%.2f%%"%(proc.memory_percent()),"%",proc.name(),proc.exe())
	    except psutil.AccessDenied : 
	        print("psutil.AccessDenied")
	pass
 
 
def getProcessInfo(p):
	''' function of get ProcessInfo (PID,Memory, CPU Percent) '''
	username = getpass.getuser()
	proUsername = p.username()
	if username == proUsername:
		try:
			pid = p.pid
			memory = p.memory_info() 
			rss = int(memory.rss / 1024 / 1024 )
			vms = int(memory.vms / 1024 / 1024 )
			cpu = int(p.cpu_percent(interval=0))
			proStatus = p.status()
			proTime = "{:.2f}".format(p.cpu_times().user + p.cpu_times().system + p.cpu_times().children_user + p.cpu_times().children_system)
			proName = ' '.join(p.cmdline())
		except psutil.Error:    
			pid = 0
			rss = 0
			vms = 0
			cpu = 0
			proStatus = 0
			proTime = 0
			proName = "Closed_Process" 
		return( ("%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s" ) % (username, pid, vms, rss, cpu, proStatus, proTime, proName))  
 
 
def getAllProcessInfo():
	instances = []
	allpid = psutil.pids()
	time.sleep(1)
	for pid in allpid:
		if psutil.pid_exists(pid):
			proc = psutil.Process(pid)
			instances.append(getProcessInfo(proc))
	instances = list(filter(None, instances))
	return instances
 
 
def send_mail(message): 
	sender = 'luojy00@126.com' # 发送邮箱 
	receiver = ['luojy00@126.com'] #接收邮箱 
	subject = '报警' 
	username = 'luojy00@126.com' #发送邮箱 
	password = '123456' #发送邮箱密码或授权码 
	msg = MIMEText(message, 'plain', 'utf-8') 
	msg['Subject'] = Header(subject, 'utf-8') 
	msg['From'] = 'Luojy<luojy00@126.com>' 
	msg['To'] = "luojy00@126.com" 
	smtp = smtplib.SMTP() 
	smtp.connect('smtp.126.com') 
	smtp.login(username, password) 
	smtp.sendmail(sender, receiver, msg.as_string()) 
	smtp.quit()
 
 
def main():
	logging.basicConfig(filename="memory.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s",  filemode='w')
	while 1:
		cpus = getCPUState()
		cpu = cpus[0]
		mem = getMemoryState()
		disk = getDiskState()
		processInfoList = getAllProcessInfo()
		outputInfo = [cpu, mem, disk, "#Username\tPid\tVms\tRss\tCpu\tStatus\tTime\tCMD", "======================================================================"] + processInfoList
		logging.info("\n" + "\n".join(outputInfo) + "\n")
		if float(cpus[1]) > 98:
			logging.info("CPU usage exceeds 98%\n")
			pass
		time.sleep(5)
		pass
 
 
if __name__ == '__main__':
	main()
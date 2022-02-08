import selenium
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

if __name__ == "__main__":
    browser = webdriver.Chrome()
browser.get('https://www.google.com')
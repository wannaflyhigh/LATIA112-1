from math import floor
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import chromedriver_autoinstaller_fix
from time import sleep
import requests as rq
import pandas as pd
from bs4 import BeautifulSoup as soup
from selenium.webdriver.chrome.options import Options
from lxml import etree
import time

chromedriver_autoinstaller_fix.install()

driver = webdriver.Chrome()

url = "https://www.junyiacademy.org/junyi-science/science-high/junyi-biology/"
url_short = "https://www.junyiacademy.org/"
html = driver.get(url)
time.sleep(2)
sp = soup(driver.page_source, "lxml")

data_column_name = ["單元", "課程名稱", "網址"]


def get_data_address():
    data = []
    row = []
    sp = soup(driver.page_source, "html.parser")

    # Check if the tbody element with class "table_bottom" exists
    table = sp.find(
        "div",
        class_="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-lg-9 css-1hjwhii",
    )
    if table:
        div_tags = table.find_all("div", class_="MuiBox-root css-bdhjb8")
        for div_tag in div_tags:
            element_id = div_tag.get("id")[11:]
            td_tags = div_tag.find_all("div", class_="css-1fxvrsu")
            element_id = element_id.strip("'")
            row.append(element_id)
            for td_tag in td_tags:
                row.append(td_tag.text)
                data.append(row)
                row = []
    return data


def get_data(columns_name, now_page):
    data = []
    row = []
    sp = soup(driver.page_source, "html.parser")

    table = sp.find(
        "ul",
        class_="MuiList-root MuiList-padding css-1ontqvh",
    )
    if table:
        li_tags = table.find_all("li", class_="MuiListItem-container css-79elbk")
        for li_tag in li_tags:
            # judge_div_tags = li_tag.find_all(
            #     "div", class_="MuiListItemAvatar-root css-a5kqs7"
            # )
            # print(judge_div_tags)
            # for i in judge_div_tags:
            #     judge_div_tag = i.find_all("img", "MuiAvatar-img css-1hy9t21")
            #     print(judge_div_tag)
            #     for z in judge_div_tag:
            #         element = driver.execute_script(
            #             "return arguments[0].getAttribute('alt');", z
            #         )
            # if element != "video":
            #     continue
            div_tags = li_tag.find_all("div", class_="MuiListItemText-root css-1u7dzma")
            for div_tag in div_tags:
                span_tags = div_tag.find_all(
                    "span", class_="MuiTypography-root MuiTypography-body1 css-37h3rr"
                )
                for span_tag in span_tags:
                    row.append(columns_name)
                    row.append(span_tag.text[:-7])
                    data.append(row)
                    row = []
    print(data)
    return data


def get_data_video_web():
    sp = soup(driver.page_source, "html.parser")
    button_element = driver.find_element(
        By.XPATH,
        "/html/body/div[1]/div[4]/div[1]/div[2]/article/div/div/div[1]/div/div[2]/div[2]/ul/li[1]/div[1]",
    )
    button_element.click()


def get_data_web(data, count):
    sp = soup(driver.page_source, "html.parser")

    table = sp.find(
        "div",
        class_="nav-page-content",
    )
    if table:
        li_tags = table.find_all("div", class_="nav-pane")
        for li_tag in li_tags:
            ul_element = li_tag.find("ul")
            li_elements = ul_element.find_all("li")
            for li_element in li_elements:
                link_element = li_element.find("a")
                if link_element:
                    href_value = link_element.get("href")
                    data[count].append(url_short + href_value)
                    count += 1
    return data, count


def next_page(html_port):
    driver.get(url + html_port)
    time.sleep(5)


address = get_data_address()
data = []
now_page = 0
while True:
    next_page(address[now_page][0])
    data.extend(get_data(address[now_page][1], now_page))
    if now_page == len(address) - 1:
        print("This is the last page ( •̀ ω •́ )✧")
        break
    else:
        now_page += 1
now_page = 0
count = 0
while True:
    next_page(address[now_page][0])
    get_data_video_web()
    time.sleep(3)
    data_sp = get_data_web(data, count)
    data = data_sp[0]
    count = data_sp[1]
    if now_page == len(address) - 1:
        print("This is the last page ( •̀ ω •́ )✧")
        break
    else:
        now_page += 1

print(data)
data_column_name = ["單元", "課程名稱", "網址"]
df = pd.DataFrame(data, columns=data_column_name)
df.to_csv("均一高中生物.csv", index=False, encoding="utf-8")
driver.quit()

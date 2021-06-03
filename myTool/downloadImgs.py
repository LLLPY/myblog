from lxml import etree

from requests import get
from fake_useragent import UserAgent

url='https://www.17sucai.com/preview/537801/2019-01-09/QQ/index.html'
header={
    'User-Agent':UserAgent().chrome
}
response=get(url,headers=header)
content=response.text
e=etree.HTML(content)
srcList=e.xpath('//li/img/@src')

baseUrl='https://www.17sucai.com/preview/537801/2019-01-09/QQ/'
for url in srcList:
    nowUrl=baseUrl+url
    response=get(nowUrl,headers=header)
    content=response.content
    with open('../static/imgs/'+url.replace('images/',''),'wb+') as f:
        f.write(content)
print('爬取完毕!')
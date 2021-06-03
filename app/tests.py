import requests
from django.test import TestCase

# Create your tests here.
from fake_useragent import UserAgent

headers={
    'User-Agent':UserAgent().chrome
}


#测试中间件的正确性
def testMiddle():
    url='http://127.0.0.1:8000/login/'
    for i in range(100):
        response=requests.get(url,headers=headers)
        content=response.text
        print(content)


if __name__ == '__main__':
    testMiddle()
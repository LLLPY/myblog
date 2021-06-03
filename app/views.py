from random import choice, random, randint
from time import time, mktime, strptime

from django.contrib.auth.hashers import make_password,check_password
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django_redis import get_redis_connection

# 在登录中往往都需要使用post请求，在使用该请求是，需要进行csrf_token的验证，通过该验证有3中方法
from app.models import User, RequestLogTable, Blog

'''
1.在settings的MIDDLEWARE中注释掉csrf验证的中间件
2.在模板的form表单中添加{%csrf_token%}
3.使用装饰器获取豁免权:在视图函数的上一行使用装饰器:@csrf_exempt
'''

# 缓存的使用 登录
# @cache_page(timeout=60, cache='default')  # timeout指定缓存过期时间,cache指定缓存用的数据库，
def login(request):
    ip = request.META.get('REMOTE_ADDR')
    print(ip)
    print(cache.get(ip))
    return render(request,'login.html')
#注册
# @cache_page(timeout=60, cache='default')
def register(request):

    if request.method=='GET':
        return render(request,'register.html')

    if request.method=='POST':

        telValue = request.POST.get('tel')  # 用户的手机号码
        yzmValue=request.POST.get('yzm') #验证码
        pwdValue=request.POST.get('pwd') #密码

        if not all([telValue,yzmValue,pwdValue]): #如果不是全部参数,就说明是在发送验证码
            # 验证手机号码是否已经注册
            redis_con = get_redis_connection('default')  # 连接redis
            isRegister=redis_con.get(telValue)
            print(isRegister)
            if isRegister:
                return JsonResponse({'msg':'该号码已注册,可以直接登录!'})

            redis_con.setex(telValue,100000000000000000,'1') # {电话号码:1} 电话号码作为key 时效
            # 发送短信验证码
            #TODO


        #检查验证码是否正确
        else:
            yzm=''
            localYzm=''
            if yzm == localYzm:
                user=User()
                user.mobile=telValue
                user.password=make_password(pwdValue) #对密码进行加密
                  # check_password("前端传输过来的密码", "数据库中的密码") #检验密码的正确性
                user.save()
                return JsonResponse({'msg':'注册成功,可以直接登录!'})

            else:
                return JsonResponse({'msg':'验证码错误!'})


#访问出错
def error(request):
    return render(request,'404.html')


#用于测试
def test(request):

    return render(request,'search.html')

# 把时间转换成秒数
def str_to_timestamp(str_time=None, format='%Y-%m-%d %H:%M:%S'):
    if str_time:
        time_tuple = strptime(str_time, format)  # 把格式化好的时间转换成元祖
        result = mktime(time_tuple)  # 把时间元祖转换成时间戳
        return int(result)
    return int(time())

# # 时间戳转换成日期
# def timestamp_to_date(timestamp):
#     # 转换为其他日期格式,如:"%Y-%m-%d %H:%M:%S"
#     timeArray = localtime(timestamp)  # 30/12/2020 21:05:19
#     otherStyleTime = strftime("%d/%m/%Y %H:%M:%S", timeArray)
#     return otherStyleTime

#博客首页
def index(request):

    author='LLL'
    planetNum=2
    blogObj=Blog.objects.all()
    blogNum=blogObj.count() #博客数量
    birthday='2021-5-20 00:00:00'
    startTime=str_to_timestamp(birthday)
    birthday='2021-5-20'
    nowTime=time()
    days=int((nowTime-startTime)/(3600*24)) #运行的天数
    visitObj=RequestLogTable.objects.all()
    visitorNum=visitObj.count() #访客量

    #快乐星球的链接 随机链接
    toLearnPlanetLinkId= randint(1,blogNum+1)

    return render(request,'index.html',context=locals())
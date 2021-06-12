from random import choice, random, randint
from time import time, mktime, strptime

from django.contrib.auth.hashers import make_password,check_password
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
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
@cache_page(timeout=60, cache='default')  # timeout指定缓存过期时间,cache指定缓存用的数据库，
def login(request):
    if request.method=='GET':
        return render(request,'login.html')

    if request.method=='POST':
        account=request.POST.get('account')
        password=request.POST.get('password')

        user=User.objects.filter(Q(username=account)|Q(mobile=account)).first()
        if not user:
            return HttpResponse('该账号还未注册~')
        # if not check_password(user.password,password):
        #     return HttpResponse('密码错误~')

        if password!='1234':
            return HttpResponse('密码错误~')

        # 缓存的实现的内部原理:接受到来自客户端的要求后，服务器不是首先到数据库请求数据，而是查看是否有该数据的
        # 缓存，如果有，则直接返回缓存中的数据，如果没有，则再请求数据库同时创建相应的缓存
        #使用缓存保存用户的登录状态 同时设置cookie记录用户的登录状态
        #当用户进行的某项操作需要登录后才能使用时,同时检验客户端(cookie)和服务端(cache),以确保操作的安全性
        #登录成功后重定向到首页


        response=redirect(reverse('app:index'))
        response.set_signed_cookie('userId',user.id,salt='LLL',max_age=7*24*60*60) #设置加密的cookie
        cache.set(str(user.id), 'true', timeout=7*24*60*60) #同时将登录信息保存在缓存中
        return response



#判断是否处于登录状态
def isLoginStatus(request):

    try:
        userId=request.get_signed_cookie('userId',salt='LLL') #从cookie中获取用户的id
        status=cache.get(userId) #再从缓冲中获取用户的登录状态
        return status,userId
    except:
        return None,None

#注册
@cache_page(timeout=60, cache='default')
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
            isRegister=int(str(redis_con.get(telValue)).replace('b','').replace('\'',''))
            if isRegister:
                return JsonResponse({'msg':'该号码已注册,可以直接登录!'})

            redis_con.setex(telValue,100000000000000000,'1') # {电话号码:1} 电话号码作为key 时效
            # 发送短信验证码
            #TODO


            #短信功能暂未实现,假设注册成功,直接跳转到登录界面
            return JsonResponse({'msg':'验证码已发送至您的手机,请注意查收!'})

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



# 把时间转换成秒数
def str_to_timestamp(str_time=None, format='%Y-%m-%d %H:%M:%S'):
    if str_time:
        time_tuple = strptime(str_time, format)  # 把格式化好的时间转换成元祖
        result = mktime(time_tuple)  # 把时间元祖转换成时间戳
        return int(result)
    return int(time())



#博客首页
# @cache_page(timeout=60, cache='default')  # timeout指定缓存过期时间,cache指定缓存用的数据库
def index(request):

    LoginStatus,userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心

    bloggerId=1 #博主的id
    author='LLL'
    planetNum=2
    blogObj=Blog.objects.all()
    blogNum=blogObj.count() #博客数量
    # 快乐星球的链接 随机链接
    toLearnPlanetLinkId = randint(1, blogNum + 1)
    birthday='2021-5-20 00:00:00'
    startTime=str_to_timestamp(birthday)
    birthday='2021-5-20'
    nowTime=time()
    days=int((nowTime-startTime)/(3600*24)) #运行的天数
    visitObj=RequestLogTable.objects.all()
    visitorNum=visitObj.count() #访客量



    lastThreeBlog=blogObj[blogNum-3:blogNum] #获取最后三条数据
    blogObjList=[]
    for blogObj in lastThreeBlog:
        conDic = {
            'title': blogObj.title,
            'author': blogObj.author.username,
            'category': blogObj.category.title,
            'summary': blogObj.summary,
            'createdTime': str(blogObj.createdTime).split(' ')[0],
            'blogId': blogObj.id
        }
        blogObjList.append(conDic)

    return render(request,'index.html',context=locals())



#用于测试
def test(request):
    return render(request,'search.html')

# 个人中心
def personalCenter(request,userId):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus: #没有登录就直接跳转到首页
        return redirect(reverse('app:index'))

    if request.method=='GET':
        user=User.objects.filter(id=userId).first()

        showSearchBox = 0  # 显示搜索框
        playingPlanet=1 #同时显示快乐星球和学习星球
        logoutShow=1 #显示退出登录的按钮
        blogObj = Blog.objects.all()
        blogNum = blogObj.count()  # 博客数量
        # 快乐星球的链接 随机链接
        toLearnPlanetLinkId = randint(1, blogNum + 1)
        return render(request,'personalCenter.html',context=locals())

#退出登录
def logout(request,userId):
    cache.set(userId,'0')
    response=redirect(reverse('app:index'))
    response.delete_cookie('userId')
    response.flush()
    return response

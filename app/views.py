from random import randint, choice
from time import time
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django_redis import get_redis_connection
from app.models import User, RequestLogTable, Blog, Category
from learningPlanet.models import CollectTable, RandomPenTable
from myTool.messageSurvice import returnRandomCode, returnMessageSurviceStatus
from myTool.tools import base64ToPicture, str_to_timestamp

# 在登录中往往都需要使用post请求，在使用该请求是，需要进行csrf_token的验证，通过该验证有3中方法
'''
1.在settings的MIDDLEWARE中注释掉csrf验证的中间件
2.在模板的form表单中添加{%csrf_token%}
3.使用装饰器获取豁免权:在视图函数的上一行使用装饰器:@csrf_exempt
'''


# 缓存的使用 登录
@cache_page(timeout=60, cache='default')  # timeout指定缓存过期时间,cache指定缓存用的数据库，
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')

    if request.method == 'POST':
        account = request.POST.get('account')
        password = request.POST.get('password')
        user = User.objects.filter(Q(username=account) | Q(mobile=account)).first()
        response=render(request, 'login.html')
        if not user:
            response.write('<script>alert("该账号还未注册~");</script>')
            response.flush()
            return response

        if not check_password(password, user.password):  # 参数顺序:明文 密文
            response.write('<script>alert("密码错误~");</script>')
            response.flush()
            return response

        # 缓存的实现的内部原理:接受到来自客户端的要求后，服务器不是首先到数据库请求数据，而是查看是否有该数据的
        # 缓存，如果有，则直接返回缓存中的数据，如果没有，则再请求数据库同时创建相应的缓存
        # 使用缓存保存用户的登录状态 同时设置cookie记录用户的登录状态
        # 当用户进行的某项操作需要登录后才能使用时,同时检验客户端(cookie)和服务端(cache),以确保操作的安全性
        # 登录成功后重定向到首页

        response = redirect(reverse('app:index'))
        response.set_signed_cookie('userId', user.id, salt='LLL', max_age=7 * 24 * 60 * 60)  # 设置加密的cookie
        cache.set(str(user.id), 'true', timeout=7 * 24 * 60 * 60)  # 同时将登录信息保存在缓存中
        return response


# 判断是否处于登录状态
def isLoginStatus(request):
    try:
        userId = request.get_signed_cookie('userId', salt='LLL')  # 从cookie中获取用户的id
        status = cache.get(userId)  # 再从缓冲中获取用户的登录状态
        return status, userId
    except:
        return None, None


# 注册
@cache_page(timeout=60, cache='default')
def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')

    if request.method == 'POST':
        redis_con = get_redis_connection('default')  # 连接redis

        telValue = request.POST.get('tel')  # 用户的手机号码
        yzmValue = request.POST.get('yzm')  # 验证码
        pwdValue = request.POST.get('pwd')  # 密码

        # 检查验证码是否正确
        try:
            code = str(redis_con.get(str(telValue) + 'code'), encoding='utf8')  # 存在本地的验证码
        except:
            code = ''
        if yzmValue == code:
            user = User()
            user.mobile = telValue
            user.username = telValue  # 用户名同手机号
            user.password = make_password(pwdValue)  # 对密码进行加密
            user.save()

            # 记录该手机号码已注册
            redis_con.setex(telValue, 100000000000000000, '1')  # {电话号码:1} 电话号码作为key 时效

            return JsonResponse({'msg': '注册成功,可以直接登录!'})
        else:
            return JsonResponse({'msg': '验证码错误!'})


# 发送验证码
def sendCode(request):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))
    if request.method == 'POST':
        redis_con = get_redis_connection('default')  # 连接redis

        telValue = request.POST.get('tel')  # 用户的手机号码
        # 验证手机号码是否已经注册
        try:
            isRegister = str(redis_con.get(telValue), encoding='utf8')
        except:
            isRegister = None
        if isRegister == '1':
            return JsonResponse({'msg': '该号码已注册,可以直接登录!'})
        else:  # 没有注册就发送验证码
            code = returnRandomCode()  # 随机验证码
            # messageSurviceStatus = returnMessageSurviceStatus(phoneNumber=telValue, code=code) #发送
            messageSurviceStatus=1
            redis_con.setex(str(telValue) + 'code', 300, code)  # 保存当前手机号码的验证码 时效5分钟

            if messageSurviceStatus:
                return JsonResponse({'msg': '验证码已发送至您的手机,请注意查收!'})
            else:
                return JsonResponse({'msg': '验证码发送失败!'})



# 访问出错
def error(request):
    return render(request, '404.html')


# 博客首页
# @cache_page(timeout=60, cache='default')  # timeout指定缓存过期时间,cache指定缓存用的数据库
def index(request):

    if request.method=='GET':
        LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
        bloggerId = 1  # 博主的id
        author = 'LLL'
        planetNum = 2
        blogObj = Blog.objects.filter(isShow=1)
        blogNum = blogObj.count()  # 博客数量
        # 快乐星球的链接 随机链接
        toLearnPlanetLinkId = randint(1, blogNum + 1)
        birthday = '2021-5-20 00:00:00'
        startTime = str_to_timestamp(birthday)
        birthday = '2021-5-20'
        nowTime = time()
        days = int((nowTime - startTime) / (3600 * 24))  # 运行的天数
        visitObj = RequestLogTable.objects.all()
        visitorNum = visitObj.count()  # 访客量

        lastThreeBlog = blogObj[blogNum - 3:blogNum]  # 获取最后三条数据
        blogObjList = []
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

        blogObjList.reverse()  # 逆序

        return render(request, 'index.html', context=locals())




# 用于测试
def test(request):
    #
    # class_=Category.objects.all()
    # clasList=[]
    # for i in class_:
    #     clasList.append(i.title)
    # print(clasList)
    #
    redis_con = get_redis_connection('default')  # 连接redis
    redis_con.setex('15623108273', 10, '0')    # redis_con.setex('15623108273', 10, 0)
    return render(request, 'caogao.html')


# 个人中心
def personalCenter(request, userId):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))

    if request.method == 'GET':
        user = User.objects.filter(id=userId).first()

        showSearchBox = 0  # 显示搜索框
        playingPlanet = 1  # 同时显示快乐星球和学习星球
        logoutShow = 1  # 显示退出登录的按钮
        blogObj = Blog.objects.all()
        blogNum = blogObj.count()  # 博客数量
        # 快乐星球的链接 随机链接
        toLearnPlanetLinkId = randint(1, blogNum + 1)

        # 返回个人的收藏记录的数据
        collectList = []
        collectObjs = CollectTable.objects.filter(Q(collectorId_id=userId) & Q(isCollected=1))[:8]
        if collectObjs:
            Num = 1
            for collectObj in collectObjs:
                conDic = {
                    'id': Num,
                    'blogName': collectObj.blogId.title,
                    'blogId': collectObj.blogId.id,
                    'blogAuthor': collectObj.collectorId.username,
                    'blogAuthorId': collectObj.collectorId.id,
                    'collectTime': str(collectObj.collectTime),
                    'summary': collectObj.blogId.summary.replace('&nbsp;', '').replace('<br>', '').replace('</br>',
                                                                                                           '').replace(
                        ' ', '')[:50]
                }
                if len(conDic['blogName']) > 10:
                    conDic['blogName'] = conDic['blogName'][:10] + '...'
                Num += 1
                collectList.append(conDic)

        # 返回随笔的数据
        randomPenList = []
        randomPenObjs = RandomPenTable.objects.filter(Q(randomPenUserId_id=userId) & Q(isShow=1))[:8]
        if randomPenObjs:
            Num = 1
            for randomPenObj in randomPenObjs:
                conDic = {
                    'id': randomPenObj.id,
                    'Num': Num,
                    'content': randomPenObj.randomPenContent,
                    'blogId': randomPenObj.randomPenBlogId.id,
                    'blogTitle': randomPenObj.randomPenBlogId.title,
                    'randomPenTime': randomPenObj.randomPenTime,
                    'summary': randomPenObj.randomPenContent,
                }
                if len(conDic['summary']) > 26:
                    conDic['summary'] = conDic['summary'][:23] + '...'

                randomPenList.append(conDic)
                Num += 1

            # 第一个随笔的内容
            firstRandomPenContent = randomPenList[0]['content']
            firstRandomPenId=randomPenList[0]['id']
        return render(request, 'personalCenter.html', context=locals())


# 返回个人收藏的数据
def returnCollectList(request):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))

    if request.method == 'POST':
        nowId = request.POST.get('nowId')
        pre_next = nowId.split('-')[0]
        nowPage = int(nowId.split('-')[1])
        if pre_next == 'pre':
            nowPage -= 1
        else:
            nowPage += 1

        if nowPage < 0:
            nowPage = 0

        collectObjs = CollectTable.objects.filter(Q(collectorId_id=userId) & Q(isCollected=1))[
                      nowPage * 8: nowPage * 8 + 8]
        collectList = []
        if collectObjs:
            Num = nowPage * 8 + 1
            for collectObj in collectObjs:
                conDic = {
                    'id': Num,
                    'blogName': collectObj.blogId.title,
                    'blogId': collectObj.blogId.id,
                    'blogAuthor': collectObj.collectorId.username,
                    'blogAuthorId': collectObj.collectorId.id,
                    'collectTime': str(collectObj.collectTime),
                    'summary': collectObj.blogId.summary.replace('&nbsp;', '').replace('<br>', '').replace('</br>',
                                                                                                           '').replace(
                        ' ', '')[:50]
                }
                if len(conDic['blogName']) > 10:
                    conDic['blogName'] = conDic['blogName'][:10] + '...'
                Num += 1
                collectList.append(conDic)
        preId = 'pre-' + str(nowPage)
        nextId = 'next-' + str(nowPage)
        return JsonResponse({'collectList': collectList, 'preId': preId, 'nextId': nextId})


# 返回个人随笔的数据
def returnRandomPenList(request):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))

    if request.method == 'POST':
        nowId = request.POST.get('nowId')
        pre_next = nowId.split('-')[0]
        nowPage = int(nowId.split('-')[1])
        if pre_next == 'pre':
            nowPage -= 1
        else:
            nowPage += 1

        if nowPage < 0:
            nowPage = 0

        # 返回随笔的数据
        randomPenList = []
        randomPenObjs = RandomPenTable.objects.filter(Q(randomPenUserId_id=userId) & Q(isShow=1))[
                        nowPage * 8: nowPage * 8 + 8]
        if randomPenObjs:
            Num = nowPage * 8 + 1
            for randomPenObj in randomPenObjs:
                conDic = {
                    'id': randomPenObj.id,
                    'Num': Num,
                    'content': randomPenObj.randomPenContent,
                    'blogId': randomPenObj.randomPenBlogId.id,
                    'blogTitle': randomPenObj.randomPenBlogId.title,
                    'randomPenTime': randomPenObj.randomPenTime,
                    'summary': randomPenObj.randomPenContent,
                }
                if len(conDic['summary']) > 26:
                    conDic['summary'] = conDic['summary'][:23] + '...'

                randomPenList.append(conDic)
                Num += 1

        # 第一个随笔的内容
        firstRandomPenContent = randomPenList[0]['content']
        preId = 'pre-' + str(nowPage)
        nextId = 'next-' + str(nowPage)
        return JsonResponse({'randomPenList': randomPenList, 'preId': preId, 'nextId': nextId,
                             'firstRandomPenContent': firstRandomPenContent})


# 退出登录
def logout(request, userId):
    cache.set(userId, '0')
    response = redirect(reverse('app:index'))
    response.delete_cookie('userId')
    response.flush()
    return response


# 修改头像
def modifyAvatar(request):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))
    wordList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']
    if request.method == 'POST':
        try:
            userId = request.POST.get('userId')
            imgData = request.POST.get('imgData')
            avatarPath = base64ToPicture(dataList=[imgData], title=choice(wordList) + str(userId) + choice(wordList),
                                         path='static/avatar/')[0]
            user = User.objects.filter(id=userId).first()
            user.avatar = avatarPath
            user.save()
            return JsonResponse({'msg': '头像修改成功!'})
        except Exception as result:
            print(result)
            return JsonResponse({'msg': '头像修改失败!'})

#修改个人资料
def modifyDesc(request):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))

    if request.method=='POST':
        userId=request.POST.get('userId')
        user=User.objects.filter(id=userId).first()
        if user:
            name=request.POST.get('name')
            isExistName=User.objects.filter(username=name).first()
            if isExistName and name!=user.username: #如果新用户名存在就不能进行用户名的修改
                user.save()
                return JsonResponse({'msg': '该用户名已经存在'})
            whichId=request.POST.get('whichId') #which=0代表修改名称 1代表修改职位 2代表修改个人简介
            if whichId=='0':
                user.username=name
            elif whichId=='1':
                job = request.POST.get('job')
                user.job = job
            elif whichId=='2':
                desc = request.POST.get('desc')
                user.desc=desc
            user.save()
            return JsonResponse({'msg': '修改成功'})
        else:
            return JsonResponse({'msg': '修改失败'})

#修改随笔
def modifyrandomPen(request):
    LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
    if not LoginStatus:  # 没有登录就直接跳转到首页
        return redirect(reverse('app:index'))


    if request.method=='POST':
        pass

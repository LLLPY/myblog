from random import randint
from django.shortcuts import render
from app.models import Blog


#快乐星球
from app.views import isLoginStatus


def index(request):
    if request.method=='GET':

        LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
        # 快乐星球的链接 随机链接
        blogObj = Blog.objects.all()
        blogNum = blogObj.count()  # 博客数量
        showSearchBox=0 #显示搜索框

        toLearnPlanetLinkId = randint(1, blogNum + 1)




        return render(request,'playingplanet.html',context=locals())


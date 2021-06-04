from random import randint
from django.shortcuts import render
from app.models import Blog


#快乐星球
def index(request):


    if request.method=='GET':
        # 快乐星球的链接 随机链接
        blogObj = Blog.objects.all()
        blogNum = blogObj.count()  # 博客数量
        toLearnPlanetLinkId = randint(1, blogNum + 1)




        return render(request,'playingplanet.html',context=locals())


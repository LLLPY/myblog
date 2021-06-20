import re
from random import choices
from time import time
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from app.models import Blog, User, SearchTable, Category
from app.views import isLoginStatus
from learningPlanet.models import JudgeTable, CollectTable, RandomPenTable


# 学习星球的主页
# @cache_page(timeout=60, cache='default')  # timeout指定缓存过期时间,cache指定缓存用的数据库，
from myTool.tools import base64ToPicture, timestamp_to_date


def index(request, blogid):
    if request.method == 'GET':

        LoginStatus, userId = isLoginStatus(request)  # 如果是登录状态则显示个人中心
        learningPlanet = 1  # 如果是学习星球 头部就显示快乐星球
        showSearchBox = 1  # 显示搜索框

        # 判断该用户是否收藏了本文
        try:
            isCollected = CollectTable.objects.filter(Q(collectorId=userId) & Q(blogId=blogid)).first().isCollected
            if not isCollected:
                isCollected = ''
        except:
            isCollected = ''

        lastBlogId = Blog.objects.all().count()
        if int(blogid) > lastBlogId:
            blogid = lastBlogId
        elif int(blogid) < 1:
            blogid = 1

        blogObj = Blog.objects.filter(id=blogid).first()
        blogObj.total_views += 1
        blogObj.save()  # 浏览量加一

        authorName = blogObj.author.username  # 作者名称
        authorAvator = blogObj.author.avatar  # 作者头像
        authorId = blogObj.author.id  # 作者的id

        # 如果登录的用户是超级用户(管理员),且该文章的作者也是该管理员则可对文章进行修改操作
        try:
            user = User.objects.filter(id=userId).first()
            isModify = user.is_superuser
            if userId != str(authorId):  # 就算是管理员,但不是本文的作者也不能编辑该文
                isModify = ''
            userName = user.username
            userAvatar = user.avatar
        except:
            isModify = ''

        blogTitle = blogObj.title  # 文章的标题
        blogContent = blogObj.content  # 文章的内容
        blogCategory = blogObj.category.title  # 文章的分类
        blogTags = blogObj.tags.split('LLL')  # 文章的标签
        blogTotalViews = blogObj.total_views  # 文章的浏览量
        blogTotalLikes = blogObj.total_likes  # 文章的获赞量
        blogCreatedTime = blogObj.createdTime  # 文章的发布时间
        blogUpdatedTime = blogObj.updatedTime  # 文章的更新时间
        preBlogId = int(blogid) - 1  # 前一篇文章的id
        if preBlogId <= 1:
            preBlogId = 1
        nextBlogId = int(blogid) + 1  # 后一篇文章的id
        blogSumNum = Blog.objects.all().count()  # 文章的总数
        if nextBlogId >= blogSumNum:
            nextBlogId = blogSumNum

        # 相关推荐部分 推荐同一类别下的内容
        blogCategory = blogObj.category  # 文章的分类
        recommendBlogList = choices(Blog.objects.filter(category=blogCategory), k=5)
        return render(request, 'learningplanet.html', context=locals())

    if request.method == 'POST':
        return JsonResponse({'msg': 'hello world~'})


# 返回评论信息列表
def returnJudgeList(request):
    if request.method == 'POST':

        # 被评论的博客的id
        blogId = request.POST.get('blogId')
        # 找到博客实例对象
        blogObj = Blog.objects.filter(id=blogId).first()
        resultList = []
        judgeList = JudgeTable.objects.filter(judgeBlog=blogObj)
        if judgeList:
            for judgeObj in judgeList:
                if judgeObj.isShow:  # 如果是可展示的就添加到评论列表中
                    conDic = {
                        'name': judgeObj.judger.username,  # 评论人的名称
                        'avatar': 'http://www.lll.plus/' + str(judgeObj.judger.avatar),  # 评论人的头像地址
                        'date': str(judgeObj.judgeTime),  # 评论的日期
                        'content': judgeObj.content,  # 评论的内容
                        'id': judgeObj.id,  # 评论的id
                        'judgerId': judgeObj.judger.id  # 评论人的id
                    }
                    resultList.append(conDic)
        return JsonResponse({'judgeList': resultList})


# 删除评论
def deleteJudgeList(request):
    if request.method == 'POST':
        judgeId = request.POST.get('judgeId')
        try:
            judgeObj = JudgeTable.objects.filter(id=judgeId).first()
            judgeObj.isShow = False
            judgeObj.save()

            return JsonResponse({'msg': '删除成功!'})
        except:
            return JsonResponse({'msg': '删除失败!'})


# 增加评论信息
def addJudgeList(request):
    if request.method == 'POST':

        try:
            judgerId = request.POST.get('judgerId')  # 评论人的id
            blogId = request.POST.get('blogId')  # 评论人的id
            content = request.POST.get('content')  # 评论的内容
            date = request.POST.get('date')  # 评论的日期

            judgeObj = JudgeTable()
            judgeObj.judger_id = judgerId
            judgeObj.judgeBlog_id = blogId
            judgeObj.content = content
            judgeObj.judgeTime = date
            judgeObj.save()
            return JsonResponse({'judgeId': judgeObj.id})  # 增加成功就返回该评论的id
        except:
            return JsonResponse({'msg': '评论失败!'})


# 点赞功能
def doCall(request):
    if request.method == 'POST':

        try:
            blogId = request.POST.get('blogId')
            docall = request.POST.get('docall')
            blogObj = Blog.objects.filter(id=blogId).first()
            nowLikes = blogObj.total_likes
            blogObj.total_likes = nowLikes + int(docall)
            blogObj.save()
            return JsonResponse({'msg': '点赞成功!'})
        except:
            return JsonResponse({'msg': '点赞失败!'})


# 搜索功能 返回一个博客对象列表
def search(request):
    if request.method == 'POST':
        keyword = request.POST.get('keyword')[:100]  # 关键字
        keyworldObj = SearchTable()
        keyworldObj.keyword = keyword
        keyworldObj.save()
        blogObjs = Blog.objects.filter(
            Q(title__contains=keyword.upper()) | Q(category__title__contains=keyword.upper()) | Q(
                title__contains=keyword.lower()) | Q(category__title__contains=keyword.lower()))
        blogObjList = []
        if blogObjs:
            for blogObj in blogObjs:
                conDic = {
                    'title': blogObj.title,
                    'author': blogObj.author.username,
                    'category': blogObj.category.title,
                    'summary': blogObj.summary,  # .replace('&nbsp;','').replace('<br>','')
                    'createdTime': str(blogObj.createdTime),
                    'blogId': blogObj.id
                }
                blogObjList.append(conDic)
        return JsonResponse({'data': blogObjList})

#返回替换后的content
def returnNewContent(content,title):
    imgDataList = re.findall(r'<img src="data:image/png;base64,(.*?)alt="">', content)  # 取消贪婪模式
    imgPathList = base64ToPicture(imgDataList, title)  # 把博客中的base64转成图片保存到本地
    for i in imgPathList: #把博客内容中的图片数据改成对应的图片路径
        content = content.replace(rf'<img src="data:image/png;base64,{imgDataList[imgPathList.index(i)]}alt="">',f'<img src="http://127.0.0.1/{i}">',1)  # 每次只替换一次
    return content

# 博客编辑
def modifyBlog(request, blogid, authorid):
    if request.method == 'GET':
        if blogid == 'add':
            return render(request, 'modifyBlog.html', context=locals())

        blogObj = Blog.objects.filter(author_id=authorid).filter(id=blogid).first()

        content = blogObj.content  # 内容
        title = blogObj.title  # 标题
        category = blogObj.category  # 分类
        tags = blogObj.tags.split('LLL')  # 标签

        while len(tags) < 3:
            tags.append('python')

        tag1 = tags[0]
        tag2 = tags[1]
        tag3 = tags[2]

        categoryList = Category.objects.all()
        tagsList = ['python', 'numpy', '机器学习', '人工智能', '可视化', '爬虫', 'web开发']

        return render(request, 'modifyBlog.html', context=locals())

    if request.method == 'POST':

        lastBlogId = Blog.objects.last().id

        title = request.POST.get('title')
        category = request.POST.get('category')
        tag1 = request.POST.get('tag1')
        tag2 = request.POST.get('tag2')
        tag3 = request.POST.get('tag3')
        content = request.POST.get('content')
        content=returnNewContent(content,title) #使用处理后的博客内容
        summary = ''.join(re.findall(r'[\u4e00-\u9fa5]', content))[:200]

        categoryObj = Category.objects.filter(title=category).first()
        if not categoryObj:  # 如果数据库中没有该类,则新建该类
            categoryObj = Category()
            categoryObj.title = category
            categoryObj.save()

        # 如果blogid=add 说明是新增博客
        if blogid == 'add':
            newBlog = Blog()
            newBlog.id = lastBlogId + 1
            newBlog.title = title
            newBlog.author_id = authorid
            newBlog.category_id = categoryObj.id
            newBlog.content=content
            newBlog.summary = summary if summary else title  # 匹配中文文字

            newBlog.updatedTime = timestamp_to_date(time())
            newBlog.tags = 'LLL'.join([tag1, tag2, tag3])  # 以LLL作为分隔符
            newBlog.save()
            # 重定向到展示页面
            return redirect(reverse("app:learningPlanet", kwargs={'blogid': newBlog.id}))

        blogObj = Blog.objects.filter(author_id=authorid).filter(id=blogid).first()
        blogObj.title = title
        blogObj.category_id = categoryObj.id
        blogObj.tags = 'LLL'.join([tag1, tag2, tag3])  # 以LLL作为分隔符
        blogObj.content = content
        blogObj.summary = summary if summary else title  # 匹配中文文字
        blogObj.updatedTime = timestamp_to_date(time())
        blogObj.save()
        # 重定向到展示页面
        return redirect(reverse("app:learningPlanet", kwargs={'blogid': blogid}))


# 收藏和取消收藏文章
def collect(request):
    if request.method == 'POST':
        userId = request.POST.get('userId')
        blogId = request.POST.get('blogId')
        isCollected = request.POST.get('isCollected')
        try:
            collectObj = CollectTable.objects.filter(collectorId_id=userId).filter(blogId_id=blogId).first()
            if not collectObj:  # 如果是第一次收藏 则需要创建新的对象记录
                collectObj = CollectTable()
                collectObj.collectorId_id = userId
                collectObj.blogId_id = blogId
            collectObj.isCollected = isCollected
            collectObj.collectTime = timestamp_to_date(time())
            collectObj.save()
        except:
            print('收藏操作失败~')
            return JsonResponse({'msg': '收藏操作失败~'})

        return JsonResponse({'msg': '收藏成功~'})


# 保存随笔
def saveRandomPen(request):
    if request.method == 'POST':
        userId = request.POST.get('userId')
        blogId = request.POST.get('blogId')
        content = request.POST.get('content')

        try:
            randomPenObj = RandomPenTable()
            randomPenObj.randomPenBlogId_id = blogId
            randomPenObj.randomPenUserId_id = userId
            randomPenObj.randomPenContent = content
            randomPenObj.save()
        except:
            return JsonResponse({'msg': '随笔保存失败!'})

        return JsonResponse({'msg': '随笔保存成功!'})


#删除随笔
def deleteRandomPen(request):

    if request.method=='POST':
        try:
            randomPenId=request.POST.get('randomPenId')
            randomPenObj=RandomPenTable.objects.filter(id=randomPenId).first()
            randomPenObj.isShow=False
            randomPenObj.save()
            return JsonResponse({'msg':'随笔删除成功!'})
        except:
            return JsonResponse({'msg': '随笔删除失败!'})

    return JsonResponse({'msg': '随笔删除失败!'})

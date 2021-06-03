from random import choices, randint
from django.http import JsonResponse
from django.shortcuts import render
from app.models import Blog, User
from learningPlanet.models import JudgeTable

# 学习星球的主页
def index(request, blogid):

    if request.method == 'GET':
        learningPlanet = 1  # 如果是学习星球 头部就显示快乐星球
        blogObj = Blog.objects.filter(id=blogid).first()
        blogObj.total_views += 1
        blogObj.save()  #浏览量加一


        authorName = blogObj.author.username  # 作者名称
        authorAvator = blogObj.author.avatar  # 作者头像
        authorId = blogObj.author.id  # 作者的id
        blogTitle = blogObj.title  # 文章的标题
        blogContent = blogObj.content  # 文章的内容

        if blogTitle.endswith('.html'): #如果是html文件就不对其进行转义
            safe=0
            blogContent=blogContent.replace('&nbsp;',' ')#.replace('<','《》').replace('>','')
        else:safe=1
        # blogTitle=blogTitle.replace('.py','').replace('.html','')
        blogCategory = blogObj.category.title  # 文章的分类
        blogTags = blogObj.tags  # 文章的标签
        blogTotalViews = blogObj.total_views  # 文章的浏览量
        blogTotalLikes = blogObj.total_likes  # 文章的获赞量
        blogCreatedTime = blogObj.createdTime  # 文章的发布时间
        blogUpdatedTime = blogObj.updatedTime  # 文章的更新时间
        preBlogId=int(blogid)-1 #前一篇文章的id
        if preBlogId<=1:
            preBlogId=1
        nextBlogId=int(blogid)+1 #后一篇文章的id
        blogSumNum=Blog.objects.all().count() #文章的总数
        if nextBlogId>=blogSumNum:
            nextBlogId=blogSumNum

        #相关推荐部分 推荐同一类别下的内容
        blogCategory = blogObj.category  # 文章的分类
        recommendBlogList=choices(Blog.objects.filter(category=blogCategory),k=5)
        return render(request, 'learningplanet.html', context=locals())
    if request.method == 'POST':
        return JsonResponse({'msg': 'hello world~'})


# 返回评论信息列表
def returnJudgeList(request):
    if request.method=='POST':

        #被评论的博客的id
        blogId=request.POST.get('blogId')
        #找到博客实例对象
        blogObj=Blog.objects.filter(id=blogId).first()
        resultList=[]
        judgeList=JudgeTable.objects.filter(judgeBlog=blogObj)
        if judgeList:
            for judgeObj in judgeList:
                if judgeObj.isShow: #如果是可展示的就添加到评论列表中
                    conDic={
                        'name':judgeObj.judger.username, #评论人的名称
                        'avatar':str(judgeObj.judger.avatar), #评论人的头像地址
                        'date':str(judgeObj.judgeTime), #评论的日期
                        'content':judgeObj.content, #评论的内容
                        'id':judgeObj.id #评论的id
                    }
                    resultList.append(conDic)
        return JsonResponse({'judgeList':resultList})

#删除评论
def deleteJudgeList(request):

    if request.method=='POST':
        judgeId=request.POST.get('judgeId')
        print(judgeId)
        try:
            judgeObj=JudgeTable.objects.filter(id=judgeId).first()
            judgeObj.isShow=False
            judgeObj.save()

            return JsonResponse({'msg':'删除成功!'})
        except:
            return JsonResponse({'msg':'删除失败!'})

#增加评论信息
def addJudgeList(request):

    if request.method=='POST':

        # try:
            judgerId=request.POST.get('judgerId') #评论人的id
            blogId=request.POST.get('blogId') #评论人的id
            content=request.POST.get('content') #评论的内容
            date=request.POST.get('date') #评论的日期

            judgeObj=JudgeTable()
            judgeObj.judger=User.objects.filter(id=judgerId).first()
            judgeObj.judgeBlog=Blog.objects.filter(id=blogId).first()
            judgeObj.content=content
            judgeObj.judgeTime=date
            judgeObj.save()
            return JsonResponse({'judgeId': judgeObj.id}) #增加成功就返回该评论的id
        # except:
        #     return JsonResponse({'msg': '评论失败!'})


#点赞功能
def doCall(request):

    if request.method=='POST':

        try:
            blogId=request.POST.get('blogId')
            docall=request.POST.get('docall')
            blogObj=Blog.objects.filter(id=blogId).first()
            nowLikes=blogObj.total_likes
            blogObj.total_likes=nowLikes+int(docall)
            blogObj.save()
            return JsonResponse({'msg':'点赞成功!'})
        except:
            return JsonResponse({'msg':'点赞失败!'})


def modifyBlog(request,blogid,authorid):

    if request.method=='GET':
        authorid = '1'
        blogObj = Blog.objects.filter(author=User.objects.filter(id=authorid).first()).filter(id=blogid).first()
        content = blogObj.content

        return render(request,'modifyBlog.html',context=locals())
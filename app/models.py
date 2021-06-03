from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

#定义用户模型
class User(AbstractUser): #模型继承自django自带的User模型 并在其基础上添加另外的属性

    #手机号
    mobile=models.CharField(max_length=11,unique=True,blank=False) #blank=False 表示必须要填写该字段的值

    #头像信息 头像的保存路径static/avatar/%Y%m%d
    avatar=models.ImageField(upload_to='static/avatar/%Y%m%d',blank=True) #blank=True 表示该字段的值可有可无

    #简介
    desc=models.CharField(max_length=200,blank=True)



    class Meta:
        db_table='User' #修改表名
        verbose_name='用户管理' #admin 后台显示
        verbose_name_plural=verbose_name

    #只要自己定义了__str__(self)方法，那么就会打印从在这个方法中return的数据
    def __str__(self):
        return self.mobile


#博客分类
class Category(models.Model):

    # 标题
    title = models.CharField(max_length=100, blank=True, db_column='标题')
    # 创建时间
    createdTime = models.DateTimeField(auto_now=True, db_column='创建时间')

    # admin站点显示,调查查看对象方便
    def __str__(self):
        return self.title

    class Meta:
        db_table = '文章分类'  # 修改表名




#博客
class Blog(models.Model):
    # 作者
    author = models.ForeignKey(User, on_delete=models.CASCADE, db_column='作者')

    # 标题
    title = models.CharField(max_length=50, blank=True, db_column='标题')

    # 分类
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='分类')

    # 标签
    tags = models.CharField(max_length=50, blank=True, db_column='标签')

    # 摘要信息
    summary = models.CharField(max_length=200, null=False, blank=False, db_column='摘要信息')

    # 文章正文
    content = models.TextField(db_column='文章正文')

    # 浏览量
    total_views = models.PositiveIntegerField(default=0, db_column='浏览量')

    #获赞量
    total_likes=models.PositiveIntegerField(default=0,db_column='获赞量')

    # 文章创建时间
    createdTime = models.DateTimeField(default=timezone.now, db_column='文章创建时间')

    # 文章修改的时间
    updatedTime = models.DateTimeField(auto_now=True, db_column='文章修改的时间')  # 自动添加

    class Meta:
        db_table='博客' #修改表名


#请求记录表
class RequestLogTable(models.Model):

    ip=models.CharField(max_length=30,db_column='IP地址')
    computerName=models.CharField(max_length=30,db_column='计算机名称')
    oS=models.CharField(max_length=10,db_column='操作系统')
    userProfile=models.CharField(max_length=100,db_column='客户端的用户文件路径')
    userAgent=models.CharField(max_length=200,db_column='请求头')
    httpRefer=models.CharField(max_length=100,db_column='跳转的网页')
    requestTime = models.DateTimeField(default=timezone.now, db_column='请求时间')
    requestPath=models.CharField(max_length=50,db_column='请求路径',default='/')


    class Meta:
        db_table='请求记录表'










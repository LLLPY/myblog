from django.db import models

# Create your models here.


# 用户评论表
from app.models import User, Blog


class JudgeTable(models.Model):
    # 评论人的id
    judger = models.ForeignKey(User, on_delete=models.CASCADE, db_column='评论人的id')
    # 评论的博客的id
    judgeBlog = models.ForeignKey(Blog, on_delete=models.CASCADE, db_column='评论的博客的id')

    # 评论内容
    content = models.CharField(max_length=500, db_column='评论内容')

    # 评论时间
    judgeTime = models.DateTimeField()

    # 是否显示 如果用户删除评论后 该评论就不被显示
    isShow=models.BooleanField(default=True,db_column='是否显示')

    class Meta:
        db_table = '评论表'


#收藏记录表
class CollectTable(models.Model):

    #收藏人的id
    collectorId=models.ForeignKey(User,on_delete=models.CASCADE,db_column='收藏人的id')

    #被收藏的博客的id
    blogId=models.ForeignKey(Blog,on_delete=models.CASCADE,db_column='被收藏的博客的id')

    #是否收藏
    isCollected=models.BooleanField(default=0,db_column='是否被收藏')


    class Meta:
        db_table='收藏记录表'


#随笔记录表
class RandomPenTable(models.Model):

    #随笔记录人的id
    randomPenUserId=models.ForeignKey(User,on_delete=models.CASCADE,db_column='随笔人的id')

    #随笔的相关博客的id
    randomPenBlogId = models.ForeignKey(Blog, on_delete=models.CASCADE, db_column='随笔的相关博客的id')

    #随笔的内容
    randomPenContent=models.CharField(max_length=300,db_column='随笔的内容')

    #随笔时间
    randomPenTime=models.DateField(auto_now=True,db_column='随笔的时间')

    class Meta:
        db_table='随笔记录表'


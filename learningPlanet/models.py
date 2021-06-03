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

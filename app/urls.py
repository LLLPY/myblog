from django.conf.urls import url
from app import views
from learningPlanet import views as learningViews
from playingPlanet import views as playingViews

urlpatterns = [
    url(r'^login/', views.login, name='login'),  # 登录
    url(r'^register/', views.register, name='register'),  # 注册
    url(r'^error/', views.error, name='error'),  # 访问出错
    url(r'^test/', views.test, name='test'),  # 用于测试
    url(r'^learningPlanet/(?P<blogid>\d+)', learningViews.index, name='learningPlanet'),  # 学习星球
    url(r'^playingPlanet/', playingViews.index, name='playingPlanet'),  # 快乐星球
    url(r'^returnJudgeList/', learningViews.returnJudgeList, name='returnJudgeList'),  # 返回评论信息
    url(r'^deleteJudgeList/', learningViews.deleteJudgeList, name='deleteJudgeList'),  # 删除评论信息
    url(r'^addJudgeList/', learningViews.addJudgeList, name='addJudgeList'),  # 增加评论信息
    url(r'^doCall/', learningViews.doCall, name='doCall'),  # 点赞
    url(r'^modifyBlog/(?P<blogid>\d+)/(?P<authorid>\d+)', learningViews.modifyBlog, name='modifyBlog'),  # 修改博客
    url(r'^search/', learningViews.search, name='search'),  # 搜索功能
    url(r'^personalCenter/(?P<userId>\d+)', views.personalCenter, name='personalCenter'),  # 个人中心
    url(r'^logout/(?P<userId>\d+)', views.logout, name='logout'),  # 退出登录

    url(r'', views.index, name='index'),  # 首页 这个可以匹配任何路由 所以要放在最下面

]

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
    url(r'^modifyBlog/(?P<blogid>.*)/(?P<authorid>\d+)', learningViews.modifyBlog, name='modifyBlog'),  # 修改博客
    url(r'^search/', learningViews.search, name='search'),  # 搜索功能
    url(r'^personalCenter/(?P<userId>\d+)', views.personalCenter, name='personalCenter'),  # 个人中心
    url(r'^logout/(?P<userId>\d+)', views.logout, name='logout'),  # 退出登录
    url(r'^collect/', learningViews.collect, name='collect'),  # 收藏和取消收藏文章
    url(r'^saveRandomPen/', learningViews.saveRandomPen, name='saveRandomPen'),  # 保存随笔
    url(r'^returnCollectList/', views.returnCollectList, name='returnCollectList'),  # 返回个人收藏的数据
    url(r'^returnRandomPenList/', views.returnRandomPenList, name='returnRandomPenList'),  # 返回个人随笔的数据
    url(r'^deleteRandomPen/', learningViews.deleteRandomPen, name='deleteRandomPen'),  # 删除随笔
    url(r'^modifyAvatar/', views.modifyAvatar, name='modifyAvatar'),  # 修改头像
    url(r'^sendCode/', views.sendCode, name='sendCode'),  # 发送验证码
    url(r'^modifyDesc/', views.modifyDesc, name='modifyDesc'),  # 修改个人资料
    url(r'^modifyrandomPen/', views.modifyrandomPen, name='modifyrandomPen'),  # 修改随笔





    url(r'', views.index, name='index'),  # 首页 这个可以匹配任何路由 所以要放在最下面

]

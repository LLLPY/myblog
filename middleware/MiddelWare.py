import time
from django.core.cache import cache
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.deprecation import MiddlewareMixin
from app.models import RequestLogTable

'''

中间件的基本流程:
1.在工程目录下创建一个middleware目录
2.在middleware中创建一个Python文件
3.在这个Python文件中创建一个类，继承自django内置的中间件MiddlewareMixin(伪装)
4.注册，在工程的配置文件settings中找到MIDDLEWARE的配置，将这个类的路径添加到MIDDLEWARE列表里面
5.封装类方法
'''


class LearnMiddleWare(MiddlewareMixin):
    def process_request(self, request):
        print(request.META)
        requestPath=request.path
        ip = request.META.get('REMOTE_ADDR')  # 客户端的ip地址
        if requestPath !='/undefined' and 'static/' not in requestPath:
            HTTP_USER_AGENT = request.META['HTTP_USER_AGENT']  # 请求头

            try:
                USERPROFILE = request.META['USERPROFILE']  # 客户端的用户文件路径
                COMPUTERNAME = request.META['COMPUTERNAME']  # 电脑的名称
                OS = request.META['OS']  # 电脑的系统

            except:
                COMPUTERNAME='无'
                OS='无'
                USERPROFILE = '无'


            try:
                HTTP_REFERER = request.META['HTTP_REFERER']  # 访问本网页前的网页地址
            except:
                HTTP_REFERER = '无'

                # HTTP_USER_AGENT = '无'

            print(f'IP:{ip}')
            print(f'计算机名称:{COMPUTERNAME}')
            print(f'操作系统:{OS}')
            print(f'客户端的用户文件路径:{USERPROFILE}')
            print(f'请求头:{HTTP_USER_AGENT}')
            print(f'跳转的网页:{HTTP_REFERER}')

            try:
                requestLog = RequestLogTable()
                requestLog.ip = ip
                requestLog.computerName = COMPUTERNAME
                requestLog.oS = OS
                requestLog.userProfile = USERPROFILE
                requestLog.userAgent = HTTP_USER_AGENT
                requestLog.httpRefer = HTTP_REFERER
                requestLog.requestPath=requestPath
                requestLog.save()
            except Exception as result:
                print('请求记录保存失败!', result)

        # # 实现限制某个时间段内的访问次数(例:1分钟内只能访问10次)
        # requests = cache.get(ip, [])
        # # 黑名单列表，用于保存访问频率大于30的ip
        # black_list = cache.get('black_list', [])
        # print(black_list)
        # # 判断该ip是否在黑名单列表，如果在，直接返回
        # if ip in black_list:
        #     return HttpResponse('抱歉，您已很荣幸地加入到我们的黑名单列表中!')
        #
        # # 时间限制在1分钟 (比较最新的请求和最早的请求的时间差，如果大于60秒，则踢出最早的请求)
        # while requests and time.time() - requests[-1] > 60:
        #     requests.pop()
        #
        # # 最新的请求添加到请求列表的头部，那么最早的请求就在列表的尾部
        # requests.insert(0, time.time())
        # # 将请求列表保存在缓存中
        # cache.set(ip, requests, timeout=60)
        #
        # if len(requests) > 29:
        #     # 如果在60秒内的访问频率高于30，将该ip添加到黑名单中
        #     black_list.insert(0, ip)
        #     cache.set('black_list', black_list, timeout=60 * 60 * 24)
        #
        # # 次数限制在50次
        # if len(requests) > 49:
        #     return HttpResponse('请求过于频繁，小爬虫快回去睡觉去吧!')

    # 界面友好化处理(当服务器出现异常，状态码为500时，为了不让用户知道服务器的故障，可以使用中间件对此进行处理)
    # def process_exception(self, request, exception):
    #     print('错误原因:', exception)
    #     print('客户端ip:', request.META.get('REMOTE_ADDR'))
    #
    #     # 如果报错，将页面重定向到指定页面
    #     return redirect(reverse('app:error'))

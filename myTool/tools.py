import base64
import os
from time import time, localtime, strftime, strptime, mktime


# 时间戳转换成日期
def timestamp_to_date(timestamp):
    # 转换为其他日期格式,如:"%Y-%m-%d %H:%M:%S"
    timeArray = localtime(timestamp)  # 30/12/2020 21:05:19
    otherStyleTime = strftime("%Y-%m-%d %H:%M:%S", timeArray)
    return otherStyleTime

# 把时间转换成秒数
def str_to_timestamp(str_time=None, format='%Y-%m-%d %H:%M:%S'):
    if str_time:
        time_tuple = strptime(str_time, format)  # 把格式化好的时间转换成元祖
        result = mktime(time_tuple)  # 把时间元祖转换成时间戳
        return int(result)
    return int(time())

# base64数据转换成图片 返回图片保存的路径
def base64ToPicture(dataList, title,path='static/imgs/imgInBlog'):
    #去掉文件名中的特殊符号
    for i in '/ \:*"<>|?.':
        title=title.replace(i,'')
    title=title+str(time())

    date = timestamp_to_date(time()).split(' ')[0].replace('-', '')
    fileNameList = []
    for data in dataList:
        imgdata = base64.b64decode(data)
        fileName = title + str(dataList.index(data)) + '.png'
        path = f'{path}/{date}/'
        if not os.path.exists(path):
            os.mkdir(path)
        f= open(path + fileName, 'wb')
        f.write(imgdata)
        f.close()

        fileNameList.append(f'{path}' + fileName)
    return fileNameList
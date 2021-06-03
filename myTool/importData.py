# *_* coding:utf8 *_*
import csv
import os
import pymysql

# 将所有文件导入数据库
basePath = '\\Users\LLL\Desktop\python\python基础(演练)'

def file_name(file_dir):
    fileNum = 0
    fileList = []
    for root, dirs, files in os.walk(file_dir):
        # print(root)  # 当前目录路径
        # print(dirs)  # 当前路径下所有子目录
        for file in files:
            if file.endswith('.py') or file.endswith('.html'):
                if 'lll' in file:
                    abPath = root + '\\' + file
                    fileList.append(abPath)
                    fileNum += 1
        # print('*'*50)
        # break
    return fileList

#返回文件列表
def returnFileList():
    fileList = file_name(basePath)
    dataList = []
    for file in fileList[:-2]:
        if 'build' not in file and 'venv' not in file and 'ex_html' not in file:
            filePartList = file.split('\\')
            # 文件的类别
            classOne = filePartList[-2:][0]
            # 文件名
            fileName = filePartList[-2:][1]
            # 文件的路径
            filePath = file
            dataList.append((classOne, fileName, filePath))
    return dataList


#将数据导入数据库
def importToDBS(dataList):

    # 创建来接对象
    con = pymysql.connect(host='121.199.23.213', port=3306, user='LLL', password='LVLL0318', database='myblog')

    # 创建游标对象
    cur = con.cursor()
    # 编写插入的sql语句
    sql = '''insert into 博客 values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''

    try:
        # 执行插入的sql语句
        cur.executemany(sql, dataList)
        # 事务提交
        con.commit()
        print('数据插入成功!')
    except Exception as e:
        print(e)
        # 书事务回滚
        con.rollback()
        print('数据插入失败!')
    finally:
        con.close()

#返回读取到的文件内容
def returnFileContent(filePath):
    con='内容不见了~'
    try:
        with open(filePath, 'r', encoding='utf8') as f:
            con = f.read()
    except:
        pass
    return con

#执行导入数据库的操作 每次执行后需要重新导入分类表的数据
def doImportToDBS():
    classSet=set()
    classDic={}
    #将文件的分类写入文件
    with open('fileClass.csv','w',encoding='utf8',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=['id','标题','创建时间'])
        n=1
        for i in classSet:
            writer.writerow({'id':n,'标题':i,'创建时间':'2021-5-29 14:17:26'})
            classDic[i]=n
            n += 1

    for file in returnFileList():
        class_ = file[0]
        for i in range(10):
            class_ = class_.replace(f'{i}', '').replace('_', '')

        fileName = file[1]
        filePath = file[2]
        # print(f'文件的类别:{class_},文件名:{fileName},文件路径:{filePath}')
        classSet.add(class_)


    dataList=[]
    N=1
    for i in returnFileList():
        #标题 标签
        class_ = i[0]
        for k in range(10):
            class_ = class_.replace(f'{k}', '').replace('_', '')
        content=returnFileContent(i[2]).replace(' ','&nbsp;').replace('\n','<br>')
        classId=classDic[class_]
        data=(N,i[1],class_,content[:200],content,0,0,'2021-5-29 14:17:26','2021-5-29 14:17:26','1',classId)
        N+=1
        dataList.append(data)
    importToDBS(dataList)

if __name__ == '__main__':
    # doImportToDBS()

    pass






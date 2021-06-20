# 第一大题
# 第一步
name = '懒猪彤'
import numpy as np

arr = np.array(range(12))
print(arr)

# 第二部
name = '懒猪彤'
arrType = type(arr)
print(name)
print(arrType)

# 第三步
name = '懒猪彤'
arr1 = np.array(range(6), dtype='bool')
print(name)
print(arr1)

# 第二大题
# 第一步
name = '懒猪彤'
import pandas as pd

df = pd.DataFrame(
    {'name': ['懒猪彤', '室友1', '室友2', '室友3', '室友4', '室友5', ],
     'age': [20, 20, 20, 20, 20, 20],
     'major': ['我的专业', '室友1的专业', '室友2的专业', '室友3的专业', '室友4的专业', '室友5的专业', ]}
)
print(name)

# 第二部
name = '懒猪彤'
df.sort_values('age', ascending=0)
print(name)

# 第三步
name = '懒猪彤'
print(df.describe())
print(name)

# 第四步
name = '懒猪彤'
print(df.loc[0, 'name'], df.loc[0, 'age'], df.loc[0, 'major'])

# 第三大题
# 第一步
name = '懒猪彤'
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负好
print(name)

# 第二步
name = '懒猪彤'
chipo = pd.read_csv('chipo.csv', sep=':')
chipo.head()
print(name)

# 第三步
name = '懒猪彤'
order_list = chipo.item_name.value_counts().iloc[5:0:-1]
print(order_list)
print(name)

# 第四步
name = '懒猪彤'
xticks_list = order_list.index
x_list = range(len(xticks_list))
y_list = order_list.values
plt.bar(x_list, y_list, width=0.5, color=['g', 'r', 'orange', 'b', 'purple'])
plt.xticks(x_list, xticks_list, rotation=90)
plt.title('购买次数最多的商品')
plt.xlabel('商品的名称')
plt.ylabel('订单次数')
plt.show()
print(name)

# 第五步
name = '懒猪彤'
c = chipo.copy()
c.quantity = c.quantity.astype('int')
c.item_price = c.item_price.str.strip('$').astype('float')
order_group = c.groupby('oder_id')
x_list = order_group.item_price.sum()
y_list = order_group.quantity.sum()
plt.scatter(x_list, y_list, color='orange')
plt.xlabel('订单总价')
plt.ylabel('商品总数')
plt.title('每笔订单总金额和购买商品数量的关系')
plt.show()
print(name)

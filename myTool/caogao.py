import re

a='/favicon.ico/static/undefined'
# a=''
b=re.search(r'favicon.ico|static|undefined',a)
if not b:
    print(b)
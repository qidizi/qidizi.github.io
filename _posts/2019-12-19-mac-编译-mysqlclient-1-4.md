---
layout: post
title:  "mac编译mysqlClient"
date:   2019-12-19 14:50:24 +0800
categories: [mac]
tags: [mac, 编译, mysqlClient]
---



> __在编译过程配合自定义安装目录的mysql使用出现找不到mysqlclient动态库的问题，解决方案目录已知有2种：_  

>   * __ln -s到它找的位置可以解决__  
>   * __修改site.cfg的引用方式成静态的，也能解决__  


下方为尝试过程   


`site.cfg`配置内容如下，~~当`static = False`时，会出现异常无法使用~~  

```
mac:mysqlclient-1.4.2.post1 qidizi$ cat site.cfg 
[options]
# static: link against a static library
static = False

# The path to mysql_config.
# Only use this if mysql_config is not on your PATH, or you have some weird
# setup that requires it.
mysql_config = /-/soft/mysql-8.0.17/qidizi/bin/mysql_config 

# http://stackoverflow.com/questions/1972259/mysql-python-install-problem-using-virtualenv-windows-pip
# Windows connector libs for MySQL. You need a 32-bit connector for your 32-bit Python build.
# connector = C:\Program Files (x86)\MySQL\MySQL Connector C 6.1
```  

## 经过 `python3 setup.py build`后，使用如下查询   
mac:mysqlclient-1.4.2.post1 qidizi$ `otool -l build/lib.macosx-10.14-x86_64-3.7-pydebug/MySQLdb/_mysql.cpython-37dm-darwin.so`  

得到它引用mysql client的lib是指向了/usr/lib/，其实我并没有把mysql cleint安装在这个位置，它当然会出错   
```
Load command 9
          cmd LC_LOAD_DYLIB
      cmdsize 56
         name @rpath/libmysqlclient.21.dylib (offset 24)
   time stamp 2 Thu Jan  1 08:00:02 1970
      current version 21.0.0
compatibility version 21.0.0
```   

` python3 setup.py install` 提示安装到python3的site-pa。。。下面了，并是安装成功的   

引用`MySQLdb`，ok直接报错，找不到这个lib，错误如下   

``` 
mac:edm-python qidizi$ python3 main.py 
Traceback (most recent call last):
  File "main.py", line 9, in <module>
    import MySQLdb
  File "/-/soft/Python-3.7.4/qidizi/lib/python3.7/site-packages/mysqlclient-1.4.2.post1-py3.7-macosx-10.14-x86_64.egg/MySQLdb/__init__.py", line 18, in <module>
    from . import _mysql
ImportError: dlopen(/-/soft/Python-3.7.4/qidizi/lib/python3.7/site-packages/mysqlclient-1.4.2.post1-py3.7-macosx-10.14-x86_64.egg/MySQLdb/_mysql.cpython-37dm-darwin.so, 2): Library not loaded: @rpath/libmysqlclient.21.dylib
  Referenced from: /-/soft/Python-3.7.4/qidizi/lib/python3.7/site-packages/mysqlclient-1.4.2.post1-py3.7-macosx-10.14-x86_64.egg/MySQLdb/_mysql.cpython-37dm-darwin.so
  Reason: image not found
```   


-----

## 删除这个`mysqlclient-1.4.2.post1`并重新编译  

`rm -rf mysqlclient-1.4.2.post1`   

**编译`syte.cfg`修改static为true,能正常使用**，

```  
mac:mysqlclient-1.4.2.post1 qidizi$ vim site.cfg 
mac:mysqlclient-1.4.2.post1 qidizi$ 
mac:mysqlclient-1.4.2.post1 qidizi$ 
mac:mysqlclient-1.4.2.post1 qidizi$ cat site.cfg 
[options]
# static: link against a static library
static = True

# The path to mysql_config.
# Only use this if mysql_config is not on your PATH, or you have some weird
# setup that requires it.
mysql_config = /-/soft/mysql-8.0.17/qidizi/bin/mysql_config 

# http://stackoverflow.com/questions/1972259/mysql-python-install-problem-using-virtualenv-windows-pip
# Windows connector libs for MySQL. You need a 32-bit connector for your 32-bit Python build.
# connector = C:\Program Files (x86)\MySQL\MySQL Connector C 6.1
```   


build，`mac:mysqlclient-1.4.2.post1 qidizi$ python3 setup.py build`   
查看生成的so文件引用mysql client的方式如下，`mac:mysqlclient-1.4.2.post1 qidizi$ otool -l build/lib.macosx-10.14-x86_64-3.7-pydebug/MySQLdb/_mysql.cpython-37dm-darwin.so`  

```  

Load command 9
          cmd LC_LOAD_DYLIB
      cmdsize 80
         name /-/soft/openssl-1.0.2s/qidizi/lib/libssl.1.0.0.dylib (offset 24)
   time stamp 2 Thu Jan  1 08:00:02 1970
      current version 1.0.0
compatibility version 1.0.0
Load command 10
          cmd LC_LOAD_DYLIB
      cmdsize 80
         name /-/soft/openssl-1.0.2s/qidizi/lib/libcrypto.1.0.0.dylib (offset 24)
   time stamp 2 Thu Jan  1 08:00:02 1970
      current version 1.0.0
compatibility version 1.0.0
Load command 11
          cmd LC_LOAD_DYLIB
      cmdsize 48
         name /usr/lib/libc++.1.dylib (offset 24)
   time stamp 2 Thu Jan  1 08:00:02 1970
      current version 400.9.4
compatibility version 1.0.0
Load command 12
          cmd LC_LOAD_DYLIB
      cmdsize 56
         name /usr/lib/libSystem.B.dylib (offset 24)
   time stamp 2 Thu Jan  1 08:00:02 1970
      current version 1252.250.1
compatibility version 1.0.0
Load command 13
      cmd LC_FUNCTION_STARTS
  cmdsize 16
  dataoff 6761288
 datasize 2128
Load command 14
      cmd LC_DATA_IN_CODE
  cmdsize 16
  dataoff 6763416
 datasize 344

```  


查看上方记录，没再看到@rpath的引用方式

测试代码输出  

```   
mac:edm-python qidizi$ python3 main.py 
代理FIFO池大小：100
代理FIFO 空槽数 100
耗时0.31835222244262695秒来请求网页 https://www.xxx.com/nt
新提取的代理个数 100
<_mysql.connection open to 'xxxx.rds.aliyuncs.com' at 0x7fcd06085e40>
```  


ok，正常使用   
以上步骤就算是使用pip3来安装也一定问题。   
另外一个解决方案是把那个lib ln -s 到 /usr/lib目录下也能解决问题   


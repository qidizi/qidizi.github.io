---
layout: post
title:  "python3.8编译"
date:   2019-11-23 14:50:24 +0800
categories: [python, centos]
tags: [python, centos, 编译]
---


下列教程针对centos7  
uuid模块使用yum 安装 libuuid-devel  ；  
_dbm模块 使用yum 安装 gdbm-devel 也会包含了_gdbm    
_tkinter模块使用yum 安装 tk-devel     

方案一（推荐）  

```
# 步骤见方案二中的解释，注意j200并发编译可能对于某些低性能机器会导致cpu100％当机  
make clean && ./configure --prefix=/home/q/python38/  --enable-optimizations --enable-loadable-sqlite-extensions --with-pydebug   --with-trace-refs --enable-shared LDFLAGS="-Wl,-rpath /home/q/python38/lib" && make -j200 && make install && /home/q/python38/bin/python3 -m pip list


# 什么都不做，直接运行结果  
[q@1bomTest ~]$ /home/q/python38/bin/python3 -m pip list
Package    Version
---------- -------
pip        19.2.3 
setuptools 41.2.0 
WARNING: You are using pip version 19.2.3, however version 19.3.1 is available.
You should consider upgrading via the 'pip install --upgrade pip' command.

``` 

**注意:方案一与二，神奇的用法在这句 ` LDFLAGS="-Wl,-rpath /home/q/python38/lib" `，它能自动指定自定义目录的动态库放在那个目录**   


方案二（不推荐）    


```
# 下载安装包，并解压到/home/q/python38
# 配置 
 ./configure --prefix=/home/q/python38/  --enable-optimizations --enable-loadable-sqlite-extensions --with-pydebug   --with-trace-refs --enable-shared
# 编译
make -j200 
# 安装
make install 
# 运行
/home/q/python38/bin/python3
# 提示缺少动态库 
# ./bin/python3: error while loading shared libraries: libpython3.8d.so.1.0: cannot open shared object file: No such file or directory
# 把so软链接到默认动态库目录
ln -s /home/q/python38/lib/libpython3.8d.so.1.0 /lib64/
# 再次运行，ok
/home/q/python38/bin/python3


```  


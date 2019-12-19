---
layout: post
title:  "在linux下，使用python多线程触发 `Too many open files:`异常"
date:   2019-08-12 14:50:24 +0800
categories: [python]
tags: [linux, python, Too-many-open-files]
---


python代码

```python
# -*- coding: utf-8 -*-
from lib.letter_custom import Custom as LetterCustom
import os
import threading
import datetime
import time

root_dir = os.path.abspath('%s' % os.path.dirname(__file__))


class A(object):
    num = 0


def show(*arg, **karg):
    for b in range(257):
        A.num += 1
        print('num=%s' % A.num)
        try:
            with open('%s/custom/txt/subject.test.txt' % root_dir) as txt:
                # 标题模板
                subject = txt.read()
                time.sleep(10)
                print('end -' % b)
        except Exception as e:
            print('error - num-%s' % A.num)
            raise


for i in range(257):
    th = threading.Thread(target=show, args=(i,))
    th.start()

```  

运行结果，限制是100，基本是99就会触发：  

```
num=95
num=96
num=97
error - num-97
num=98
error - num-98
Exception in thread Thread-97:
Traceback (most recent call last):
  File "/-/soft/Python-3.7.4/qidizi/lib/python3.7/threading.py", line 926, in _bootstrap_inner
  File "/-/soft/Python-3.7.4/qidizi/lib/python3.7/threading.py", line 870, in run
  File "test.letter.py", line 21, in show
OSError: [Errno 24] Too many open files: '/Volumes/-/edm-python/custom/txt/subject.test.txt'
```   


查看当前系统打开数限制  

```
mac:edm-python qidizi$ ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
file size               (blocks, -f) unlimited
max locked memory       (kbytes, -l) unlimited
max memory size         (kbytes, -m) unlimited
open files                      (-n) 100  #######这个是文件打开数，也可以使用-n参数仅显示它
pipe size            (512 bytes, -p) 1
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 1418
virtual memory          (kbytes, -v) unlimited
```  

临时调整限制数  `ulimit -SHn 100`  


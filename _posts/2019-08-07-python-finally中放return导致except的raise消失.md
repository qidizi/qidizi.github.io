---
layout: post
title:  "python 在finally中放return导致except中的raise没有抛出的坑"
date:   2019-08-07 14:50:24 +0800
categories: [python]
tags: [python, finally, return, raise]
---


```
def e_try():
    try:
        raise Exception('我的错')
    except Exception as e:
        print('捉到：%s' % e)
        raise
    finally:
        print('来到finally')
        return print('return了，你见不到except中raise的东西罗')  # TODO 这是不小心的坑


e_try()


def e_try2():
    try:
        raise Exception('我的错')
    except Exception as e:
        print('捉到：%s' % e)
        raise
    finally:
        print('来到finally，在我之后，你会见到except中raise信息，因为它在我之后处理')

    return print('raise暴发了，你看不到我的')


e_try2()


```

运行结果：

```

mac:edm-python qidizi$ python3 test.py 
捉到：我的错
来到finally
return了，你见不到except中raise的东西罗
捉到：我的错
来到finally，在我之后，你会见到except中raise信息，因为它在我之后处理
Traceback (most recent call last):
  File "test.py", line 27, in <module>
    e_try2()
  File "test.py", line 17, in e_try2
    raise Exception('我的错')
Exception: 我的错
mac:edm-python qidizi$ 
```  


**原因是finally先执行，再去处理except中的raise**  

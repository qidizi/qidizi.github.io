---
layout: post
title:  "关于python print时出现`UnicodeEncodeError: 'utf-8' codec can't encode character '\\ud800' in position 1: surrogates not allowed`问题"
date:   2019-08-09 14:50:24 +0800
categories: [python]
tags: [python, utf-8, UnicodeEncodeError]
---


比如执行`print ('d\ud800')`就会出现如下异常，提示字符串位置1字符无法转换成utf-8： 

```
>>> print ('d\ud800')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeEncodeError: 'utf-8' codec can't encode character '\ud800' in position 1: surrogates not allowed

```  


把它换成`d7ff`，正常输出如下： 

```
>>> print ('d\ud7ff')
d퟿
``` 

我们打开[unicode](https://unicode-table.com/cn/#hangul-jamo-extended-b)码表网站，拉到`d7ff`区， 
即可看到从`d800`开始显示与前面的不同，说明这个属于保留区间，也就是没有任何与之对应的~~字符~~，那它就无法显示， 
怎么办？

python有一个处理方式是，使用html表示方式来显示它的unicode值也就是**&#xxxx;**这样表示方式。

比如： 

```
>>> bytes('d\ud800中',encoding='utf-8', errors='xmlcharrefreplace').decode('utf-8')
'd&#55296;中'

```  

这样就能正常输出了  

php的json_decode同样也会提示类似错误：

```
mac:edm-python qidizi$ php -r "var_dump(json_decode('\"\ud800\"'),json_last_error_msg());"
Command line code:1:
NULL
Command line code:1:
string(50) "Single unpaired UTF-16 surrogate in unicode escape"
```   


js却不会异常

``` 
String.fromCharCode(0xd801)
"�"
```  


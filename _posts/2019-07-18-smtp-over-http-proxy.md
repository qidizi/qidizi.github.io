---
layout: post
title:  "smtp经过http代理"
date:   2019-07-18 14:50:24 +0800
categories: [smtp]
tags: [smtp, proxy, http, connect]
---


***在使用python 的smtp时，有个需求是要走http代理，研究下，才发现就简单加一个CONNECT命令就解决*** 

telnet 交互代码

```
mac:smtp-python qidizi$ /-/soft/inetutils/qidizi/bin/telnet 59.*.*.* 9797
Trying 59.*.*.*...
Connected to 59.*.*.*.
Escape character is '^]'.
CONNECT smtp.qq.com:25 HTTP/1.0

HTTP/1.0 200 OK

EHLO qidizi
220 smtp.qq.com Esmtp QQ Mail Server
250-smtp.qq.com
250-PIPELINING
250-SIZE 73400320
250-STARTTLS
250-AUTH LOGIN PLAIN
250-AUTH=LOGIN
250-MAILCOMPRESS
250 8BITMIME
auth login
334 VXNlcm5hbWU6
kkkk
334 UGFzc3dvcmQ6
kk
535 Error: ??ʹ????Ȩ???¼???????뿴: http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256
quit
221 Bye
Connection closed by foreign host.
```

http代理就是通过CONNECT打开一个socket后，就无脑搬后续的您输入的内容到socket和然后再搬运socket中响应了给您。

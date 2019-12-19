---
layout: post
title:  "sftp命令连接时失败码为1解决思路"
date:   2019-07-11 14:50:24 +0800
categories: [linux]
tags: [linux, sftp, exit-1]
---


1. 使用`sftp -vvv`最齐全debug参数输出方式还是只能看到如下错误信息，没有说明失败原因：

```
debug3: send packet: type 1
debug1: fd 0 clearing O_NONBLOCK
debug3: fd 1 is not O_NONBLOCK
Transferred: sent 2552, received 2392 bytes, in 0.1 seconds
Bytes per second: sent 50728.5, received 47548.0
debug1: Exit status 1
Connection closed
```

1. 换成`ssh -vvv`方式来连接，终于看到明确的原因，因为linux做了多久必须更新密码一次才能使用其它功能的策略导致密码过期了不能使用：

```
debug2: shell request accepted on channel 0
You are required to change your password immediately (password aged)
Last login: Mon Apr  1 13:50:47 2019 from 116.24.101.30

Welcome to Alibaba Cloud Elastic Compute Service !

WARNING: Your password has expired.
You must change your password now and login again!
Changing password for user xxx.
Changing password for xxx.
(current) UNIX password: debug3: receive packet: type 2

```


***由此可见，使用命令`sftp`或是php的ssh2方法，都是无法得到具体的出错原因的，必须要切换成`ssh`命令，就可以获得具体的出错原因了。***

---
layout: post
title:  "使用letsencrypt自签发域名证书"
date:   2019-11-30 14:50:24 +0800
categories: [LetsEncrypt, ssl]
tags: [LetsEncrypt, ssl, https, 证书]
---


1. mac使用brew 安装，centos使用yum安装  
1. 执行以下命名，输入域名，在域名解析上加入提示的txt类型记录，一路确认下去即可完成，最后在nginx上配置使用即可：  

```
# 因为mac上使用root执行比较麻烦，所以，指定了它需要的所有目录为当前登录可以写入目录，省去要切换到root的麻烦操作   
certbot certonly --manual --preferred-challenge dns --config-dir /usr/local/etc/letsencrypt --work-dir /usr/local/etc/letsencrypt --logs-dir /usr/local/var/log/

```

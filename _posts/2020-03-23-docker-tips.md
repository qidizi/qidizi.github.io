---
layout: post
title:  "docker使用心得"
date:   2020-03-23 11:48:01 +0800
categories: [soft]
tags: [docker, 心得]
---  


# docker使用心得   

## 运行容器参数解释  

`docker run -p 10.10.10.10:30080:80 -v /data/ai.net/:/web/ai.net --name qidizi -dt centos /bin/bash`：   

容器的`80`端口绑定在主机的`10.10.10.10:30080`   
主机的`/data/ai.net/`目录挂载在容器`/web/ai.net`下   
`/bin/bash`，启动时运行;  
`centos`，使用centos最新镜像；   
`qidizi`,容器名称，比如运行`docker exe qidizi`指定它即可，不用使用id，容易记；  

`docker exec -it qidizi /bin/bash`  进入`docker run`起来的容器系统，类似于ssh登录；  


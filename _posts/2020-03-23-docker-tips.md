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


## mac 找不到 `/var/lib/docker`   

当我升级成docker desktop 2.2.0.5之后，发现原来存在的这个目录现在消失了，经过研究发现，它现在是把它放到虚拟机内部去了，
而要进入这个虚拟机内部目前操作方式是`screen ～/Library/Containers/com.docker.docker/Data/vms/0/tty`，关于screen用法自行百度，类似于ssh； 
然后就能找到`/var/lib/docker`，就可以在这里修改container的配置json   


## container中使用主机的代理   

主机的代理只能监听在127.0.0.1下，而不是lan，导致无法在docker容器中使用；   
开始尝试使用nginx做转发，最后发现nginx只适合做反向代理，而不适合做代理服务器（正向）；   
于是安装了tinyproxy来做中转代理服务器；  
启用方式1可以编辑`~/.docker/config.json`,加入以下段（注意要重启docker服务和container，仅重启container无效）    

```
"proxies":
 {
   "default":
   {
     "httpProxy": "http://127.0.0.1:3001",
     "httpsProxy": "http://127.0.0.1:3001",
     "noProxy": "*.test.example.com,.example2.com"
   }
 }
```   

或是`export http_proxy="....";export https_proxy="....`,在当前环境下可用；  

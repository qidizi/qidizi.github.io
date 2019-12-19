---
layout: post
title:  "centos 7开机提示selinux规则加载失败解决方案"
date:   2019-08-19 14:50:24 +0800
categories: [linux]
tags: [linux, centos, selinux, Failed]
---


今天在虚拟机上的centos 7关闭selinux时,看走眼改错了配置,重启时提示`Failed to load SELinux Policy. Freezing.`就不动了  

解决步骤: 

* 重启  
* 看到启动内核选择菜单时,选中最上的菜单,按e进入该菜单grub的编辑  
* 找到`linux16 /boot/vmlinuz-3.10.0-957.27.2.el7.x86_64 root=UUID=01e03c5c-0d56-4a0a-9da1-7ee83e21d690 ro rhgb quiet LANG=zh_CN.UTF-8 `,在这行后面加上`  selinux=0`
* 按ctrl+x应用并引导开机,ok,成功进入,立刻修复改错的selinux配置即可;  

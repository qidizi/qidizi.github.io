---
layout: post
title:  "mac系统编译c源文件时，提示找不到`/usr/include`处理方法"
date:   2019-07-27 14:50:24 +0800
categories: [mac]
tags: [mac, 编译, include]
---


比如自己编译`gcc`就强制要求必须要有这个目录  

1. `xcode-select install`安装必要的工具
2. `/usr/include`还是没有，需要手工安装include文件如：`sudo installer /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg -target /`

# 2019-7-27更新

10.14.6 (18G84)版本 用法`sudo installer -pkg /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg -target /`,添加了`-pkg`参数？  

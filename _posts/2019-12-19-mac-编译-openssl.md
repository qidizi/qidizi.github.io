---
layout: post
title:  "在mac上编译 openssl-1.0.2s"
date:   2019-12-19 14:50:24 +0800
categories: [mac]
tags: [mac, 编译, openssl]
---



## 配置
```
mac:openssl-1.0.2s qidizi$ bash ./Configure  threads shared zlib-dynamic  --prefix=/-/soft/openssl-1.0.2s/qidizi --with-zlib-lib=/-/soft/zlib/qidizi/lib/ --with-zlib-include=/-/soft/zlib/qidizi/include/  darwin64-x86_64-cc
```

## `make`

## `make install`

---
layout: post
title:  "python3 mysqlclient1.4.2在centos7 执行 `select * from table where a = '中文';` 出现了`UnicodeEncodeError: 'latin-1' codec can't encode characters`异常"
date:   2019-08-13 14:50:24 +0800
categories: [python]
tags: [python, mysqlclient, 中文, utf8]
---


在连接时设置一下 `charset='utf8'`即可解决  



```python

_me._mysql = _mysql = Mysql.connect(
                host=ConfigCustom.get_mysql_host(),
                password=ConfigCustom.get_mysql_pwd(),
                port=ConfigCustom.get_mysql_port(),
                user=ConfigCustom.get_mysql_user(),
                db=ConfigCustom.get_mysql_db(),
                use_unicode=True,
                # 否则有些系统会触发
                # UnicodeEncodeError: 'latin-1' codec can't encode characters in position 34-35:
                # ordinal not in range(256)
                charset='utf8',
                connect_timeout=30,  # 这个参数好像无效，还是默认使用60来
                autocommit=True,  # 它默认是否
            )
            _me._cursor = _me._mysql.cursor()
``` 


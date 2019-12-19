---
layout: post
title:  "关于mysql不区分大小写"
date:   2019-12-04 14:50:24 +0800
categories: [mysql]
tags: [mysql, centos, 大小写]
---


**注意本前提是在区分大小写的系统做的测试，像centos 7**  


## 不区分场景   

1. sql关键字不区分，如`sElEct 1;`  ；  
1. 字段，若字段`field_a'，使用`select field_A from ...`不会出错；   

## 区分的场景  

1. 库名，如有库`db_a`若使用`select * from db_A.table_a limit 1;`就会出错；   
2. 表名，如有表`table_a`，若使用`select * from db_A.table_A limit 1;`就会出错； 
3. `replace`函数，若字段`field_a'有值`a`,使用`replace(field_a, 'A','1')`就会返回0个影响行；  

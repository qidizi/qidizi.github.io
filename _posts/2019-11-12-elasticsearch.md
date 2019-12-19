---
layout: post
title:  "elasticsearch 随记（基于mac ox）"
date:   2019-11-12 14:50:24 +0800
categories: [elasticSearch]
tags: [mac, elasticSearch]
---



## 如何更换jdk？ 

比如默认执行`./bin/elasticsearch-plugin --help`，会得到如下提示：  
```bash

future versions of Elasticsearch will require Java 11; your Java version from [/Library/Java/JavaVirtualMachines/jdk1.8.0_161.jdk/Contents/Home/jre] does not meet this requirement
A tool for managing installed elasticsearch plugins
```   
解决方案，替换环境变更再执行：`JAVA_HOME=jdk/Contents/Home ./bin/elasticsearch-plugin --help`   

bin目录下的文件应该全部是shell脚本，在运行前都会调用一下xxx－env这个获取必须的运行环境参数，里面有一段代码就是选择java：  
```bash
# now set the path to java
if [ ! -z "$JAVA_HOME" ]; then
  JAVA="$JAVA_HOME/bin/java"
else
  if [ "$(uname -s)" = "Darwin" ]; then
    # OSX has a different structure
    JAVA="$ES_HOME/jdk/Contents/Home/bin/java"
  else
    JAVA="$ES_HOME/jdk/bin/java"
  fi
fi

```   

## 为什么分页时只建议取前1000个？   

见某权威指南解释：   
```
为了理解为什么深度分页是有问题的，让我们假设在一个有5个主分片的索引中搜索。当我们请求结果的第一页（结果1到10）时，每个分片产生自己最顶端10个结果然后返回它们给请求节点(requesting node)，它再排序这所有的50个结果以选出顶端的10个结果。
现在假设我们请求第1000页——结果10001到10010。工作方式都相同，不同的是每个分片都必须产生顶端的10010个结果。然后请求节点排序这50050个结果并丢弃50040个！
你可以看到在分布式系统中，排序结果的花费随着分页的深入而成倍增长。这也是为什么网络搜索引擎中任何语句不能返回多于1000个结果的原因。
```

## 默认配置修改成0.0.0.0后，启动失败怎么解决？  

centos使用默认配置正常运行，把ip 127.0.0.1 修改成0.0.0.0后，重启失败，查看日志看到：  

```bash
11月 13 12:03:54 localhost.localdomain elasticsearch[29916]: [1]: the default discovery settings are unsuitable for production use; at least one of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured

```   
只有一台机子，并不需要发现其它节点解决方案是按提示加上发现规则，如：  `discovery.seed_hosts: ["[::1]"]`，把前面注释去掉修改一下发现节点的ip；  
 


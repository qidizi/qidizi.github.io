---
layout: post
title:  "mac 10.14.5 (18F132)手工编译扩展memcached"
date:   2019-07-08 14:50:24 +0800
categories: [c, memcached, mac]
tags: [c, 编译, memcached, mac]
---


1. 尝试使用./pecl install memcached 失败     
1. 从[官网](https://launchpad.net/libmemcached/+download) 下载 libmemcached，解压并`cd`到源码根目录，执行`bash ./configure --prefix=/-/soft/libmemcached/qidizi`配置成功；`make` 时出错提示如下：    

```
libmemcached/byteorder.cc:66:10: error: use of undeclared identifier 'ntohll'
  return ntohll(value);
         ^
libmemcached/byteorder.cc:75:10: error: use of undeclared identifier 'htonll'
  return htonll(value);
         ^

```

大概看了眼，感觉是判断有问题，本来应该是不能加载htonll的，自己把#ifdef修改一下跳过也行，网上还有修改configure逻辑的，还有一个方案修改方式：  

```
vim libmemcached/byteorder.c，找到 #include "libmemcached/byteorder.h" 在下方加上：  

#ifdef HAVE_SYS_TYPES_H
#include <sys/types.h>
#endif
```

1. 重新配置和make，又报错 

```
clients/memflush.cc:42:19: error: comparison between pointer and integer ('char *' and 'bool')
  if (opt_servers == false)
      ~~~~~~~~~~~ ^  ~~~~~
clients/memflush.cc:51:21: error: comparison between pointer and integer ('char *' and 'bool')
    if (opt_servers == false)
        ~~~~~~~~~~~ ^  ~~~~~
```   

解决方案是直接vim代码把`false`替换成`NULL`后，继续配置与make，一路下去这个组件成功编译；

1. 在`./pecl install memcached`时还提示缺少`pkg-config`,解决方案是从`https://pkg-config.freedesktop.org/releases/pkg-config-0.29.2.tar.gz`下载并使用`bash ./configure --prefix=/-/soft/pkg-config/qidizi --with-internal-glib`方式来配置，完成编译和安装，并`ln -s /-/soft/pkg-config/qidizi/bin/pkg-config /-/soft/bin/`,和设置一下`$PATH`把`/-/soft/bin/`设置到最前面，这样全局中就有pkg-config使用了；  

1. 再使用 `./pecl install memcached` 安装按提示安装即可能正常执行下去了，如果需要zlib也可以按前面方式编译一下提供路径，注意比如设置的`--prefix=/-/soft/zlib/qidizi`,那就提供相同的路径即可，也就是它要的是安装目录；  

1. 在`php.ini` 按提示`You should add "extension=memcached.so" to php.ini`添加扩展；  
1. 使用`php -i|grep memcache`就能看到扩展是否已经成功加载，如：   

```
mac:bin qidizi$ php -i|grep memcache
memcached
memcached support => enabled
libmemcached version => 1.0.18
memcached.compression_factor => 1.3 => 1.3
memcached.compression_threshold => 2000 => 2000
memcached.compression_type => fastlz => fastlz
memcached.default_binary_protocol => Off => Off
memcached.default_connect_timeout => 0 => 0
memcached.default_consistent_hash => Off => Off
memcached.serializer => php => php
memcached.sess_binary_protocol => On => On
memcached.sess_connect_timeout => 0 => 0
memcached.sess_consistent_hash => On => On
memcached.sess_consistent_hash_type => ketama => ketama
memcached.sess_lock_expire => 0 => 0
memcached.sess_lock_max_wait => not set => not set
memcached.sess_lock_retries => 5 => 5
memcached.sess_lock_wait => not set => not set
memcached.sess_lock_wait_max => 150 => 150
memcached.sess_lock_wait_min => 150 => 150
memcached.sess_locking => On => On
memcached.sess_number_of_replicas => 0 => 0
memcached.sess_persistent => Off => Off
memcached.sess_prefix => memc.sess.key. => memc.sess.key.
memcached.sess_randomize_replica_read => Off => Off
memcached.sess_remove_failed_servers => Off => Off
memcached.sess_sasl_password => no value => no value
memcached.sess_sasl_username => no value => no value
memcached.sess_server_failure_limit => 0 => 0
memcached.store_retry_count => 2 => 2
Registered save handlers => files user memcached 
OLDPWD => /-/soft/php-last/ext/memcached-3.1.3
$_SERVER['OLDPWD'] => /-/soft/php-last/ext/memcached-3.1.3

```
   



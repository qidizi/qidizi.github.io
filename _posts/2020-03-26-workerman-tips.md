---
layout: post
title:  "workerman心得"
date:   2020-03-26 14:58:24 +0800
categories: [php,workerman]
tags: [php, workerman, 心得]
---

# workerman使用笔记   


## 1个websocket client，同时多个php使用sendToClient发送消息测试   

测试环境，mac 2.8 GHz 四核Intel Core i7，16 GB 2133 MHz LPDDR3   

fork send to client.php 代码   

```php
<?php

// fork 多个php
$fork = 100;
while ($fork-- > 0) {
    $log_path = __DIR__ . '/' . basename(__FILE__, '.php') . '/' . date('Y-m') . '/' . $fork . '/';
    // 这个命令只能在linux下运行，window会出错
    $command = [
        // 创建日志目录
        'mkdir -p ',
        $log_path,
        ';',
        // 不要挂断
        'nohup',
        'php',
        'send_to_ws_client.php',
        // 加前缀防止误指向不安全的文件
        $fork,
        //  > /dev/null 2>&1 必须有这句，否则本php会等到子进程结束才返回；
        // 注意这个日志文件会不停的增长，除非使用 log rotate 来处理,
        // 不同的处理文件，保存到不同的日志中,同时按启动的月份来切割
        ">>{$log_path}log.txt",
        // 重定向错误到另一个文件
        "2>>{$log_path}error.txt",
        // 后台运行
        '&',
        // 返回当前进程id
        'echo',
        '$!'
    ];
    $command = implode(' ', $command);
    exec($command, $op, $exit_code);
}

```   


send to client.php 的代码   

```php
<?php

define('PROJECT_ROOT', __DIR__ . '/../');

include_once PROJECT_ROOT . 'core/includes/base.php';
include_once PROJECT_ROOT . 'core/workerman/Workerman/Autoloader_worker_man.php';


use my\includes\classes\client_gateway;
use project\core\includes\config;


$wk_client_id = client_gateway::get_websocket_client_list();
if (empty($wk_client_id)) quite('暂无已连接的客户端');
// 测试时一般只会开一个客户端，所以，只选择首个即可
$wk_client_id = array_keys($wk_client_id)[0];

$fork_id = $argv['1'];
$loop = 10000;
while ($loop-- > 0) {
    client_gateway::sendToClient(
        $wk_client_id, 'window["aaa' . $fork_id . '"] || (window["aaa' . $fork_id . '"]=[]),window["aaa' . $fork_id . '"].push(' . $loop . '+" ' . microtime(1).'");'
    );
}

function quite($msg)
{
    line($msg);
    exit;
}

function line($msg)
{
    echo $msg . "\n\n";
}

```   

ws client 收到消息代码    

```javascript

    socket.onmessage = function (e) {
        var msg = new Function('', 'return ' + e.data)() || {};
        }
```   

ws client 在chrome console中抽查结果   

```
aaa90.length
3760
aaa70.length
3198
aaa60.length
4071
aaa50.length
3340
aaa40.length
3638
aaa30.length
3314
aaa10.length
3398
```  

php send to client 抽查结果   

```
Warning: stream_socket_client(): unable to connect to tcp://127.0.0.1:2300 (Can't assign requested address) 
in core/workerman/GatewayWorker/Lib/Gateway.php on line 1214
mac:2020-03 qidizi$ cat 97/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4046
mac:2020-03 qidizi$ cat 0/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4435
mac:2020-03 qidizi$ cat 1/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4799
mac:2020-03 qidizi$ cat 2/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    5047
mac:2020-03 qidizi$ cat 3/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4421
mac:2020-03 qidizi$ cat 4/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    5161
mac:2020-03 qidizi$ cat 5/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    5322
mac:2020-03 qidizi$ cat 8/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4739
mac:2020-03 qidizi$ cat 20/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4838
mac:2020-03 qidizi$ cat 30/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    5335
mac:2020-03 qidizi$ cat 50/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    5054
mac:2020-03 qidizi$ cat 80/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    5200
mac:2020-03 qidizi$ cat 90/log.txt |grep 'tcp://127.0.0.1:2300'|wc -l
    4581
mac:2020-03 qidizi$ 
```  

结论：由2个抽查结果来看，100个异步php给ws client发送消息，一半连接不上gateway，有1k左右消失（非连接不上gateway问题？）    
建议？？！！：异步同时给ws client发送消息的数量不要过多，若有必要，消息先进队列，使用单php进行轮询发送；   


把fork php个数修改成10个php，每个php发送2000条消息，统计数据：   

```
发送消息的php日志，无法连接大概是1/10  

Warning: stream_socket_client(): unable to connect to tcp://127.0.0.1:2300 (Can't assign requested address) in 
workerman/GatewayWorker/Lib/Gateway.php on line 1214
mac:2020-03 qidizi$ cat 9/log.txt |grep 'unable to connect to tcp'|wc -l
     272
mac:2020-03 qidizi$ cat 8/log.txt |grep 'unable to connect to tcp'|wc -l
     423
mac:2020-03 qidizi$ cat 7/log.txt |grep 'unable to connect to tcp'|wc -l
     349
mac:2020-03 qidizi$ cat 6/log.txt |grep 'unable to connect to tcp'|wc -l
     103
mac:2020-03 qidizi$ cat 5/log.txt |grep 'unable to connect to tcp'|wc -l
     444
mac:2020-03 qidizi$ cat 4/log.txt |grep 'unable to connect to tcp'|wc -l
     452
mac:2020-03 qidizi$ cat 3/log.txt |grep 'unable to connect to tcp'|wc -l
     457
mac:2020-03 qidizi$ cat 2/log.txt |grep 'unable to connect to tcp'|wc -l
     168
mac:2020-03 qidizi$ cat 1/log.txt |grep 'unable to connect to tcp'|wc -l
     219
mac:2020-03 qidizi$ cat 0/log.txt |grep 'unable to connect to tcp'|wc -l
     328
mac:2020-03 qidizi$ 


js的统计  
aaa0.length
1611
aaa1.length
1717
aaa2.length
1777
aaa3.length
1466
aaa4.length
1475
aaa5.length
1491
aaa6.length
1832
aaa7.length
1597
aaa8.length
1507
aaa9.length
1658

```  

见统计 比如0，1611+328，还是有部分消失了；  
经过测试，就算是2个fork+10000个消息，前台也只能收到8k左右消息；   
但是只有1个的时候，前台才能收到全部消息；  

**经坛友提醒**，可能是受到内核并发数限制，可以参考 http://doc.workerman.net/appendices/kernel-optimization.html 调整试试； 目前因测试时间比较紧，当前测试版本的mac暂没找到合适的修改conf文件生效的方式，虽有sysctl等命令可用，但是会提醒某些name不可用。。。暂未继续测试    





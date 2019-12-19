---
layout: post
title:  "php cli 当前进程的debug信息在1行打印出来"
date:   2019-12-13 14:50:24 +0800
categories: [php]
tags: [php, cli, debug, workerMan]
---



比如我们在使用worker man时，它不支持xdebug，调试很麻烦，如果采用直接echo调试信息，在控制台查看，同一进程的调试信息就会混合在不同进程输出中，给调试带来麻烦。  
下面的变通处理方式可以解决这个问题，让一个进程的debug信息在控制台的1行（处）全部打印出来：     


**方案一：在入口处采用finally总是（除非你使用了exit等终止进程的指令）会执行的特性做“收尾工作”**  

```php  
static function onMessage(){
   try{
      if(1)
         return 1;
      if(2)
         return 2;
   }finally{
      echo implode("\t", static_class_a::$_debug_msg);
   }
}
```  

还有另外一个方案是使用实例化类的`析构`方法来处理：


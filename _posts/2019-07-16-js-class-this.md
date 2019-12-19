---
layout: post
title:  "js class this在new与静态引用时所指不同"
date:   2019-07-16 14:50:24 +0800
categories: [javascript]
tags: [js, javascript, class, this]
---


***this在这里的表现也跟func样跟着谁说叫谁老板的，与function.call("this"概念一样。***

简单的一个类
```
class a{
static a = "static-a";
 b = "ins-b";

constructor(){
console.log('new',this.a,this.b,this);
}

static fn(){
console.log('static',this.a,this.b,this);
}

}

```


* new用法`new a();`时输出如后：`new undefined ins-b a {b: "ins-b"}`，选择性失明，static的东西与被抛弃了；
* static用法：`a.fn();`，输出结果如下：

```
static static-a undefined class a{
static a = "static-a";
 b = "ins-b";

constructor(){
console.log('new',this.a,this.b,this);
}

static fn(){
console.log('static',this.a,this.b,this);
}

}
```

同样，new的东西被选择性抛弃；

----
ok，通过上面2个例子，我们可以明确了解到，this，就是指向当前这个使用的对象如new出来的实例，或是static

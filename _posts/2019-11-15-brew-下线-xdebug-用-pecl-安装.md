---
layout: post
title:  "brew安装php7.3.11后用pecl安装xdebug"
date:   2019-11-15 14:50:24 +0800
categories: [mac, brew]
tags: [mac, brew, php, xdebug, pecl]
---


网络上听说，brew把xdebug移除了，查询一下，确实已经变成关闭的了：   

```bash
brew search xdebug


No formula or cask found for "xdebug".
Closed pull requests:
xdebug-osx: delete (https://github.com/Homebrew/homebrew-php/pull/4837)
php72-xdebug 2.6.0RC2 (https://github.com/Homebrew/homebrew-php/pull/4726)
php7{0-2}-xdebug 2.6.0 (https://github.com/Homebrew/homebrew-php/pull/4738)
php72-xdebug 2.6.0-beta1 (https://github.com/Homebrew/homebrew-php/pull/4683)
php7{0,1}-xdebug 2.6.0beta1 (devel) (https://github.com/Homebrew/homebrew-php/pull/4686)
php72-xdebug (new formula, head only) (https://github.com/Homebrew/homebrew-php/pull/4439)
php71: migrate to homebrew/core (https://github.com/Homebrew/homebrew-php/pull/4798)
Adds debug options for php70-xdebug (GH-4338) (https://github.com/Homebrew/homebrew-php/pull/4341)
Updated xdebug-osx to v1.3 (https://github.com/Homebrew/homebrew-php/pull/4307)
Add formula for infection (https://github.com/Homebrew/homebrew-php/pull/4519)
xdebug 2.5.5 (https://github.com/Homebrew/homebrew-php/pull/4294)
enchant 2.2.0 (https://github.com/Homebrew/homebrew-core/pull/21807)
xdebug 2.5.4 (https://github.com/Homebrew/homebrew-php/pull/4162)
xdebug 2.5.3 (https://github.com/Homebrew/homebrew-php/pull/4122)
xdebug 2.5.2 (https://github.com/Homebrew/homebrew-php/pull/4120)
php70 7.0.17 (https://github.com/Homebrew/homebrew-php/pull/4044)
php{55-71} xdebug 2.5.1 (https://github.com/Homebrew/homebrew-php/pull/4013)
Add PHP 7.2.0-alpha.1 core formula (php72) (https://github.com/Homebrew/homebrew-php/pull/4211)
php{55-71}-xdebug 2.5.0 (https://github.com/Homebrew/homebrew-php/pull/3809)
php71-xdebug 2.5.0RC1 - Fixes Segfault in code coverage issue (https://github.com/Homebrew/homebrew-php/pull/3788)

```   

于是考虑使用pecl 安装xdebug，运行`pecl install xdebug`提示成功后，却发现这个so文件不存在，因为pecl这个目录根据就不存在，这估计是brew的失误，   

```bash 
35178575 600 -rwxr-xr-x  1 qidizi  wheel  304048 11 15 09:24 /private/tmp/pear/temp/pear-build-qidiziHxZAEj/install-xdebug-2.8.0/usr/local/Cellar/php/7.3.11/pecl/20180731/xdebug.so

Build process completed successfully
Installing '/usr/local/Cellar/php/7.3.11/pecl/20180731/xdebug.so'
adding to transaction: mkdir /usr/local/Cellar/php/7.3.11/pecl/20180731
+ create dir /usr/local/Cellar/php/7.3.11/pecl/20180731

Warning: mkdir(): File exists in System.php on line 294
PHP Warning:  mkdir(): File exists in /usr/local/Cellar/php/7.3.11/share/php/pear/System.php on line 294

Warning: mkdir(): File exists in /usr/local/Cellar/php/7.3.11/share/php/pear/System.php on line 294
ERROR: failed to mkdir /usr/local/Cellar/php/7.3.11/pecl/20180731

Warning: unlink(/private/tmp/pear/temp/pearUnagAx): No such file or directory in System.php on line 225
mac:1bom qidizi$ ls /private/tmp/pear/temp/channel.xml 
mac:1bom qidizi$ ls -al  /usr/local/Cellar/php/7.3.11/pecl 
lrwxr-xr-x  1 qidizi  staff  23 11 14 00:20 /usr/local/Cellar/php/7.3.11/pecl -> /usr/local/lib/php/pecl
mac:1bom qidizi$ ls -al /usr/local/lib/php/
20180731/ build/    
mac:1bom qidizi$ ls -al /usr/local/lib/php
total 0
drwxr-xr-x    4 qidizi  admin   128 11 14 01:18 .
drwxrwxrwx  186 qidizi  admin  5952 11 15 09:20 ..
lrwxr-xr-x    1 qidizi  admin    40 11 14 00:20 20180731 -> ../../Cellar/php/7.3.11/lib/php/20180731
lrwxr-xr-x    1 qidizi  admin    37 11 14 00:20 build -> ../../Cellar/php/7.3.11/lib/php/build
```   

从安装日志上来看，是能正常安装的，只是一个brew没有准备这个目录，另一个xdebug并不强制保证这个目录存在，最后，一路下来，白装了，那么给它补上这个目录看看如何   

```bash  
mac:1bom qidizi$ ls -l /usr/local/lib/php/
total 0
lrwxr-xr-x  1 qidizi  admin  40 11 14 00:20 20180731 -> ../../Cellar/php/7.3.11/lib/php/20180731
lrwxr-xr-x  1 qidizi  admin  37 11 14 00:20 build -> ../../Cellar/php/7.3.11/lib/php/build
lrwxr-xr-x  1 qidizi  admin  41 11 15 09:36 pecl -> /usr/local/Cellar/php/7.3.11/lib/php/pecl  # 根据brew的保持干净原则补上
```   

再重新`pecl install xdebug`，通过`pecl list`看到了xdebug了，`php -i|grep xdebug`也看到已经加载。

**注意，因为so放到该目录会自动加载，所不要再在php.ini中手工添加`zend_extension=xdebug`方式加载了**

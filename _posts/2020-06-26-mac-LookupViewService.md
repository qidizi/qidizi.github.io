# 关于苹果osx系统的look up(LookupViewService)服务   

1.  可以使用`ps aux|grep ook`得到完整路径;    
1.  它使用的词典放到`/System/Library/AssetsV2/com_apple_MobileAsset_DictionaryServices_dictionaryOSX`;  
1.  它判断为单词时,调用`/System/Library/Frameworks/CoreServices.framework/Frameworks/DictionaryServices.framework`来显示,  
1.  修改了配置后,可以使用`kill -9 pid`来强制结束,三指trap即可生效;    
1.  如下文件,可以加入js来控制显示,但是这个是词典中有匹配时才会调用这个页面,否则只会显示无记录的界面,目前不清楚这个界面能否简单修改,已知词典无法指定正则方式来匹配达到总是进入这个页面;  
```
sh-3.2# vim qidizi.js 
sh-3.2# pwd
/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/DictionaryServices.framework/Versions/A/Resources
sh-3.2# cat Transform.xsl 
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:d="http://www.apple.com/DTDs/DictionaryService-1.0.rng"
				version="1.0">
<xsl:output method="html" encoding="UTF-8" indent="no"
	doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
	doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
<xsl:template match="/">
<html>
	<head>
	</head>
	<body>
        <xsl:apply-templates/>
Transform.xsl
<script src="file:///System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/DictionaryServices.framework/Versions/A/Resources/qidizi.js" type="text/javascript"></script>
	</body>
  ```  
  
  

# 关于苹果osx系统的look up(LookupViewService)服务   

1.  可以使用`ps aux|grep ook`得到完整路径;    
1.  它使用的词典放到`/System/Library/AssetsV2/com_apple_MobileAsset_DictionaryServices_dictionaryOSX`;  
1.  它判断为单词时,调用`/System/Library/Frameworks/CoreServices.framework/Frameworks/DictionaryServices.framework`来显示,  
1.  修改了配置后,可以使用`kill -9 pid`来强制结束,三指trap即可生效;    

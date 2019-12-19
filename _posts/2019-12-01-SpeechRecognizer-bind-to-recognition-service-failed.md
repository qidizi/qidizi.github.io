---
layout: post
title:  "关于 `E/SpeechRecognizer: bind to recognition service failed`"
date:   2019-12-01 14:50:24 +0800
categories: [android]
tags: [SpeechRecognizer, android, failed]
---



在使用`speech_recognizer.startListening(speechIntent);`出现了如标题所示的错误，
查看了下源代码   

```java


    /**
     * Starts listening for speech. Please note that
     * {@link #setRecognitionListener(RecognitionListener)} should be called beforehand, otherwise
     * no notifications will be received.
     *
     * @param recognizerIntent contains parameters for the recognition to be performed. The intent
     *        may also contain optional extras, see {@link RecognizerIntent}. If these values are
     *        not set explicitly, default values will be used by the recognizer.
     */
    public void startListening(final Intent recognizerIntent) {
        if (recognizerIntent == null) {
            throw new IllegalArgumentException("intent must not be null");
        }
        checkIsCalledFromMainThread();
        if (mConnection == null) { // first time connection
            mConnection = new Connection();
            
            Intent serviceIntent = new Intent(RecognitionService.SERVICE_INTERFACE);
            
            if (mServiceComponent == null) {
                String serviceComponent = Settings.Secure.getString(mContext.getContentResolver(),
                        Settings.Secure.VOICE_RECOGNITION_SERVICE);
                
                if (TextUtils.isEmpty(serviceComponent)) {
                    Log.e(TAG, "no selected voice recognition service");
                    mListener.onError(ERROR_CLIENT);
                    return;
                }
                
                serviceIntent.setComponent(ComponentName.unflattenFromString(serviceComponent));                
            } else {
                serviceIntent.setComponent(mServiceComponent);
            }
            
            if (!mContext.bindService(serviceIntent, mConnection, Context.BIND_AUTO_CREATE)) {
                Log.e(TAG, "bind to recognition service failed");
                mConnection = null;
                mService = null;
                mListener.onError(ERROR_CLIENT);
                return;
            }
        }
        putMessage(Message.obtain(mHandler, MSG_START, recognizerIntent));
    }
    
``` 
    
里面有一句，它是有把错误传递给listener的 `mListener.onError(ERROR_CLIENT);`，但是怪异的是我的`RecognitionListener.onError`
并没有收到错误，导致我无法做异常处理，`startListening`又没有返回值无法做`null`判断，最后参考别人的代码做了如下判断后再进行创建    

```java


    void open_speech_recognizer() {
        Handler mainHandler = new Handler(context.getMainLooper());
        Runnable myRunnable = new Runnable() {
            @RequiresApi(api = Build.VERSION_CODES.M)
            @Override
            public void run() {
                if (null == speech_recognizer)
                    create_speech_recognizer();

                if (null == speech_recognizer) return;
                if (null == speechIntent) create_intent();

                // 小米9设置语音输入为小爱同学时，会出现无法绑定的异常，需要去掉勾选成，讯飞语记才能使用；
                speech_recognizer.startListening(speechIntent);
            }
        };
        mainHandler.post(myRunnable);
    }

    private void create_intent() {
        speechIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        // 识别结束用途，如网络查找，可能要提炼关键字
        speechIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        // 不支持边说边识别，只能说完再识别
        speechIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        // 只要一个识别结果
        speechIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void create_speech_recognizer() {
        // 语音到文本，必须运行在main thread中
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            SoftKeyboard.emit_js_str(webView, "speech_recognizer_on_error", "语音不可用");
            return;
        }

        // 查找当前系统的内置使用的语音识别服务
        String voice_component = Settings.Secure.getString(context.getContentResolver(),
                "voice_recognition_service");

        Log.e("qidizi", "voice_recognition_service : " + voice_component);

        if (TextUtils.isEmpty(voice_component)) {
            SoftKeyboard.emit_js_str(webView, "speech_recognizer_on_error", "未安装语音识别组件");
            return;
        }

        ComponentName component = ComponentName.unflattenFromString(voice_component);

        if (null == component) {
            SoftKeyboard.emit_js_str(webView, "speech_recognizer_on_error",
                    "无法使用语音识别组件：" + voice_component);
            return;
        }

        boolean is_recognizer_installed = false;
        ComponentName last_recognition = null;

        // 查找得到的 "可用的" 语音识别服务
        List<ResolveInfo> list = context.getPackageManager().queryIntentServices(
                new Intent(RecognitionService.SERVICE_INTERFACE), PackageManager.MATCH_ALL
        );

        if (0 == list.size()) {
            SoftKeyboard.emit_js_str(webView, "speech_recognizer_on_error",
                    "没有可用的语音识别组件");
            return;
        }

        for (ResolveInfo info : list) {
            Log.e("qidizi", "\t" + info.loadLabel(context.getPackageManager()) + ": "
                    + info.serviceInfo.packageName + "/" + info.serviceInfo.name);

            if (info.serviceInfo.packageName.equals(component.getPackageName())) {
                is_recognizer_installed = true;
                break;
            } else {
                last_recognition = new ComponentName(info.serviceInfo.packageName, info.serviceInfo.name);
            }
        }

        // 这个方法在小米9上，总是返回null,比如已经安装了讯飞语记
//        Intent intent = RecognizerIntent.getVoiceDetailsIntent(context);
//        Log.e("kk",intent.toString());
        // 不能直接new，只能这样用

        if (is_recognizer_installed) {
            speech_recognizer = SpeechRecognizer.createSpeechRecognizer(context);
        } else {
            speech_recognizer = SpeechRecognizer.createSpeechRecognizer(context, last_recognition);
        }

        speech_recognizer.setRecognitionListener(this);
    }
    
```   
  
  
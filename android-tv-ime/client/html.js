+function () {
    let rnd = +new Date;
    let host = '127.0.0.1' === location.hostname ?
        "php.local.qidizi.com" : "www-public.qidizi.com";
    document.close();
    document.write(`
<!DOCTYPE html>
<html lang="zh">
<head>
    <base href="http://${host}/android-tv-ime/client/"/>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>安卓tv控制器</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgo=">
    <link rel="stylesheet" href="index.css?r=${rnd}"/>
    <!--用异步加载js,否则chrome会阻止,通过document.write写入的-->
    <script src="https://cn.vuejs.org/js/vue.min.js" SameSite=None async></script>
</head>
<body>
<div id="app">
    <i class="toast" v-html="toast"> </i>
    <b class="pad_box pad_btn" @click.stop.prevent.self="send_key('KEYCODE_DPAD_CENTER')">
        <b class="pad_center unselect pad_btn" @click.stop.prevent.self="send_key('KEYCODE_DPAD_CENTER')">OK</b>
        <b class="pad_left pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_DPAD_LEFT')">左</b>
        <b class="pad_up pad_btn " @click.stop.prevent.self="send_key('KEYCODE_DPAD_UP')">上</b>
        <b class="pad_right pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_DPAD_RIGHT')">右</b>
        <b class="pad_down pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_DPAD_DOWN')">下</b>


        <b class="pad_key pad_menu pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_MENU')">菜单</b>
        <b class="pad_key pad_home pad_btn home unselect" @click.stop.prevent.self="send_key('KEYCODE_HOME')">主页</b>
        <b class="pad_key pad_back pad_btn back unselect" @click.stop.prevent.self="send_key('KEYCODE_BACK')">返回</b>
        <b class="pad_key pad_vol_down pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_VOLUME_DOWN')">声-</b>
        <b class="pad_key pad_mute pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_VOLUME_MUTE')">静音</b>
        <b class="pad_key pad_vol_up pad_btn unselect" @click.stop.prevent.self="send_key('KEYCODE_VOLUME_UP')">声+</b>
    </b>
    <br>
    <textarea v-model="text" class="text text_left" placeholder="要输入到电视的文字"> </textarea>
    <input type="button" class="btn_right" value="发送文字" @click="send_text"/>

    <textarea v-model.trim="media_url" class="media_url text_left"
              placeholder="自动识别或加ext=htm或视频后缀指定类型"> </textarea>
    <input type="button" class="btn_right" value="在电视打开" @click="play_url()"/>
    <input type="file" id="file_input" class="text_left file_input"/>
    <input type="submit" class="btn_right" @click="upload" value="上传应用"/>
    <input v-model.trim="filter" class="filter" placeholder="输入关键字快速查找">
    <ol class="media_list">
        <template v-for="nu in media_list">
            <li class="url" v-if="!filter || nu[0].toLowerCase().indexOf(filter.toLowerCase()) > -1">
                <a href="javascript:void(0)" v-html="nu[0]" @click="play_url(nu[1])" :title="nu[1]"> </a>
            </li>
        </template>
    </ol>
    <i class="to_top" onclick="window.scrollTo(0, 0);">顶部</i>
    <div class="mask" :style="mask_on ? '': 'display:none'">
        <div class="loader"><p></p></div>
    </div>
</div>
<script src="index.js?r=${rnd}" type="text/javascript" async></script>
<script src="http://www-public.qidizi.com/android-tv-ime/client/media.js?r=${rnd}" type="text/javascript"
        async></script>
</body>
</html>
`);
    document.close();
}();
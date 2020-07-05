+function () {
    // 加载样式表
    let res = document.createElement('LINK');
    res.href = "index.css";
    res.setAttribute('rel', "stylesheet");
    document.getElementsByTagName('HEAD')[0].appendChild(res);
    // 加载html模板
    res = document.createElement('SCRIPT');
    res.src = "html.js";
    res.setAttribute('type', "text/javascript");
    res.onload = function () {
        // 加载vue js
        res = document.createElement('SCRIPT');
        res.src = 'https://cn.vuejs.org/js/vue.js';//"https://cdn.jsdelivr.net/npm/vue";
        res.setAttribute('type', "text/javascript");
        res.onload = new_app;
        document.getElementsByTagName('HEAD')[0].appendChild(res);
    };
    document.getElementsByTagName('HEAD')[0].appendChild(res);
}();

function new_app() {
    window.app = new Vue({
        el: '#app',
        data: {
            toast: '',
            media_url: '',
            text: '',
            media_list: [],
            filter: ''
        },
        mounted() {
            // 加载播放列表
            let res = document.createElement('SCRIPT');
            res.src = "media.js";
            res.setAttribute('type', "text/javascript");
            document.getElementsByTagName('HEAD')[0].appendChild(res);
        },
        methods: {
            set_media_list(str) {
                let tmp = [];
                str.split('\n').forEach(function (v) {
                    v = v.trim();
                    if (!v) return;
                    let url;
                    v = v.replace(/\w+:\/\/.+$/, function ($0) {
                        url = $0;
                        return '';
                    });
                    tmp.push([v.trim(), url]);
                });
                this.media_list = tmp;
            },
            go_to_top() {
                window.scrollTo(0, 0);
            },
            xhr(data, callback) {
                let self = this;
                if (!window.XMLHttpRequest) {
                    this.toast = '浏览器不支持【XMLHttpRequest】';
                    return;
                }

                let done = false;
                let xhr = new window.XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && !done) {
                        done = true;
                        let obj = {
                            code: xhr.status,
                            headers: xhr.getAllResponseHeaders()
                        };
                        try {
                            let json = JSON.parse(xhr.response);

                            if (200 !== json.code) {
                                self.toast = "连接电视端失败:" + json.msg;
                                return;
                            }
                            callback(json, obj);
                        } catch (e) {
                            self.toast = "电视端响应处理失败:" + e;
                        }
                    }
                };
                xhr.onabort = xhr.onerror = function () {
                    if (!done) {
                        done = true;
                        self.toast = "连接电视端失败,错误描述:" + xhr.statusText + '[' + xhr.status + ']';
                    }
                };
                let url = 'http://' + location.host + '/?r=' + +new Date;
                let is_file = data instanceof File;
                xhr.open(is_file ? 'PUT' : "POST", url);
                if (!is_file)
                    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
                xhr.send(is_file ? data : JSON.stringify(data));
            },
            upload() {
                let self = this;
                let file = document.getElementById('file_input').files;

                if (!file.length) {
                    this.toast = '请选择文件';
                    return;
                }

                file = file[0];

                if (!/\.apk$/i.test(file.name)) {
                    this.toast = '只允许上传安卓应用文件';
                    return;
                }

                self.xhr(file, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            },
            send_key(key) {
                let self = this;
                this.xhr({action: 'send_key', key: key}, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            },
            send_text() {
                let self = this;
                this.xhr({action: 'send_text', text: this.text}, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            },
            play_url(url) {
                let self = this;
                this.xhr({action: 'play_url', url: url || this.media_url}, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            }
        }
    });
}

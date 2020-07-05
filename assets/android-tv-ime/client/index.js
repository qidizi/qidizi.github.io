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
    document.getElementsByTagName('HEAD')[0].appendChild(res);
    // 加载vue js
    res = document.createElement('SCRIPT');
    res.src = "vue.js";
    res.setAttribute('type', "text/javascript");
    res.onload = new_app;
    document.getElementsByTagName('HEAD')[0].appendChild(res);
}();

function new_app() {
    let app = new Vue({
        el: '#app',
        data: {
            toast: '',
            media_url: 'http://dpv.videocc.net/e785b2c81c/5/e785b2c81c9e018296671a1287e99615_2.mp4?pid=1593798817820X1508665&a.mp4',
            text: ''
        },
        methods: {
            post(json, callback) {
                let self = this;
                json = JSON.stringify(json);
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
                        self.toast = "连接电视端失败,错误描述:" + xhr.statusText + '['
                        xhr.status + ']';
                    }
                };
                let url = 'http://' + location.host + '/?r=' + +new Date;
                xhr.open('POST', url);
                xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
                xhr.send(json);
            },
            upload() {
                let self = this;
                let file = document.getElementById('file_input').files;

                if (!file.length) {
                    this.toast = '请选择文件';
                    return;
                }

                file = file[0];
                let reader = new FileReader();
                reader.addEventListener("load", function () {
                    self.post({
                        action: 'upload',
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        base64: reader.result
                    }, function (json) {
                        self.toast = json.msg + ' ' + json.time;
                    });
                }, false);
                reader.readAsDataURL(file);
            },
            send_key(key) {
                let self = this;
                this.post({action: 'send_key', key: key}, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            }
            ,
            send_text() {
                let self = this;
                this.post({action: 'send_text', text: this.text}, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            }
            ,
            play_url() {
                let self = this;
                this.post({action: 'play_url', url: this.media_url}, function (json) {
                    self.toast = json.msg + ' ' + json.time;
                });
            }
        }
    });
}

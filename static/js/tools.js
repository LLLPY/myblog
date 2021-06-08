/*获取当前时间*/
function NowTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    month += 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (second < 10) {
        second = '0' + second;
    }
    var week = date.getDay();
    var days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    // return year + '/' + month + '/' + day + '  ' + days[week] + ' ' + hour + ':' + minute + ':' + second;
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

}

//获取指定节点的css样式(浏览器的兼容写法)
function getStyle(node, cssStyle) {
    return node.currentStyle ? node.currentStyle[cssStyle] : getComputedStyle(node)[cssStyle];
}


//随机整数的生成
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//获取随机颜色
function ranColor() {
    return "rgba(" + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + Math.random() + ")";
}


//阻止事件冒泡的浏览器兼容性写法
stopBubble = function (ev) {
    ev.stopPropagation?.() ?? true;
}

//阻止超链接的浏览器兼容写法
function preDef(ev) {
    ev.preventDefault?.() ?? false;
}

//拖拽 传入拖拽对象即可
function drag(node) {
    node.onmousedown = function (ev) {
        var e = ev || window.event;
        var absoluteX = e.clientX - this.offsetLeft; //x方向的相对距离=鼠标距窗口左边的距离-div距窗口左边的距离
        var absoluteY = e.clientY - this.offsetTop; //y方向的相对距离=鼠标距窗口上边的距离-div距窗口上边的距离
        //在mousedown触发的前提下才能触发mousemove,所有mousemove写在mousedown的里面
        //因为这个移动是div相对是窗口的移动,所以
        document.onmousemove = function (ev) {
            var e = ev || window.event;
            node.style.left = e.clientX - absoluteX + 'px';
            node.style.top = e.clientY - absoluteY + 'px';
        }
        document.onmouseup = function () {
            document.onmousemove = null;
        }
    }
}

//限制拖拽(不允许移出边界)
function limlitDrag(node) {
    node.onmousedown = function (ev) {
        var e = ev || window.event;
        var absoluteX = e.clientX - this.offsetLeft; //x方向的相对距离=鼠标距窗口左边的距离-div距窗口左边的距离
        var absoluteY = e.clientY - this.offsetTop; //y方向的相对距离=鼠标距窗口上边的距离-div距窗口上边的距离
        //在mousedown触发的前提下才能触发mousemove,所有mousemove写在mousedown的里面
        //因为这个移动是div相对是窗口的移动,所以
        document.onmousemove = function (ev) {
            var e = ev || window.event;
            var l = e.clientX - absoluteX;
            var t = e.clientY - absoluteY;

            //获取窗口的高度和宽度
            windowwidth = document.documentElement.clientWidth || document.body.clientWidth;
            windowheigh = document.documentElement.clientHeight || document.body.clientHeight;

            if (l <= 0) { //限制出左边界
                l = 0;
            }
            if (l >= windowwidth - node.offsetWidth) { //限制出右边界
                l = windowwidth - node.offsetWidth;
            }
            if (t <= 0) { //限制出上边界
                t = 0;
            }
            if (t >= windowheigh - node.offsetHeight) { //限制出下边界
                t = windowheigh - node.offsetHeight;
            }
            node.style.left = l + 'px';
            node.style.top = t + 'px';
        }
        document.onmouseup = function () {
            document.onmousemove = null;
        }
    }
}


//事件监听的浏览器兼容写法
//增加事件
function AddEventListener(node, eventType, funcName, capture = false) {
    node.addEventListener(eventType, funcName, capture);
}

//删除事件
function RemoveEventListener(node, eventType, funcName) {
    node.removeEventListener?.(eventType, funcName) ?? node.detachEvent('on' + eventType, funcName);
}

//返回去重后的数组
function returnArrBySet(arr) {
    let set = new Set(arr);
    return [...set]
}

//箭头函数的写法(返回去重后的数组)
returnArrBySet2 = arr => [...new Set(arr)]

//检测两个物体是否发生了碰撞
function Crash(node1, node2) {
    var l1 = node1.offsetLeft; //第一个物体的左边框的左边距
    var r1 = node1.offsetLeft + node1.offsetWidth; //右边框的左边距
    var t1 = node1.offsetTop; //上边框的上边距
    var b1 = node1.offsetTop + node1.offsetHeight; //下边框的上边距

    var l2 = node2.offsetLeft;
    var r2 = node2.offsetLeft + node2.offsetWidth; //右边框的左边距
    var t2 = node2.offsetTop; //上边框的上边距
    var b2 = node2.offsetTop + node2.offsetHeight; //下边框的上边距

    return !(r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2);
}



//完美运动函数 同时进行多个运动 cssObj:css样式对象
function perfectMove(node, cssObj, complete = null) {
    clearInterval(node.timer);
    node.timer = setInterval(function () {
        var isEnd = true; //假设所有动画都达到目的值
        for (var attr in cssObj) {
            var iTarget = cssObj[attr];
            var iCur = null;
            if (attr === 'opacity') {
                iCur = parseInt(parseFloat(getStyle(node, 'opacity')) * 100);
            } else {
                iCur = parseInt(getStyle(node, attr));
            }

            var speed = (iTarget - iCur) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (attr === 'opacity') {
                iCur += speed;
                node.style.opacity = iCur / 100;
                node.style.filter = 'alpha(opacity=' + iCur + ')';
            } else {
                node.style[attr] = iCur + speed + 'px';
            }
            if (iCur !== iTarget) {
                isEnd = false;
            }
        }
        if (isEnd) {
            clearInterval(node.timer);
            if (complete) {
                complete.call(node);
            }
        }

    }, 30);

}

//ajax中get请求和post请求的混合函数 success是请求成功时调用的函数 error是请求失败时调用的函数
function $ajax(method, url, data = {}, success = null, error = null) {
    //创建ajax对象
    try {
        var _ajax = new XMLHttpRequest();
    } catch (e) {
        _ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //定义一个返回查询字符集的函数
    function queryString(data) {
        //判断data中是否有数据,如果有转换成查询字符集
        if (data) {
            var args = '';
            for (var key in data) {
                args += key + '=' + data[key] + '&';
            }
            return args.substring(0, args.length - 1); //去掉最后一个&
        }
    }

    args = queryString(data);
    //如果是get请求,将参数和url拼接
    if (method === 'get') {
        url += '?' + args;
    }
    //open()
    _ajax.open(method, url, true);
    if (method === 'get') {
        _ajax.send();
    } else {
        //设置请求头格式(必须设置在send之前)
        _ajax.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        _ajax.send(args);
    }
    _ajax.onreadystatechange = function () {
        if (_ajax.readyState === 4) {
            if (_ajax.status === 200) {
                if (success) { //使用回调函数
                    success(_ajax.responseText);
                }
            } else {
                if (error) {
                    error(_ajax.status);
                }
            }
        }
    }
}

//setCookie
function setCookie(key, value, expires = null, path = null, domain = null, secure = null) {
    var cookieStr = key + '=' + value + ';';
    if (expires) { //设置过期时间
        cookieStr += `expires=${afterNofDate(expires)};`;
    }
    if (path) { //设置限制访问路径
        cookieStr += `path=${path};`;
    }
    if (domain) { //设置显示访问域名
        cookieStr += `domain=${domain};`;
    }
    if (secure) { //设置访问协议
        cookieStr += `secure;`;
    }
    document.cookie = cookieStr;

    //获取n天后的时间
    function afterNofDate(n) {
        var d = new Date();
        var day = d.getDate();
        d.setDate(n + day);
        return d
    }
}

//getCookie
function getCookie(key) {
    var cookieStr = decodeURIComponent(document.cookie);
    var star = cookieStr.indexOf(key + '=');
    if (star === -1) {
        return null
    } else {
        //查询从star位置开始的第一个分号的位置
        var end = cookieStr.indexOf(';', star);
        if (end === -1) {
            end = cookieStr.length;
        }
        var value = cookieStr.substring(star, end);
        return value.replace(key, '').replace('=', '');

    }

}

//removeCookie
function removeCookie(name) {
    document.cookie = encodeURIComponent(name) + '=;expires=' + new Date(0);
}
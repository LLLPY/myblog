(function (factory) {
    if (typeof window.define === 'function') {
        if (window.define.amd) {
            // AMD妯″紡
            window.define('wangEditor', ["jquery"], factory);
        } else if (window.define.cmd) {
            // CMD妯″紡
            window.define(function (require, exports, module) {
                return factory;
            });  
        } else {
            // 鍏ㄥ眬妯″紡
            factory(window.jQuery);
        }
    } else if (typeof module === "object" && typeof module.exports === "object") {
        // commonjs
        module.exports = factory(
            require('./wangEditor-jquery.js')
        );
    } else {
        // 鍏ㄥ眬妯″紡
        factory(window.jQuery);
    }
})(function($){

    // 楠岃瘉鏄惁寮曠敤jquery
    if (!$ || !$.fn || !$.fn.jquery) {
        alert('鍦ㄥ紩鐢╳angEditor.js涔嬪墠锛屽厛寮曠敤jQuery锛屽惁鍒欐棤娉曚娇鐢? wangEditor');
        return;
    }

    // 瀹氫箟鎵╁睍鍑芥暟
    var _e = function (fn) {
        var E = window.wangEditor;
        if (E) {
            // 鎵ц浼犲叆鐨勫嚱鏁?
            fn(E, $);
        }
    };
// 瀹氫箟鏋勯€犲嚱鏁?
(function (window, $) {
    if (window.wangEditor) {
        // 閲嶅寮曠敤
        alert('涓€涓〉闈笉鑳介噸澶嶅紩鐢? wangEditor.js 鎴? wangEditor.min.js 锛侊紒锛?');
        return;
    }

    // 缂栬緫鍣紙鏁翠綋锛夋瀯閫犲嚱鏁?
    var E = function (elemId) {

        // ---------------鑾峰彇鍩烘湰鑺傜偣------------------
        var $elem = $('#' + elemId);
        if ($elem.length !== 1) {
            return;
        }
        var nodeName = $elem[0].nodeName;
        if (nodeName !== 'TEXTAREA' && nodeName !== 'DIV') {
            // 鍙兘鏄? textarea 鍜? div 锛屽叾浠栫被鍨嬬殑鍏冪礌涓嶈
            return;
        }
        this.valueNodeName = nodeName.toLowerCase();
        this.$valueContainer = $elem;

        // 璁板綍 elem 鐨? prev 鍜? parent锛堟渶鍚庢覆鏌? editor 瑕佺敤鍒帮級
        this.$prev = $elem.prev();
        this.$parent = $elem.parent();

        // ------------------鍒濆鍖?------------------
        this.init();
    };

    E.fn = E.prototype;


    E.$body = $('body');
    E.$document = $(document);
    E.$window = $(window);
    E.userAgent = navigator.userAgent;
    E.getComputedStyle = window.getComputedStyle;
    E.w3cRange = typeof document.createRange === 'function';
    E.hostname = location.hostname.toLowerCase();
    E.websiteHost = 'wangeditor.github.io';
    E.isOnWebsite = E.hostname === E.websiteHost;
    E.docsite = 'http://www.kancloud.cn/wangfupeng/wangeditor2/113961';

    // 鏆撮湶缁欏叏灞€瀵硅薄
    window.wangEditor = E;

    // 娉ㄥ唽 plugin 浜嬩欢锛岀敤浜庣敤鎴疯嚜瀹氫箟鎻掍欢
    // 鐢ㄦ埛鍦ㄥ紩鐢? wangEditor.js 涔嬪悗锛岃繕鍙互閫氳繃 E.plugin() 娉ㄥ叆鑷畾涔夊嚱鏁帮紝
    // 璇ュ嚱鏁板皢浼氬湪 editor.create() 鏂规硶鐨勬渶鍚庝竴姝ユ墽琛?
    E.plugin = function (fn) {
        if (!E._plugins) {
            E._plugins = [];
        }

        if (typeof fn === 'function') {
            E._plugins.push(fn);
        }
    };

})(window, $);
// editor 缁戝畾浜嬩欢
_e(function (E, $) {

    E.fn.init = function () {

        // 鍒濆鍖? editor 榛樿閰嶇疆
        this.initDefaultConfig();

        // 澧炲姞container
        this.addEditorContainer();

        // 澧炲姞缂栬緫鍖哄煙
        this.addTxt();

        // 澧炲姞menuContainer
        this.addMenuContainer();

        // 鍒濆鍖栬彍鍗曢泦鍚?
        this.menus = {};

        // 鍒濆鍖朿ommandHooks
        this.commandHooks();

    };

});
// editor api
_e(function (E, $) {

    // 棰勫畾涔? ready 浜嬩欢
    E.fn.ready = function (fn) {

        if (!this.readyFns) {
            this.readyFns = [];
        }

        this.readyFns.push(fn);
    };

    // 澶勭悊ready浜嬩欢
    E.fn.readyHeadler = function () {
        var fns = this.readyFns;

        while (fns.length) {
            fns.shift().call(this);
        }
    };

    // 鏇存柊鍐呭鍒? $valueContainer
    E.fn.updateValue = function () {
        var editor = this;
        var $valueContainer = editor.$valueContainer;
        var $txt = editor.txt.$txt;

        if ($valueContainer === $txt) {
            // 浼犲叆鐢熸垚缂栬緫鍣ㄧ殑div锛屽嵆鏄紪杈戝尯鍩?
            return;
        }

        var value = $txt.html();
        $valueContainer.val(value);
    };

    // 鑾峰彇鍒濆鍖栫殑鍐呭
    E.fn.getInitValue = function () {
        var editor = this;
        var $valueContainer = editor.$valueContainer;
        var currentValue = '';
        var nodeName = editor.valueNodeName;

        if (nodeName === 'div') {
            currentValue = $valueContainer.html();
        } else if (nodeName === 'textarea') {
            currentValue = $valueContainer.val();
        }

        return currentValue;
    };

    // 瑙﹀彂鑿滃崟updatestyle
    E.fn.updateMenuStyle = function () {
        var menus = this.menus;

        $.each(menus, function (k, menu) {
            menu.updateSelected();
        });
    };

    // 闄や簡浼犲叆鐨? menuIds锛屽叾浠栧叏閮ㄥ惎鐢?
    E.fn.enableMenusExcept = function (menuIds) {
        if (this._disabled) {
            // 缂栬緫鍣ㄥ浜庣鐢ㄧ姸鎬侊紝鍒欎笉鎵ц鏀规搷浣?
            return;
        }
        // menuIds鍙傛暟锛氭敮鎸佹暟缁勫拰瀛楃涓?
        menuIds = menuIds || [];
        if (typeof menuIds === 'string') {
            menuIds = [menuIds];
        }

        $.each(this.menus, function (k, menu) {
            if (menuIds.indexOf(k) >= 0) {
                return;
            }
            menu.disabled(false);
        });
    };

    // 闄や簡浼犲叆鐨? menuIds锛屽叾浠栧叏閮ㄧ鐢?
    E.fn.disableMenusExcept = function (menuIds) {
        if (this._disabled) {
            // 缂栬緫鍣ㄥ浜庣鐢ㄧ姸鎬侊紝鍒欎笉鎵ц鏀规搷浣?
            return;
        }
        // menuIds鍙傛暟锛氭敮鎸佹暟缁勫拰瀛楃涓?
        menuIds = menuIds || [];
        if (typeof menuIds === 'string') {
            menuIds = [menuIds];
        }

        $.each(this.menus, function (k, menu) {
            if (menuIds.indexOf(k) >= 0) {
                return;
            }
            menu.disabled(true);
        });
    };

    // 闅愯棌鎵€鏈? dropPanel droplist modal
    E.fn.hideDropPanelAndModal = function () {
        var menus = this.menus;

        $.each(menus, function (k, menu) {
            var m = menu.dropPanel || menu.dropList || menu.modal;
            if (m && m.hide) {
                m.hide();
            }
        });
    };

});
// selection range API
_e(function (E, $) {

    // 鐢ㄥ埌 w3c range 鐨勫嚱鏁帮紝濡傛灉妫€娴嬪埌娴忚鍣ㄤ笉鏀寔 w3c range锛屽垯璧嬪€间负绌哄嚱鏁?
    var ieRange = !E.w3cRange;
    function emptyFn() {}

    // 璁剧疆鎴栬鍙栧綋鍓嶇殑range
    E.fn.currentRange = function (cr){
        if (cr) {
            this._rangeData = cr;
        } else {
            return this._rangeData;
        }
    };

    // 灏嗗綋鍓嶉€夊尯鎶樺彔
    E.fn.collapseRange = function (range, opt) {
        // opt 鍙傛暟璇存槑锛?'start'-鎶樺彔鍒板紑濮?; 'end'-鎶樺彔鍒扮粨鏉?
        opt = opt || 'end';
        opt = opt === 'start' ? true : false;

        range = range || this.currentRange();

        if (range) {
            // 鍚堝苟锛屼繚瀛?
            range.collapse(opt);
            this.currentRange(range);
        }
    };

    // 鑾峰彇閫夊尯鐨勬枃瀛?
    E.fn.getRangeText = ieRange ? emptyFn : function (range) {
        range = range || this.currentRange();
        if (!range) {
            return;
        }
        return range.toString();
    };

    // 鑾峰彇閫夊尯瀵瑰簲鐨凞OM瀵硅薄
    E.fn.getRangeElem = ieRange ? emptyFn : function (range) {
        range = range || this.currentRange();
        var dom = range.commonAncestorContainer;

        if (dom.nodeType === 1) {
            return dom;
        } else {
            return dom.parentNode;
        }
    };

    // 閫夊尯鍐呭鏄惁涓虹┖锛?
    E.fn.isRangeEmpty = ieRange ? emptyFn : function (range) {
        range = range || this.currentRange();

        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true;
                }
            }
        }

        return false;
    };

    // 淇濆瓨閫夊尯鏁版嵁
    E.fn.saveSelection = ieRange ? emptyFn : function (range) {
        var self = this,
            _parentElem,
            selection,
            txt = self.txt.$txt.get(0);

        if (range) {
            _parentElem = range.commonAncestorContainer;
        } else {
            selection = document.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                range = document.getSelection().getRangeAt(0);
                _parentElem = range.commonAncestorContainer;
            }
        }
        // 纭畾鐖跺厓绱犱竴瀹氳鍖呭惈鍦ㄧ紪杈戝櫒鍖哄煙鍐?
        if (_parentElem && ($.contains(txt, _parentElem) || txt === _parentElem) ) {
            // 淇濆瓨閫夋嫨鍖哄煙
            self.currentRange(range);
        }
    };

    // 鎭㈠閫変腑鍖哄煙
    E.fn.restoreSelection = ieRange ? emptyFn : function (range) {
        var selection;

        range = range || this.currentRange();

        if (!range) {
            return;
        }

        // 浣跨敤 try catch 鏉ラ槻姝? IE 鏌愪簺鎯呭喌鎶ラ敊
        try {
            selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (ex) {
            E.error('鎵ц editor.restoreSelection 鏃讹紝IE鍙兘浼氭湁寮傚父锛屼笉褰卞搷浣跨敤');
        }
    };

    // 鏍规嵁elem鎭㈠閫夊尯
    E.fn.restoreSelectionByElem = ieRange ? emptyFn : function (elem, opt) {
        // opt鍙傛暟璇存槑锛?'start'-鎶樺彔鍒板紑濮嬶紝'end'-鎶樺彔鍒扮粨鏉燂紝'all'-鍏ㄩ儴閫変腑
        if (!elem) {
            return;
        }
        opt = opt || 'end'; // 榛樿涓烘姌鍙犲埌缁撴潫

        // 鏍规嵁elem鑾峰彇閫夊尯
        this.setRangeByElem(elem);

        // 鏍规嵁 opt 鎶樺彔閫夊尯
        if (opt === 'start') {
            this.collapseRange(this.currentRange(), 'start');
        }
        if (opt === 'end') {
            this.collapseRange(this.currentRange(), 'end');
        }

        // 鎭㈠閫夊尯
        this.restoreSelection();
    };

    // 鍒濆鍖栭€夊尯
    E.fn.initSelection = ieRange ? emptyFn : function () {
        var editor = this;
        if( editor.currentRange() ){
            //濡傛灉currentRange鏈夊€硷紝鍒欎笉鐢ㄥ啀鍒濆鍖?
            return;
        }

        var range;
        var $txt = editor.txt.$txt;
        var $firstChild = $txt.children().first();

        if ($firstChild.length) {
            editor.restoreSelectionByElem($firstChild.get(0));
        }
    };

    // 鏍规嵁鍏冪礌鍒涘缓閫夊尯
    E.fn.setRangeByElem = ieRange ? emptyFn : function (elem) {
        var editor = this;
        var txtElem = editor.txt.$txt.get(0);
        if (!elem || !$.contains(txtElem, elem)) {
            return;
        }

        // 鎵惧埌elem鐨勭涓€涓? textNode 鍜? 鏈€鍚庝竴涓? textNode
        var firstTextNode = elem.firstChild;
        while (firstTextNode) {
            if (firstTextNode.nodeType === 3) {
                break;
            }
            // 缁х画鍚戜笅
            firstTextNode = firstTextNode.firstChild;
        }
        var lastTextNode = elem.lastChild;
        while (lastTextNode) {
            if (lastTextNode.nodeType === 3) {
                break;
            }
            // 缁х画鍚戜笅
            lastTextNode = lastTextNode.lastChild;
        }

        var range = document.createRange();
        if (firstTextNode && lastTextNode) {
            // 璇存槑 elem 鏈夊唴瀹癸紝鑳藉彇鍒板瓙鍏冪礌
            range.setStart(firstTextNode, 0);
            range.setEnd(lastTextNode, lastTextNode.textContent.length);
        } else {
            // 璇存槑 elem 鏃犲唴瀹?
            range.setStart(elem, 0);
            range.setEnd(elem, 0);
        }

        // 淇濆瓨閫夊尯
        editor.saveSelection(range);
    };

});
// selection range API - IE8鍙婁互涓?
_e(function (E, $) {

    if (E.w3cRange) {
        // 璇存槑鏀寔 W3C 鐨剅ange鏂规硶
        return;
    }

    // -----------------IE8鏃讹紝闇€瑕侀噸鍐欎互涓嬫柟娉?-------------------

    // 鑾峰彇閫夊尯鐨勬枃瀛?
    E.fn.getRangeText = function (range) {
        range = range || this.currentRange();
        if (!range) {
            return;
        }
        return range.text;
    };

    // 鑾峰彇閫夊尯瀵瑰簲鐨凞OM瀵硅薄
    E.fn.getRangeElem = function (range) {
        range = range || this.currentRange();
        if (!range) {
            return;
        }
        var dom = range.parentElement();

        if (dom.nodeType === 1) {
            return dom;
        } else {
            return dom.parentNode;
        }
    };

    // 閫夊尯鍐呭鏄惁涓虹┖锛?
    E.fn.isRangeEmpty = function (range) {
        range = range || this.currentRange();

        if (range && range.text) {
            return false;
        }

        return true;
    };

    // 淇濆瓨閫夊尯鏁版嵁
    E.fn.saveSelection = function (range) {
        var self = this,
            _parentElem,
            selection,
            txt = self.txt.$txt.get(0);

        if (range) {
            _parentElem = range.parentElement();
        } else {
            range = document.selection.createRange();
            if(typeof range.parentElement === 'undefined'){
                //IE6銆?7涓紝insertImage鍚庝細鎵ц姝ゅ
                //鐢变簬鎵句笉鍒皉ange.parentElement锛屾墍浠ュ共鑴嗗皢_parentElem璧嬪€间负null
                _parentElem = null;
            }else{
                _parentElem = range.parentElement();
            }
        }

        // 纭畾鐖跺厓绱犱竴瀹氳鍖呭惈鍦ㄧ紪杈戝櫒鍖哄煙鍐?
        if (_parentElem && ($.contains(txt, _parentElem) || txt === _parentElem) ) {
            // 淇濆瓨閫夋嫨鍖哄煙
            self.currentRange(range);
        }
    };

    // 鎭㈠閫変腑鍖哄煙
    E.fn.restoreSelection = function (currentRange){
        var editor = this,
            selection,
            range;

        currentRange = currentRange || editor.currentRange();
        if(!currentRange){
            return;
        }

        range = document.selection.createRange();
        try {
            // 姝ゅ锛宲lupload涓婁紶涓婁紶鍥剧墖鏃讹紝IE8-浼氭姤涓€涓€庡弬鏁版棤鏁堛€忕殑閿欒
            range.setEndPoint('EndToEnd', currentRange);
        } catch (ex) {

        }

        if(currentRange.text.length === 0){
            try {
                // IE8 鎻掑叆琛ㄦ儏浼氭姤閿?
                range.collapse(false);
            } catch (ex) {

            }

        }else{
            range.setEndPoint('StartToStart', currentRange);
        }
        range.select();
    };

});
// editor command hooks
_e(function (E, $) {

    E.fn.commandHooks = function () {
        var editor = this;
        var commandHooks = {};

        // insertHtml
        commandHooks.insertHtml = function (html) {
            var $elem = $(html);
            var rangeElem = editor.getRangeElem();
            var targetElem;

            targetElem = editor.getLegalTags(rangeElem);
            if (!targetElem) {
                return;
            }

            $(targetElem).after($elem);
        };

        // 淇濆瓨鍒板璞?
        editor.commandHooks = commandHooks;
    };

});
// editor command API
_e(function (E, $) {

    // 鍩烘湰鍛戒护
    E.fn.command = function (e, commandName, commandValue, callback) {
        var editor = this;
        var hooks;

        function commandFn() {
            if (!commandName) {
                return;
            }
            if (editor.queryCommandSupported(commandName)) {
                // 榛樿鍛戒护
                document.execCommand(commandName, false, commandValue);
            } else {
                // hooks 鍛戒护
                hooks = editor.commandHooks;
                if (commandName in hooks) {
                    hooks[commandName](commandValue);
                }
            }
        }

        this.customCommand(e, commandFn, callback);
    };

    // 閽堝涓€涓猠lem瀵硅薄鎵ц鍩虹鍛戒护
    E.fn.commandForElem = function (elemOpt, e, commandName, commandValue, callback) {
        // 鍙栧緱鏌ヨelem鐨勬煡璇㈡潯浠跺拰楠岃瘉鍑芥暟
        var selector;
        var check;
        if (typeof elemOpt === 'string') {
            selector = elemOpt;
        } else {
            selector = elemOpt.selector;
            check = elemOpt.check;
        }

        // 鏌ヨelem
        var rangeElem = this.getRangeElem();
        rangeElem = this.getSelfOrParentByName(rangeElem, selector, check);

        // 鏍规嵁elem璁剧疆range
        if (rangeElem) {
            this.setRangeByElem(rangeElem);
        }

        // 鐒跺悗鎵ц鍩虹鍛戒护
        this.command(e, commandName, commandValue, callback);
    };

    // 鑷畾涔夊懡浠?
    E.fn.customCommand = function (e, commandFn, callback) {
        var editor = this;
        var range = editor.currentRange();

        if (!range) {
            // 鐩墠娌℃湁閫夊尯锛屽垯鏃犳硶鎵ц鍛戒护
            e && e.preventDefault();
            return;
        }
        // 璁板綍鍐呭锛屼互渚挎挙閿€锛堟墽琛屽懡浠や箣鍓嶅氨瑕佽褰曪級
        editor.undoRecord();

        // 鎭㈠閫夊尯锛堟湁 range 鍙傛暟锛?
        this.restoreSelection(range);

        // 鎵ц鍛戒护浜嬩欢
        commandFn.call(editor);

        // 淇濆瓨閫夊尯锛堟棤鍙傛暟锛岃浠庢祻瑙堝櫒鐩存帴鑾峰彇range淇℃伅锛?
        this.saveSelection();
        // 閲嶆柊鎭㈠閫夊尯锛堟棤鍙傛暟锛岃鍙栧緱鍒氬垰浠庢祻瑙堝櫒寰楀埌鐨剅ange淇℃伅锛?
        this.restoreSelection();

        // 鎵ц callback
        if (callback && typeof callback === 'function') {
            callback.call(editor);
        }

        // 鏈€鍚庢彃鍏ョ┖琛?
        editor.txt.insertEmptyP();

        // 鏇存柊鍐呭
        editor.updateValue();

        // 鏇存柊鑿滃崟鏍峰紡
        editor.updateMenuStyle();

        // 闅愯棌 dropPanel dropList modal  璁剧疆 200ms 闂撮殧
        function hidePanelAndModal() {
            editor.hideDropPanelAndModal();
        }
        setTimeout(hidePanelAndModal, 200);

        if (e) {
            e.preventDefault();
        }
    };

    // 灏佽 document.queryCommandValue 鍑芥暟
    // IE8 鐩存帴鎵ц鍋跺皵浼氭姤閿欙紝鍥犳鐩存帴鐢? try catch 灏佽涓€涓?
    E.fn.queryCommandValue = function (commandName) {
        var result = '';
        try {
            result = document.queryCommandValue(commandName);
        } catch (ex) {

        }
        return result;
    };

    // 灏佽 document.queryCommandState 鍑芥暟
    // IE8 鐩存帴鎵ц鍋跺皵浼氭姤閿欙紝鍥犳鐩存帴鐢? try catch 灏佽涓€涓?
    E.fn.queryCommandState = function (commandName) {
        var result = false;
        try {
            result = document.queryCommandState(commandName);
        } catch (ex) {

        }
        return result;
    };

    // 灏佽 document.queryCommandSupported 鍑芥暟
    E.fn.queryCommandSupported = function (commandName) {
        var result = false;
        try {
            result = document.queryCommandSupported(commandName);
        } catch (ex) {

        }
        return result;
    };

});
// dom selector
_e(function (E, $) {

    var matchesSelector;

    // matchesSelector hook
    function _matchesSelectorForIE(selector) {
        var elem = this;
        var $elems = $(selector);
        var result = false;

        // 鐢╦query鏌ユ壘 selector 鎵€鏈夊璞★紝濡傛灉鍏朵腑鏈変竴涓拰浼犲叆 elem 鐩稿悓锛屽垯璇佹槑 elem 绗﹀悎 selector
        $elems.each(function () {
            if (this === elem) {
                result = true;
                return false;
            }
        });

        return result;
    }

    // 浠庡綋鍓嶇殑elem锛屽線涓婂幓鏌ユ壘鍚堟硶鏍囩 濡? p head table blockquote ul ol 绛?
    E.fn.getLegalTags = function (elem) {
        var legalTags = this.config.legalTags;
        if (!legalTags) {
            E.error('閰嶇疆椤逛腑缂哄皯 legalTags 鐨勯厤缃?');
            return;
        }
        return this.getSelfOrParentByName(elem, legalTags);
    };

    // 鏍规嵁鏉′欢锛屾煡璇㈣嚜韬垨鑰呯埗鍏冪礌锛岀鍚堝嵆杩斿洖
    E.fn.getSelfOrParentByName = function (elem, selector, check) {

        if (!elem || !selector) {
            return;
        }

        if (!matchesSelector) {
            // 瀹氫箟 matchesSelector 鍑芥暟
            matchesSelector = elem.webkitMatchesSelector ||
                              elem.mozMatchesSelector ||
                              elem.oMatchesSelector ||
                              elem.matchesSelector;
        }
        if (!matchesSelector) {
            // 濡傛灉娴忚鍣ㄦ湰韬笉鏀寔 matchesSelector 鍒欎娇鐢ㄨ嚜瀹氫箟鐨刪ook
            matchesSelector = _matchesSelectorForIE;
        }

        var txt = this.txt.$txt.get(0);

        while (elem && txt !== elem && $.contains(txt, elem)) {
            if (matchesSelector.call(elem, selector)) {
                // 绗﹀悎 selector 鏌ヨ鏉′欢

                if (!check) {
                    // 娌℃湁 check 楠岃瘉鍑芥暟锛岀洿鎺ヨ繑鍥炲嵆鍙?
                    return elem;
                }

                if (check(elem)) {
                    // 濡傛灉鏈? check 楠岃瘉鍑芥暟锛岃繕闇€ check 鍑芥暟鐨勭‘璁?
                    return elem;
                }
            }

            // 濡傛灉涓婁竴姝ユ病缁忚繃楠岃瘉锛屽垯灏嗚烦杞埌鐖跺厓绱?
            elem = elem.parentNode;
        }

        return;
    };

});
// undo redo
_e(function (E, $) {

    var redoList = [];
    var undoList = [];
    var length = 20;  // 缂撳瓨鐨勬渶澶ч暱搴?

    // 鏁版嵁澶勭悊
    function _handle(editor, data) {
        // var range = data.range;
        // var range2 = range.cloneRange && range.cloneRange();
        var val = data.val;
        var html = editor.txt.$txt.html();

        if(val == null) {
            return;
        }

        if (val === html) {
            return;
        }

        // 淇濆瓨鏁版嵁
        editor.txt.$txt.html(val);
        editor.updateValue();

    }

    // 璁板綍
    E.fn.undoRecord = function () {
        var editor = this;
        var $txt = editor.txt.$txt;
        var val = $txt.html();
        var currentVal = undoList.length ? undoList[0] : '';

        if (val === currentVal) {
            return;
        }

        // 娓呯┖ redolist
        if (redoList.length) {
            redoList = [];
        }

        // 娣诲姞鏁版嵁鍒? undoList
        undoList.unshift({
            range: editor.currentRange(),  // 灏嗗綋鍓嶇殑range涔熻褰曚笅
            val: val
        });

        // 闄愬埗 undoList 闀垮害
        if (undoList.length > length) {
            undoList.pop();
        }
    };

    // undo 鎿嶄綔
    E.fn.undo = function () {
        if (!undoList.length) {
            return;
        }

        // 鍙栧嚭 undolist 绗竴涓€硷紝鍔犲叆 redolist
        var data = undoList.shift();
        redoList.unshift(data);

        // 骞朵慨鏀圭紪杈戝櫒鐨勫唴瀹?
        _handle(this, data);
    };

    // redo 鎿嶄綔
    E.fn.redo = function () {
        if (!redoList.length) {
            return;
        }

        // 鍙栧嚭 redolist 绗竴涓€硷紝鍔犲叆 undolist
        var data = redoList.shift();
        undoList.unshift(data);

        // 骞朵慨鏀圭紪杈戝櫒鐨勫唴瀹?
        _handle(this, data);
    };
});
// 鏆撮湶缁欑敤鎴风殑 API
_e(function (E, $) {

    // 鍒涘缓缂栬緫鍣?
    E.fn.create = function () {
        var editor = this;

        // 鎵ц addMenus 涔嬪墠锛?
        // 1. 鍏佽鐢ㄦ埛淇敼 editor.UI 鑷畾涔夐厤缃甎I
        // 2. 鍏佽鐢ㄦ埛閫氳繃淇敼 editor.menus 鏉ヨ嚜瀹氫箟閰嶇疆鑿滃崟
        // 鍥犳瑕佸湪 create 鏃舵墽琛岋紝鑰屼笉鏄? init
        editor.addMenus();

        // 娓叉煋
        editor.renderMenus();
        editor.renderMenuContainer();
        editor.renderTxt();
        editor.renderEditorContainer();

        // 缁戝畾浜嬩欢
        editor.eventMenus();
        editor.eventMenuContainer();
        editor.eventTxt();

        // 澶勭悊ready浜嬩欢
        editor.readyHeadler();

        // 鍒濆鍖栭€夊尯
        editor.initSelection();

        // 鎵ц鐢ㄦ埛鑷畾涔変簨浠讹紝閫氳繃 E.ready() 娣诲姞
        var _plugins = E._plugins;
        if (_plugins && _plugins.length) {
            $.each(_plugins, function (k, val) {
                val.call(editor);
            });
        }

        // $txt 蹇嵎鏂瑰紡
        editor.$txt = editor.txt.$txt;
    };

    // 绂佺敤缂栬緫鍣?
    E.fn.disable = function () {
        this.txt.$txt.removeAttr('contenteditable');
        this.disableMenusExcept();

        // 鍏堢鐢紝鍐嶈褰曠姸鎬?
        this._disabled = true;
    };
    // 鍚敤缂栬緫鍣?
    E.fn.enable = function () {
        // 鍏堣В闄ょ姸鎬佽褰曪紝鍐嶅惎鐢?
        this._disabled = false;
        this.txt.$txt.attr('contenteditable', 'true');
        this.enableMenusExcept();
    };

    // 閿€姣佺紪杈戝櫒
    E.fn.destroy = function () {
        var self = this;
        var $valueContainer = self.$valueContainer;
        var $editorContainer = self.$editorContainer;
        var valueNodeName = self.valueNodeName;

        if (valueNodeName === 'div') {
            // div 鐢熸垚鐨勭紪杈戝櫒
            $valueContainer.removeAttr('contenteditable');
            $editorContainer.after($valueContainer);
            $editorContainer.hide();
        } else {
            // textarea 鐢熸垚鐨勭紪杈戝櫒
            $valueContainer.show();
            $editorContainer.hide();
        }
    };

    // 鎾ら攢 閿€姣佺紪杈戝櫒
    E.fn.undestroy = function () {
        var self = this;
        var $valueContainer = self.$valueContainer;
        var $editorContainer = self.$editorContainer;
        var $menuContainer = self.menuContainer.$menuContainer;
        var valueNodeName = self.valueNodeName;

        if (valueNodeName === 'div') {
            // div 鐢熸垚鐨勭紪杈戝櫒
            $valueContainer.attr('contenteditable', 'true');
            $menuContainer.after($valueContainer);
            $editorContainer.show();
        } else {
            // textarea 鐢熸垚鐨勭紪杈戝櫒
            $valueContainer.hide();
            $editorContainer.show();
        }
    };

    // 娓呯┖鍐呭鐨勫揩鎹锋柟寮?
    E.fn.clear = function () {
        var editor = this;
        var $txt = editor.txt.$txt;
        $txt.html('<p><br></p>');
        editor.restoreSelectionByElem($txt.find('p').get(0));
    };

});
// menuContainer 鏋勯€犲嚱鏁?
_e(function (E, $) {

    // 瀹氫箟鏋勯€犲嚱鏁?
    var MenuContainer = function (editor) {
        this.editor = editor;
        this.init();
    };

    MenuContainer.fn = MenuContainer.prototype;

    // 鏆撮湶缁? E 鍗? window.wangEditor
    E.MenuContainer = MenuContainer;

});
// MenuContainer.fn bind fn
_e(function (E, $) {

    var MenuContainer = E.MenuContainer;

    // 鍒濆鍖?
    MenuContainer.fn.init = function () {
        var self = this;
        var $menuContainer = $('<div class="wangEditor-menu-container clearfix"></div>');

        self.$menuContainer = $menuContainer;

        // change shadow
        self.changeShadow();
    };

    // 缂栬緫鍖哄煙婊氬姩鏃讹紝澧炲姞shadow
    MenuContainer.fn.changeShadow = function () {
        var $menuContainer = this.$menuContainer;
        var editor = this.editor;
        var $txt = editor.txt.$txt;

        $txt.on('scroll', function () {
            if ($txt.scrollTop() > 10) {
                $menuContainer.addClass('wangEditor-menu-shadow');
            } else {
                $menuContainer.removeClass('wangEditor-menu-shadow');
            }
        });
    };

});
// MenuContainer.fn API
_e(function (E, $) {

    var MenuContainer = E.MenuContainer;

    MenuContainer.fn.render = function () {
        var $menuContainer = this.$menuContainer;
        var $editorContainer = this.editor.$editorContainer;

        $editorContainer.append($menuContainer);
    };

    // 鑾峰彇鑿滃崟鏍忕殑楂樺害
    MenuContainer.fn.height = function () {
        var $menuContainer = this.$menuContainer;
        return $menuContainer.height();
    };

    // 娣诲姞鑿滃崟
    MenuContainer.fn.appendMenu = function (groupIdx, menu) {
        // 鍒ゆ柇鏄惁闇€瑕佹柊澧炰竴涓彍鍗曠粍
        this._addGroup(groupIdx);
        // 澧炲姞鑿滃崟锛堣繑鍥? $menuItem锛?
        return this._addOneMenu(menu);
    };
    MenuContainer.fn._addGroup = function (groupIdx) {
        var $menuContainer = this.$menuContainer;
        var $menuGroup;
        if (!this.$currentGroup || this.currentGroupIdx !== groupIdx) {
            $menuGroup = $('<div class="menu-group clearfix"></div>');
            $menuContainer.append($menuGroup);

            this.$currentGroup = $menuGroup;
            this.currentGroupIdx = groupIdx;
        }
    };
    MenuContainer.fn._addOneMenu = function (menu) {
        var $menuNormal = menu.$domNormal;
        var $menuSelected = menu.$domSelected;

        var $menuGroup = this.$currentGroup;
        var $item = $('<div class="menu-item clearfix"></div>');
        $menuSelected.hide();
        $item.append($menuNormal).append($menuSelected);
        $menuGroup.append($item);

        return $item;
    };

});
// menu 鏋勯€犲嚱鏁?
_e(function (E, $) {

    // 瀹氫箟鏋勯€犲嚱鏁?
    var Menu = function (opt) {
        this.editor = opt.editor;
        this.id = opt.id;
        this.title = opt.title;
        this.$domNormal = opt.$domNormal;
        this.$domSelected = opt.$domSelected || opt.$domNormal;

        // document.execCommand 鐨勫弬鏁?
        this.commandName = opt.commandName;
        this.commandValue = opt.commandValue;
        this.commandNameSelected = opt.commandNameSelected || opt.commandName;
        this.commandValueSelected = opt.commandValueSelected || opt.commandValue;
    };

    Menu.fn = Menu.prototype;

    // 鏆撮湶缁? E 鍗? window.wangEditor
    E.Menu = Menu;
});
// Menu.fn 鍒濆鍖栫粦瀹氱殑浜嬩欢
_e(function (E, $) {

    var Menu = E.Menu;

    // 鍒濆鍖朥I
    Menu.fn.initUI = function () {
        var editor = this.editor;
        var uiConfig = editor.UI.menus;
        var menuId = this.id;
        var menuUI = uiConfig[menuId];

        if (this.$domNormal && this.$domSelected) {
            // 鑷畾涔夌殑鑿滃崟涓紝宸茬粡浼犲叆浜? $dom 鏃犻渶浠庨厤缃枃浠朵腑鏌ユ壘鐢熸垚
            return;
        }

        if (menuUI == null) {
            E.warn('editor.UI閰嶇疆涓紝娌℃湁鑿滃崟 "' + menuId + '" 鐨刄I閰嶇疆锛屽彧鑳藉彇榛樿鍊?');

            // 蹇呴』鍐欐垚 uiConfig['default'];
            // 鍐欐垚 uiConfig.default IE8浼氭姤閿?
            menuUI = uiConfig['default'];
        }

        // 姝ｅ父鐘舵€?
        this.$domNormal = $(menuUI.normal);

        // 閫変腑鐘舵€?
        if (/^\./.test(menuUI.selected)) {
            // 澧炲姞涓€涓牱寮?
            this.$domSelected = this.$domNormal.clone().addClass(menuUI.selected.slice(1));
        } else {
            // 涓€涓柊鐨刣om瀵硅薄
            this.$domSelected = $(menuUI.selected);
        }
    };

});
// Menu.fn API
_e(function (E, $) {

    var Menu = E.Menu;

    // 娓叉煋鑿滃崟
    Menu.fn.render = function (groupIdx) {
        // 娓叉煋UI
        this.initUI();

        var editor = this.editor;
        var menuContainer = editor.menuContainer;
        var $menuItem = menuContainer.appendMenu(groupIdx, this);
        var onRender = this.onRender;

        // 娓叉煋tip
        this._renderTip($menuItem);

        // 鎵ц onRender 鍑芥暟
        if (onRender && typeof onRender === 'function') {
            onRender.call(this);
        }
    };
    Menu.fn._renderTip = function ($menuItem) {
        var self = this;
        var editor = self.editor;
        var title = self.title;
        var $tip = $('<div class="menu-tip"></div>');

        // 璁＄畻 tip 瀹藉害
        var $tempDiv;
        if (!self.tipWidth) {
            // 璁剧疆涓€涓函閫忔槑鐨? p锛坅bsolute;top:-10000px;涓嶄細鏄剧ず鍦ㄥ唴瀹瑰尯鍩燂級
            // 鍐呭璧嬪€间负 title 锛屼负浜嗚绠梩ip瀹藉害
            $tempDiv = $('<p style="opacity:0; filter:Alpha(opacity=0); position:absolute;top:-10000px;">' + title + '</p>');
            // 鍏堟坊鍔犲埌body锛岃绠楀畬鍐? remove
            E.$body.append($tempDiv);
            editor.ready(function () {
                var editor = this;
                var titleWidth = $tempDiv.outerWidth() + 5; // 澶氬嚭 5px 鐨勫啑浣?
                var currentWidth = $tip.outerWidth();
                var currentMarginLeft = parseFloat($tip.css('margin-left'), 10);
                // 璁＄畻瀹岋紝鎷垮埌鏁版嵁锛屽垯寮冪敤
                $tempDiv.remove();
                $tempDiv = null;

                // 閲嶆柊璁剧疆鏍峰紡
                $tip.css({
                    width: titleWidth,
                    'margin-left': currentMarginLeft + (currentWidth - titleWidth)/2
                });

                // 瀛樺偍
                self.tipWidth = titleWidth;
            });
        }

        // $tip.append($triangle);
        $tip.append(title);
        $menuItem.append($tip);

        function show() {
            $tip.show();
        }
        function hide() {
            $tip.hide();
        }

        var timeoutId;
        $menuItem.find('a').on('mouseenter', function (e) {
            if (!self.active() && !self.disabled()) {
                timeoutId = setTimeout(show, 200);
            }
        }).on('mouseleave', function (e) {
            timeoutId && clearTimeout(timeoutId);
            hide();
        }).on('click', hide);
    };

    // 缁戝畾浜嬩欢
    Menu.fn.bindEvent = function () {
        var self = this;

        var $domNormal = self.$domNormal;
        var $domSelected = self.$domSelected;

        // 璇曞浘鑾峰彇璇ヨ彍鍗曞畾涔夌殑浜嬩欢锛堟湭selected锛夛紝娌℃湁鍒欒嚜宸卞畾涔?
        var clickEvent = self.clickEvent;
        if (!clickEvent) {
            clickEvent = function (e) {
                // -----------dropPanel dropList modal-----------
                var dropObj = self.dropPanel || self.dropList || self.modal;
                if (dropObj && dropObj.show) {
                    if (dropObj.isShowing) {
                        dropObj.hide();
                    } else {
                        dropObj.show();
                    }
                    return;
                }

                // -----------command-----------
                var editor = self.editor;
                var commandName;
                var commandValue;

                var selected = self.selected;
                if (selected) {
                    commandName = self.commandNameSelected;
                    commandValue = self.commandValueSelected;
                } else {
                    commandName = self.commandName;
                    commandValue = self.commandValue;
                }

                if (commandName) {
                    // 鎵ц鍛戒护
                    editor.command(e, commandName, commandValue);
                } else {
                    // 鎻愮ず
                    E.warn('鑿滃崟 "' + self.id + '" 鏈畾涔塩lick浜嬩欢');
                    e.preventDefault();
                }
            };
        }
        // 鑾峰彇鑿滃崟瀹氫箟鐨剆elected鎯呭喌涓嬬殑鐐瑰嚮浜嬩欢
        var clickEventSelected = self.clickEventSelected || clickEvent;

        // 灏嗕簨浠剁粦瀹氬埌鑿滃崟dom涓?
        $domNormal.click(function (e) {
            if (!self.disabled()) {
                clickEvent.call(self, e);
                self.updateSelected();
            }
            e.preventDefault();
        });
        $domSelected.click(function (e) {
            if (!self.disabled()) {
                clickEventSelected.call(self, e);
                self.updateSelected();
            }
            e.preventDefault();
        });
    };

    // 鏇存柊閫変腑鐘舵€?
    Menu.fn.updateSelected = function () {
        var self = this;
        var editor = self.editor;

        // 璇曞浘鑾峰彇鐢ㄦ埛鑷畾涔夌殑鍒ゆ柇浜嬩欢
        var updateSelectedEvent = self.updateSelectedEvent;
        if (!updateSelectedEvent) {
            // 鐢ㄦ埛鏈嚜瀹氫箟锛屽垯璁剧疆榛樿鍊?
            updateSelectedEvent = function () {
                var self = this;
                var editor = self.editor;
                var commandName = self.commandName;
                var commandValue = self.commandValue;

                if (commandValue) {
                    if (editor.queryCommandValue(commandName).toLowerCase() === commandValue.toLowerCase()) {
                        return true;
                    }
                } else if (editor.queryCommandState(commandName)) {
                    return true;
                }

                return false;
            };
        }

        // 鑾峰彇缁撴灉
        var result = updateSelectedEvent.call(self);
        result = !!result;

        // 瀛樺偍缁撴灉銆佹樉绀烘晥鏋?
        self.changeSelectedState(result);
    };

    // 鍒囨崲閫変腑鐘舵€併€佹樉绀烘晥鏋?
    Menu.fn.changeSelectedState = function (state) {
        var self = this;
        var selected = self.selected;

        if (state != null && typeof state === 'boolean') {
            if (selected === state) {
                // 璁＄畻缁撴灉鍜屽綋鍓嶇殑鐘舵€佷竴鏍?
                return;
            }
            // 瀛樺偍缁撴灉
            self.selected = state;

            // 鍒囨崲鑿滃崟鐨勬樉绀?
            if (state) {
                // 閫変腑
                self.$domNormal.hide();
                self.$domSelected.show();
            } else {
                // 鏈€変腑
                self.$domNormal.show();
                self.$domSelected.hide();
            }
        } // if
    };

    // 鐐瑰嚮鑿滃崟锛屾樉绀轰簡 dropPanel modal 鏃讹紝鑿滃崟鐨勭姸鎬?
    Menu.fn.active = function (active) {
        if (active == null) {
            return this._activeState;
        }
        this._activeState = active;
    };
    Menu.fn.activeStyle = function (active) {
        var selected = this.selected;
        var $dom = this.$domNormal;
        var $domSelected = this.$domSelected;

        if (active) {
            $dom.addClass('active');
            $domSelected.addClass('active');
        } else {
            $dom.removeClass('active');
            $domSelected.removeClass('active');
        }

        // 璁板綍鐘舵€? 锛? menu hover 鏃朵細鍙栫姸鎬佺敤 锛?
        this.active(active);
    };

    // 鑿滃崟鐨勫惎鐢ㄥ拰绂佺敤
    Menu.fn.disabled = function (opt) {
        // 鍙傛暟涓虹┖锛屽彇鍊?
        if (opt == null) {
            return !!this._disabled;
        }

        if (this._disabled === opt) {
            // 瑕佽缃殑鍙傛暟鍊煎拰褰撳墠鍙傛暟鍙竴鏍凤紝鏃犻渶鍐嶆璁剧疆
            return;
        }

        var $dom = this.$domNormal;
        var $domSelected = this.$domSelected;

        // 璁剧疆鏍峰紡
        if (opt) {
            $dom.addClass('disable');
            $domSelected.addClass('disable');
        } else {
            $dom.removeClass('disable');
            $domSelected.removeClass('disable');
        }

        // 瀛樺偍
        this._disabled = opt;
    };

});
// dropList 鏋勯€犲嚱鏁?
_e(function (E, $) {

    // 瀹氫箟鏋勯€犲嚱鏁?
    var DropList = function (editor, menu, opt) {
        this.editor = editor;
        this.menu = menu;

        // list 鐨勬暟鎹簮锛屾牸寮? {'commandValue': 'title', ...}
        this.data = opt.data;
        // 瑕佷负姣忎釜item鑷畾涔夌殑妯℃澘
        this.tpl = opt.tpl;
        // 涓轰簡鎵ц editor.commandForElem 鑰屼紶鍏ョ殑elem鏌ヨ鏂瑰紡
        this.selectorForELemCommand = opt.selectorForELemCommand;

        // 鍒濆鍖?
        this.init();
    };

    DropList.fn = DropList.prototype;

    // 鏆撮湶缁? E 鍗? window.wangEditor
    E.DropList = DropList;
});
// dropList fn bind
_e(function (E, $) {

    var DropList = E.DropList;

    // init
    DropList.fn.init = function () {
        var self = this;

        // 鐢熸垚dom瀵硅薄
        self.initDOM();

        // 缁戝畾command浜嬩欢
        self.bindEvent();

        // 澹版槑闅愯棌鐨勪簨浠?
        self.initHideEvent();
    };

    // 鍒濆鍖杁om缁撴瀯
    DropList.fn.initDOM = function () {
        var self = this;
        var data = self.data;
        var tpl = self.tpl || '<span>{#title}</span>';
        var $list = $('<div class="wangEditor-drop-list clearfix"></div>');

        var itemContent;
        var $item;
        $.each(data, function (commandValue, title) {
            itemContent = tpl.replace(/{#commandValue}/ig, commandValue).replace(/{#title}/ig, title);
            $item = $('<a href="#" commandValue="' + commandValue + '"></a>');
            $item.append(itemContent);
            $list.append($item);
        });

        self.$list = $list;
    };

    // 缁戝畾浜嬩欢
    DropList.fn.bindEvent = function () {
        var self = this;
        var editor = self.editor;
        var menu = self.menu;
        var commandName = menu.commandName;
        var selectorForELemCommand = self.selectorForELemCommand;
        var $list = self.$list;

        $list.on('click', 'a[commandValue]', function (e) {
            // 鎵ц鍛戒护

            var commandValue = $(e.currentTarget).attr('commandValue');
            if (menu.selected && editor.isRangeEmpty() && selectorForELemCommand) {
                // 褰撳墠澶勪簬閫変腑鐘舵€侊紝骞朵笖閫変腑鍐呭涓虹┖
                editor.commandForElem(selectorForELemCommand, e, commandName, commandValue);
            } else {
                // 褰撳墠鏈浜庨€変腑鐘舵€侊紝鎴栬€呮湁閫変腑鍐呭銆傚垯鎵ц榛樿鍛戒护
                editor.command(e, commandName, commandValue);
            }
        });
    };

    // 鐐瑰嚮鍏朵粬鍦版柟锛岀珛鍗抽殣钘? droplist
    DropList.fn.initHideEvent = function () {
        var self = this;

        // 鑾峰彇 list elem
        var thisList = self.$list.get(0);

        E.$body.on('click', function (e) {
            if (!self.isShowing) {
                return;
            }
            var trigger = e.target;

            // 鑾峰彇鑿滃崟elem
            var menu = self.menu;
            var menuDom;
            if (menu.selected) {
                menuDom = menu.$domSelected.get(0);
            } else {
                menuDom = menu.$domNormal.get(0);
            }

            if (menuDom === trigger || $.contains(menuDom, trigger)) {
                // 璇存槑鐢辨湰鑿滃崟鐐瑰嚮瑙﹀彂鐨?
                return;
            }

            if (thisList === trigger || $.contains(thisList, trigger)) {
                // 璇存槑鐢辨湰list鐐瑰嚮瑙﹀彂鐨?
                return;
            }

            // 鍏朵粬鎯呭喌锛岄殣钘? list
            self.hide();
        });

        E.$window.scroll(function () {
            self.hide();
        });

        E.$window.on('resize', function () {
            self.hide();
        });
    };

});
// dropListfn api
_e(function (E, $) {

    var DropList = E.DropList;

    // 娓叉煋
    DropList.fn._render = function () {
        var self = this;
        var editor = self.editor;
        var $list = self.$list;

        // 娓叉煋鍒伴〉闈?
        editor.$editorContainer.append($list);

        // 璁板綍鐘舵€?
        self.rendered = true;
    };

    // 瀹氫綅
    DropList.fn._position = function () {
        var self = this;
        var $list = self.$list;
        var editor = self.editor;
        var menu = self.menu;
        var $menuContainer = editor.menuContainer.$menuContainer;
        var $menuDom = menu.selected ? menu.$domSelected : menu.$domNormal;
        // 娉ㄦ剰杩欓噷鐨? offsetParent() 瑕佽繑鍥? .menu-item 鐨? position
        // 鍥犱负 .menu-item 鏄? position:relative
        var menuPosition = $menuDom.offsetParent().position();

        // 鍙栧緱 menu 鐨勪綅缃€佸昂瀵稿睘鎬?
        var menuTop = menuPosition.top;
        var menuLeft = menuPosition.left;
        var menuHeight = $menuDom.offsetParent().height();
        var menuWidth = $menuDom.offsetParent().width();

        // 鍙栧緱 list 鐨勫昂瀵稿睘鎬?
        var listWidth = $list.outerWidth();
        // var listHeight = $list.outerHeight();

        // 鍙栧緱 $txt 鐨勫昂瀵?
        var txtWidth = editor.txt.$txt.outerWidth();

        // ------------寮€濮嬭绠?-------------

        // 鍒濇璁＄畻 list 浣嶇疆灞炴€?
        var top = menuTop + menuHeight;
        var left = menuLeft + menuWidth/2;
        var marginLeft = 0 - menuWidth/2;

        // 濡傛灉瓒呭嚭浜嗘湁杈圭晫锛屽垯瑕佸乏绉伙紙涓斿拰鍙充晶鏈夐棿闅欙級
        var valWithTxt = (left + listWidth) - txtWidth;
        if (valWithTxt > -10) {
            marginLeft = marginLeft - valWithTxt - 10;
        }
        // 璁剧疆鏍峰紡
        $list.css({
            top: top,
            left: left,
            'margin-left': marginLeft
        });

        // 濡傛灉鍥犱负鍚戜笅婊氬姩鑰屽鑷磋彍鍗昮ixed锛屽垯鍐嶅姞涓€姝ュ鐞?
        if (editor._isMenufixed) {
            top = top + (($menuContainer.offset().top + $menuContainer.outerHeight()) - $list.offset().top);

            // 閲嶆柊璁剧疆top
            $list.css({
                top: top
            });
        }
    };

    // 鏄剧ず
    DropList.fn.show = function () {
        var self = this;
        var menu = self.menu;
        if (!self.rendered) {
            // 绗竴娆how涔嬪墠锛屽厛娓叉煋
            self._render();
        }

        if (self.isShowing) {
            return;
        }

        var $list = self.$list;
        $list.show();

        // 瀹氫綅
        self._position();

        // 璁板綍鐘舵€?
        self.isShowing = true;

        // 鑿滃崟鐘舵€?
        menu.activeStyle(true);
    };

    // 闅愯棌
    DropList.fn.hide = function () {
        var self = this;
        var menu = self.menu;
        if (!self.isShowing) {
            return;
        }

        var $list = self.$list;
        $list.hide();

        // 璁板綍鐘舵€?
        self.isShowing = false;

        // 鑿滃崟鐘舵€?
        menu.activeStyle(false);
    };
});
// dropPanel 鏋勯€犲嚱鏁?
_e(function (E, $) {

    // 瀹氫箟鏋勯€犲嚱鏁?
    var DropPanel = function (editor, menu, opt) {
        this.editor = editor;
        this.menu = menu;
        this.$content = opt.$content;
        this.width = opt.width || 200;
        this.height = opt.height;
        this.onRender = opt.onRender;

        // init
        this.init();
    };

    DropPanel.fn = DropPanel.prototype;

    // 鏆撮湶缁? E 鍗? window.wangEditor
    E.DropPanel = DropPanel;
});
// dropPanel fn bind
_e(function (E, $) {

    var DropPanel = E.DropPanel;

    // init
    DropPanel.fn.init = function () {
        var self = this;

        // 鐢熸垚dom瀵硅薄
        self.initDOM();

        // 澹版槑闅愯棌鐨勪簨浠?
        self.initHideEvent();
    };

    // init DOM
    DropPanel.fn.initDOM = function () {
        var self = this;
        var $content = self.$content;
        var width = self.width;
        var height = self.height;
        var $panel = $('<div class="wangEditor-drop-panel clearfix"></div>');
        var $triangle = $('<div class="tip-triangle"></div>');

        $panel.css({
            width: width,
            height: height ? height : 'auto'
        });
        $panel.append($triangle);
        $panel.append($content);

        // 娣诲姞瀵硅薄鏁版嵁
        self.$panel = $panel;
        self.$triangle = $triangle;
    };

    // 鐐瑰嚮鍏朵粬鍦版柟锛岀珛鍗抽殣钘? dropPanel
    DropPanel.fn.initHideEvent = function () {
        var self = this;

        // 鑾峰彇 panel elem
        var thisPanle = self.$panel.get(0);

        E.$body.on('click', function (e) {
            if (!self.isShowing) {
                return;
            }
            var trigger = e.target;

            // 鑾峰彇鑿滃崟elem
            var menu = self.menu;
            var menuDom;
            if (menu.selected) {
                menuDom = menu.$domSelected.get(0);
            } else {
                menuDom = menu.$domNormal.get(0);
            }

            if (menuDom === trigger || $.contains(menuDom, trigger)) {
                // 璇存槑鐢辨湰鑿滃崟鐐瑰嚮瑙﹀彂鐨?
                return;
            }

            if (thisPanle === trigger || $.contains(thisPanle, trigger)) {
                // 璇存槑鐢辨湰panel鐐瑰嚮瑙﹀彂鐨?
                return;
            }

            // 鍏朵粬鎯呭喌锛岄殣钘? panel
            self.hide();
        });

        E.$window.scroll(function () {
            self.hide();
        });

        E.$window.on('resize', function () {
            self.hide();
        });
    };

});
// dropPanel fn api
_e(function (E, $) {

    var DropPanel = E.DropPanel;

    // 娓叉煋
    DropPanel.fn._render = function () {
        var self = this;
        var onRender = self.onRender;
        var editor = self.editor;
        var $panel = self.$panel;

        // 娓叉煋鍒伴〉闈?
        editor.$editorContainer.append($panel);

        // 娓叉煋鍚庣殑鍥炶皟浜嬩欢
        onRender && onRender.call(self);

        // 璁板綍鐘舵€?
        self.rendered = true;
    };

    // 瀹氫綅
    DropPanel.fn._position = function () {
        var self = this;
        var $panel = self.$panel;
        var $triangle = self.$triangle;
        var editor = self.editor;
        var $menuContainer = editor.menuContainer.$menuContainer;
        var menu = self.menu;
        var $menuDom = menu.selected ? menu.$domSelected : menu.$domNormal;
        // 娉ㄦ剰杩欓噷鐨? offsetParent() 瑕佽繑鍥? .menu-item 鐨? position
        // 鍥犱负 .menu-item 鏄? position:relative
        var menuPosition = $menuDom.offsetParent().position();

        // 鍙栧緱 menu 鐨勪綅缃€佸昂瀵稿睘鎬?
        var menuTop = menuPosition.top;
        var menuLeft = menuPosition.left;
        var menuHeight = $menuDom.offsetParent().height();
        var menuWidth = $menuDom.offsetParent().width();

        // 鍙栧緱 panel 鐨勫昂瀵稿睘鎬?
        var panelWidth = $panel.outerWidth();
        // var panelHeight = $panel.outerHeight();

        // 鍙栧緱 $txt 鐨勫昂瀵?
        var txtWidth = editor.txt.$txt.outerWidth();

        // ------------寮€濮嬭绠?-------------

        // 鍒濇璁＄畻 panel 浣嶇疆灞炴€?
        var top = menuTop + menuHeight;
        var left = menuLeft + menuWidth/2;
        var marginLeft = 0 - panelWidth/2;
        var marginLeft2 = marginLeft;  // 涓嬫枃鐢ㄤ簬鍜? marginLeft 姣旇緝锛屾潵璁剧疆涓夎褰ip鐨勪綅缃?

        // 濡傛灉瓒呭嚭浜嗗乏杈圭晫锛屽垯绉诲姩鍥炴潵锛堣鍜屽乏渚ф湁10px闂撮殭锛?
        if ((0 - marginLeft) > (left - 10)) {
            marginLeft = 0 - (left - 10);
        }

        // 濡傛灉瓒呭嚭浜嗘湁杈圭晫锛屽垯瑕佸乏绉伙紙涓斿拰鍙充晶鏈?10px闂撮殭锛?
        var valWithTxt = (left + panelWidth + marginLeft) - txtWidth;
        if (valWithTxt > -10) {
            marginLeft = marginLeft - valWithTxt - 10;
        }

        // 璁剧疆鏍峰紡
        $panel.css({
            top: top,
            left: left,
            'margin-left': marginLeft
        });

        // 濡傛灉鍥犱负鍚戜笅婊氬姩鑰屽鑷磋彍鍗昮ixed锛屽垯鍐嶅姞涓€姝ュ鐞?
        if (editor._isMenufixed) {
            top = top + (($menuContainer.offset().top + $menuContainer.outerHeight()) - $panel.offset().top);

            // 閲嶆柊璁剧疆top
            $panel.css({
                top: top
            });
        }

        // 璁剧疆涓夎褰? tip 鐨勪綅缃?
        $triangle.css({
            'margin-left': marginLeft2 - marginLeft - 5
        });
    };

    // focus 绗竴涓? input
    DropPanel.fn.focusFirstInput = function () {
        var self = this;
        var $panel = self.$panel;
        $panel.find('input[type=text],textarea').each(function () {
            var $input = $(this);
            if ($input.attr('disabled') == null) {
                $input.focus();
                return false;
            }
        });
    };

    // 鏄剧ず
    DropPanel.fn.show = function () {
        var self = this;
        var menu = self.menu;
        if (!self.rendered) {
            // 绗竴娆how涔嬪墠锛屽厛娓叉煋
            self._render();
        }

        if (self.isShowing) {
            return;
        }

        var $panel = self.$panel;
        $panel.show();

        // 瀹氫綅
        self._position();

        // 璁板綍鐘舵€?
        self.isShowing = true;

        // 鑿滃崟鐘舵€?
        menu.activeStyle(true);

        if (E.w3cRange) {
            // 楂樼骇娴忚鍣?
            self.focusFirstInput();
        } else {
            // 鍏煎 IE8 input placeholder
            E.placeholderForIE8($panel);
        }
    };

    // 闅愯棌
    DropPanel.fn.hide = function () {
        var self = this;
        var menu = self.menu;
        if (!self.isShowing) {
            return;
        }

        var $panel = self.$panel;
        $panel.hide();

        // 璁板綍鐘舵€?
        self.isShowing = false;

        // 鑿滃崟鐘舵€?
        menu.activeStyle(false);
    };

});
// modal 鏋勯€犲嚱鏁?
_e(function (E, $) {

    // 瀹氫箟鏋勯€犲嚱鏁?
    var Modal = function (editor, menu, opt) {
        this.editor = editor;
        this.menu = menu;
        this.$content = opt.$content;

        this.init();
    };

    Modal.fn = Modal.prototype;

    // 鏆撮湶缁? E 鍗? window.wangEditor
    E.Modal = Modal;
});
// modal fn bind
_e(function (E, $) {

    var Modal = E.Modal;

    Modal.fn.init = function () {
        var self = this;

        // 鍒濆鍖杁om
        self.initDom();

        // 鍒濆鍖栭殣钘忎簨浠?
        self.initHideEvent();
    };

    // 鍒濆鍖杁om
    Modal.fn.initDom = function () {
        var self = this;
        var $content = self.$content;
        var $modal = $('<div class="wangEditor-modal"></div>');
        var $close = $('<div class="wangEditor-modal-close"><i class="wangeditor-menu-img-cancel-circle"></i></div>');

        $modal.append($close);
        $modal.append($content);

        // 璁板綍鏁版嵁
        self.$modal = $modal;
        self.$close = $close;
    };

    // 鍒濆鍖栭殣钘忎簨浠?
    Modal.fn.initHideEvent = function () {
        var self = this;
        var $close = self.$close;
        var modal = self.$modal.get(0);

        // 鐐瑰嚮 $close 鎸夐挳锛岄殣钘?
        $close.click(function () {
            self.hide();
        });

        // 鐐瑰嚮鍏朵粬閮ㄥ垎锛岄殣钘?
        E.$body.on('click', function (e) {
            if (!self.isShowing) {
                return;
            }
            var trigger = e.target;

            // 鑾峰彇鑿滃崟elem
            var menu = self.menu;
            var menuDom;
            if (menu) {
                if (menu.selected) {
                    menuDom = menu.$domSelected.get(0);
                } else {
                    menuDom = menu.$domNormal.get(0);
                }

                if (menuDom === trigger || $.contains(menuDom, trigger)) {
                    // 璇存槑鐢辨湰鑿滃崟鐐瑰嚮瑙﹀彂鐨?
                    return;
                }
            }

            if (modal === trigger || $.contains(modal, trigger)) {
                // 璇存槑鐢辨湰panel鐐瑰嚮瑙﹀彂鐨?
                return;
            }

            // 鍏朵粬鎯呭喌锛岄殣钘? panel
            self.hide();
        });
    };
});
// modal fn api
_e(function (E, $) {

    var Modal = E.Modal;

    // 娓叉煋
    Modal.fn._render = function () {
        var self = this;
        var editor = self.editor;
        var $modal = self.$modal;

        // $modal鐨剒-index锛屽湪閰嶇疆鐨剒-index鍩虹涓婂啀 +10
        $modal.css('z-index', editor.config.zindex + 10 + '');

        // 娓叉煋鍒癰ody鏈€鍚庨潰
        E.$body.append($modal);

        // 璁板綍鐘舵€?
        self.rendered = true;
    };

    // 瀹氫綅
    Modal.fn._position = function () {
        var self = this;
        var $modal = self.$modal;
        var top = $modal.offset().top;
        var width = $modal.outerWidth();
        var height = $modal.outerHeight();
        var marginLeft = 0 - (width / 2);
        var marginTop = 0 - (height / 2);

        // 淇濊瘉modal鏈€椤堕儴锛屼笉瓒呰繃娴忚鍣ㄤ笂杈规
        if ((height / 2) > top) {
            marginTop = 0 - top;
        }

        $modal.css({
            'margin-left': marginLeft + 'px',
            'margin-top': marginTop + 'px'
        });
    };

    // 鏄剧ず
    Modal.fn.show = function () {
        var self = this;
        var menu = self.menu;
        if (!self.rendered) {
            // 绗竴娆how涔嬪墠锛屽厛娓叉煋
            self._render();
        }

        if (self.isShowing) {
            return;
        }
        // 璁板綍鐘舵€?
        self.isShowing = true;

        var $modal = self.$modal;
        $modal.show();

        // 瀹氫綅
        self._position();

        // 婵€娲昏彍鍗曠姸鎬?
        menu && menu.activeStyle(true);
    };

    // 闅愯棌
    Modal.fn.hide = function () {
        var self = this;
        var menu = self.menu;
        if (!self.isShowing) {
            return;
        }
        // 璁板綍鐘舵€?
        self.isShowing = false;

        // 闅愯棌
        var $modal = self.$modal;
        $modal.hide();

        // 鑿滃崟鐘舵€?
        menu && menu.activeStyle(false);
    };
});
// txt 鏋勯€犲嚱鏁?
_e(function (E, $) {

    // 瀹氫箟鏋勯€犲嚱鏁?
    var Txt = function (editor) {
        this.editor = editor;

        // 鍒濆鍖?
        this.init();
    };

    Txt.fn = Txt.prototype;

    // 鏆撮湶缁? E 鍗? window.wangEditor
    E.Txt = Txt;
});
// Txt.fn bind fn
_e(function (E, $) {

    var Txt = E.Txt;

    // 鍒濆鍖?
    Txt.fn.init = function () {
        var self = this;
        var editor = self.editor;
        var $valueContainer = editor.$valueContainer;
        var currentValue = editor.getInitValue();
        var $txt;

        if ($valueContainer.get(0).nodeName === 'DIV') {
            // 濡傛灉浼犲叆鐢熸垚缂栬緫鍣ㄧ殑鍏冪礌灏辨槸div锛屽垯鐩存帴浣跨敤
            $txt = $valueContainer;
            $txt.addClass("wangEditor-txt");
            $txt.attr('contentEditable', 'true');
        } else {
            // 濡傛灉涓嶆槸div锛堟槸textarea锛夛紝鍒欏垱寤轰竴涓猟iv
            $txt = $(
                '<div class="wangEditor-txt" contentEditable="true">' +
                    currentValue +
                '</div>'
            );
        }

        // 璇曞浘鏈€鍚庢彃鍏ヤ竴涓┖琛岋紝ready涔嬪悗鎵嶈
        editor.ready(function () {
            self.insertEmptyP();
        });

        self.$txt = $txt;

        // 鍒犻櫎鏃讹紝濡傛灉娌℃湁鍐呭浜嗭紝灏辨坊鍔犱竴涓? <p><br></p>
        self.contentEmptyHandle();

        // enter鏃讹紝涓嶈兘浣跨敤 div 鎹㈣
        self.bindEnterForDiv();

        // tab 鎻掑叆4涓┖鏍?
        self.bindTabEvent();

        // 澶勭悊绮樿创鍐呭
        self.bindPasteFilter();

        // $txt.formatText() 鏂规硶
        self.bindFormatText();

        // 瀹氫箟 $txt.html() 鏂规硶
        self.bindHtml();
    };

    // 鍒犻櫎鏃讹紝濡傛灉娌℃湁鍐呭浜嗭紝灏辨坊鍔犱竴涓? <p><br></p>
    Txt.fn.contentEmptyHandle = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;
        var $p;

        $txt.on('keyup', function (e) {
            if (e.keyCode !== 8) {
                return;
            }
            var txtHtml = $.trim($txt.html());
            // ff鏃剁敤 txtHtml === '<br>' 鍒ゆ柇锛屽叾浠栫敤 !txtHtml 鍒ゆ柇
            if (!txtHtml || txtHtml === '<br>') {
                // 鍐呭绌轰簡
                $p = $('<p><br/></p>');
                $txt.html(''); // 涓€瀹氳鍏堟竻绌猴紝鍚﹀垯鍦? ff 涓嬫湁闂
                $txt.append($p);
                editor.restoreSelectionByElem($p.get(0));
            }
        });
    };

    // enter鏃讹紝涓嶈兘浣跨敤 div 鎹㈣
    Txt.fn.bindEnterForDiv = function () {
        var tags = E.config.legalTags; // 閰嶇疆涓紪杈戝櫒瑕佹眰鐨勫悎娉曟爣绛撅紝濡? p head table blockquote ul ol 绛?
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;

        var $keydownDivElem;
        function divHandler() {
            if (!$keydownDivElem) {
                return;
            }

            var $pElem = $('<p>' + $keydownDivElem.html() + '</p>');
            $keydownDivElem.after($pElem);
            $keydownDivElem.remove();
        }

        $txt.on('keydown keyup', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            // 鏌ユ壘鍚堟硶鏍囩
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getLegalTags(rangeElem);
            var $targetElem;
            var $pElem;

            if (!targetElem) {
                // 娌℃壘鍒板悎娉曟爣绛撅紝灏卞幓鏌ユ壘 div
                targetElem = editor.getSelfOrParentByName(rangeElem, 'div');
                if (!targetElem) {
                    return;
                }
                $targetElem = $(targetElem);

                if (e.type === 'keydown') {
                    // 寮傛鎵ц锛堝悓姝ユ墽琛屼細鍑虹幇闂锛?
                    $keydownDivElem = $targetElem;
                    setTimeout(divHandler, 0);
                }

                if (e.type === 'keyup') {
                    // 灏? div 鐨勫唴瀹圭Щ鍔ㄥ埌 p 閲岄潰锛屽苟绉婚櫎 div
                    $pElem = $('<p>' + $targetElem.html() + '</p>');
                    $targetElem.after($pElem);
                    $targetElem.remove();

                    // 濡傛灉鏄洖杞︾粨鏉燂紝灏嗛€夊尯瀹氫綅鍒拌棣?
                    editor.restoreSelectionByElem($pElem.get(0), 'start');
                }
            }
        });
    };

    // tab 鏃讹紝鎻掑叆4涓┖鏍?
    Txt.fn.bindTabEvent = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;

        $txt.on('keydown', function (e) {
            if (e.keyCode !== 9) {
                // 鍙洃鍚? tab 鎸夐挳
                return;
            }
            // 濡傛灉娴忚鍣ㄦ敮鎸? insertHtml 鍒欐彃鍏?4涓┖鏍笺€傚鏋滀笉鏀寔锛屽氨涓嶇浜?
            if (editor.queryCommandSupported('insertHtml')) {
                editor.command(e, 'insertHtml', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });
    };

    // 澶勭悊绮樿创鍐呭
    Txt.fn.bindPasteFilter = function () {
        var self = this;
        var editor = self.editor;
        var resultHtml = '';  //瀛樺偍鏈€缁堢殑缁撴灉
        var $txt = self.$txt;
        var legalTags = editor.config.legalTags;
        var legalTagArr = legalTags.split(',');

        $txt.on('paste', function (e) {
            if (!editor.config.pasteFilter) {
                // 閰嶇疆涓彇娑堜簡绮樿创杩囨护
                return;
            }

            var currentNodeName = editor.getRangeElem().nodeName;
            if (currentNodeName === 'TD' || currentNodeName === 'TH') {
                // 鍦ㄨ〃鏍肩殑鍗曞厓鏍间腑绮樿创锛屽拷鐣ユ墍鏈夊唴瀹广€傚惁鍒欎細鍑虹幇寮傚父鎯呭喌
                return;
            }

            resultHtml = ''; // 鍏堟竻绌? resultHtml

            var pasteHtml, $paste;
            var data = e.clipboardData || e.originalEvent.clipboardData;

            if (data && data.getData) {
                // w3c

                // 鑾峰彇绮樿创杩囨潵鐨刪tml
                pasteHtml = data.getData('text/html');
                if (pasteHtml) {
                    // 鍒涘缓dom
                    $paste = $('<div>' + pasteHtml + '</div>');
                    // 澶勭悊锛屽苟灏嗙粨鏋滃瓨鍌ㄥ埌 resultHtml 銆庡叏灞€銆忓彉閲?
                    handle($paste.get(0));
                } else {
                    // 寰椾笉鍒癶tml锛岃瘯鍥捐幏鍙杢ext
                    pasteHtml = data.getData('text/plain');
                    if (pasteHtml) {
                        // 鏇挎崲鐗规畩瀛楃
                        pasteHtml = pasteHtml.replace(/[ ]/g, '&nbsp;')
                                             .replace(/</g, '&lt;')
                                             .replace(/>/g, '&gt;')
                                             .replace(/\n/g, '</p><p>');
                        // 鎷兼帴
                        resultHtml = '<p>' + pasteHtml + '</p>';

                        // 鏌ヨ閾炬帴
                        resultHtml = resultHtml.replace(/<p>(https?:\/\/.*?)<\/p>/ig, function (match, link) {
                            return '<p><a href="' + link + '" target="_blank">' + link + '</p>';
                        });
                    }
                }

            } else if (window.clipboardData && window.clipboardData.getData) {
                // IE 鐩存帴浠庡壀鍒囨澘涓彇鍑虹函鏂囨湰鏍煎紡
                resultHtml = window.clipboardData.getData('text');
                if (!resultHtml) {
                    return;
                }
                // 鎷兼帴涓? <p> 鏍囩
                resultHtml = '<p>' + resultHtml + '</p>';
                resultHtml = resultHtml.replace((new RegExp('\n', 'g'), '</p><p>'));
            } else {
                // 鍏朵粬鎯呭喌
                return;
            }

            // 鎵ц鍛戒护
            if (resultHtml) {
                editor.command(e, 'insertHtml', resultHtml);
            }
        });

        // 澶勭悊绮樿创鐨勫唴瀹?
        function handle(elem) {
            if (!elem || !elem.nodeType || !elem.nodeName) {
                return;
            }
            var $elem;
            var nodeName = elem.nodeName.toLowerCase();
            var nodeType = elem.nodeType;

            // 鍙鐞嗘枃鏈拰鏅€歯ode鏍囩
            if (nodeType !== 3 && nodeType !== 1) {
                return;
            }

            // 濡傛灉鏄鍣紝鍒欑户缁繁搴﹂亶鍘?
            if (nodeName === 'div') {
                $elem = $(elem);
                $elem.children().each(function () {
                    handle(this);
                });
                return;
            }

            if (legalTagArr.indexOf(nodeName) >= 0) {
                // 濡傛灉鏄悎娉曟爣绛句箣鍐呯殑锛屽垯鏍规嵁鍏冪礌绫诲瀷锛岃幏鍙栧€?
                resultHtml += getResult(elem);
            } else if (nodeType === 3) {
                // 濡傛灉鏄枃鏈紝鍒欑洿鎺ユ彃鍏? p 鏍囩
                resultHtml += '<p>' + elem.textContent + '</p>';
            } else {
                // 蹇界暐鐨勬爣绛?
                if (['meta', 'style', 'script', 'object', 'form', 'iframe'].indexOf(nodeName) >= 0) {
                    return;
                }
                // 鍏朵粬鏍囩锛岀Щ闄ゅ睘鎬э紝鎻掑叆 p 鏍囩
                $elem = $(removeAttrs(elem));
                resultHtml += $('<div>').append($elem).html();
            }
        }

        // 鑾峰彇鍏冪礌鐨勭粨鏋?
        function getResult(elem) {
            var nodeName = elem.nodeName.toLowerCase();
            var $elem;
            var htmlForP = '';
            var htmlForLi = '';

            if (['blockquote'].indexOf(nodeName) >= 0) {

                // 鐩存帴鍙栧嚭鍏冪礌text鍗冲彲
                $elem = $(elem);
                return '<' + nodeName + '>' + $elem.text() + '</' + nodeName + '>';

            } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5'].indexOf(nodeName) >= 0) {

                //p head 鍙栧嚭 text 鍜岄摼鎺?
                elem = removeAttrs(elem);
                $elem = $(elem);
                htmlForP = $elem.html();

                // 鍓旈櫎 a img 涔嬪鐨勫厓绱?
                htmlForP = htmlForP.replace(/<.*?>/ig, function (tag) {
                    if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
                        return tag;
                    } else {
                        return '';
                    }
                });

                return '<' + nodeName + '>' + htmlForP + '</' + nodeName + '>';

            } else if (['ul', 'ol'].indexOf(nodeName) >= 0) {

                // ul ol鍏冪礌锛岃幏鍙栧瓙鍏冪礌锛坙i鍏冪礌锛夌殑text link img锛屽啀鎷兼帴
                $elem = $(elem);
                $elem.children().each(function () {
                    var $li = $(removeAttrs(this));
                    var html = $li.html();

                    html = html.replace(/<.*?>/ig, function (tag) {
                        if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
                            return tag;
                        } else {
                            return '';
                        }
                    });

                    htmlForLi += '<li>' + html + '</li>';
                });
                return '<' + nodeName + '>' + htmlForLi + '</' + nodeName + '>';

            } else {

                // 鍏朵粬鍏冪礌锛岀Щ闄ゅ厓绱犲睘鎬?
                $elem = $(removeAttrs(elem));
                return $('<div>').append($elem).html();
            }
        }

        // 绉婚櫎涓€涓厓绱狅紙瀛愬厓绱狅級鐨刟ttr
        function removeAttrs(elem) {
            var attrs = elem.attributes || [];
            var attrNames = [];
            var exception = ['href', 'target', 'src', 'alt', 'rowspan', 'colspan']; //渚嬪鎯呭喌

            // 鍏堝瓨鍌ㄤ笅elem涓墍鏈? attr 鐨勫悕绉?
            $.each(attrs, function (key, attr) {
                if (attr && attr.nodeType === 2) {
                    attrNames.push(attr.nodeName);
                }
            });
            // 鍐嶆牴鎹悕绉板垹闄ゆ墍鏈塧ttr
            $.each(attrNames, function (key, attr) {
                if (exception.indexOf(attr) < 0) {
                    // 闄や簡 exception 瑙勫畾鐨勪緥澶栨儏鍐碉紝鍒犻櫎鍏朵粬灞炴€?
                    elem.removeAttribute(attr);
                }
            });


            // 閫掑綊瀛愯妭鐐?
            var children = elem.childNodes;
            if (children.length) {
                $.each(children, function (key, value) {
                    removeAttrs(value);
                });
            }

            return elem;
        }
    };

    // 缁戝畾 $txt.formatText() 鏂规硶
    Txt.fn.bindFormatText = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;
        var legalTags = E.config.legalTags;
        var legalTagArr = legalTags.split(',');
        var length = legalTagArr.length;
        var regArr = [];

        // 灏? E.config.legalTags 閰嶇疆鐨勬湁鏁堝瓧绗︼紝鐢熸垚姝ｅ垯琛ㄨ揪寮?
        $.each(legalTagArr, function (k, tag) {
            var reg = '\>\\s*\<(' + tag + ')\>';
            regArr.push(new RegExp(reg, 'ig'));
        });

        // 澧炲姞 li
        regArr.push(new RegExp('\>\\s*\<(li)\>', 'ig'));

        // 澧炲姞 tr
        regArr.push(new RegExp('\>\\s*\<(tr)\>', 'ig'));

        // 澧炲姞 code
        regArr.push(new RegExp('\>\\s*\<(code)\>', 'ig'));

        // 鐢熸垚 formatText 鏂规硶
        $txt.formatText = function () {
            var $temp = $('<div>');
            var html = $txt.html();

            // 鍘婚櫎绌烘牸
            html = html.replace(/\s*</ig, '<');

            // 娈佃惤銆佽〃鏍间箣闂存崲琛?
            $.each(regArr, function (k, reg) {
                if (!reg.test(html)) {
                    return;
                }
                html = html.replace(reg, function (matchStr, tag) {
                    return '>\n<' + tag + '>';
                });
            });

            $temp.html(html);
            return $temp.text();
        };
    };

    // 瀹氬埗 $txt.html 鏂规硶
    Txt.fn.bindHtml = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;
        var $valueContainer = editor.$valueContainer;
        var valueNodeName = editor.valueNodeName;

        $txt.html = function (html) {
            var result;

            if (valueNodeName === 'div') {
                // div 鐢熸垚鐨勭紪杈戝櫒锛屽彇鍊笺€佽祴鍊硷紝閮界洿鎺ヨЕ鍙慾query鐨刪tml鏂规硶
                result = $.fn.html.call($txt, html);
            }

            // textarea 鐢熸垚鐨勭紪杈戝櫒锛屽垯闇€瑕佽€冭檻璧嬪€兼椂锛屼篃缁檛extarea璧嬪€?

            if (html === undefined) {
                // 鍙栧€硷紝鐩存帴瑙﹀彂jquery鍘熺敓html鏂规硶
                result = $.fn.html.call($txt);
            } else {
                // 璧嬪€硷紝闇€瑕佸悓鏃剁粰 textarea 璧嬪€?
                result = $.fn.html.call($txt, html);
                $valueContainer.val(html);
            }

            if (html === undefined) {
                return result;
            }
        };
    };
});
// Txt.fn api
_e(function (E, $) {

    var Txt = E.Txt;

    var txtChangeEventNames = 'propertychange change click keyup input paste';

    // 娓叉煋
    Txt.fn.render = function () {
        var $txt = this.$txt;
        var $editorContainer = this.editor.$editorContainer;
        $editorContainer.append($txt);
    };

    // 璁＄畻楂樺害
    Txt.fn.initHeight = function () {
        var editor = this.editor;
        var $txt = this.$txt;
        var valueContainerHeight = editor.$valueContainer.height();
        var menuHeight = editor.menuContainer.height();
        var txtHeight = valueContainerHeight - menuHeight;

        // 闄愬埗鏈€灏忎负 50px
        txtHeight = txtHeight < 50 ? 50 : txtHeight;

        $txt.height(txtHeight);

        // 璁板綍鍘熷楂樺害
        editor.valueContainerHeight = valueContainerHeight;

        // 璁剧疆 max-height
        this.initMaxHeight(txtHeight, menuHeight);
    };

    // 璁＄畻鏈€澶ч珮搴?
    Txt.fn.initMaxHeight = function (txtHeight, menuHeight) {
        var editor = this.editor;
        var $menuContainer = editor.menuContainer.$menuContainer;
        var $txt = this.$txt;
        var $wrap = $('<div>');

        // 闇€瑕佹祻瑙堝櫒鏀寔 max-height锛屽惁鍒欎笉绠?
        if (window.getComputedStyle && 'max-height'in window.getComputedStyle($txt.get(0))) {
            // 鑾峰彇 max-height 骞跺垽鏂槸鍚︽湁鍊?
            var maxHeight = parseInt(editor.$valueContainer.css('max-height'));
            if (isNaN(maxHeight)) {
                return;
            }

            // 鏍囪
            editor.useMaxHeight = true;

            // 璁剧疆maxheight
            $wrap.css({
                'max-height': (maxHeight - menuHeight) + 'px',
                'overflow-y': 'auto'
            });
            $txt.css({
                'height': 'auto',
                'overflow-y': 'visible',
                'min-height': txtHeight + 'px'
            });

            // 婊氬姩寮忥紝鑿滃崟闃村奖
            $wrap.on('scroll', function () {
                if ($txt.parent().scrollTop() > 10) {
                    $menuContainer.addClass('wangEditor-menu-shadow');
                } else {
                    $menuContainer.removeClass('wangEditor-menu-shadow');
                }
            });

            // 闇€鍦ㄧ紪杈戝櫒鍖哄煙澶栭潰鍐嶅寘瑁逛竴灞?
            $txt.wrap($wrap);
        }
    };

    // 淇濆瓨閫夊尯
    Txt.fn.saveSelectionEvent = function () {
        var $txt = this.$txt;
        var editor = this.editor;
        var timeoutId;
        var dt = Date.now();

        function save() {
            editor.saveSelection();
        }

        // 鍚屾淇濆瓨閫夊尯
        function saveSync() {
            // 100ms涔嬪唴锛屼笉閲嶅淇濆瓨
            if (Date.now() - dt < 100) {
                return;
            }

            dt = Date.now();
            save();
        }

        // 寮傛淇濆瓨閫夊尯
        function saveAync() {
            // 鑺傛祦锛岄槻姝㈤珮棰戠巼閲嶅鎿嶄綔
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(save, 300);
        }

        // txt change 銆乫ocus銆乥lur 鏃堕殢鏃朵繚瀛橀€夊尯
        $txt.on(txtChangeEventNames + ' focus blur', function (e) {
            // 鍏堝悓姝ヤ繚瀛橀€夊尯锛屼负浜嗚鎺ヤ笅鏉ュ氨椹笂瑕佹墽琛? editor.getRangeElem() 鐨勭▼搴?
            // 鑳藉鑾峰彇鍒版纭殑 rangeElem
            saveSync();

            // 鍐嶅紓姝ヤ繚瀛橀€夊尯锛屼负浜嗙‘瀹氭洿鍔犲噯纭殑閫夊尯锛屼负鍚庣画鐨勬搷浣滃仛鍑嗗
            saveAync();
        });

        // 榧犳爣鎷栨嫿閫夋嫨鏃讹紝鍙兘浼氭嫋鎷藉埌缂栬緫鍣ㄥ尯鍩熷闈㈠啀鏉炬墜锛屾鏃? $txt 灏辩洃鍚笉鍒? click浜嬩欢浜?
        $txt.on('mousedown', function () {
            $txt.on('mouseleave.saveSelection', function (e) {
                // 鍏堝悓姝ュ悗寮傛锛屽涓婅堪娉ㄩ噴
                saveSync();
                saveAync();

                // 椤洪亾鍚ц彍鍗曠姸鎬佷篃鏇存柊浜?
                editor.updateMenuStyle();
            });
        }).on('mouseup', function () {
            $txt.off('mouseleave.saveSelection');
        });

    };

    // 闅忔椂鏇存柊 value
    Txt.fn.updateValueEvent = function () {
        var $txt = this.$txt;
        var editor = this.editor;
        var timeoutId, oldValue;

        // 瑙﹀彂 onchange 浜嬩欢
        function doOnchange() {
            var val = $txt.html();
            if (oldValue === val) {
                // 鏃犲彉鍖?
                return;
            }

            // 瑙﹀彂 onchange 浜嬩欢
            if (editor.onchange && typeof editor.onchange === 'function') {
                editor.onchange.call(editor);
            }

            // 鏇存柊鍐呭
            editor.updateValue();

            // 璁板綍鏈€鏂板唴瀹?
            oldValue = val;
        }

        // txt change 鏃堕殢鏃舵洿鏂板唴瀹?
        $txt.on(txtChangeEventNames, function (e) {
            // 鍒濆鍖?
            if (oldValue == null) {
                oldValue = $txt.html();
            }

            // 鐩戞帶鍐呭鍙樺寲锛堝仠姝㈡搷浣? 100ms 涔嬪悗绔嬪嵆鎵ц锛?
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(doOnchange, 100);
        });
    };

    // 闅忔椂鏇存柊 menustyle
    Txt.fn.updateMenuStyleEvent = function () {
        var $txt = this.$txt;
        var editor = this.editor;

        // txt change 鏃堕殢鏃舵洿鏂板唴瀹?
        $txt.on(txtChangeEventNames, function (e) {
            editor.updateMenuStyle();
        });
    };

    // 鏈€鍚庢彃鍏ヨ瘯鍥炬彃鍏? <p><br><p>
    Txt.fn.insertEmptyP = function () {
        var $txt = this.$txt;
        var $children = $txt.children();

        if ($children.length === 0) {
            $txt.append($('<p><br></p>'));
            return;
        }

        if ($children.last().html() !== '<br>') {
            $txt.append($('<p><br></p>'));
        }
    };

    // 榧犳爣hover鏃跺€欙紝鏄剧ずp銆乭ead鐨勯珮搴?
    Txt.fn.showHeightOnHover = function () {
        var editor = this.editor;
        var $editorContainer = editor.$editorContainer;
        var menuContainer = editor.menuContainer;
        var $txt = this.$txt;
        var $tip = $('<i class="height-tip"><i>');
        var isTipInTxt = false;

        function addAndShowTip($target) {
            if (!isTipInTxt) {
                $editorContainer.append($tip);
                isTipInTxt = true;
            }

            var txtTop = $txt.position().top;
            var txtHeight = $txt.outerHeight();

            var height = $target.height();
            var top = $target.position().top;
            var marginTop = parseInt($target.css('margin-top'), 10);
            var paddingTop = parseInt($target.css('padding-top'), 10);
            var marginBottom = parseInt($target.css('margin-bottom'), 10);
            var paddingBottom = parseInt($target.css('padding-bottom'), 10);

            // 璁＄畻鍒濇鐨勭粨鏋?
            var resultHeight = height + paddingTop + marginTop + paddingBottom + marginBottom;
            var resultTop = top + menuContainer.height();

            // var spaceValue;

            // // 鍒ゆ柇鏄惁瓒呭嚭涓嬭竟鐣?
            // spaceValue = (resultTop + resultHeight) - (txtTop + txtHeight);
            // if (spaceValue > 0) {
            //     resultHeight = resultHeight - spaceValue;
            // }

            // // 鍒ゆ柇鏄惁瓒呭嚭浜嗕笅杈圭晫
            // spaceValue = txtTop > resultTop;
            // if (spaceValue) {
            //     resultHeight = resultHeight - spaceValue;
            //     top = top + spaceValue;
            // }

            // 鎸夌収鏈€缁堢粨鏋滄覆鏌?
            $tip.css({
                height: height + paddingTop + marginTop + paddingBottom + marginBottom,
                top: top + menuContainer.height()
            });
        }
        function removeTip() {
            if (!isTipInTxt) {
                return;
            }
            $tip.remove();
            isTipInTxt = false;
        }

        $txt.on('mouseenter', 'ul,ol,blockquote,p,h1,h2,h3,h4,h5,table,pre', function (e) {
            addAndShowTip($(e.currentTarget));
        }).on('mouseleave', function () {
            removeTip();
        });
    };

});
// 宸ュ叿鍑芥暟
_e(function (E, $) {

    // IE8 [].indexOf()
    if(!Array.prototype.indexOf){
        //IE浣庣増鏈笉鏀寔 arr.indexOf
        Array.prototype.indexOf = function(elem){
            var i = 0,
                length = this.length;
            for(; i<length; i++){
                if(this[i] === elem){
                    return i;
                }
            }
            return -1;
        };
        //IE浣庣増鏈笉鏀寔 arr.lastIndexOf
        Array.prototype.lastIndexOf = function(elem){
            var length = this.length;
            for(length = length - 1; length >= 0; length--){
                if(this[length] === elem){
                    return length;
                }
            }
            return -1;
        };
    }

    // IE8 Date.now()
    if (!Date.now) {
        Date.now = function () {
            return new Date().valueOf();
        };
    }

    // console.log && console.warn && console.error
    var console = window.console;
    var emptyFn = function () {};
    $.each(['info', 'log', 'warn', 'error'], function (key, value) {
        if (console == null) {
            E[value] = emptyFn;
        } else {
            E[value] = function (info) {
                // 閫氳繃閰嶇疆鏉ユ帶鍒舵墦鍗拌緭鍑?
                if (E.config && E.config.printLog) {
                    console[value]('wangEditor鎻愮ず: ' + info);
                }
            };
        }
    });

    // 鑾峰彇闅忔満鏁?
    E.random = function () {
        return Math.random().toString().slice(2);
    };

    // 娴忚鍣ㄦ槸鍚︽敮鎸? placeholder
    E.placeholder = 'placeholder' in document.createElement('input');

    // 鍏煎IE8鐨? input placeholder
    E.placeholderForIE8 = function ($container) {
        if (E.placeholder) {
            return;
        }
        $container.find('input[placeholder]').each(function () {
            var $input = $(this);
            var placeholder = $input.attr('placeholder');

            if ($input.val() === '') {
                $input.css('color', '#666');
                $input.val(placeholder);

                $input.on('focus.placeholder click.placeholder', function () {
                    $input.val('');
                    $input.css('color', '#333');
                    $input.off('focus.placeholder click.placeholder');
                });
            }
        });
    };
});

_e(function (E, $) {
    E.langs = {};

    // 涓枃
    E.langs['zh-cn'] = {
        bold: '粗体',
        underline: '下划线',
        italic: '斜体',
        forecolor: '文字颜色',
        bgcolor: '背景色',
        strikethrough: '删除线',
        eraser: '清空格式',
        source: '源码',
        quote: '引用',
        fontfamily: '字体',
        fontsize: '字号',
        head: '标题',
        orderlist: '有序列表',
        unorderlist: '无序列表',
        alignleft: '左对齐',
        aligncenter: '居中',
        alignright: '右对齐',
        link: '链接',
        text: '文本',
        submit: '提交',
        cancel: '取消',
        unlink: '取消链接',
        table: '表格',
        emotion: '表情',
        img: '图片',
        video: '视频',
        'width': '宽度',
        'height': '高度',
        location: '位置',
        loading: '加载中',
        searchlocation: '搜索位置',
        dynamicMap: '动态地图',
        clearLocation: '清除位置',
        langDynamicOneLocation: '',
        insertcode: '插入代码',
        undo: '撤销',
        redo: '重复',
        fullscreen: '全屏'
    };

    // 鑻辨枃
    E.langs.en = {
        bold: 'Bold',
        underline: 'Underline',
        italic: 'Italic',
        forecolor: 'Color',
        bgcolor: 'Backcolor',
        strikethrough: 'Strikethrough',
        eraser: 'Eraser',
        source: 'Codeview',
        quote: 'Quote',
        fontfamily: 'Font family',
        fontsize: 'Font size',
        head: 'Head',
        orderlist: 'Ordered list',
        unorderlist: 'Unordered list',
        alignleft: 'Align left',
        aligncenter: 'Align center',
        alignright: 'Align right',
        link: 'Insert link',
        text: 'Text',
        submit: 'Submit',
        cancel: 'Cancel',
        unlink: 'Unlink',
        table: 'Table',
        emotion: 'Emotions',
        img: 'Image',
        video: 'Video',
        'width': 'width',
        'height': 'height',
        location: 'Location',
        loading: 'Loading',
        searchlocation: 'search',
        dynamicMap: 'Dynamic',
        clearLocation: 'Clear',
        langDynamicOneLocation: 'Only one location in dynamic map',
        insertcode: 'Insert Code',
        undo: 'Undo',
        redo: 'Redo',
        fullscreen: 'Full screnn'
    };
});
// 鍏ㄥ眬閰嶇疆
_e(function (E, $) {

    E.config = {};

    // 鍏ㄥ睆鏃剁殑 z-index
    E.config.zindex = 10000;

    // 鏄惁鎵撳嵃log
    E.config.printLog = true;

    // 鑿滃崟鍚搁《锛歠alse - 涓嶅惛椤讹紱number - 鍚搁《锛屽€间负top鍊?
    E.config.menuFixed = 0;

    // 缂栬緫婧愮爜鏃讹紝杩囨护 javascript
    E.config.jsFilter = true;

    // 缂栬緫鍣ㄥ厑璁哥殑鏍囩
    E.config.legalTags = 'p,h1,h2,h3,h4,h5,h6,blockquote,table,ul,ol,pre';

    // 璇█鍖?
    E.config.lang = E.langs['zh-cn'];

    // 鑿滃崟閰嶇疆
    E.config.menus = [
        'source',
        '|',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        // 'emotion',
        '|',
        'img',
        'video',
        'location',
        'insertcode',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ];

    // 棰滆壊閰嶇疆
    E.config.colors = {
        // 'value': 'title'
        '#880000': '鏆楃孩鑹?',
        '#800080': '绱壊',
        '#ff0000': '绾㈣壊',
        '#ff00ff': '椴滅矇鑹?',
        '#000080': '娣辫摑鑹?',
        '#0000ff': '钃濊壊',
        '#00ffff': '婀栬摑鑹?',
        '#008080': '钃濈豢鑹?',
        '#008000': '缁胯壊',
        '#808000': '姗勬鑹?',
        '#00ff00': '娴呯豢鑹?',
        '#ffcc00': '姗欓粍鑹?',
        '#808080': '鐏拌壊',
        '#c0c0c0': '閾惰壊',
        '#000000': '榛戣壊',
        '#ffffff': '鐧借壊'
    };

    // 瀛椾綋
    E.config.familys = [
        '宋体', '黑体', '楷体', '微软雅黑',
        'Arial', 'Verdana', 'Georgia',
        'Times New Roman', 'Microsoft JhengHei',
        'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'
    ];

    // 瀛楀彿
    E.config.fontsizes = {
        // 鏍煎紡锛?'value': 'title'
        1: '10px',
        2: '13px',
        3: '16px',
        4: '19px',
        5: '22px',
        6: '25px',
        7: '28px'
    };

    // 琛ㄦ儏鍖?
    E.config.emotions = {
        'default': {
            title: '榛樿',
            size: 18,
            imgs: [
                '../static/emotions/default/1.gif',
                '../static/emotions/default/2.gif',
                '../static/emotions/default/3.gif',
                '../static/emotions/default/4.gif',
                '../static/emotions/default/5.gif',
                '../static/emotions/default/6.gif',
                '../static/emotions/default/7.gif',
                '../static/emotions/default/8.gif',
                '../static/emotions/default/9.gif',
                '../static/emotions/default/10.gif',
                '../static/emotions/default/11.gif',
                '../static/emotions/default/12.gif',
                '../static/emotions/default/13.gif',
                '../static/emotions/default/14.gif',
                '../static/emotions/default/15.gif',
                '../static/emotions/default/16.gif',
                '../static/emotions/default/17.gif',
                '../static/emotions/default/18.gif',
                '../static/emotions/default/19.gif',
                '../static/emotions/default/20.gif',
                '../static/emotions/default/21.gif',
                '../static/emotions/default/22.gif',
                '../static/emotions/default/23.gif',
                '../static/emotions/default/24.gif',
                '../static/emotions/default/25.gif',
                '../static/emotions/default/26.gif',
                '../static/emotions/default/27.gif',
                '../static/emotions/default/28.gif',
                '../static/emotions/default/29.gif',
                '../static/emotions/default/30.gif',
                '../static/emotions/default/31.gif',
                '../static/emotions/default/32.gif',
                '../static/emotions/default/33.gif',
                '../static/emotions/default/34.gif',
                '../static/emotions/default/35.gif',
                '../static/emotions/default/36.gif',
                '../static/emotions/default/37.gif',
                '../static/emotions/default/38.gif',
                '../static/emotions/default/39.gif',
                '../static/emotions/default/40.gif',
                '../static/emotions/default/41.gif',
                '../static/emotions/default/42.gif',
                '../static/emotions/default/43.gif',
                '../static/emotions/default/44.gif',
                '../static/emotions/default/45.gif',
                '../static/emotions/default/46.gif',
                '../static/emotions/default/47.gif',
                '../static/emotions/default/48.gif',
                '../static/emotions/default/49.gif',
                '../static/emotions/default/50.gif'
            ]
        },
        'jinxing': {
            title: '閲戞槦',
            size: 50,
            imgs: [
                '../static/emotions/jinxing/1.gif',
                '../static/emotions/jinxing/2.gif',
                '../static/emotions/jinxing/3.gif',
                '../static/emotions/jinxing/4.gif',
                '../static/emotions/jinxing/5.gif',
                '../static/emotions/jinxing/6.gif'
            ]
        }
    };

    // 鐧惧害鍦板浘鐨刱ey
    E.config.mapAk = 'TVhjYjq1ICT2qqL5LdS8mwas';

    // 涓婁紶鍥剧墖鐨勯厤缃?
    // server鍦板潃
    E.config.uploadImgUrl = '';
    // 瓒呮椂鏃堕棿
    E.config.uploadTimeout = 20 * 1000;
    // 鐢ㄤ簬瀛樺偍涓婁紶鍥炶皟浜嬩欢
    E.config.uploadImgFns = {};

    // 鑷畾涔変笂浼狅紝璁剧疆涓? true 涔嬪悗锛屾樉绀轰笂浼犲浘鏍?
    E.config.customUpload = false;
    // 鑷畾涔変笂浼犵殑init浜嬩欢
    // E.config.customUploadInit = function () {....};

    // 鏄惁杩囨护绮樿创鍐呭
    E.config.pasteFilter = true;

});
// 鍏ㄥ眬UI
_e(function (E, $) {

     E.UI = {};

     // 涓鸿彍鍗曡嚜瀹氫箟閰嶇疆鐨刄I
     E.UI.menus = {
        // 杩欎釜 default 涓嶅姞寮曞彿锛屽湪 IE8 浼氭姤閿?
        'default': {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-command"></i></a>',
            selected: '.selected'
        },
        bold: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-bold"></i></a>',
            selected: '.selected'
        },
        underline: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-underline"></i></a>',
            selected: '.selected'
        },
        italic: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-italic"></i></a>',
            selected: '.selected'
        },
        forecolor: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-pencil"></i></a>',
            selected: '.selected'
        },
        bgcolor: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-brush"></i></a>',
            selected: '.selected'
        },
        strikethrough: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-strikethrough"></i></a>',
            selected: '.selected'
        },
        eraser: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-eraser"></i></a>',
            selected: '.selected'
        },
        quote: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-quotes-left"></i></a>',
            selected: '.selected'
        },
        source: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-code"></i></a>',
            selected: '.selected'
        },
        fontfamily: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-font2"></i></a>',
            selected: '.selected'
        },
        fontsize: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-text-height"></i></a>',
            selected: '.selected'
        },
        head: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-header"></i></a>',
            selected: '.selected'
        },
        orderlist: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-list-numbered"></i></a>',
            selected: '.selected'
        },
        unorderlist: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-list-bullet"></i></a>',
            selected: '.selected'
        },
        alignleft: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-left"></i></a>',
            selected: '.selected'
        },
        aligncenter: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-center"></i></a>',
            selected: '.selected'
        },
        alignright: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-right"></i></a>',
            selected: '.selected'
        },
        link: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-link"></i></a>',
            selected: '.selected'
        },
        unlink: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-unlink"></i></a>',
            selected: '.selected'
        },
        table: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-table"></i></a>',
            selected: '.selected'
        },
        emotion: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-happy"></i></a>',
            selected: '.selected'
        },
        img: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-picture"></i></a>',
            selected: '.selected'
        },
        video: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-play"></i></a>',
            selected: '.selected'
        },
        location: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-location"></i></a>',
            selected: '.selected'
        },
        insertcode: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-terminal"></i></a>',
            selected: '.selected'
        },
        undo: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-ccw"></i></a>',
            selected: '.selected'
        },
        redo: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-cw"></i></a>',
            selected: '.selected'
        },
        fullscreen: {
            normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-enlarge2"></i></a>',
            selected: '<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-shrink2"></i></a>'
        }
     };

});
// 瀵硅薄閰嶇疆
_e(function (E, $) {

    E.fn.initDefaultConfig = function () {
        var editor = this;
        editor.config = $.extend({}, E.config);
        editor.UI = $.extend({}, E.UI);
    };

});
// 澧炲姞 container
_e(function (E, $) {

    E.fn.addEditorContainer = function () {
        this.$editorContainer = $('<div class="wangEditor-container"></div>');
    };

});
// 澧炲姞缂栬緫鍖哄煙瀵硅薄
_e(function (E, $) {

    E.fn.addTxt = function () {
        var editor = this;
        var txt = new E.Txt(editor);

        editor.txt = txt;
    };

});
// 澧炲姞menuContainer瀵硅薄
_e(function (E, $) {

    E.fn.addMenuContainer = function () {
        var editor = this;
        editor.menuContainer = new E.MenuContainer(editor);
    };

});
// 澧炲姞menus
_e(function (E, $) {

    // 瀛樺偍鍒涘缓鑿滃崟鐨勫嚱鏁?
    E.createMenuFns = [];
    E.createMenu = function (fn) {
        E.createMenuFns.push(fn);
    };

    // 鍒涘缓鎵€鏈夎彍鍗?
    E.fn.addMenus = function () {
        var editor = this;
        var menuIds = editor.config.menus;

        // 妫€楠? menuId 鏄惁鍦ㄩ厤缃腑瀛樺湪
        function check(menuId) {
            if (menuIds.indexOf(menuId) >= 0) {
                return true;
            }
            return false;
        }

        // 閬嶅巻鎵€鏈夌殑鑿滃崟鍒涘缓鍑芥暟锛屽苟鎵ц
        $.each(E.createMenuFns, function (k, createMenuFn) {
            createMenuFn.call(editor, check);
        });
    };

});
// bold鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'bold';
        if (!check(menuId)) {
            return;
        }

        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.bold,
            commandName: 'Bold'
        });

        // 瀹氫箟閫変腑鐘舵€佷笅鐨刢lick浜嬩欢
        menu.clickEventSelected = function (e) {
            var isRangeEmpty = editor.isRangeEmpty();
            if (!isRangeEmpty) {
                // 濡傛灉閫夊尯鏈夊唴瀹癸紝鍒欐墽琛屽熀纭€鍛戒护
                editor.command(e, 'Bold');
            } else {
                // 濡傛灉閫夊尯娌℃湁鍐呭
                editor.commandForElem('b,strong,h1,h2,h3,h4,h5', e, 'Bold');
            }
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// underline鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'underline';
        if (!check(menuId)) {
            return;
        }

        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.underline,
            commandName: 'Underline'
        });

        // 瀹氫箟閫変腑鐘舵€佷笅鐨刢lick浜嬩欢
        menu.clickEventSelected = function (e) {
            var isRangeEmpty = editor.isRangeEmpty();
            if (!isRangeEmpty) {
                // 濡傛灉閫夊尯鏈夊唴瀹癸紝鍒欐墽琛屽熀纭€鍛戒护
                editor.command(e, 'Underline');
            } else {
                // 濡傛灉閫夊尯娌℃湁鍐呭
                editor.commandForElem('u,a', e, 'Underline');
            }
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// italic 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'italic';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.italic,
            commandName: 'Italic'
        });

        // 瀹氫箟閫変腑鐘舵€佷笅鐨刢lick浜嬩欢
        menu.clickEventSelected = function (e) {
            var isRangeEmpty = editor.isRangeEmpty();
            if (!isRangeEmpty) {
                // 濡傛灉閫夊尯鏈夊唴瀹癸紝鍒欐墽琛屽熀纭€鍛戒护
                editor.command(e, 'Italic');
            } else {
                // 濡傛灉閫夊尯娌℃湁鍐呭
                editor.commandForElem('i', e, 'Italic');
            }
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// forecolor 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'forecolor';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var configColors = editor.config.colors;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.forecolor
        });

        // 鍒涘缓 dropPanel
        var $content = $('<div></div>');
        $.each(configColors, function (k, v) {
            $content.append(
                [
                    '<a href="#" class="color-item"',
                    '    title="' + v + '" commandValue="' + k + '" ',
                    '    style="color: ' + k + '" ',
                    '><i class="wangeditor-menu-img-pencil"></i></a>'
                ].join('')
            );
        });
        $content.on('click', 'a[commandValue]', function (e) {
            // 鎵ц鍛戒护
            var $elem = $(this);
            var commandValue = $elem.attr('commandValue');

            if (menu.selected && editor.isRangeEmpty()) {
                // 褰撳墠澶勪簬閫変腑鐘舵€侊紝骞朵笖閫変腑鍐呭涓虹┖
                editor.commandForElem('font[color]', e, 'forecolor', commandValue);
            } else {
                // 褰撳墠鏈浜庨€変腑鐘舵€侊紝鎴栬€呮湁閫変腑鍐呭銆傚垯鎵ц榛樿鍛戒护
                editor.command(e, 'forecolor', commandValue);
            }
        });
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 125
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'font[color]');
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// bgcolor 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'bgcolor';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var configColors = editor.config.colors;

        // 妫€鏌ュ厓绱犳槸鍚︽湁 background-color: 鍐呰仈鏍峰紡
        function checkElemFn(elem) {
            var cssText;
            if (elem && elem.style && elem.style.cssText != null) {
                cssText = elem.style.cssText;
                if (cssText && cssText.indexOf('background-color:') >= 0) {
                    return true;
                }
            }
            return false;
        }

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.bgcolor
        });

        // 鍒涘缓 dropPanel
        var $content = $('<div></div>');
        $.each(configColors, function (k, v) {
            $content.append(
                [
                    '<a href="#" class="color-item"',
                    '    title="' + v + '" commandValue="' + k + '" ',
                    '    style="color: ' + k + '" ',
                    '><i class="wangeditor-menu-img-brush"></i></a>'
                ].join('')
            );
        });
        $content.on('click', 'a[commandValue]', function (e) {
            // 鎵ц鍛戒护

            var $elem = $(this);
            var commandValue = $elem.attr('commandValue');

            if (menu.selected && editor.isRangeEmpty()) {
                // 褰撳墠澶勪簬閫変腑鐘舵€侊紝骞朵笖閫変腑鍐呭涓虹┖銆備娇鐢? commandForElem 鎵ц鍛戒护
                editor.commandForElem({
                    selector: 'span,font',
                    check: checkElemFn
                }, e, 'BackColor', commandValue);
            } else {
                // 褰撳墠鏈浜庨€変腑鐘舵€侊紝鎴栬€呮湁閫変腑鍐呭銆傚垯鎵ц榛樿鍛戒护
                editor.command(e, 'BackColor', commandValue);
            }
        });
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 125
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'span,font', checkElemFn);

            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// strikethrough 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'strikethrough';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.strikethrough,
            commandName: 'StrikeThrough'
        });

        // 瀹氫箟閫変腑鐘舵€佷笅鐨刢lick浜嬩欢
        menu.clickEventSelected = function (e) {
            var isRangeEmpty = editor.isRangeEmpty();
            if (!isRangeEmpty) {
                // 濡傛灉閫夊尯鏈夊唴瀹癸紝鍒欐墽琛屽熀纭€鍛戒护
                editor.command(e, 'StrikeThrough');
            } else {
                // 濡傛灉閫夊尯娌℃湁鍐呭
                editor.commandForElem('strike', e, 'StrikeThrough');
            }
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// eraser 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'eraser';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.eraser,
            commandName: 'RemoveFormat'
        });

        // 瀹氫箟鐐瑰嚮浜嬩欢
        menu.clickEvent = function (e) {
            var isRangeEmpty = editor.isRangeEmpty();

            if (!isRangeEmpty) {
                // 閫夊尯涓嶆槸绌虹殑锛屽垯鎵ц榛樿鍛戒护
                editor.command(e, 'RemoveFormat');
                return;
            }

            var $clearElem;

            // 鑷畾涔夌殑鍛戒护鍑芥暟
            function commandFn() {
                var editor = this;
                var rangeElem;
                var pElem, $pElem;
                var quoteElem, $quoteElem;
                var listElem, $listElem;

                // 鑾峰彇閫夊尯 elem
                rangeElem = editor.getRangeElem();
                // 绗竴姝ワ紝鑾峰彇 quote 鐖跺厓绱?
                quoteElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                if (quoteElem) {
                    $quoteElem = $(quoteElem);
                    $clearElem = $('<p>' + $quoteElem.text() + '</p>');
                    $quoteElem.after($clearElem).remove();
                }
                // 绗簩姝ワ紝鑾峰彇 p h 鐖跺厓绱?
                pElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5');
                if (pElem) {
                    $pElem = $(pElem);
                    $clearElem = $('<p>' + $pElem.text() + '</p>');
                    $pElem.after($clearElem).remove();
                }
                // 绗笁姝ワ紝鑾峰彇list
                listElem = editor.getSelfOrParentByName(rangeElem, 'ul,ol');
                if (listElem) {
                    $listElem = $(listElem);
                    $clearElem = $('<p>' + $listElem.text() + '</p>');
                    $listElem.after($clearElem).remove();
                }
            }

            // 鑷畾涔? callback 浜嬩欢
            function callback() {
                // callback涓紝璁剧疆range涓篶learElem
                var editor = this;
                if ($clearElem) {
                    editor.restoreSelectionByElem($clearElem.get(0));
                }
            }

            // 鎵ц鑷畾涔夊懡浠?
            editor.customCommand(e, commandFn, callback);
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// source 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'source';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var txtHtml;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.source
        });

        menu.isShowCode = false;

        // 鏇存柊鍐呭
        function updateValue() {
            var $code = menu.$codeTextarea;
            var $txt = editor.txt.$txt;
            var value = $code.val(); // 鍙栧€?

            // 杩囨护js浠ｇ爜
            if (editor.config.jsFilter) {

                value = value.replace(/<script[\s\S]*?<\/script>/ig, '');
            }
            // 璧嬪€?
            $txt.html(value);
        }

        // 瀹氫箟click浜嬩欢
        menu.clickEvent = function (e) {
            var self = this;
            var editor = self.editor;
            var $txt = editor.txt.$txt;
            var txtOuterHeight = $txt.outerHeight();
            var txtHeight = $txt.height();

            if (!self.$codeTextarea) {
                self.$codeTextarea = $('<textarea class="code-textarea"></textarea>');
            }
            var $code = self.$codeTextarea;
            $code.css({
                height: txtHeight,
                'margin-top': txtOuterHeight - txtHeight
            });

            // 璧嬪€?
            $code.val($txt.html());

            // 娓叉煋
            $txt.after($code).hide();
            $code.show();

            // 鏇存柊鐘舵€?
            menu.isShowCode = true;

            // 鎵ц updateSelected 浜嬩欢
            this.updateSelected();

            // 绂佺敤鍏朵粬鑿滃崟
            editor.disableMenusExcept('source');

            // 璁板綍褰撳墠html鍊?
            txtHtml = $txt.html();
        };

        // 瀹氫箟閫変腑鐘舵€佷笅鐨刢lick浜嬩欢
        menu.clickEventSelected = function (e) {
            var self = this;
            var editor = self.editor;
            var $txt = editor.txt.$txt;
            var $code = self.$codeTextarea;
            var value;

            if (!$code) {
                return;
            }

            // 鏇存柊鍐呭
            updateValue();

            // 娓叉煋
            $code.after($txt).hide();
            $txt.show();

            // 鏇存柊鐘舵€?
            menu.isShowCode = false;

            // 鎵ц updateSelected 浜嬩欢
            this.updateSelected();

            // 鍚敤鍏朵粬鑿滃崟
            editor.enableMenusExcept('source');

            // 鍒ゆ柇鏄惁鎵ц onchange 浜嬩欢
            if ($txt.html() !== txtHtml) {
                if (editor.onchange && typeof editor.onchange === 'function') {
                    editor.onchange.call(editor);
                }
            }
        };

        // 瀹氫箟鍒囨崲閫変腑鐘舵€佷簨浠?
        menu.updateSelectedEvent = function () {
            return this.isShowCode;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// quote 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'quote';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.quote,
            commandName: 'formatBlock',
            commandValue: 'blockquote'
        });

        // 瀹氫箟click浜嬩欢
        menu.clickEvent = function (e) {
            var rangeElem = editor.getRangeElem();
            var $rangeElem;
            if (!rangeElem) {
                e.preventDefault();
                return;
            }
            var currentQuote = editor.getSelfOrParentByName(rangeElem, 'blockquote');
            var $quote;

            if (currentQuote) {
                // 璇存槑褰撳墠鍦╭uote涔嬪唴锛屼笉鍋氫换浣曞鐞?
                e.preventDefault();
                return;
            }

            rangeElem = editor.getLegalTags(rangeElem);
            $rangeElem = $(rangeElem);

            // 鏃犳枃瀛楋紝鍒欎笉鍏佽鎵ц寮曠敤
            if (!$rangeElem.text()) {
                return;
            }


            if (!rangeElem) {
                // 鎵ц榛樿鍛戒护
                // IE8 涓嬫墽琛屾澶勶紙涓嶈繃锛岀粡娴嬭瘯浠ｇ爜鏃犳晥锛屼篃涓嶆姤閿欙級
                editor.command(e, 'formatBlock', 'blockquote');
                return;
            }

            // 鑷畾涔塩ommand浜嬩欢
            function commandFn() {
                $quote = $('<p>' + $rangeElem.text() + '</p>');
                $rangeElem.after($quote).remove();
                $quote.wrap('<blockquote>');
            }

            // 鑷畾涔? callback 浜嬩欢
            function callback() {
                // callback涓紝璁剧疆range涓簈uote
                var editor = this;
                if ($quote) {
                    editor.restoreSelectionByElem($quote.get(0));
                }
            }

            // 鎵ц鑷畾涔夊懡浠?
            editor.customCommand(e, commandFn, callback);
        };

        // 瀹氫箟閫変腑鐘舵€佷笅鐨刢lick浜嬩欢
        menu.clickEventSelected = function (e) {
            var rangeElem;
            var quoteElem;
            var $lastChild;

            // 鑾峰彇褰撳墠閫夊尯鐨別lem锛屽苟璇曞浘寰€涓婃壘 quote 鍏冪礌
            rangeElem = editor.getRangeElem();
            quoteElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
            if (!quoteElem) {
                // 娌℃壘鍒帮紝鍒欒繑鍥?
                e.preventDefault();
                return;
            }

            // 鑷畾涔夌殑command浜嬩欢
            function commandFn() {
                var $quoteElem;
                var $children;

                $quoteElem = $(quoteElem);
                $children = $quoteElem.children();
                if ($children.length) {
                    $children.each(function (k) {
                        var $item = $(this);
                        if ($item.get(0).nodeName === 'P') {
                            $quoteElem.after($item);
                        } else {
                            $quoteElem.after('<p>' + $item.text() + '</p>');
                        }
                        $lastChild = $item;  // 璁板綍鏈€鍚庝竴涓瓙鍏冪礌锛岀敤浜巆allback涓殑range瀹氫綅
                    });
                    $quoteElem.remove();
                    return;
                }
            }

            // 鑷畾涔夌殑callback鍑芥暟
            function callback() {
                // callback涓紝璁剧疆range涓簂astChild
                var editor = this;
                if ($lastChild) {
                    editor.restoreSelectionByElem($lastChild.get(0));
                }
            }

            // 鎵ц鑷畾涔夊懡浠?
            editor.customCommand(e, commandFn, callback);
        };

        // 瀹氫箟鏇存柊閫変腑鐘舵€佺殑浜嬩欢
        menu.updateSelectedEvent = function () {
            var self = this; //鑿滃崟瀵硅薄
            var editor = self.editor;
            var rangeElem;

            rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');

            if (rangeElem) {
                return true;
            }

            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;

        // --------------- 涓ゆ鐐瑰嚮 enter 璺冲嚭寮曠敤 ---------------
        editor.ready(function () {
            var editor = this;
            var $txt = editor.txt.$txt;
            var isPrevEnter = false;  // 鏄笉鏄垰鍒氬湪quote涓寜浜? enter 閿?
            $txt.on('keydown', function (e) {
                if (e.keyCode !== 13) {
                    // 涓嶆槸 enter 閿?
                    isPrevEnter = false;
                    return;
                }

                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                if (!rangeElem) {
                    // 閫夊尯涓嶆槸 quote
                    isPrevEnter = false;
                    return;
                }

                if (!isPrevEnter) {
                    // 鏈€杩戞病鏈夊湪qote涓寜enter閿?
                    isPrevEnter = true;
                    return;
                }

                var currentRangeElem = editor.getRangeElem();
                var $currentRangeElem = $(currentRangeElem);
                if ($currentRangeElem.length) {
                    $currentRangeElem.parent().after($currentRangeElem);
                }

                // 璁剧疆閫夊尯
                editor.restoreSelectionByElem(currentRangeElem, 'start');

                isPrevEnter = false;
                // 闃绘榛樿琛屾枃
                e.preventDefault();

            });
        }); // editor.ready(

        // --------------- 澶勭悊quote涓棤鍐呭鏃朵笉鑳藉垹闄ょ殑闂 ---------------
        editor.ready(function () {
            var editor = this;
            var $txt = editor.txt.$txt;
            var $rangeElem;

            function commandFn() {
                $rangeElem && $rangeElem.remove();
            }
            function callback() {
                if (!$rangeElem) {
                    return;
                }
                var $prev = $rangeElem.prev();
                if ($prev.length) {
                    // 鏈? prev 鍒欏畾浣嶅埌 prev 鏈€鍚?
                    editor.restoreSelectionByElem($prev.get(0));
                } else {
                    // 鏃? prev 鍒欏垵濮嬪寲閫夊尯
                    editor.initSelection();
                }
            }

            $txt.on('keydown', function (e) {
                if (e.keyCode !== 8) {
                    // 涓嶆槸 backspace 閿?
                    return;
                }

                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                if (!rangeElem) {
                    // 閫夊尯涓嶆槸 quote
                    return;
                }
                $rangeElem = $(rangeElem);

                var text = $rangeElem.text();
                if (text) {
                    // quote 涓繕鏈夊唴瀹?
                    return;
                }
                editor.customCommand(e, commandFn, callback);

            }); // $txt.on
        }); // editor.ready(
    });

});
// 瀛椾綋 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'fontfamily';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var configFamilys = editor.config.familys;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.fontfamily,
            commandName: 'fontName'
        });

        // 鍒濆鍖栨暟鎹?
        var data  = {};
        /*
            data 闇€瑕佺殑缁撴瀯
            {
                'commandValue': 'title'
                ...
            }
        */
        $.each(configFamilys, function (k, v) {
            // configFamilys 鏄暟缁勶紝data 鏄璞?
            data[v] = v;
        });

        // 鍒涘缓droplist
        var tpl = '<span style="font-family:{#commandValue};">{#title}</span>';
        menu.dropList = new E.DropList(editor, menu, {
            data: data,
            tpl: tpl,
            selectorForELemCommand: 'font[face]'  // 涓轰簡鎵ц editor.commandForElem 鑰屼紶鍏ョ殑elem鏌ヨ鏂瑰紡
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'font[face]');
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });
});
// 瀛楀彿 鑿滃崟
_e(function (E, $) {
    E.createMenu(function (check) {
        var menuId = 'fontsize';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var configSize = editor.config.fontsizes;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.fontsize,
            commandName: 'fontSize'
        });

        // 鍒濆鍖栨暟鎹?
        var data  = configSize;
        /*
            data 闇€瑕佺殑缁撴瀯
            {
                'commandValue': 'title'
                ...
            }
        */

        // 鍒涘缓droplist
        var tpl = '<span style="font-size:{#title};">{#title}</span>';
        menu.dropList = new E.DropList(editor, menu, {
            data: data,
            tpl: tpl,
            selectorForELemCommand: 'font[size]'  // 涓轰簡鎵ц editor.commandForElem 鑰屼紶鍏ョ殑elem鏌ヨ鏂瑰紡
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'font[size]');
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });
});
// head 鑿滃崟
_e(function (E, $) {
    E.createMenu(function (check) {
        var menuId = 'head';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.head,
            commandName: 'formatBlock'
        });

        // 鍒濆鍖栨暟鎹?
        var data  = {
            '<h1>': '标题1',
            '<h2>': '标题2',
            '<h3>': '标题3',
            '<h4>': '标题4',
            '<h5>': '标题5'
        };
        /*
            data 闇€瑕佺殑缁撴瀯
            {
                'commandValue': 'title'
                ...
            }
        */

        // 鍒涘缓droplist
        var tpl = '{#commandValue}{#title}';
        menu.dropList = new E.DropList(editor, menu, {
            data: data,
            tpl: tpl
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'h1,h2,h3,h4,h5');
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });
});
// unorderlist 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'unorderlist';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.unorderlist,
            commandName: 'InsertUnorderedList'
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// orderlist 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'orderlist';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.orderlist,
            commandName: 'InsertOrderedList'
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// alignleft 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'alignleft';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.alignleft,
            commandName: 'JustifyLeft'
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
                var cssText;
                if (elem && elem.style && elem.style.cssText != null) {
                    cssText = elem.style.cssText;
                    if (cssText && /text-align:\s*left;/.test(cssText)) {
                        return true;
                    }
                }
                return false;
            });
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// aligncenter 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'aligncenter';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.aligncenter,
            commandName: 'JustifyCenter'
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
                var cssText;
                if (elem && elem.style && elem.style.cssText != null) {
                    cssText = elem.style.cssText;
                    if (cssText && /text-align:\s*center;/.test(cssText)) {
                        return true;
                    }
                }
                return false;
            });
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// alignright 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'alignright';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.alignright,
            commandName: 'JustifyRight'
        });

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
                var cssText;
                if (elem && elem.style && elem.style.cssText != null) {
                    cssText = elem.style.cssText;
                    if (cssText && /text-align:\s*right;/.test(cssText)) {
                        return true;
                    }
                }
                return false;
            });
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// link 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'link';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.link
        });

        // 鍒涘缓 dropPanel
        var $content = $('<div></div>');
        var $div1 = $('<div style="margin:20px 10px;" class="clearfix"></div>');
        var $div2 = $div1.clone();
        var $div3 = $div1.clone().css('margin', '0 10px');
        var $textInput = $('<input type="text" class="block" placeholder="' + lang.text + '"/>');
        var $urlInput = $('<input type="text" class="block" placeholder="' + lang.link + '"/>');
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

        $div1.append($textInput);
        $div2.append($urlInput);
        $div3.append($btnSubmit).append($btnCancel);
        $content.append($div1).append($div2).append($div3);

        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 300
        });

        // 瀹氫箟click浜嬩欢
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // -------------闅愯棌----------------
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // -------------鏄剧ず----------------

            // 閲嶇疆 input
            $textInput.val('');
            $urlInput.val('');

            // 鑾峰彇url
            var url = '';
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'a');
            if (rangeElem) {
                url = rangeElem.href || '';
            }

            // 鑾峰彇 text
            var text = '';
            var isRangeEmpty = editor.isRangeEmpty();
            if (!isRangeEmpty) {
                // 閫夊尯涓嶆槸绌?
                text = editor.getRangeText() || '';
            } else if (rangeElem) {
                // 濡傛灉閫夊尯绌猴紝骞朵笖鍦? a 鏍囩涔嬪唴
                text = rangeElem.textContent || rangeElem.innerHTML;
            }

            // 璁剧疆 url 鍜? text
            url && $urlInput.val(url);
            text && $textInput.val(text);

            // 濡傛灉鏈夐€夊尯鍐呭锛宼extinput 涓嶈兘淇敼
            if (!isRangeEmpty) {
                $textInput.attr('disabled', true);
            } else {
                $textInput.removeAttr('disabled');
            }

            // 鏄剧ず锛堣璁剧疆濂戒簡鎵€鏈塱nput鐨勫€煎拰灞炴€т箣鍚庡啀鏄剧ず锛?
            dropPanel.show();
        };

        // 瀹氫箟 update selected 浜嬩欢
        menu.updateSelectedEvent = function () {
            var rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'a');
            if (rangeElem) {
                return true;
            }
            return false;
        };

        // 銆庡彇娑堛€? 鎸夐挳
        $btnCancel.click(function (e) {
            e.preventDefault();
            menu.dropPanel.hide();
        });

        // 銆庣‘瀹氥€忔寜閽?
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'a');
            var isRangeEmpty = editor.isRangeEmpty();

            var $linkElem, linkHtml;
            var commandFn, callback;
            var $txt = editor.txt.$txt;
            var $oldLinks, $newLinks;
            var uniqId = 'link' + E.random();

            // 鑾峰彇鏁版嵁
            var url = $.trim($urlInput.val());
            var text = $.trim($textInput.val());

            if (!url) {
                menu.dropPanel.focusFirstInput();
                return;
            }
            if (!text) {
                text = url;
            }

            if (!isRangeEmpty) {
                // 閫変腑鍖哄煙鏈夊唴瀹癸紝鍒欐墽琛岄粯璁ゅ懡浠?

                // 鑾峰彇鐩墠 txt 鍐呮墍鏈夐摼鎺ワ紝骞朵负褰撳墠閾炬帴鍋氫竴涓爣璁?
                $oldLinks = $txt.find('a');
                $oldLinks.attr(uniqId, '1');

                // 鎵ц鍛戒护
                editor.command(e, 'createLink', url);

                // 鍘荤殑娌℃湁鏍囪鐨勯摼鎺ワ紝鍗冲垰鍒氭彃鍏ョ殑閾炬帴
                $newLinks = $txt.find('a').not('[' + uniqId + ']');
                $newLinks.attr('target', '_blank'); // 澧炲姞 _blank

                // 鍘绘帀涔嬪墠鍋氱殑鏍囪
                $oldLinks.removeAttr(uniqId);

            } else if (targetElem) {
                // 鏃犻€変腑鍖哄煙锛屽湪 a 鏍囩涔嬪唴锛屼慨鏀硅 a 鏍囩鐨勫唴瀹瑰拰閾炬帴
                $linkElem = $(targetElem);
                commandFn = function () {
                    $linkElem.attr('href', url);
                    $linkElem.text(text);
                };
                callback = function () {
                    var editor = this;
                    editor.restoreSelectionByElem(targetElem);
                };
                // 鎵ц鍛戒护
                editor.customCommand(e, commandFn, callback);
            } else {
                // 鏃犻€変腑鍖哄煙锛屼笉鍦? a 鏍囩涔嬪唴锛屾彃鍏ユ柊鐨勯摼鎺?

                linkHtml = '<a href="' + url + '" target="_blank">' + text + '</a>';
                if (E.userAgent.indexOf('Firefox') > 0) {
                    linkHtml += '<span>&nbsp;</span>';
                }
                editor.command(e, 'insertHtml', linkHtml);
            }

        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// unlink 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'unlink';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.unlink,
            commandName: 'unLink'
        });

        // click 浜嬩欢
        menu.clickEvent = function  (e) {
            var isRangeEmpty = editor.isRangeEmpty();
            if (!isRangeEmpty) {
                // 鏈夐€変腑鍖哄煙锛屾垨鑰匢E8锛屾墽琛岄粯璁ゅ懡浠?
                editor.command(e, 'unLink');
                return;
            }

            // 鏃犻€変腑鍖哄煙...

            var rangeElem = editor.getRangeElem();
            var aElem = editor.getSelfOrParentByName(rangeElem, 'a');
            if (!aElem) {
                // 涓嶅湪 a 涔嬪唴锛岃繑鍥?
                e.preventDefault();
                return;
            }

            // 鍦? a 涔嬪唴
            var $a = $(aElem);
            var $span = $('<span>' + $a.text() + '</span>');
            function commandFn() {
                $a.after($span).remove();
            }
            function callback() {
                editor.restoreSelectionByElem($span.get(0));
            }
            editor.customCommand(e, commandFn, callback);
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// table 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'table';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.table
        });

        // dropPanel 鍐呭
        var $content = $('<div style="font-size: 14px; color: #666; text-align:right;"></div>');
        var $table = $('<table class="choose-table" style="margin-bottom:10px;margin-top:5px;">');
        var $row = $('<span>0</span>');
        var $rowspan = $('<span>行</span>');
        var $col = $('<span>0</span>');
        var $colspan = $('<span>列</span>');
        var $tr;
        var i, j;

        // 鍒涘缓涓€涓?10琛?10鍒楃殑琛ㄦ牸
        for (i = 0; i < 10; i++) {
            $tr = $('<tr index="' + (i + 1) + '">');
            for (j = 0; j < 10; j++) {
                $tr.append($('<td index="' + (j + 1) + '">'));
            }
            $table.append($tr);
        }
        $content.append($table);
        $content.append($row).append($rowspan).append($col).append($colspan);

        // 瀹氫箟table浜嬩欢
        $table.on('mouseenter', 'td', function (e) {
            var $currentTd = $(e.currentTarget);
            var currentTdIndex = $currentTd.attr('index');
            var $currentTr = $currentTd.parent();
            var currentTrIndex = $currentTr.attr('index');

            // 鏄剧ず
            $row.text(currentTrIndex);
            $col.text(currentTdIndex);

            // 閬嶅巻璁剧疆鑳屾櫙棰滆壊
            $table.find('tr').each(function () {
                var $tr = $(this);
                var trIndex = $tr.attr('index');
                if (parseInt(trIndex, 10) <= parseInt(currentTrIndex, 10)) {
                    // 璇ヨ闇€瑕佸彲鑳介渶瑕佽缃儗鏅壊
                    $tr.find('td').each(function () {
                        var $td = $(this);
                        var tdIndex = $td.attr('index');
                        if (parseInt(tdIndex, 10) <= parseInt(currentTdIndex, 10)) {
                            // 闇€瑕佽缃儗鏅壊
                            $td.addClass('active');
                        } else {
                            // 闇€瑕佺Щ闄よ儗鏅壊
                            $td.removeClass('active');
                        }
                    });
                } else {
                    // 鏀硅涓嶉渶瑕佽缃儗鏅壊
                    $tr.find('td').removeClass('active');
                }
            });
        }).on('mouseleave', function (e) {
            // mouseleave 鍒犻櫎鑳屾櫙鑹?
            $table.find('td').removeClass('active');
        });

        // 鎻掑叆琛ㄦ牸
        $table.on('click', 'td', function (e) {
            var $currentTd = $(e.currentTarget);
            var currentTdIndex = $currentTd.attr('index');
            var $currentTr = $currentTd.parent();
            var currentTrIndex = $currentTr.attr('index');

            var rownum = parseInt(currentTrIndex, 10);
            var colnum = parseInt(currentTdIndex, 10);

            // -------- 鎷兼帴tabel html --------

            var i, j;
            var tableHtml = '\n<table>';
            for (i = 0; i < rownum; i++) {
                tableHtml += '\n  <tr>';

                for (j = 0; j < colnum; j++) {
                    tableHtml += '\n    <td><span>&nbsp;</span></td>';
                }
                tableHtml += '\n  </tr>';
            }
            tableHtml += '\n</table>\n';

            // -------- 鎵ц鍛戒护 --------
            editor.command(e, 'insertHtml', tableHtml);
        });

        // 鍒涘缓 panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 181
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// emotion 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'emotion';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var configEmotions = editor.config.emotions;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.emotion
        });

        // 鎷兼帴 dropPanel 鍐呭
        var $panelContent = $('<div class="panel-tab"></div>');
        var $tabContainer = $('<div class="tab-container"></div>');
        var $contentContainer = $('<div class="content-container"></div>');
        $.each(configEmotions, function (k, val) {
            var title = val.title;
            var size = val.size;
            var imgs = val.imgs;

            var $tab = $('<a href="#">' + title +' </a>');
            $tabContainer.append($tab);
            var $tabContent = $('<div class="content"></div>');
            $contentContainer.append($tabContent);

            // 娣诲姞琛ㄦ儏鍥剧墖
            $.each(imgs, function (k, src) {
                var $command = $('<a href="#" commandValue="' + src + '"></a>');
                var $img = $('<img>');
                $img.css({
                    width: size + 'px',
                    height: size + 'px'
                });
                $img.attr('_src', src);  // 鍏堝皢 src 澶嶅埗鍒? '_src' 灞炴€э紝鍏堜笉鍔犺浇

                $command.append($img);
                $tabContent.append($command);
            });

            // tab 鍒囨崲浜嬩欢
            $tab.click(function (e) {
                $tabContainer.children().removeClass('selected');
                $contentContainer.children().removeClass('selected');
                $tabContent.addClass('selected');
                $tab.addClass('selected');
                e.preventDefault();
            });
        });
        $panelContent.append($tabContainer).append($contentContainer);

        // 榛樿鏄剧ず绗竴涓猼ab
        $tabContainer.children().first().addClass('selected');
        $contentContainer.children().first().addClass('selected');

        // 鎻掑叆琛ㄦ儏command浜嬩欢
        $contentContainer.on('click', 'a[commandValue]', function (e) {
            var $a = $(e.currentTarget);
            var src = $a.attr('commandValue');

            editor.command(e, 'InsertImage', src);
        });

        // 娣诲姞panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $panelContent,
            width: 350
        });

        // 瀹氫箟click浜嬩欢锛堝紓姝ュ姞杞借〃鎯呭浘鐗囷級
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // -------------闅愯棌-------------
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // -------------鏄剧ず-------------
            dropPanel.show();

            // 寮傛鍔犺浇鍥剧墖
            if (menu.imgLoaded) {
                return;
            }
            $contentContainer.find('img').each(function () {
                var $img = $(this);
                var _src = $img.attr('_src');
                $img.on('error', function () {
                    E.error('鍔犺浇涓嶅嚭琛ㄦ儏鍥剧墖 ' + _src);
                });
                $img.attr('src', _src);
                $img.removeAttr('_src');
            });
            menu.imgLoaded = true;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// img 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'img';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.img
        });

        // 鍒涘缓 panel content
        var $panelContent = $('<div class="panel-tab"></div>');
        var $tabContainer = $('<div class="tab-container"></div>');
        var $contentContainer = $('<div class="content-container"></div>');
        $panelContent.append($tabContainer).append($contentContainer);

        // tab
        var $uploadTab = $('<a href="#">上传图片</a>');
        var $linkTab = $('<a href="#">网络图片</a>');
        $tabContainer.append($uploadTab).append($linkTab);

        // 涓婁紶鍥剧墖 content
        var $uploadContent = $('<div class="content"></div>');
        $contentContainer.append($uploadContent);

        // 缃戠粶鍥剧墖 content
        var $linkContent = $('<div class="content"></div>');
        $contentContainer.append($linkContent);
        linkContentHandler(editor, menu, $linkContent);

        // 娣诲姞panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $panelContent,
            width: 400,
            onRender: function () {
                // 娓叉煋鍚庣殑鍥炶皟浜嬩欢锛岀敤浜庢墽琛岃嚜瀹氫箟涓婁紶鐨刬nit
                // 鍥犱负娓叉煋涔嬪悗锛屼笂浼犻潰鏉跨殑dom鎵嶄細琚覆鏌撳埌椤甸潰锛屾墠鑳借绗笁鏂圭┖闂磋幏鍙栧埌
                var init = editor.config.customUploadInit;
                init && init.call(editor);
            }
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;

        // tab 鍒囨崲浜嬩欢
        function tabToggle() {
            $uploadTab.click(function (e) {
                $tabContainer.children().removeClass('selected');
                $contentContainer.children().removeClass('selected');
                $uploadContent.addClass('selected');
                $uploadTab.addClass('selected');
                e.preventDefault();
            });
            $linkTab.click(function (e) {
                $tabContainer.children().removeClass('selected');
                $contentContainer.children().removeClass('selected');
                $linkContent.addClass('selected');
                $linkTab.addClass('selected');
                e.preventDefault();

                // focus input
                if (E.placeholder) {
                    $linkContent.find('input[type=text]').focus();
                }
            });

            // 榛樿鎯呭喌
            // $uploadTab.addClass('selected');
            // $uploadContent.addClass('selected');
            $uploadTab.click();
        }

        // 闅愯棌涓婁紶鍥剧墖
        function hideUploadImg() {
            $tabContainer.remove();
            $uploadContent.remove();
            $linkContent.addClass('selected');
        }

        // 鍒ゆ柇鐢ㄦ埛鏄惁閰嶇疆浜嗕笂浼犲浘鐗?
        editor.ready(function () {
            var editor = this;
            var config = editor.config;
            var uploadImgUrl = config.uploadImgUrl;
            var customUpload = config.customUpload;
            var $uploadImgPanel;

            if (uploadImgUrl || customUpload) {
                // 绗竴锛屾毚闇插嚭 $uploadContent 浠ヤ究鐢ㄦ埛鑷畾涔? 锛侊紒锛侀噸瑕?
                editor.$uploadContent = $uploadContent;

                // 绗簩锛岀粦瀹歵ab鍒囨崲浜嬩欢
                tabToggle();
            } else {
                // 鏈厤缃笂浼犲浘鐗囧姛鑳?
                hideUploadImg();
            }

            // 鐐瑰嚮 $uploadContent 绔嬪嵆闅愯棌 dropPanel
            // 涓轰簡鍏煎IE8銆?9鐨勪笂浼狅紝鍥犱负IE8銆?9浣跨敤 modal 涓婁紶
            // 杩欓噷浣跨敤寮傛锛屼负浜嗕笉濡ㄧ楂樼骇娴忚鍣ㄩ€氳繃鐐瑰嚮 $uploadContent 閫夋嫨鏂囦欢
            function hidePanel() {
                menu.dropPanel.hide();
            }
            $uploadContent.click(function () {
                setTimeout(hidePanel);
            });
        });
    });

    // --------------- 澶勭悊缃戠粶鍥剧墖content ---------------
    function linkContentHandler (editor, menu, $linkContent) {
        var lang = editor.config.lang;
        var $urlContainer = $('<div style="margin:20px 10px 10px 10px;"></div>');
        var $urlInput = $('<input type="text" class="block" placeholder="http://"/>');
        $urlContainer.append($urlInput);
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

        $linkContent.append($urlContainer).append($btnSubmit).append($btnCancel);

        // 鍙栨秷
        $btnCancel.click(function (e) {
            e.preventDefault();
            menu.dropPanel.hide();
        });

        // callback
        function callback() {
            $urlInput.val('');
        }

        // 纭畾
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var url = $.trim($urlInput.val());
            if (!url) {
                // 鏃犲唴瀹?
                $urlInput.focus();
                return;
            }

            var imgHtml = '<img style="max-width:100%;" src="' + url + '"/>';
            editor.command(e, 'insertHtml', imgHtml, callback);
        });
    }

});
// video 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'video';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;
        var reg = /^\s*(http:\/\/|https:\/\/).+(\.swf|\.ogg|\.mp4|\.webm)/i;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.video,
            commandName: 'unLink'
        });

        // 瑙嗛浠ｇ爜妯℃澘 - flash
        var videoTplFlash = [
            '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ',
            '        codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" ',
            '        width="#{width}" ',
            '        height="#{height}" >',
            '   <param name="movie" ',
            '          value="#{videoUrl}" />',
            '   <param name="allowFullScreen" value="true" />',
            '   <param name="allowScriptAccess" value="always" />',
            '   <param value="transparent" name="wmode" />',
            '   <embed src="#{videoUrl}"',
            '          width="#{width}" ',
            '          height="#{height}" ',
            '          name="cc_8E6888CDEA7087C49C33DC5901307461" ',
            '          allowFullScreen="true" ',
            '          wmode="transparent" ',
            '          allowScriptAccess="always" ',
            '          pluginspage="http://www.macromedia.com/go/getflashplayer" ',
            '          type="application/x-shockwave-flash"/>',
            '</object>',
            '<p><br></p>'
        ].join('');

        // 瑙嗛浠ｇ爜妯℃澘 - h5
        var videoTplH5 = [
            '<video src="#{videoUrl}" controls="controls" width="#{width}" height="#{height}">',
            '</video>',
            '<p><br></p>'
        ].join('');

        // 鍒涘缓 panel 鍐呭
        var $content = $('<div></div>');
        var $urlInputContainer = $('<div style="margin:20px 10px;"></div>');
        var $urlInput = $('<input type="text" class="block" placeholder="*.swf, *.mp4, *.ogg, *.webm"/>');
        $urlInputContainer.append($urlInput);
        var $sizeContainer = $('<div style="margin:20px 10px;"></div>');
        var $widthInput = $('<input type="text" value="480" style="width:50px;text-align:center;"/>');
        var $heightInput = $('<input type="text" value="360" style="width:50px;text-align:center;"/>');
        $sizeContainer.append('<span> ' + lang.width + ' </span>')
                      .append($widthInput)
                      .append('<span> px &nbsp;&nbsp;&nbsp;</span>')
                      .append('<span> ' + lang.height + ' </span>')
                      .append($heightInput)
                      .append('<span> px </span>');
        var $btnContainer = $('<div></div>');
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');
        $btnContainer.append($btnSubmit).append($btnCancel);
        $content.append($urlInputContainer).append($sizeContainer).append($btnContainer);

        // 鍙栨秷鎸夐挳
        $btnCancel.click(function (e) {
            e.preventDefault();
            $urlInput.val('');
            menu.dropPanel.hide();
        });

        // 纭畾鎸夐挳
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var url = $.trim($urlInput.val());
            var width = parseInt($widthInput.val());
            var height = parseInt($heightInput.val());
            var html;

            // 楠岃瘉鏁版嵁
            if (!url) {
                menu.dropPanel.focusFirstInput();
                return;
            }

            if (!reg.test(url)) {
                alert('瑙嗛閾炬帴鏍煎紡閿欒锛?');
                menu.dropPanel.focusFirstInput();
                return;
            }

            if (isNaN(width) || isNaN(height)) {
                alert('瀹藉害鎴栭珮搴︿笉鏄暟瀛楋紒');
                return;
            }

            // 鎷兼帴 video 浠ｇ爜
            if ((/.swf/i).test(url)) {
                // swf 鏍煎紡
                html = videoTplFlash.replace(/#{videoUrl}/ig, url)
                                    .replace(/#{width}/ig, width)
                                    .replace(/#{height}/ig, height);
            } else {
                // 鍏朵粬鏍煎紡锛屽ogg mp4 webm
                html = videoTplH5.replace(/#{videoUrl}/ig, url)
                                 .replace(/#{width}/ig, width)
                                 .replace(/#{height}/ig, height);
            }

            // 鎵ц鍛戒护
            editor.command(e, 'insertHtml', html);
            $urlInput.val('');
        });

        // 鍒涘缓panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 400
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// location 鑿滃崟
_e(function (E, $) {

    // 鍒ゆ柇娴忚鍣ㄧ殑 input 鏄惁鏀寔 keyup
    var inputKeyup = (function (input) {
        return 'onkeyup' in input;
    })(document.createElement('input'));

    // 鐧惧害鍦板浘鐨刱ey
    E.baiduMapAk = 'TVhjYjq1ICT2qqL5LdS8mwas';

    var index = 1;

    E.createMenu(function (check) {
        var menuId = 'location';
        if (!check(menuId)) {
            return;
        }

        if (index++ > 1) {
            E.error('鐩墠涓嶆敮鎸佸湪涓€涓〉闈㈠涓紪杈戝櫒涓婂悓鏃朵娇鐢ㄥ湴鍥撅紝鍙€氳繃鑷畾涔夎彍鍗曢厤缃幓鎺夊湴鍥捐彍鍗?');
            return;
        }

        var editor = this;
        var config = editor.config;
        var lang = config.lang;
        var ak = config.mapAk;

        // 鍦板浘鐨勫彉閲忓瓨鍌ㄥ埌杩欎釜鍦版柟
        editor.mapData = {};
        var mapData = editor.mapData;

        // ---------- 鍦板浘浜嬩欢 ----------
        mapData.markers = [];
        mapData.mapContainerId = 'map' + E.random();

        mapData.clearLocations = function () {
            var map = mapData.map;
            if (!map) {
                return;
            }
            map.clearOverlays();

            //鍚屾椂锛屾竻绌簃arker鏁扮粍
            mapData.markers = [];
        };

        mapData.searchMap = function () {
            var map = mapData.map;
            if (!map) {
                return;
            }

            var BMap = window.BMap;
            var cityName = $cityInput.val();
            var locationName = $searchInput.val();
            var myGeo, marker;

            if(cityName !== ''){
                if(!locationName || locationName === ''){
                    map.centerAndZoom(cityName, 11);
                }

                //鍦板潃瑙ｆ瀽
                if(locationName && locationName !== ''){
                    myGeo = new BMap.Geocoder();
                    // 灏嗗湴鍧€瑙ｆ瀽缁撴灉鏄剧ず鍦ㄥ湴鍥句笂,骞惰皟鏁村湴鍥捐閲?
                    myGeo.getPoint(locationName, function(point){
                        if (point) {
                            map.centerAndZoom(point, 13);
                            marker = new BMap.Marker(point);
                            map.addOverlay(marker);
                            marker.enableDragging();  //鍏佽鎷栨嫿
                            mapData.markers.push(marker);  //灏唌arker鍔犲叆鍒版暟缁勪腑
                        }else{
                            // alert('鏈壘鍒?');
                            map.centerAndZoom(cityName, 11);  //鎵句笉鍒板垯閲嶆柊瀹氫綅鍒板煄甯?
                        }
                    }, cityName);
                }
            } // if(cityName !== '')
        };

        // load script 涔嬪悗鐨? callback
        var hasCallback = false;
        window.baiduMapCallBack = function(){
            // 閬垮厤閲嶅鍔犺浇
            if (hasCallback) {
                return;
            } else {
                hasCallback = true;
            }

            var BMap = window.BMap;
            if (!mapData.map) {
                // 鍒涘缓Map瀹炰緥
                mapData.map = new BMap.Map(mapData.mapContainerId);
            }
            var map = mapData.map;

            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 鍒濆鍖栧湴鍥?,璁剧疆涓績鐐瑰潗鏍囧拰鍦板浘绾у埆
            map.addControl(new BMap.MapTypeControl());   //娣诲姞鍦板浘绫诲瀷鎺т欢
            map.setCurrentCity("鍖椾含");          // 璁剧疆鍦板浘鏄剧ず鐨勫煄甯? 姝ら」鏄繀椤昏缃殑
            map.enableScrollWheelZoom(true);     //寮€鍚紶鏍囨粴杞缉鏀?

            //鏍规嵁IP瀹氫綅
            function locationFun(result){
                var cityName = result.name;
                map.setCenter(cityName);

                // 璁剧疆鍩庡競鍚嶇О
                $cityInput.val(cityName);
                if (E.placeholder) {
                    $searchInput.focus();
                }
                var timeoutId, searchFn;
                if (inputKeyup) {
                   // 骞剁粦瀹氭悳绱簨浠? - input 鏀寔 keyup
                   searchFn = function (e) {
                       if (e.type === 'keyup' && e.keyCode === 13) {
                           e.preventDefault();
                       }
                       if (timeoutId) {
                           clearTimeout(timeoutId);
                       }
                       timeoutId = setTimeout(mapData.searchMap, 500);
                   };
                   $cityInput.on('keyup change paste', searchFn);
                   $searchInput.on('keyup change paste', searchFn);
                } else {
                    // 骞剁粦瀹氭悳绱簨浠? - input 涓嶆敮鎸? keyup
                    searchFn = function () {
                        if (!$content.is(':visible')) {
                            // panel 涓嶆樉绀轰簡锛屽氨涓嶇敤鍐嶇洃鎺т簡
                            clearTimeout(timeoutId);
                            return;
                        }

                        var currentCity = '';
                        var currentSearch = '';
                        var city = $cityInput.val();
                        var search = $searchInput.val();

                        if (city !== currentCity || search !== currentSearch) {
                            // 鍒氳幏鍙栫殑鏁版嵁鍜屼箣鍓嶇殑鏁版嵁涓嶄竴鑷达紝鎵ц鏌ヨ
                            mapData.searchMap();
                            // 鏇存柊鏁版嵁
                            currentCity = city;
                            currentSearch = search;
                        }

                        // 缁х画鐩戞帶
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        timeoutId = setTimeout(searchFn, 1000);
                    };
                    // 寮€濮嬬洃鎺?
                    timeoutId = setTimeout(searchFn, 1000);
                }
            }
            var myCity = new BMap.LocalCity();
            myCity.get(locationFun);

            //榧犳爣鐐瑰嚮锛屽垱寤轰綅缃?
            map.addEventListener("click", function(e){
                var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
                map.addOverlay(marker);
                marker.enableDragging();
                mapData.markers.push(marker);  //鍔犲叆鍒版暟缁勪腑
            }, false);
        };

        mapData.loadMapScript = function () {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=baiduMapCallBack";  // baiduMapCallBack鏄竴涓湰鍦板嚱鏁?
            try {
                // IE10- 鎶ラ敊
                document.body.appendChild(script);
            } catch (ex) {
                E.error('鍔犺浇鍦板浘杩囩▼涓彂鐢熼敊璇?');
            }
        };

        // 鍒濆鍖栧湴鍥?
        mapData.initMap = function () {
            if (window.BMap) {
                // 涓嶆槸绗竴娆★紝鐩存帴澶勭悊鍦板浘鍗冲彲
                window.baiduMapCallBack();
            } else {
                // 绗竴娆★紝鍏堝姞杞藉湴鍥? script锛屽啀澶勭悊鍦板浘锛坰cript鍔犺浇瀹岃嚜鍔ㄦ墽琛屽鐞嗭級
                mapData.loadMapScript();
            }
        };

        // ---------- 鍒涘缓 menu 瀵硅薄 ----------

        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.location
        });

        editor.menus[menuId] = menu;

        // ---------- 鏋勫缓UI ----------

        // panel content
        var $content = $('<div></div>');

        // 鎼滅储妗?
        var $inputContainer = $('<div style="margin:10px 0;"></div>');
        var $cityInput = $('<input type="text"/>');
        $cityInput.css({
            width: '80px',
            'text-align': 'center'
        });
        var $searchInput = $('<input type="text"/>');
        $searchInput.css({
            width: '300px',
            'margin-left': '10px'
        }).attr('placeholder', lang.searchlocation);
        var $clearBtn = $('<button class="right link">' + lang.clearLocation + '</button>');
        $inputContainer.append($clearBtn)
                       .append($cityInput)
                       .append($searchInput);
        $content.append($inputContainer);

        // 娓呴櫎浣嶇疆鎸夐挳
        $clearBtn.click(function (e) {
            $searchInput.val('');
            $searchInput.focus();
            mapData.clearLocations();
            e.preventDefault();
        });

        // 鍦板浘
        var $map = $('<div id="' + mapData.mapContainerId + '"></div>');
        $map.css({
            height: '260px',
            width: '100%',
            position: 'relative',
            'margin-top': '10px',
            border: '1px solid #f1f1f1'
        });
        var $mapLoading = $('<span>' + lang.loading + '</span>');
        $mapLoading.css({
            position: 'absolute',
            width: '100px',
            'text-align': 'center',
            top: '45%',
            left: '50%',
            'margin-left': '-50px'
        });
        $map.append($mapLoading);
        $content.append($map);

        // 鎸夐挳
        var $btnContainer = $('<div style="margin:10px 0;"></div>');
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');
        var $checkLabel = $('<label style="display:inline-block;margin-top:10px;color:#666;"></label>');
        var $check = $('<input type="checkbox">');
        $checkLabel.append($check).append('<span style="display:inline-block;margin-left:5px;">  ' + lang.dynamicMap + '</span>');
        $btnContainer.append($checkLabel)
                     .append($btnSubmit)
                     .append($btnCancel);
        $content.append($btnContainer);

        function callback() {
            $searchInput.val('');
        }

        // 銆庡彇娑堛€忔寜閽簨浠?
        $btnCancel.click(function (e) {
            e.preventDefault();
            callback();
            menu.dropPanel.hide();
        });

        // 銆庣‘瀹氥€忔寜閽簨浠?
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var map = mapData.map,
                isDynamic = $check.is(':checked'),
                markers =  mapData.markers,

                center = map.getCenter(),
                centerLng = center.lng,
                centerLat = center.lat,

                zoom = map.getZoom(),

                size = map.getSize(),
                sizeWidth = size.width,
                sizeHeight = size.height,

                position,
                src,
                iframe;

            if(isDynamic){
                //鍔ㄦ€佸湴鍧€
                src = 'http://ueditor.baidu.com/ueditor/dialogs/map/show.html#';
            }else{
                //闈欐€佸湴鍧€
                src = 'http://api.map.baidu.com/staticimage?';
            }

            //src鍙傛暟
            src = src +'center=' + centerLng + ',' + centerLat +
                '&zoom=' + zoom +
                '&width=' + sizeWidth +
                '&height=' + sizeHeight;
            if(markers.length > 0){
                src = src + '&markers=';

                //娣诲姞鎵€鏈夌殑marker
                $.each(markers, function(key, value){
                    position = value.getPosition();
                    if(key > 0){
                        src = src + '|';
                    }
                    src = src + position.lng + ',' + position.lat;
                });
            }

            if(isDynamic){
                if(markers.length > 1){
                    alert( lang.langDynamicOneLocation );
                    return;
                }

                src += '&markerStyles=l,A';

                //鎻掑叆iframe
                iframe = '<iframe class="ueditor_baidumap" src="{src}" frameborder="0" width="' + sizeWidth + '" height="' + sizeHeight + '"></iframe>';
                iframe = iframe.replace('{src}', src);
                editor.command(e, 'insertHtml', iframe, callback);
            }else{
                //鎻掑叆鍥剧墖
                editor.command(e, 'insertHtml', '<img style="max-width:100%;" src="' + src + '"/>', callback);
            }
        });

        // 鏍规嵁 UI 鍒涘缓鑿滃崟 panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 500
        });

        // ---------- 浜嬩欢 ----------

        // render 鏃舵墽琛屼簨浠?
        menu.onRender = function () {
            if (ak === E.baiduMapAk) {
                E.warn('寤鸿鍦ㄩ厤缃腑鑷畾涔夌櫨搴﹀湴鍥剧殑mapAk锛屽惁鍒欏彲鑳藉奖鍝嶅湴鍥惧姛鑳斤紝鏂囨。锛?' + E.docsite);
            }
        };

        // click 浜嬩欢
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;
            var firstTime = false;

            // -------------闅愯棌-------------
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // -------------鏄剧ず-------------
            if (!mapData.map) {
                // 绗竴娆★紝鍏堝姞杞藉湴鍥?
                firstTime = true;
            }
            mapData.initMap();
            dropPanel.show();

            if (!firstTime) {
                $searchInput.focus();
            }
        };

    });

});
// insertcode 鑿滃崟
_e(function (E, $) {

    // 鍔犺浇 highlightjs 浠ｇ爜
    function loadHljs() {
        if (E.userAgent.indexOf('MSIE 8') > 0) {
            // 涓嶆敮鎸? IE8
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://apps.bdimg.com/libs/highlight.js/9.1.0/highlight.min.js";
        document.body.appendChild(script);
    }


    E.createMenu(function (check) {
        var menuId = 'insertcode';
        if (!check(menuId)) {
            return;
        }

        // 鍔犺浇 highlightjs 浠ｇ爜
        setTimeout(loadHljs, 0);

        var editor = this;
        var lang = editor.config.lang;
        var $txt = editor.txt.$txt;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.insertcode
        });

        // click 浜嬩欢
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // 闅愯棌
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // 鏄剧ず
            $textarea.val('');
            dropPanel.show();

            // highlightjs 璇█鍒楄〃
            var hljs = window.hljs;
            if (hljs && hljs.listLanguages) {
                $langSelect.css({
                    'margin-top': '9px',
                    'margin-left': '5px'
                });
                $.each(hljs.listLanguages(), function (key, lang) {
                    $langSelect.append('<option value="' + lang + '">' + lang + '</option>');
                });
            } else {
                $langSelect.hide();
            }
        };

        // 閫変腑鐘舵€佷笅鐨? click 浜嬩欢
        menu.clickEventSelected = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // 闅愯棌
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // 鏄剧ず
            dropPanel.show();

            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'pre');
            var $targetElem;
            var className;
            if (targetElem) {
                // 纭畾鎵惧埌 pre 涔嬪悗锛屽啀鎵? code
                targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
            }
            if (!targetElem) {
                return;
            }
            $targetElem = $(targetElem);

            // 璧嬪€煎唴瀹?
            $textarea.val($targetElem.text());
            if ($langSelect) {
                // 璧嬪€艰瑷€
                className = $targetElem.attr('class');
                if (className) {
                    $langSelect.val(className.split(' ')[0]);
                }
            }
        };

        // 瀹氫箟鏇存柊閫変腑鐘舵€佺殑浜嬩欢
        menu.updateSelectedEvent = function () {
            var self = this; //鑿滃崟瀵硅薄
            var editor = self.editor;
            var rangeElem;

            rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'pre');

            if (rangeElem) {
                return true;
            }

            return false;
        };

        // 鍒涘缓 panel
        var $content = $('<div></div>');
        var $textarea = $('<textarea></textarea>');
        var $langSelect = $('<select></select>');
        contentHandle($content);
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 500
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;

        // ------ 澧炲姞 content 鍐呭 ------
        function contentHandle($content) {
            // textarea 鍖哄煙
            var $textareaContainer = $('<div></div>');
            $textareaContainer.css({
                margin: '15px 5px 5px 5px',
                height: '160px',
                'text-align': 'center'
            });
            $textarea.css({
                width: '100%',
                height: '100%',
                padding: '10px'
            });
            $textarea.on('keydown', function (e) {
                // 鍙栨秷 tab 閿粯璁よ涓?
                if (e.keyCode === 9) {
                    e.preventDefault();
                }
            });
            $textareaContainer.append($textarea);
            $content.append($textareaContainer);

            // 鎸夐挳鍖哄煙
            var $btnContainer = $('<div></div>');
            var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

            $btnContainer.append($btnSubmit).append($btnCancel).append($langSelect);
            $content.append($btnContainer);

            // 鍙栨秷鎸夐挳
            $btnCancel.click(function (e) {
                e.preventDefault();
                menu.dropPanel.hide();
            });

            // 纭畾鎸夐挳
            var codeTpl = '<pre style="max-width:100%;overflow-x:auto;"><code{#langClass}>{#content}</code></pre>';
            $btnSubmit.click(function (e) {
                e.preventDefault();
                var val = $textarea.val();
                if (!val) {
                    // 鏃犲唴瀹?
                    $textarea.focus();
                    return;
                }

                var rangeElem = editor.getRangeElem();
                if ($.trim($(rangeElem).text())) {
                    codeTpl = '<p><br></p>' + codeTpl;
                }

                var lang = $langSelect ? $langSelect.val() : ''; // 鑾峰彇楂樹寒璇█
                var langClass = '';
                var doHightlight = function () {
                    $('pre code').each(function(i, block) {
                        if (window.hljs) {
                            window.hljs.highlightBlock(block);
                        }
                    });
                };

                // 璇█楂樹寒鏍峰紡
                if (lang) {
                    langClass = ' class="' + lang + ' hljs"';
                }

                // 鏇挎崲鏍囩
                val = val.replace(/&/gm, '&amp;')
                         .replace(/</gm, '&lt;')
                         .replace(/>/gm, '&gt;');

                // ---- menu 鏈€変腑鐘舵€? ----
                if (!menu.selected) {
                    // 鎷兼帴html
                    var html = codeTpl.replace('{#langClass}', langClass).replace('{#content}', val);
                    editor.command(e, 'insertHtml', html, doHightlight);
                    return;
                }

                // ---- menu 閫変腑鐘舵€? ----
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'pre');
                var $targetElem;
                if (targetElem) {
                    // 纭畾鎵惧埌 pre 涔嬪悗锛屽啀鎵? code
                    targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
                }
                if (!targetElem) {
                    return;
                }
                $targetElem = $(targetElem);

                function commandFn() {
                    var className;
                    if (lang) {
                        className = $targetElem.attr('class');
                        if (className !== lang + ' hljs') {
                            $targetElem.attr('class', lang + ' hljs');
                        }
                    }
                    $targetElem.html(val);
                }
                function callback() {
                    editor.restoreSelectionByElem(targetElem);
                    doHightlight();
                }
                editor.customCommand(e, commandFn, callback);
            });
        }

        // ------ enter 鏃讹紝涓嶅彟璧锋爣绛撅紝鍙崲琛? ------
        $txt.on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
            if (!targetElem) {
                return;
            }

            editor.command(e, 'insertHtml', '\n');
        });

        // ------ 鐐瑰嚮鏃讹紝绂佺敤鍏朵粬鏍囩 ------
        function updateMenu() {
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
            if (targetElem) {
                // 鍦? code 涔嬪唴锛岀鐢ㄥ叾浠栬彍鍗?
                editor.disableMenusExcept('insertcode');
            } else {
                // 涓嶆槸鍦? code 涔嬪唴锛屽惎鐢ㄥ叾浠栬彍鍗?
                editor.enableMenusExcept('insertcode');
            }
        }
        $txt.on('keydown click', function (e) {
            // 姝ゅ蹇呴』浣跨敤 setTimeout 寮傛澶勭悊锛屽惁鍒欎笉瀵?
            setTimeout(updateMenu);
        });
    });

});
// undo 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'undo';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.undo
        });

        // click 浜嬩欢
        menu.clickEvent = function (e) {
            editor.undo();
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;


        // ------------ 鍒濆鍖栨椂銆乪nter 鏃躲€佹墦瀛椾腑鏂椂锛屽仛璁板綍 ------------
        // ------------ ctrl + z 鏄皟鐢ㄨ褰曟挙閿€锛岃€屼笉鏄娇鐢ㄦ祻瑙堝櫒榛樿鐨勬挙閿€ ------------
        editor.ready(function () {
            var editor = this;
            var $txt = editor.txt.$txt;
            var timeoutId;

            // 鎵цundo璁板綍
            function undo() {
                editor.undoRecord();
            }

            $txt.on('keyup', function (e) {
                var keyCode = e.keyCode;

                // 鎾ら攢 ctrl + z
                if (e.ctrlKey && keyCode === 90) {
                    editor.undo();
                    return;
                }

                if (keyCode === 13) {
                    // enter 鍋氳褰?
                    undo();
                } else {
                    // keyup 涔嬪悗 1s 涔嬪唴涓嶆搷浣滐紝鍒欏仛涓€娆¤褰?
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(undo, 1000);
                }
            });

            // 鍒濆鍖栧仛璁板綍
            editor.undoRecord();
        });
    });

});
// redo 鑿滃崟
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'redo';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.redo
        });

        // click 浜嬩欢
        menu.clickEvent = function (e) {
            editor.redo();
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// 鍏ㄥ睆 鑿滃崟
_e(function (E, $) {

    // 璁板綍鍏ㄥ睆鏃剁殑scrollTop
    var scrollTopWhenFullScreen;

    E.createMenu(function (check) {
        var menuId = 'fullscreen';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var $txt = editor.txt.$txt;
        var config = editor.config;
        var zIndexConfig = config.zindex || 10000;
        var lang = config.lang;

        var isSelected = false;
        var zIndex;

        var maxHeight;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.fullscreen
        });

        // 瀹氫箟click浜嬩欢
        menu.clickEvent = function (e) {
            // 澧炲姞鏍峰紡
            var $editorContainer = editor.$editorContainer;
            $editorContainer.addClass('wangEditor-fullscreen');

            // 锛堝厛淇濆瓨褰撳墠鐨勶級鍐嶈缃畓-index
            zIndex = $editorContainer.css('z-index');
            $editorContainer.css('z-index', zIndexConfig);

            var $wrapper;
            var txtHeight = $txt.height();
            var txtOuterHeight = $txt.outerHeight();

            if (editor.useMaxHeight) {
                // 璁板綍 max-height锛屽苟鏆傛椂鍘绘帀maxheight
                maxHeight = $txt.css('max-height');
                $txt.css('max-height', 'none');

                // 濡傛灉浣跨敤浜唌axHeight锛? 灏?$txt浠庡畠鐨勭埗鍏冪礌涓Щ鍑烘潵
                $wrapper = $txt.parent();
                $wrapper.after($txt);
                $wrapper.remove();
                $txt.css('overflow-y', 'auto');
            }

            // 璁剧疆楂樺害鍒板叏灞?
            var menuContainer = editor.menuContainer;
            $txt.height(
                E.$window.height() -
                menuContainer.height() -
                (txtOuterHeight - txtHeight)  // 鍘绘帀鍐呰竟璺濆拰澶栬竟璺?
            );

            // 鍙栨秷menuContainer鐨勫唴鑱旀牱寮忥紙menu鍚搁《鏃讹紝浼氫负 menuContainer 璁剧疆涓€浜涘唴鑱旀牱寮忥級
            editor.menuContainer.$menuContainer.attr('style', '');

            // 淇濆瓨鐘舵€?
            isSelected = true;

            // 璁板綍缂栬緫鍣ㄦ槸鍚﹀叏灞?
            editor.isFullScreen = true;

            // 璁板綍璁剧疆鍏ㄥ睆鏃剁殑楂樺害
            scrollTopWhenFullScreen = E.$window.scrollTop();
        };

        // 瀹氫箟閫変腑鐘舵€佺殑 click 浜嬩欢
        menu.clickEventSelected = function (e) {
            // 鍙栨秷鏍峰紡
            var $editorContainer = editor.$editorContainer;
            $editorContainer.removeClass('wangEditor-fullscreen');
            $editorContainer.css('z-index', zIndex);

            // 杩樺師height
            if (editor.useMaxHeight) {
                $txt.css('max-height', maxHeight);
            } else {
                // editor.valueContainerHeight 鍦? editor.txt.initHeight() 涓簨鍏堜繚瀛樹簡
                editor.$valueContainer.css('height', editor.valueContainerHeight);
            }

            // 閲嶆柊璁＄畻楂樺害
            editor.txt.initHeight();

            // 淇濆瓨鐘舵€?
            isSelected = false;

            // 璁板綍缂栬緫鍣ㄦ槸鍚﹀叏灞?
            editor.isFullScreen = false;

            // 杩樺師scrollTop
            if (scrollTopWhenFullScreen != null) {
                E.$window.scrollTop(scrollTopWhenFullScreen);
            }
        };

        // 瀹氫箟閫変腑浜嬩欢
        menu.updateSelectedEvent = function (e) {
            return isSelected;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// 娓叉煋menus
_e(function (E, $) {

    E.fn.renderMenus = function () {

        var editor = this;
        var menus = editor.menus;
        var menuIds = editor.config.menus;
        var menuContainer = editor.menuContainer;

        var menu;
        var groupIdx = 0;
        $.each(menuIds, function (k, v) {
            if (v === '|') {
                groupIdx++;
                return;
            }

            menu = menus[v];
            if (menu) {
                menu.render(groupIdx);
            }
        });
    };

});
// 娓叉煋menus
_e(function (E, $) {

    E.fn.renderMenuContainer = function () {

        var editor = this;
        var menuContainer = editor.menuContainer;
        var $editorContainer = editor.$editorContainer;

        menuContainer.render();

    };

});
// 娓叉煋 txt
_e(function (E, $) {

    E.fn.renderTxt = function () {

        var editor = this;
        var txt = editor.txt;

        txt.render();

        // ready 鏃跺€欙紝璁＄畻txt鐨勯珮搴?
        editor.ready(function () {
            txt.initHeight();
        });
    };

});
// 娓叉煋 container
_e(function (E, $) {

    E.fn.renderEditorContainer = function () {

        var editor = this;
        var $valueContainer = editor.$valueContainer;
        var $editorContainer = editor.$editorContainer;
        var $txt = editor.txt.$txt;
        var $prev, $parent;

        // 灏嗙紪杈戝櫒娓叉煋鍒伴〉闈腑
        if ($valueContainer === $txt) {
            $prev = editor.$prev;
            $parent = editor.$parent;

            if ($prev && $prev.length) {
                // 鏈夊墠缃妭鐐癸紝灏辨彃鍏ュ埌鍓嶇疆鑺傜偣鐨勫悗闈?
                $prev.after($editorContainer);
            } else {
                // 娌℃湁鍓嶇疆鑺傜偣锛屽氨鐩存帴鎻掑叆鍒扮埗鍏冪礌
                $parent.prepend($editorContainer);
            }

        } else {
            $valueContainer.after($editorContainer);
            $valueContainer.hide();
        }

        // 璁剧疆瀹藉害锛堣繖鏍疯缃搴︽湁闂锛?
        // $editorContainer.css('width', $valueContainer.css('width'));
    };

});
// 鑿滃崟浜嬩欢
_e(function (E, $) {

    // 缁戝畾姣忎釜鑿滃崟鐨刢lick浜嬩欢
    E.fn.eventMenus = function () {

        var menus = this.menus;

        // 缁戝畾鑿滃崟鐨勭偣鍑讳簨浠?
        $.each(menus, function (k, v) {
            v.bindEvent();
        });

    };

});
// 鑿滃崟container浜嬩欢
_e(function (E, $) {

    E.fn.eventMenuContainer = function () {

    };

});
// 缂栬緫鍖哄煙浜嬩欢
_e(function (E, $) {

    E.fn.eventTxt = function () {

        var txt = this.txt;

        // txt鍐呭鍙樺寲鏃讹紝淇濆瓨閫夊尯
        txt.saveSelectionEvent();

        // txt鍐呭鍙樺寲鏃讹紝闅忔椂鏇存柊 value
        txt.updateValueEvent();

        // txt鍐呭鍙樺寲鏃讹紝闅忔椂鏇存柊 menu style
        txt.updateMenuStyleEvent();

        // // 榧犳爣hover鏃讹紝鏄剧ず p head 楂樺害锛堟殏鏃跺叧闂繖涓姛鑳斤級
        // if (!/ie/i.test(E.userAgent)) {
        //     // 鏆傛椂涓嶆敮鎸両E
        //     txt.showHeightOnHover();
        // }
    };

});
// 涓婁紶鍥剧墖浜嬩欢
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var fns = editor.config.uploadImgFns; // editor.config.uploadImgFns = {} 鍦╟onfig鏂囦欢涓畾涔変簡

        // -------- 瀹氫箟load鍑芥暟 --------
        fns.onload || (fns.onload = function (resultText, xhr) {
            E.log('涓婁紶缁撴潫锛岃繑鍥炵粨鏋滀负 ' + resultText);

            var editor = this;
            var img;
            if (resultText.indexOf('error|') === 0) {
                // 鎻愮ず閿欒
                E.warn('涓婁紶澶辫触锛?' + resultText.split('|')[1]);
                alert(resultText.split('|')[1]);
            } else {
                E.log('涓婁紶鎴愬姛锛屽嵆灏嗘彃鍏ョ紪杈戝尯鍩燂紝缁撴灉涓猴細' + resultText);

                // 灏嗙粨鏋滄彃鍏ョ紪杈戝櫒
                img = document.createElement('img');
                img.onload = function () {
                    var html = '<img src="' + resultText + '" style="max-width:100%;"/>';
                    editor.command(null, 'insertHtml', html);

                    E.log('宸叉彃鍏ュ浘鐗囷紝鍦板潃 ' + resultText);
                    img = null;
                };
                img.onerror = function () {
                    E.error('浣跨敤杩斿洖鐨勭粨鏋滆幏鍙栧浘鐗囷紝鍙戠敓閿欒銆傝纭浠ヤ笅缁撴灉鏄惁姝ｇ‘锛?' + resultText);
                    img = null;
                };
                img.src = resultText;
            }

        });

        // -------- 瀹氫箟tiemout鍑芥暟 --------
        fns.ontimeout || (fns.ontimeout = function (xhr) {
            E.error('涓婁紶涓婂浘鐗囧彂鐢熼敊璇?');
            alert('涓婁紶涓婂浘鐗囧彂鐢熼敊璇?');
        });

        // -------- 瀹氫箟error鍑芥暟 --------
        fns.onerror || (fns.onerror = function (xhr) {
            E.error('上传图片失败');
            alert('上传图片失败');
        });

    });
});
// xhr 涓婁紶鍥剧墖
_e(function (E, $) {

    if (!window.FileReader || !window.FormData) {
        // 濡傛灉涓嶆敮鎸乭tml5鐨勬枃妗ｆ搷浣滐紝鐩存帴杩斿洖
        return;
    }

    E.plugin(function () {

        var editor = this;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var uploadTimeout = config.uploadTimeout;

        // 鑾峰彇閰嶇疆涓殑涓婁紶浜嬩欢
        var uploadImgFns = config.uploadImgFns;
        var onload = uploadImgFns.onload;
        var ontimeout = uploadImgFns.ontimeout;
        var onerror = uploadImgFns.onerror;

        if (!uploadImgUrl) {
            return;
        }

        // -------- 灏嗕互base64鐨勫浘鐗噓rl鏁版嵁杞崲涓築lob --------
        function convertBase64UrlToBlob(urlData, filetype){
            //鍘绘帀url鐨勫ご锛屽苟杞崲涓篵yte
            var bytes = window.atob(urlData.split(',')[1]);

            //澶勭悊寮傚父,灏哸scii鐮佸皬浜?0鐨勮浆鎹负澶т簬0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            var i;
            for (i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            return new Blob([ab], {type : filetype});
        }

        // -------- 鎻掑叆鍥剧墖鐨勬柟娉? --------
        function insertImg(src, event) {
            var img = document.createElement('img');
            img.onload = function () {
                var html = '<img src="' + src + '" style="max-width:100%;"/>';
                editor.command(event, 'insertHtml', html);

                E.log('宸叉彃鍏ュ浘鐗囷紝鍦板潃 ' + src);
                img = null;
            };
            img.onerror = function () {
                E.error('浣跨敤杩斿洖鐨勭粨鏋滆幏鍙栧浘鐗囷紝鍙戠敓閿欒銆傝纭浠ヤ笅缁撴灉鏄惁姝ｇ‘锛?' + src);
                img = null;
            };
            img.src = src;
        }

        // -------- onprogress 浜嬩欢 --------
        function updateProgress(e) {
            if (e.lengthComputable) {
                var percentComplete = e.loaded / e.total;
                editor.showUploadProgress(percentComplete * 100);
            }
        }

        // -------- xhr 涓婁紶鍥剧墖 --------
        editor.xhrUploadImg = function (opt) {
            // opt 鏁版嵁
            var event = opt.event;
            var base64 = opt.base64;
            var fileType = opt.fileType || 'image/png';  // 鏃犳墿灞曞悕锛岀敤png
            var name = opt.name || 'wangEditor_upload_file';
            var loadfn = opt.loadfn || onload;
            var errorfn = opt.errorfn || onerror;
            var timeoutfn = opt.timeoutfn || ontimeout;

            // 鑾峰彇鏂囦欢鎵╁睍鍚?
            var fileExt = 'png';  // 榛樿涓? png
            if (fileType.indexOf('/') > 0 && fileType.split('/')[1]) {
                fileExt = fileType.split('/')[1];
            }

            // ------------ begin 棰勮妯℃嫙涓婁紶 ------------
            if (E.isOnWebsite) {
                E.log('棰勮妯℃嫙涓婁紶');
                insertImg(base64, event);
                return;
            }
            // ------------ end 棰勮妯℃嫙涓婁紶 ------------

            // 鍙橀噺澹版槑
            var xhr = new XMLHttpRequest();
            var timeoutId;
            var src;
            var formData = new FormData();

            // 瓒呮椂澶勭悊
            function timeoutCallback() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (xhr && xhr.abort) {
                    xhr.abort();
                }

                // 瓒呮椂浜嗗氨闃绘榛樿琛屼负
                event.preventDefault();

                // 鎵ц鍥炶皟鍑芥暟锛屾彁绀轰粈涔堝唴瀹癸紝閮藉簲璇ュ湪鍥炶皟鍑芥暟涓畾涔?
                timeoutfn && timeoutfn.call(editor, xhr);

                // 闅愯棌杩涘害鏉?
                editor.hideUploadProgress();
            }

            xhr.onload = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // 鎵цload鍑芥暟锛屼换浣曟搷浣滐紝閮藉簲璇ュ湪load鍑芥暟涓畾涔?
                loadfn && loadfn.call(editor, xhr.responseText, xhr);

                // 闅愯棌杩涘害鏉?
                editor.hideUploadProgress();
            };
            xhr.onerror = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // 瓒呮椂浜嗗氨闃绘榛樿琛屼负
                event.preventDefault();

                // 鎵цerror鍑芥暟锛岄敊璇彁绀猴紝搴旇鍦╡rror鍑芥暟涓畾涔?
                errorfn && errorfn.call(editor, xhr);

                // 闅愯棌杩涘害鏉?
                editor.hideUploadProgress();
            };
            // xhr.onprogress = updateProgress;
            xhr.upload.onprogress = updateProgress;

            // 濉厖鏁版嵁
            formData.append(name, convertBase64UrlToBlob(base64, fileType), E.random() + '.' + fileExt);

            // 寮€濮嬩笂浼?
            xhr.open('POST', uploadImgUrl, true);
            xhr.send(formData);
            timeoutId = setTimeout(timeoutCallback, uploadTimeout);

            E.log('寮€濮嬩笂浼?...骞跺紑濮嬭秴鏃惰绠?');
        };
    });
});
// 杩涘害鏉?
_e(function (E, $) {

    E.plugin(function () {

        var editor = this;
        var menuContainer = editor.menuContainer;
        var menuHeight = menuContainer.height();
        var $editorContainer = editor.$editorContainer;
        var width = $editorContainer.width();
        var $progress = $('<div class="wangEditor-upload-progress"></div>');

        // 娓叉煋浜嬩欢
        var isRender = false;
        function render() {
            if (isRender) {
                return;
            }
            isRender = true;

            $progress.css({
                top: menuHeight + 'px'
            });
            $editorContainer.append($progress);
        }

        // ------ 鏄剧ず杩涘害 ------
        editor.showUploadProgress = function (progress) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 鏄剧ず涔嬪墠锛屽厛鍒ゆ柇鏄惁娓叉煋
            render();

            $progress.show();
            $progress.width(progress * width / 100);
        };

        // ------ 闅愯棌杩涘害鏉? ------
        var timeoutId;
        function hideProgress() {
            $progress.hide();
            timeoutId = null;
        }
        editor.hideUploadProgress = function (time) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            time = time || 750;
            timeoutId = setTimeout(hideProgress, time);
        };
    });
});
// upload img 鎻掍欢
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var uploadTimeout = config.uploadTimeout;
        var event;

        if (!uploadImgUrl) {
            return;
        }

        // 鑾峰彇editor鐨勪笂浼燿om
        var $uploadContent = editor.$uploadContent;
        if (!$uploadContent) {
            return;
        }

        // 鑷畾涔塙I锛屽苟娣诲姞鍒颁笂浼燿om鑺傜偣涓?
        var $uploadIcon = $('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>');
        $uploadContent.append($uploadIcon);

        // ---------- 鏋勫缓涓婁紶瀵硅薄 ----------
        var upfile = new E.UploadFile({
            editor: editor,
            uploadUrl: uploadImgUrl,
            timeout: uploadTimeout,
            fileAccept: 'image/*'    // 鍙厑璁搁€夋嫨鍥剧墖
        });

        // 閫夋嫨鏈湴鏂囦欢锛屼笂浼?
        $uploadIcon.click(function (e) {
            event = e;
            upfile.selectFiles();
        });
    });
});
// h5 鏂瑰紡涓婁紶鍥剧墖
_e(function (E, $) {

    if (!window.FileReader || !window.FormData) {
        // 濡傛灉涓嶆敮鎸乭tml5鐨勬枃妗ｆ搷浣滐紝鐩存帴杩斿洖
        return;
    }

    // 鏋勯€犲嚱鏁?
    var UploadFile = function (opt) {
        this.editor = opt.editor;
        this.uploadUrl = opt.uploadUrl;
        this.timeout = opt.timeout;
        this.fileAccept = opt.fileAccept;
        this.multiple = true;
    };

    UploadFile.fn = UploadFile.prototype;

    // clear
    UploadFile.fn.clear = function () {
        this.$input.val('');
        E.log('input value 宸叉竻绌?');
    };

    // 娓叉煋
    UploadFile.fn.render = function () {
        var self = this;
        if (self._hasRender) {
            // 涓嶈閲嶅娓叉煋
            return;
        }

        E.log('娓叉煋dom');

        var fileAccept = self.fileAccept;
        var acceptTpl = fileAccept ? 'accept="' + fileAccept + '"' : '';
        var multiple = self.multiple;
        var multipleTpl = multiple ? 'multiple="multiple"' : '';
        var $input = $('<input type="file" ' + acceptTpl + ' ' + multipleTpl + '/>');
        var $container = $('<div style="visibility:hidden;"></div>');

        $container.append($input);
        E.$body.append($container);

        // onchange 浜嬩欢
        $input.on('change', function (e) {
            self.selected(e, $input.get(0));
        });

        // 璁板綍瀵硅薄鏁版嵁
        self.$input = $input;

        // 璁板綍
        self._hasRender = true;
    };

    // 閫夋嫨
    UploadFile.fn.selectFiles = function () {
        var self = this;

        E.log('浣跨敤 html5 鏂瑰紡涓婁紶');

        // 鍏堟覆鏌?
        self.render();

        // 閫夋嫨
        E.log('閫夋嫨鏂囦欢');
        self.$input.click();
    };

    // 閫変腑鏂囦欢涔嬪悗
    UploadFile.fn.selected = function (e, input) {
        var self = this;
        var files = input.files || [];
        if (files.length === 0) {
            return;
        }

        E.log('閫変腑 ' + files.length + ' 涓枃浠?');

        // 閬嶅巻閫変腑鐨勬枃浠讹紝棰勮銆佷笂浼?
        $.each(files, function (key, value) {
            self.upload(value);
        });
    };

    // 涓婁紶鍗曚釜鏂囦欢
    UploadFile.fn.upload = function (file) {
        var self = this;
        var editor = self.editor;
        var filename = file.name || '';
        var fileType = file.type || '';
        var uploadImgFns = editor.config.uploadImgFns;
        var onload = uploadImgFns.onload;
        var ontimeout = uploadImgFns.ontimeout;
        var onerror = uploadImgFns.onerror;
        var reader = new FileReader();

        if (!onload || !ontimeout || !onerror) {
            E.error('璇蜂负缂栬緫鍣ㄩ厤缃笂浼犲浘鐗囩殑 onload ontimeout onerror 鍥炶皟浜嬩欢');
            return;
        }


        E.log('寮€濮嬫墽琛? ' + filename + ' 鏂囦欢鐨勪笂浼?');

        // 娓呯┖ input 鏁版嵁
        function clearInput() {
            self.clear();
        }

        // onload浜嬩欢
        reader.onload = function (e) {
            E.log('宸茶鍙?' + filename + '鏂囦欢');

            var base64 = e.target.result || this.result;
            editor.xhrUploadImg({
                event: e,
                base64: base64,
                fileType: fileType,
                name: 'wangEditorH5File',
                loadfn: function (resultText, xhr) {
                    clearInput();
                    // 鎵ц閰嶇疆涓殑鏂规硶
                    var editor = this;
                    onload.call(editor, resultText, xhr);
                },
                errorfn: function (xhr) {
                    clearInput();
                    if (E.isOnWebsite) {
                        alert('wangEditor瀹樼綉鏆傛椂娌℃湁鏈嶅姟绔紝鍥犳鎶ラ敊銆傚疄闄呴」鐩腑涓嶄細鍙戠敓');
                    }
                    // 鎵ц閰嶇疆涓殑鏂规硶
                    var editor = this;
                    onerror.call(editor, xhr);
                },
                timeoutfn: function (xhr) {
                    clearInput();
                    if (E.isOnWebsite) {
                        alert('wangEditor瀹樼綉鏆傛椂娌℃湁鏈嶅姟绔紝鍥犳瓒呮椂銆傚疄闄呴」鐩腑涓嶄細鍙戠敓');
                    }
                    // 鎵ц閰嶇疆涓殑鏂规硶
                    var editor = this;
                    ontimeout(editor, xhr);
                }
            });
        };

        // 寮€濮嬪彇鏂囦欢
        reader.readAsDataURL(file);
    };

    // 鏆撮湶缁? E
    E.UploadFile = UploadFile;

});
// form鏂瑰紡涓婁紶鍥剧墖
_e(function (E, $) {

    if (window.FileReader && window.FormData) {
        // 濡傛灉鏀寔 html5 涓婁紶锛屽垯杩斿洖
        return;
    }

    // 鏋勯€犲嚱鏁?
    var UploadFile = function (opt) {
        this.editor = opt.editor;
        this.uploadUrl = opt.uploadUrl;
        this.timeout = opt.timeout;
        this.fileAccept = opt.fileAccept;
        this.multiple = false;
    };

    UploadFile.fn = UploadFile.prototype;

    // clear
    UploadFile.fn.clear = function () {
        this.$input.val('');
        E.log('input value 宸叉竻绌?');
    };

    // 闅愯棌modal
    UploadFile.fn.hideModal = function () {
        this.modal.hide();
    };

    // 娓叉煋
    UploadFile.fn.render = function () {
        var self = this;
        var editor = self.editor;
        if (self._hasRender) {
            // 涓嶈閲嶅娓叉煋
            return;
        }

        // 鏈嶅姟鍣ㄧ璺緞
        var uploadUrl = self.uploadUrl;

        E.log('娓叉煋dom');

        // 鍒涘缓 form 鍜? iframe
        var iframeId = 'iframe' + E.random();
        var $iframe = $('<iframe name="' + iframeId + '" id="' + iframeId + '" frameborder="0" width="0" height="0"></iframe>');
        var multiple = self.multiple;
        var multipleTpl = multiple ? 'multiple="multiple"' : '';
        var $p = $('<p>閫夋嫨鍥剧墖骞朵笂浼?</p>');
        var $input = $('<input type="file" ' + multipleTpl + ' name="wangEditorFormFile"/>');
        var $btn = $('<input type="submit" value="涓婁紶"/>');
        var $form = $('<form enctype="multipart/form-data" method="post" action="' + uploadUrl + '" target="' + iframeId + '"></form>');
        var $container = $('<div style="margin:10px 20px;"></div>');

        $form.append($p).append($input).append($btn);
        $container.append($form);
        $container.append($iframe);

        self.$input = $input;
        self.$iframe = $iframe;

        // 鐢熸垚 modal
        var modal = new E.Modal(editor, undefined, {
            $content: $container
        });
        self.modal = modal;

        // 璁板綍
        self._hasRender = true;
    };

    // 缁戝畾 iframe load 浜嬩欢
    UploadFile.fn.bindLoadEvent = function () {
        var self = this;
        if (self._hasBindLoad) {
            // 涓嶈閲嶅缁戝畾
            return;
        }

        var editor = self.editor;
        var $iframe = self.$iframe;
        var iframe = $iframe.get(0);
        var iframeWindow = iframe.contentWindow;
        var onload = editor.config.uploadImgFns.onload;

        // 瀹氫箟load浜嬩欢
        function onloadFn() {
            var resultText = $.trim(iframeWindow.document.body.innerHTML);
            if (!resultText) {
                return;
            }

            // 鎵цload鍑芥暟锛屾彃鍏ュ浘鐗囩殑鎿嶄綔锛屽簲璇ュ湪load鍑芥暟涓墽琛?
            onload(resultText);

            // 娓呯┖ input 鏁版嵁
            self.clear();

            // 闅愯棌modal
            self.hideModal();
        }

        // 缁戝畾 load 浜嬩欢
        if (iframe.attachEvent) {
            iframe.attachEvent('onload', onloadFn);
        } else {
            iframe.onload = onloadFn;
        }

        // 璁板綍
        self._hasBindLoad = true;
    };

    UploadFile.fn.show = function () {
        var self = this;
        var modal = self.modal;

        function show() {
            modal.show();
            self.bindLoadEvent();
        }
        setTimeout(show);
    };

    // 閫夋嫨
    UploadFile.fn.selectFiles = function () {
        var self = this;

        E.log('浣跨敤 form 鏂瑰紡涓婁紶');

        // 鍏堟覆鏌?
        self.render();

        // 鍏堟竻绌?
        self.clear();

        // 鏄剧ず
        self.show();
    };

    // 鏆撮湶缁? E
    E.UploadFile = UploadFile;

});
// upload img 鎻掍欢 绮樿创鍥剧墖
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var pasteEvent;
        var $imgsBeforePaste;

        // 鏈厤缃笂浼犲浘鐗噓rl锛屽垯蹇界暐
        if (!uploadImgUrl) {
            return;
        }

        // -------- 闈? chrome 涓嬶紝閫氳繃鏌ユ壘绮樿创鐨勫浘鐗囩殑鏂瑰紡涓婁紶 --------
        function findPasteImgAndUpload() {
            var reg = /^data:(image\/\w+);base64/;
            var $imgs = $txt.find('img');

            E.log('绮樿创鍚庯紝妫€鏌ュ埌缂栬緫鍣ㄦ湁' + $imgs.length + '涓浘鐗囥€傚紑濮嬮亶鍘嗗浘鐗囷紝璇曞浘鎵惧埌鍒氬垰绮樿创杩囨潵鐨勫浘鐗?');

            $.each($imgs, function () {
                var img = this;
                var $img = $(img);
                var flag;
                var base64 = $img.attr('src');
                var type;

                // 鍒ゆ柇褰撳墠鍥剧墖鏄惁鏄矘璐翠箣鍓嶇殑
                $imgsBeforePaste.each(function () {
                    if (img === this) {
                        // 褰撳墠鍥剧墖鏄矘璐翠箣鍓嶇殑
                        flag = true;
                        return false;
                    }
                });

                // 褰撳墠鍥剧墖鏄矘璐翠箣鍓嶇殑锛屽垯蹇界暐
                if (flag) {
                    return;
                }

                E.log('鎵惧埌涓€涓矘璐磋繃鏉ョ殑鍥剧墖');

                if (reg.test(base64)) {
                    // 寰楀埌鐨勭矘璐寸殑鍥剧墖鏄? base64 鏍煎紡锛岀鍚堣姹?
                    E.log('src 鏄? base64 鏍煎紡锛屽彲浠ヤ笂浼?');
                    type = base64.match(reg)[1];
                    editor.xhrUploadImg({
                        event: pasteEvent,
                        base64: base64,
                        fileType: type,
                        name: 'wangEditorPasteFile'
                    });
                } else {
                    E.log('src 涓? ' + base64 + ' 锛屼笉鏄? base64 鏍煎紡锛屾殏鏃朵笉鏀寔涓婁紶');
                }

                // 鏈€缁堢Щ闄ゅ師鍥剧墖
                $img.remove();
            });

            E.log('閬嶅巻缁撴潫');
        }

        // 寮€濮嬬洃鎺х矘璐翠簨浠?
        $txt.on('paste', function (e) {
            pasteEvent = e;
            var data = pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData;
            var text;
            var items;

            // -------- 璇曞浘鑾峰彇鍓垏鏉夸腑鐨勬枃瀛楋紝鏈夋枃瀛楃殑鎯呭喌涓嬶紝灏变笉澶勭悊鍥剧墖绮樿创 --------
            if (data == null) {
                text = window.clipboardData && window.clipboardData.getData('text');
            } else {
                text = data.getData('text/plain') || data.getData('text/html');
            }
            if (text) {
                return;
            }

            items = data && data.items;
            if (items) {
                // -------- chrome 鍙互鐢? data.items 鍙栧嚭鍥剧墖 -----
                E.log('閫氳繃 data.items 寰楀埌浜嗘暟鎹?');

                $.each(items, function (key, value) {
                    var fileType = value.type || '';
                    if(fileType.indexOf('image') < 0) {
                        // 涓嶆槸鍥剧墖
                        return;
                    }

                    var file = value.getAsFile();
                    var reader = new FileReader();

                    E.log('寰楀埌涓€涓矘璐村浘鐗?');

                    reader.onload = function (e) {
                        E.log('璇诲彇鍒扮矘璐寸殑鍥剧墖');

                        // 鎵ц涓婁紶
                        var base64 = e.target.result || this.result;
                        editor.xhrUploadImg({
                            event: pasteEvent,
                            base64: base64,
                            fileType: fileType,
                            name: 'wangEditorPasteFile'
                        });
                    };

                    //璇诲彇绮樿创鐨勬枃浠?
                    reader.readAsDataURL(file);
                });
            } else {
                // -------- 闈? chrome 涓嶈兘鐢? data.items 鍙栧浘鐗? -----

                E.log('鏈粠 data.items 寰楀埌鏁版嵁锛屼娇鐢ㄦ娴嬬矘璐村浘鐗囩殑鏂瑰紡');

                // 鑾峰彇
                $imgsBeforePaste = $txt.find('img');
                E.log('绮樿创鍓嶏紝妫€鏌ュ埌缂栬緫鍣ㄦ湁' + $imgsBeforePaste.length + '涓浘鐗?');

                // 寮傛涓婁紶鎵惧埌鐨勫浘鐗?
                setTimeout(findPasteImgAndUpload, 0);
            }
        });

    });
});
// 鎷栨嫿涓婁紶鍥剧墖 鎻掍欢
_e(function (E, $) {

    E.plugin(function () {

        var editor = this;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;

        // 鏈厤缃笂浼犲浘鐗噓rl锛屽垯蹇界暐
        if (!uploadImgUrl) {
            return;
        }

        // 闃绘娴忚鍣ㄩ粯璁よ涓?
        E.$document.on('dragleave drop dragenter dragover', function (e) {
            e.preventDefault();
        });

        // 鐩戞帶 $txt drop 浜嬩欢
        $txt.on('drop', function (dragEvent) {
            dragEvent.preventDefault();

            var originalEvent = dragEvent.originalEvent;
            var files = originalEvent.dataTransfer && originalEvent.dataTransfer.files;

            if (!files || !files.length) {
                return;
            }

            $.each(files, function (k, file) {
                var type = file.type;
                var name = file.name;

                if (type.indexOf('image/') < 0) {
                    // 鍙帴鏀跺浘鐗?
                    return;
                }

                E.log('寰楀埌鍥剧墖 ' + name);

                var reader = new FileReader();
                reader.onload = function (e) {
                    E.log('璇诲彇鍒板浘鐗? ' + name);

                    // 鎵ц涓婁紶
                    var base64 = e.target.result || this.result;
                    editor.xhrUploadImg({
                        event: dragEvent,
                        base64: base64,
                        fileType: type,
                        name: 'wangEditorDragFile'
                    });
                };

                //璇诲彇绮樿创鐨勬枃浠?
                reader.readAsDataURL(file);

            });
        });
    });

});
// 缂栬緫鍣ㄥ尯鍩? table toolbar
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var $currentTable;

        // 鐢ㄥ埌鐨刣om鑺傜偣
        var isRendered = false;
        var $toolbar = $('<div class="txt-toolbar"></div>');
        var $triangle = $('<div class="tip-triangle"></div>');
        var $delete = $('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>');
        var $zoomSmall = $('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>');
        var $zoomBig = $('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');

        // 娓叉煋鍒伴〉闈?
        function render() {
            if (isRendered) {
                return;
            }

            // 缁戝畾浜嬩欢
            bindEvent();

            // 鎷兼帴 娓叉煋鍒伴〉闈笂
            $toolbar.append($triangle)
                    .append($delete)
                    .append($zoomSmall)
                    .append($zoomBig);
            editor.$editorContainer.append($toolbar);
            isRendered = true;
        }

        // 缁戝畾浜嬩欢
        function bindEvent() {
            // 缁熶竴鎵ц鍛戒护鐨勬柟娉?
            var commandFn;
            function command(e, callback) {
                if (commandFn) {
                    editor.customCommand(e, commandFn, callback);
                }
            }

            // 鍒犻櫎
            $delete.click(function (e) {
                commandFn = function () {
                    $currentTable.remove();
                };
                command(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // 鏀惧ぇ
            $zoomBig.click(function (e) {
                commandFn = function () {
                    $currentTable.css({
                        width: '100%'
                    });
                };
                command(e, function () {
                    setTimeout(show);
                });
            });

            // 缂╁皬
            $zoomSmall.click(function (e) {
                commandFn = function () {
                    $currentTable.css({
                        width: 'auto'
                    });
                };
                command(e, function () {
                    setTimeout(show);
                });
            });
        }

        // 鏄剧ず toolbar
        function show() {
            if (editor._disabled) {
                // 缂栬緫鍣ㄥ凡缁忚绂佺敤锛屽垯涓嶈鏄剧ず
                return;
            }
            if ($currentTable == null) {
                return;
            }
            $currentTable.addClass('clicked');
            var tablePosition = $currentTable.position();
            var tableTop = tablePosition.top;
            var tableLeft = tablePosition.left;
            var tableHeight = $currentTable.outerHeight();
            var tableWidth = $currentTable.outerWidth();

            // --- 瀹氫綅 toolbar ---

            // 璁＄畻鍒濇缁撴灉
            var top = tableTop + tableHeight;
            var left = tableLeft;
            var marginLeft = 0;

            var txtTop = $txt.position().top;
            var txtHeight = $txt.outerHeight();
            if (top > (txtTop + txtHeight)) {
                // top 涓嶅緱瓒呭嚭缂栬緫鑼冨洿
                top = txtTop + txtHeight;
            }

            // 鏄剧ず锛堟柟渚胯绠? margin锛?
            $toolbar.show();

            // 璁＄畻 margin
            var width = $toolbar.outerWidth();
            marginLeft = tableWidth / 2 - width / 2;

            // 瀹氫綅
            $toolbar.css({
                top: top + 5,
                left: left,
                'margin-left': marginLeft
            });
            // 濡傛灉瀹氫綅澶潬宸︿簡
            if (marginLeft < 0) {
                // 寰楀埌涓夎褰㈢殑margin-left
                $toolbar.css('margin-left', '0');
                $triangle.hide();
            } else {
                $triangle.show();
            }
        }

        // 闅愯棌 toolbar
        function hide() {
            if ($currentTable == null) {
                return;
            }
            $currentTable.removeClass('clicked');
            $currentTable = null;
            $toolbar.hide();
        }

        // click table 浜嬩欢
        $txt.on('click', 'table', function (e) {
            var $table = $(e.currentTarget);

            // 娓叉煋
            render();

            if ($currentTable && ($currentTable.get(0) === $table.get(0))) {
                setTimeout(hide, 100);
                return;
            }

            // 鏄剧ず toolbar
            $currentTable = $table;
            show();

            // 闃绘鍐掓场
            e.preventDefault();
            e.stopPropagation();

        }).on('click keypress scroll', function (e) {
            setTimeout(hide, 100);
        });
        E.$body.on('click keypress scroll', function (e) {
            setTimeout(hide, 100);
        });
    });

});
// 缂栬緫鍣ㄥ尯鍩? img toolbar
_e(function (E, $) {

    if (E.userAgent.indexOf('MSIE 8') > 0) {
        return;
    }

    E.plugin(function () {
        var editor = this;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var $editorContainer = editor.$editorContainer;
        var $currentImg;

        // 鐢ㄥ埌鐨刣om鑺傜偣
        var isRendered = false;
        var $dragPoint = $('<div class="img-drag-point"></div>');
        var $toolbar = $('<div class="txt-toolbar"></div>');
        var $triangle = $('<div class="tip-triangle"></div>');
        var $delete = $('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>');
        var $zoomSmall = $('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>');
        var $zoomBig = $('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');
        var $floatLeft = $('<a href="#"><i class="wangeditor-menu-img-align-left"></i></a>');
        var $noFloat = $('<a href="#"><i class="wangeditor-menu-img-align-justify"></i></a>');
        var $floatRight = $('<a href="#"><i class="wangeditor-menu-img-align-right"></i></a>');

        // 璁板綍鏄惁姝ｅ湪鎷栨嫿
        var isOnDrag = false;

        // 娓叉煋鍒伴〉闈?
        function render() {
            if (isRendered) {
                return;
            }

            // 缁戝畾浜嬩欢
            bindToolbarEvent();
            bindDragEvent();

            // 鎷兼帴 娓叉煋鍒伴〉闈笂
            $toolbar.append($triangle)
                    .append($delete)
                    .append($zoomSmall)
                    .append($zoomBig)
                    .append($floatLeft)
                    .append($noFloat)
                    .append($floatRight);
            editor.$editorContainer.append($toolbar).append($dragPoint);
            isRendered = true;
        }

        // 缁戝畾toolbar浜嬩欢
        function bindToolbarEvent() {
            // 缁熶竴鎵ц鍛戒护鐨勬柟娉?
            var commandFn;
            function command(e, callback) {
                if (commandFn) {
                    editor.customCommand(e, commandFn, callback);
                }
            }

            // 鍒犻櫎
            $delete.click(function (e) {
                commandFn = function () {
                    $currentImg.remove();
                };
                command(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // 鏀惧ぇ
            $zoomBig.click(function (e) {
                commandFn = function () {
                    var img = $currentImg.get(0);
                    var width = img.width;
                    var height = img.height;
                    width = width * 1.1;
                    height = height * 1.1;

                    $currentImg.css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                };
                command(e, function () {
                    setTimeout(show);
                });
            });

            // 缂╁皬
            $zoomSmall.click(function (e) {
                commandFn = function () {
                    var img = $currentImg.get(0);
                    var width = img.width;
                    var height = img.height;
                    width = width * 0.9;
                    height = height * 0.9;

                    $currentImg.css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                };
                command(e, function () {
                    setTimeout(show);
                });
            });

            // 宸︽诞鍔?
            $floatLeft.click(function (e) {
                commandFn = function () {
                    $currentImg.css({
                        float: 'left'
                    });
                };
                command(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // 鍙虫诞鍔?
            $floatRight.click(function (e) {
                commandFn = function () {
                    $currentImg.css({
                        float: 'right'
                    });
                };
                command(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // 鏃犳诞鍔?
            $noFloat.click(function (e) {
                commandFn = function () {
                    $currentImg.css({
                        float: 'none'
                    });
                };
                command(e, function () {
                    setTimeout(hide, 100);
                });
            });
        }

        // 缁戝畾drag浜嬩欢
        function bindDragEvent() {
            var _x, _y;
            var dragMarginLeft, dragMarginTop;
            var imgWidth, imgHeight;

            function mousemove (e) {
                var diffX, diffY;

                // 璁＄畻宸
                diffX = e.pageX - _x;
                diffY = e.pageY - _y;

                // --------- 璁＄畻鎷栨嫿鐐圭殑浣嶇疆 ---------
                var currentDragMarginLeft = dragMarginLeft + diffX;
                var currentDragMarginTop = dragMarginTop + diffY;
                $dragPoint.css({
                    'margin-left': currentDragMarginLeft,
                    'margin-top': currentDragMarginTop
                });

                // --------- 璁＄畻鍥剧墖鐨勫ぇ灏? ---------
                var currentImgWidth = imgWidth + diffX;
                var currentImggHeight = imgHeight + diffY;
                $currentImg && $currentImg.css({
                    width: currentImgWidth,
                    height: currentImggHeight
                });
            }

            $dragPoint.on('mousedown', function(e){
                if (!$currentImg) {
                    return;
                }
                // 褰撳墠榧犳爣浣嶇疆
                _x = e.pageX;
                _y = e.pageY;

                // 褰撳墠鎷栨嫿鐐圭殑浣嶇疆
                dragMarginLeft = parseFloat($dragPoint.css('margin-left'), 10);
                dragMarginTop = parseFloat($dragPoint.css('margin-top'), 10);

                // 褰撳墠鍥剧墖鐨勫ぇ灏?
                imgWidth = $currentImg.width();
                imgHeight = $currentImg.height();

                // 闅愯棌 $toolbar
                $toolbar.hide();

                // 缁戝畾璁＄畻浜嬩欢
                E.$document.on('mousemove._dragResizeImg', mousemove);
                E.$document.on('mouseup._dragResizeImg', function (e) {
                    // 鍙栨秷缁戝畾
                    E.$document.off('mousemove._dragResizeImg');
                    E.$document.off('mouseup._dragResizeImg');

                    // 闅愯棌锛屽苟杩樺師鎷栨嫿鐐圭殑浣嶇疆
                    hide();
                    $dragPoint.css({
                        'margin-left': dragMarginLeft,
                        'margin-top': dragMarginTop
                    });

                    // 璁板綍
                    isOnDrag = false;
                });

                // 璁板綍
                isOnDrag = true;
            });
        }

        // 鏄剧ず toolbar
        function show() {
            if (editor._disabled) {
                // 缂栬緫鍣ㄥ凡缁忚绂佺敤锛屽垯涓嶈鏄剧ず
                return;
            }
            if ($currentImg == null) {
                return;
            }
            $currentImg.addClass('clicked');
            var imgPosition = $currentImg.position();
            var imgTop = imgPosition.top;
            var imgLeft = imgPosition.left;
            var imgHeight = $currentImg.outerHeight();
            var imgWidth = $currentImg.outerWidth();

            // --- 瀹氫綅 dragpoint ---
            $dragPoint.css({
                top: imgTop + imgHeight,
                left: imgLeft + imgWidth
            });

            // --- 瀹氫綅 toolbar ---

            // 璁＄畻鍒濇缁撴灉
            var top = imgTop + imgHeight;
            var left = imgLeft;
            var marginLeft = 0;

            var txtTop = $txt.position().top;
            var txtHeight = $txt.outerHeight();
            if (top > (txtTop + txtHeight)) {
                // top 涓嶅緱瓒呭嚭缂栬緫鑼冨洿
                top = txtTop + txtHeight;
            } else {
                // top 瓒呭嚭缂栬緫鑼冨洿锛宒ragPoint灏变笉鏄剧ず浜?
                $dragPoint.show();
            }

            // 鏄剧ず锛堟柟渚胯绠? margin锛?
            $toolbar.show();

            // 璁＄畻 margin
            var width = $toolbar.outerWidth();
            marginLeft = imgWidth / 2 - width / 2;

            // 瀹氫綅
            $toolbar.css({
                top: top + 5,
                left: left,
                'margin-left': marginLeft
            });
            // 濡傛灉瀹氫綅澶潬宸︿簡
            if (marginLeft < 0) {
                // 寰楀埌涓夎褰㈢殑margin-left
                $toolbar.css('margin-left', '0');
                $triangle.hide();
            } else {
                $triangle.show();
            }

            // disable 鑿滃崟
            editor.disableMenusExcept();
        }

        // 闅愯棌 toolbar
        function hide() {
            if ($currentImg == null) {
                return;
            }
            $currentImg.removeClass('clicked');
            $currentImg = null;

            $toolbar.hide();
            $dragPoint.hide();

            // enable 鑿滃崟
            editor.enableMenusExcept();
        }

        // 鍒ゆ柇img鏄惁鏄竴涓〃鎯?
        var emotionConfig = editor.config.emotions;
        function isEmotion(imgSrc) {
            var result = false;
            $.each(emotionConfig, function (k, conf) {
                var flag = false;
                $.each(conf.imgs, function (idx, val) {
                    if (imgSrc === val) {
                        result = true;
                        flag = true;
                        return false;
                    }
                });
                if (flag) {
                    return false;
                }
            });
            return result;
        }

        // click img 浜嬩欢
        $txt.on('mousedown', 'img', function (e) {
            e.preventDefault();
        }).on('click', 'img', function (e) {
            var $img = $(e.currentTarget);
            var src = $img.attr('src');

            if (!src || isEmotion(src)) {
                // 鏄竴涓〃鎯呭浘鏍?
                return;
            }

            // ---------- 涓嶆槸琛ㄦ儏鍥炬爣 ----------

            // 娓叉煋
            render();

            if ($currentImg && ($currentImg.get(0) === $img.get(0))) {
                setTimeout(hide, 100);
                return;
            }

            // 鏄剧ず toolbar
            $currentImg = $img;
            show();

            // 闃绘鍐掓场
            e.preventDefault();
            e.stopPropagation();

        }).on('click keypress scroll', function (e) {
            if (!isOnDrag) {
                setTimeout(hide, 100);
            }
        });

    });

});
// menu鍚搁《
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var menuFixed = editor.config.menuFixed;
        if (menuFixed === false || typeof menuFixed !== 'number') {
            // 娌℃湁閰嶇疆鑿滃崟鍚搁《
            return;
        }
        var bodyMarginTop = parseFloat(E.$body.css('margin-top'), 10);
        if (isNaN(bodyMarginTop)) {
            bodyMarginTop = 0;
        }

        var $editorContainer = editor.$editorContainer;
        var editorTop = $editorContainer.offset().top;
        var editorHeight = $editorContainer.outerHeight();

        var $menuContainer = editor.menuContainer.$menuContainer;
        var menuCssPosition = $menuContainer.css('position');
        var menuCssTop = $menuContainer.css('top');
        var menuWidth;
        var menuHeight = $menuContainer.outerHeight();
        var menuTop = $menuContainer.offset().top;

        var $txt = editor.txt.$txt;

        E.$window.scroll(function () {
            //鍏ㄥ睆妯″紡涓嶆敮鎸?
            if (editor.isFullScreen) {
                return;
            }
            // 闇€瑕侀噸鏂拌绠楀搴︼紝鍥犱负娴忚鍣ㄥ彲鑳芥鏃跺嚭鐜版粴鍔ㄦ潯
            menuWidth = $menuContainer.width();

            var sTop = E.$window.scrollTop();
            if (sTop >= menuTop && sTop + menuFixed + menuHeight + 30 < editorTop + editorHeight) {
                // 鍚搁《
                $menuContainer.css({
                    position: 'fixed',
                    top: menuFixed
                });

                // 鍥哄畾瀹藉害
                $menuContainer.width(menuWidth);

                // 澧炲姞body margin-top
                E.$body.css({
                    'margin-top': bodyMarginTop + menuHeight
                });

                // 璁板綍
                if (!editor._isMenufixed) {
                    editor._isMenufixed = true;
                }
            } else {
                // 鍙栨秷鍚搁《
                $menuContainer.css({
                    position: menuCssPosition,
                    top: menuCssTop
                });

                // 鍙栨秷瀹藉害鍥哄畾
                $menuContainer.css('width', '100%');

                // 杩樺師 body margin-top
                E.$body.css({
                    'margin-top': bodyMarginTop
                });

                // 鎾ら攢璁板綍
                if (editor._isMenufixed) {
                    editor._isMenufixed = false;
                }
            }
        });
    });

});
// 缂╄繘 鑿滃崟鎻掍欢
_e(function (E, $) {

    // 鐢? createMenu 鏂规硶鍒涘缓鑿滃崟
    E.createMenu(function (check) {

        // 瀹氫箟鑿滃崟id锛屼笉瑕佸拰鍏朵粬鑿滃崟id閲嶅銆傜紪杈戝櫒鑷甫鐨勬墍鏈夎彍鍗昳d锛屽彲閫氳繃銆庡弬鏁伴厤缃?-鑷畾涔夎彍鍗曘€忎竴鑺傛煡鐪?
        var menuId = 'indent';

        // check灏嗘鏌ヨ彍鍗曢厤缃紙銆庡弬鏁伴厤缃?-鑷畾涔夎彍鍗曘€忎竴鑺傛弿杩帮級涓槸鍚﹁鑿滃崟id锛屽鏋滄病鏈夛紝鍒欏拷鐣ヤ笅闈㈢殑浠ｇ爜銆?
        if (!check(menuId)) {
            return;
        }

        // this 鎸囧悜 editor 瀵硅薄鑷韩
        var editor = this;

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,  // 缂栬緫鍣ㄥ璞?
            id: menuId,  // 鑿滃崟id
            title: '缂╄繘', // 鑿滃崟鏍囬

            // 姝ｅ父鐘舵€佸拰閫変腑瑁呬笅鐨刣om瀵硅薄锛屾牱寮忛渶瑕佽嚜瀹氫箟
            $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-indent-left"></i></a>'),
            $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-indent-left"></i></a>')
        });

        // 鑿滃崟姝ｅ父鐘舵€佷笅锛岀偣鍑诲皢瑙﹀彂璇ヤ簨浠?
        menu.clickEvent = function (e) {
            var elem = editor.getRangeElem();
            var p = editor.getSelfOrParentByName(elem, 'p');
            var $p;

            if (!p) {
                // 鏈壘鍒? p 鍏冪礌锛屽垯蹇界暐
                return e.preventDefault();
            }
            $p = $(p);

            // 浣跨敤鑷畾涔夊懡浠?
            function commandFn() {
                $p.css('text-indent', '2em');
            }
            editor.customCommand(e, commandFn);
        };

        // 鑿滃崟閫変腑鐘舵€佷笅锛岀偣鍑诲皢瑙﹀彂璇ヤ簨浠?
        menu.clickEventSelected = function (e) {
            var elem = editor.getRangeElem();
            var p = editor.getSelfOrParentByName(elem, 'p');
            var $p;

            if (!p) {
                // 鏈壘鍒? p 鍏冪礌锛屽垯蹇界暐
                return e.preventDefault();
            }
            $p = $(p);

            // 浣跨敤鑷畾涔夊懡浠?
            function commandFn() {
                $p.css('text-indent', '0');
            }
            editor.customCommand(e, commandFn);
        };

        // 鏍规嵁褰撳墠閫夊尯锛岃嚜瀹氫箟鏇存柊鑿滃崟鐨勯€変腑鐘舵€佹垨鑰呮甯哥姸鎬?
        menu.updateSelectedEvent = function () {
            // 鑾峰彇褰撳墠閫夊尯鎵€鍦ㄧ殑鐖跺厓绱?
            var elem = editor.getRangeElem();
            var p = editor.getSelfOrParentByName(elem, 'p');
            var $p;
            var indent;

            if (!p) {
                // 鏈壘鍒? p 鍏冪礌锛屽垯鏍囪涓烘湭澶勪簬閫変腑鐘舵€?
                return false;
            }
            $p = $(p);
            indent = $p.css('text-indent');

            if (!indent || indent === '0px') {
                // 寰楀埌鐨刾锛宼ext-indent 灞炴€ф槸 0锛屽垯鏍囪涓烘湭澶勪簬閫変腑鐘舵€?
                return false;
            }

            // 鎵惧埌 p 鍏冪礌锛屽苟涓? text-indent 涓嶆槸 0锛屽垯鏍囪涓洪€変腑鐘舵€?
            return true;
        };

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;
    });

});
// 琛岄珮 鑿滃崟鎻掍欢
_e(function (E, $) {

    // 鐢? createMenu 鏂规硶鍒涘缓鑿滃崟
    E.createMenu(function (check) {

        // 瀹氫箟鑿滃崟id锛屼笉瑕佸拰鍏朵粬鑿滃崟id閲嶅銆傜紪杈戝櫒鑷甫鐨勬墍鏈夎彍鍗昳d锛屽彲閫氳繃銆庡弬鏁伴厤缃?-鑷畾涔夎彍鍗曘€忎竴鑺傛煡鐪?
        var menuId = 'lineheight';

        // check灏嗘鏌ヨ彍鍗曢厤缃紙銆庡弬鏁伴厤缃?-鑷畾涔夎彍鍗曘€忎竴鑺傛弿杩帮級涓槸鍚﹁鑿滃崟id锛屽鏋滄病鏈夛紝鍒欏拷鐣ヤ笅闈㈢殑浠ｇ爜銆?
        if (!check(menuId)) {
            return;
        }

        // this 鎸囧悜 editor 瀵硅薄鑷韩
        var editor = this;

        // 鐢变簬娴忚鍣ㄨ嚜韬笉鏀寔 lineHeight 鍛戒护锛屽洜姝よ鍋氫竴涓猦ook
        editor.commandHooks.lineHeight = function (value) {
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,pre');
            if (!targetElem) {
                return;
            }
            $(targetElem).css('line-height', value + '');
        };

        // 鍒涘缓 menu 瀵硅薄
        var menu = new E.Menu({
            editor: editor,  // 缂栬緫鍣ㄥ璞?
            id: menuId,  // 鑿滃崟id
            title: '琛岄珮', // 鑿滃崟鏍囬
            commandName: 'lineHeight', // 鍛戒护鍚嶇О

            // 姝ｅ父鐘舵€佸拰閫変腑瑁呬笅鐨刣om瀵硅薄锛屾牱寮忛渶瑕佽嚜瀹氫箟
            $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-arrows-v"></i></a>'),
            $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-arrows-v"></i></a>')
        });

        // 鏁版嵁婧?
        var data  = {
            // 鏍煎紡锛? 'value' : 'title'
            '1.0': '1.0鍊?',
            '1.5': '1.5鍊?',
            '1.8': '1.8鍊?',
            '2.0': '2.0鍊?',
            '2.5': '2.5鍊?',
            '3.0': '3.0鍊?'
        };

        // 涓簃enu鍒涘缓droplist瀵硅薄
        var tpl = '<span style="line-height:{#commandValue}">{#title}</span>';
        menu.dropList = new E.DropList(editor, menu, {
            data: data,  // 浼犲叆鏁版嵁婧?
            tpl: tpl  // 浼犲叆妯℃澘
        });

        // 澧炲姞鍒癳ditor瀵硅薄涓?
        editor.menus[menuId] = menu;

    });

});
// 鑷畾涔変笂浼?
_e(function (E, $) {

    E.plugin(function () {

        var editor = this;
        var customUpload = editor.config.customUpload;
        if (!customUpload) {
            return;
        } else if (editor.config.uploadImgUrl) {
            alert('鑷畾涔変笂浼犳棤鏁堬紝璇︾湅娴忚鍣ㄦ棩蹇梒onsole.log');
            E.error('宸茬粡閰嶇疆浜? uploadImgUrl 锛屽氨涓嶈兘鍐嶉厤缃? customUpload 锛屼袱鑰呭啿绐併€傚皢瀵艰嚧鑷畾涔変笂浼犳棤鏁堛€?');
            return;
        }

        var $uploadContent = editor.$uploadContent;
        if (!$uploadContent) {
            E.error('鑷畾涔変笂浼狅紝鏃犳硶鑾峰彇 editor.$uploadContent');
        }

        // UI
        var $uploadIcon = $('<a href="#" class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></a>');
        $uploadContent.append($uploadIcon);

        // 璁剧疆id锛屽苟鏆撮湶
        var btnId = 'upload' + E.random();
        var containerId = 'upload' + E.random();
        $uploadIcon.attr('id', btnId);
        $uploadContent.attr('id', containerId);

        editor.customUploadBtnId = btnId;
        editor.customUploadContainerId = containerId;
    });

});
// 鐗堟潈鎻愮ず
_e(function (E, $) {
    E.info('鏈〉闈㈠瘜鏂囨湰缂栬緫鍣ㄧ敱 wangEditor 鎻愪緵 http://wangeditor.github.io/ ');
});

    // 鏈€缁堣繑鍥瀢angEditor鏋勯€犲嚱鏁?
    return window.wangEditor;
});
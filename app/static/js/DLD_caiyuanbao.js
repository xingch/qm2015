/*! cyb last modify 2013-12-17-05:12:36*/
/**
 * @date 2013-10-21
 * 
 */
var DLD = {};

!function(window) {
    var events = {}, inits = {}, _ = {}, ACTION = "data-action", $ = window.$, doc = window.document;
    DLD._ = _, DLD.Util = _, 
    _.getAttribute = function(el, name) {
        return el.getAttribute(name);
    }, _.type = function(val) {
        if (null === val) return "null";
        var toString = Object.prototype.toString;
        return toString.call(val).split(" ")[1].replace("]", "");
    }, _.getAgent = function() {
        var nvg = window.navigator, browser_id = [ "Chrome", "MSIE", "Firefox", "Opera", "Safari" ], vendors = [ "Google" ], browserName = "", browserVersion = "", search = function(orginStr, matcher) {
            for (var i = matcher.length, result = -1; i > 0 && -1 == (result = orginStr.indexOf(matcher[--i])); ) ;
            return {
                index: result,
                position: i
            };
        }, get_version = function(name) {
            var agent = nvg.userAgent, begin = agent.indexOf(name), restAgent = agent.substring(begin);
            return version = /(\d+([.]\d+)*)/, 
            version.test(restAgent) ? RegExp.$1 : null;
        }, vendor = search(nvg.vendor ? nvg.vendor : "", vendors);
        if (-1 != vendor.index) browserName = browser_id[vendor.position], 
        browserVersion = get_version(browserName); else {
            var agent = search(nvg.userAgent, browser_id);
            browserName = browser_id[agent.position], 
            browserVersion = get_version(browserName);
        }
        return function() {
            return {
                name: browserName,
                version: browserVersion
            };
        };
    }(), /**
     * [aop description]
     * @param  {[type]} orgFn    [description]
     * @param  {[type]} beforeFn [description]
     * @param  {[type]} afterFn  [description]
     * @return {[fn]}          [description]
     */
    _.aop = function(orgFn, opts) {
        return function() {
            var slice = Array.prototype.slice;
            opts.before && opts.before(), 
            orgFn.apply(opts.context ? opts.context : null, slice.call(arguments, 0)), 
            opts.after && opts.after();
        };
    }, _.define = function(space, name, val) {
        var p;
        space[name] || (space[name] = {});
        for (p in val) val.hasOwnProperty(p) && (space[name][p] = val[p]);
    }, _.each = function(arr, fn) {
        for (var i = 0; i < arr.length; ++i) fn.apply(arr[i], [ arr[i], i ]);
    }, /**
     * [templateParser description]
     * @param  {[string]} template [description]
     * @param  {[object || array ]} data     [description]
     * @param  {[string]} reg      [description]
     * @return {[string]}  content   [description]
     */
    _.templateParser = function(template, data, r) {
        function renderFromObject(t, d) {
            var p, regexp, content = t;
            for (p in d) if (regexp = new RegExp(reg + p + reg), 
            d.hasOwnProperty(p)) for (;content.match(regexp); ) content = content.replace(regexp, d[p]);
            return content;
        }
        var reg = r || "#", content = "";
        if ("object" != typeof data) try {} catch (e) {
            throw {
                message: "wrong data"
            };
        }
        data instanceof Array || (data = [ data ]);
        for (var i = 0, len = data.length; len > i; ++i) content += renderFromObject(template, data[i]);
        return content;
    }, /**
 *  @render localStorage for lt IE8
 *   
 */
    window.localStorage || (doc.onreadystatechange = function() {
        "complete" === doc.readyState && (_.define(window, "localStorage", function() {
            var domain = window.location.host, behaviorUrl = "#default#userData", dataSource = doc.createElement("DIV");
            doc.body.appendChild(dataSource), 
            dataSource.style.display = "none", 
            dataSource.style.behavior = "url(" + behaviorUrl + ")", 
            dataSource.addBehavior(behaviorUrl), 
            window.localStorage = {
                setItem: function(name, value) {
                    dataSource.load(domain), 
                    dataSource.setAttribute(name, value), 
                    dataSource.save(domain);
                },
                getItem: function(name) {
                    return dataSource.load(domain), 
                    dataSource.getAttribute(name);
                },
                removeItem: function(key) {
                    dataSource.load(domain), 
                    dataSource.removeAttribute(key), 
                    dataSource.save(domain);
                }
            };
        }()), doc.onreadystatechange = null);
    }), _.addEvent = function(el, type, fn, pup) {
        return el.addEventListener ? el.addEventListener(type, fn, pup) : el.attachEvent("on" + type, fn);
    }, /**
     * [serialize jQuery needed]
     * @param  {[type]} form [description]
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    _.serialize = function(form, opts) {
        return $.map($(form).serialize().split("&"), function(el) {
            var tmp = el.split("=");
            return tmp[0] in opts ? tmp[0] + "=" + opts[tmp[0]](tmp[1]) : tmp.join("=");
        }).join("&");
    }, /**
     * [date_getDistance description]
     * @return {[type]} [description]
     */
    _.date_getDistance = function(ms) {
        for (var d = [ 864e5, 36e5, 6e4, 1e3 ], result = [], i = 0; i < d.length; ++i) result.push(Math.floor(ms / d[i])), 
        ms %= d[i];
        return result;
    }, /**
 * [addEvent Proxy global event ]
 * @param {[string]}  type [event type 'click , mousemove , ...']
 * @param {[string]}  tag  [ trigger tag ]
 * @param {Function} fn   [event callback]
 */
    DLD.addEvent = function(type, tag, fn) {
        events[type] ? events[type][tag] = fn : (events[type] = {}, 
        events[type][tag] = fn, 
        _.addEvent(doc.body, type, function(e) {
            var cur = e.target || e.srcElement, action = 1 === cur.nodeType ? _.getAttribute(cur, ACTION) : !1;
            action && action in events[type] && "Function" === _.type(events[type][action]) && events[type][action].apply(cur, [ e ]);
        }));
    }, /**
 * [removeEvent description]
 * @param  {[string]} type 
 * @param  {[string]} tag  
 */
    DLD.removeEvent = function(type, tag) {
        events[type][tag] = null;
    }, /**
 * [register description]
 * 注册页面交互js
 * @param  {[String]}   flag [唯一的页面标识]
 * @param  {Function} fn   [页面交互的初始化函数]
 */
    DLD.register = function(flag, fn) {
        if (inits[flag]) throw {
            message: flag + " has been registered !"
        };
        inits[flag] = fn;
    }, /**
 * [init description]
 * 页面初始化
 * @param  {[String]} flag [唯一的页面标识]
 */
    DLD.init = function(flag) {
        inits[flag]();
    }, /**
 * DLD.widget
 */
    DLD.widgets = {}, /**
     * [Upload description]
     * @param {[HTML element]} el   [description]
     * @param {[object]} params  [description]
     * @param {[object]} opts [optional params]
     * required  "jquery , jquery.uploadify.min.js"
     * 
     */
    DLD.widgets.Upload = function(el, params, opts) {
        function btnSyn() {
            for (var p, $liftBtn, $sinkBtn, wraps = listWrapper.children, i = 0; i < wraps.length; ++i) p = wraps[i], 
            $liftBtn = $(p).find("[data-action='lift']"), 
            $sinkBtn = $(p).find("[data-action='sink']"), 
            null === p.previousSibling ? $liftBtn.hide() : $liftBtn.show(), 
            null === p.nextSibling ? $sinkBtn.hide() : $sinkBtn.show();
        }
        // if(!(this instanceof DLD.widgets.Upload)){
        //     return new DLD.widgets.Upload(  el , params , opts );
        // }
        var defaultOpts = opts || {
            previewList: !1
        }, listWrapper = doc.createElement("DIV"), slibing = el.nextSibling, tpl = defaultOpts.template ? defaultOpts.template : "<div class='cancel'><a data-action='delete' ></a></div><ul class='uploadify-list clear'><li><img width='80' height='80' src = '#data#' /></li><li><div><label>图片描述:</label></div><div><textarea style='resize:none;margin: 2px; height: 57px; width: 214px' ></textarea></div></li></ul>", parent = el.parentNode;
        parent.insertBefore(listWrapper, slibing);
        // _.templateParser
        var lim = defaultOpts.previewListLimit, cName = defaultOpts.previewListClass;
        cName && (listWrapper.className = cName);
        var addItems = defaultOpts.previewList ? function(file, data, response, limit) {
            var wrap = doc.createElement("DIV");
            if (wrap.className = "uploadify-queue-item", 
            "object" != typeof data && (data = $.parseJSON(data)), 
            wrap.innerHTML = _.templateParser(tpl, data), 
            listWrapper.appendChild(wrap), 
            limit) for (var items = $(listWrapper).find(".uploadify-queue-item"), i = 0, j = items.length - limit; j > i; ++i) listWrapper.removeChild(items[i]);
            btnSyn();
        } : function() {};
        defaultOpts.previewList.data && !function() {
            for (var wrap, d = defaultOpts.previewList.data, i = 0, len = d.length; len > i; ++i) wrap = doc.createElement("DIV"), 
            wrap.className = "uploadify-queue-item", 
            wrap.innerHTML = _.templateParser(tpl, d[i]), 
            listWrapper.appendChild(wrap);
            btnSyn();
        }();
        var beforeDelete = opts.beforeDelete || function() {
            return !0;
        }, afterDelete = opts.afterDelete || function() {};
        $(listWrapper).click(function(e) {
            var cur = e.target || e.srcElement, p = cur.parentNode, action = cur.getAttribute("data-action");
            if (action) {
                for (;"uploadify-queue-item" !== p.className; ) p = p.parentNode;
                var f = p.parentNode;
                switch (action) {
                  case "delete":
                    beforeDelete(p) && (p.innerHTML = "", 
                    p.style.display = "none", 
                    p = null, afterDelete(p), 
                    btnSyn());
                    break;

                  case "lift":
                    f.insertBefore(p, p.previousSibling), 
                    btnSyn(p);
                    break;

                  case "sink":
                    f.insertBefore(p, p.nextSibling.nextSibling), 
                    btnSyn(p);
                }
            }
        });
        var onUploadSuccess = function(fn) {
            return function(file, data, response) {
                fn(file, data, response), 
                addItems(file, data, response, lim);
            };
        };
        params.onUploadSuccess && (params.onUploadSuccess = onUploadSuccess(params.onUploadSuccess)), 
        $(el).uploadify(params);
    }, DLD.widgets.window = function(opts) {
        return this instanceof DLD.widgets.window ? (opts = opts ? opts : {}, 
        this._init(opts), this) : new DLD.widgets.window(opts);
    }, DLD.widgets.window.prototype = function() {
        var hasCover = !1, DEFAULT = {
            W_CLASSNAME: "c-window",
            C_CLASSNAME: "c-cover"
        };
        return {
            _cover: {
                el: doc.createElement("DIV"),
                hide: function() {
                    this.el.style.display = "none";
                },
                show: function() {
                    this.el.style.display = "block";
                },
                off: function() {
                    doc.body.removeChild(this.el);
                },
                on: function() {
                    doc.body.appendChild(this.el);
                },
                _init: function() {
                    this.el.className = DEFAULT.C_CLASSNAME, 
                    doc.body.appendChild(this.el), 
                    this.hide();
                }
            },
            hide: function() {
                this.el.style.display = "none", 
                this._cover.hide();
            },
            show: function() {
                this.el.style.display = "block", 
                this.position((doc.body.offsetWidth - this.el.offsetWidth) / 2, (doc.body.offsetHeight - this.el.offsetHeight) / 2), 
                this._cover.show();
            },
            open: function(content) {
                content && this.getContent(content), 
                this.show();
            },
            addEvent: function(name, fn) {
                this.events[name] = fn;
            },
            position: function(x, y) {
                this.el.style.top = y + "px", 
                this.el.style.left = x + "px";
            },
            SIMPLETEMPLATE: "<div class='c-w-h'><strong>#title#</strong> <span class='c-w-close' data-action='close'></span></div><div class='c-w-c'><div class='c-w-section'>#content#</div></div>",
            _init: function(opts) {
                var that = this, content = opts.content ? opts.content : "";
                this.el = doc.createElement("DIV"), 
                this.events = {}, hasCover || (this._cover._init(), 
                hasCover = !0), this.el.className = DEFAULT.W_CLASSNAME, 
                doc.body.appendChild(this.el), 
                this.getContent(content), 
                this.position((doc.body.offsetWidth - this.el.offsetWidth) / 2, (doc.body.offsetHeight - this.el.offsetHeight) / 2), 
                this.hide(), this.addEvent("close", function() {
                    this.hide();
                }), this.el.onclick = function(e) {
                    e || (e = window.event);
                    var cur = e.target || e.srcElement, action = cur.getAttribute("data-action");
                    that.events[action] && that.events[action].apply(that, [ e ]);
                };
            },
            getContent: function(content) {
                "String" === _.type(content) ? this.el.innerHTML = content : this.el.appendChild(content);
            },
            getSimpleContent: function(title, content) {
                this.getContent(_.templateParser(this.SIMPLETEMPLATE, {
                    title: title,
                    content: content
                }));
            },
            error: function(content, title) {
                this.getSimpleContent(title || "错误信息", "<span class='c-w-wrong'>" + content + "</span><div style='text-align: center;'><a data-action='close' class='c-red-btn'>确定</a></div>"), 
                this.show();
            },
            tip: function(content, title) {
                this.getSimpleContent(title || "提示信息", "<span class='c-dp'>" + content + "</span><div style='text-align: center;'><a data-action='close' class='c-red-btn'>确定</a></div>"), 
                this.show();
            }
        };
    }(), /*
    Validate for form

        @Autor: WuNing
        @date: 2013-3-21 
        @main method:
            setHandle:{
                handle:{
                    clickPager:fn,
                    setPager:fn,
                    pre:fn,
                    next:fn
                }
            }
            destroy:

        @config style by CONST value
*/
    _.getAgent = function() {
        var nvg = window.navigator, browser_id = [ "Chrome", "MSIE", "Firefox", "Opera", "Safari" ], vendors = [ "Google" ], browserName = "", browserVersion = "", search = function(orginStr, matcher) {
            for (var i = matcher.length, result = -1; i > 0 && -1 === (result = orginStr.indexOf(matcher[--i])); ) ;
            return {
                index: result,
                position: i
            };
        }, get_version = function(name) {
            var agent = nvg.userAgent, begin = agent.indexOf(name), restAgent = agent.substring(begin), version = /(\d+([.]\d+)*)/;
            return version.test(restAgent) ? RegExp.$1 : null;
        }, vendor = search(nvg.vendor ? nvg.vendor : "", vendors);
        if (-1 !== vendor.index) browserName = browser_id[vendor.position], 
        browserVersion = get_version(browserName); else {
            var agent = search(nvg.userAgent, browser_id);
            browserName = browser_id[agent.position], 
            browserVersion = get_version(browserName);
        }
        return function() {
            return {
                name: browserName,
                nameAndVersion: browserName + browserVersion,
                version: browserVersion
            };
        };
    }(), DLD.widgets._validate = function() {
        var id = 0, isIE = "MSIE" === _.getAgent().name ? !0 : !1, invalid_handle = function(el) {
            isIE && (el.checkValidity = function() {
                var pattern = this.attributes.pattern, /*
                                    @modify by wuning 2013/3/26 
                                    FOR damn IE
                                    lt IE7: this.attributes["required"] always eixsted;
                                    gt IE7: when required specified , this.attributes["required"] existed;
                                */
                required = this.attributes.required ? this.attributes.required.specified : !1, value = $.trim(this.value);
                if ("" === value) return required ? ("function" == typeof this.oninvalid && this.oninvalid(), 
                !1) : !0;
                if (pattern && pattern.specified) {
                    var reg = new RegExp("^" + pattern.value + "$");
                    return reg.test(value) ? !0 : ("function" == typeof this.oninvalid && this.oninvalid(), 
                    !1);
                }
                return !0;
            });
        };
        return function(options) {
            var that = this, el = options.el, blur = options.blur, change = options.change, focus = options.focus, wraper = options.wraper, invalid = options.invalid;
            this.invalid = invalid, 
            this.change = change, 
            this.focus = focus, 
            this._id = id++, this.el = el, 
            this.wraper = wraper, 
            /*
                    @modify by wuning 2013/5/7
                    render blur listener
                */
            this.blur = blur, this.name = el.name, 
            this.id = el.id, this.update = function() {
                return that.name in wraper.rules && (that.rules = wraper.rules[that.name]), 
                that;
            }, this.update(), this.check = function() {
                var valid, rules = that.rules || null;
                return rules ? (valid = rules.apply(that.el, [ that.el.checkValidity.apply(that.el, [ null ]), that ]), 
                valid || this.el.oninvalid()) : valid = that.el.checkValidity.apply(that.el, [ null ]), 
                valid;
            }, this.el.onchange = function(e) {
                that.change && that.change.apply(this, [ that, e ]);
            }, this.el.oninvalid = function(e) {
                e = e || {}, e.dld_status = null !== this.getAttribute("required") && "" === this.value ? "emptyValue" : "invalidValue", 
                that.invalid && that.invalid.apply(this, [ that, e ]);
            }, this.el._dldValidate = this, 
            /*
                    @modify by wuning 2013/5/7
                    render blur listener
                */
            this.el.onblur = function(e) {
                that.blur && that.blur.apply(this, [ that, e ]);
            }, /*
                    @modify by wuning 2013/5/9
                    register focus listener
                */
            this.el.onfocus = function(e) {
                that.focus && that.focus.apply(this, [ that, e ]);
            }, isIE || $(el).attr("required") && "" != $(el).attr("pattern"), 
            invalid_handle(el);
        };
    }(), DLD.widgets.validateForm = function() {
        var id = 0;
        return function(form, opts) {
            var that = this, submit_handle = function(e) {
                var checkResult = that.check(), result = that.handle.onsubmit ? that.handle.onsubmit.apply(that, [ checkResult, e ]) : !0;
                return result;
            };
            opts || (opts = {}), 
            this._id = id++, this.handle = {}, 
            this.rules = {};
            var rules = opts.rules || {}, handle = opts.handle || {};
            that.validations = [], 
            this.el = form;
            // novalidate='true'
            var elType = {
                SELECT: !0,
                INPUT: !0,
                TEXTARE: !0
            };
            this._init = function() {
                return _.each(form.elements, function() {
                    this.tagName in elType && that.validations.push(new DLD.widgets._validate({
                        el: this,
                        wraper: that,
                        invalid: that.handle.invalid,
                        change: that.handle.change,
                        blur: that.handle.blur,
                        focus: that.handle.focus,
                        rules: that.rules
                    }));
                }), this;
            }, form.noValidate = !0, 
            this.el.onsubmit = submit_handle, 
            this.setHandle(handle), 
            this.setRules(rules), 
            this._init();
        };
    }(), DLD.widgets.validateForm.prototype = {
        check: function() {
            var invalid = !1;
            return _.each(this.validations, function() {
                this.check() || (invalid = !0);
            }), this.handle.onCheckAll && (this.handle.onCheckAll() || (invalid = !0)), 
            invalid ? !1 : !0;
        },
        setHandle: function(handle) {
            var handle = handle || {};
            return this.handle.invalid = handle.invalid, 
            this.handle.onsubmit = handle.onsubmit, 
            this.handle.change = handle.change, 
            this.handle.onCheckAll = handle.onCheckAll, 
            /*
                    @modify by wuning 2013/5/7
                    render blur listener
                */
            this.handle.blur = handle.blur, 
            /*
                    @modify by wuning 2013/5/9
                    register focus and check listener
                */
            this.handle.focus = handle.focus, 
            this;
        },
        setRules: function(rules) {
            return this.rules = rules, 
            this;
        },
        submit: function() {
            this.el.submit();
        }
    }, /**
   * [Player description]
   * @param {[type]} time [description]
   * @param {[type]} ani  [description]
   * @param {[type]} opts [description]
   */
    _.Player = function(time, ani) {
        var timer, auto = !1;
        this.stop = function() {
            auto ? clearInterval(timer) : clearTimeout(timer);
        }, this.start = function(auto) {
            auto ? (auto = !0, timer = setInterval(ani, time)) : timer = setTimeout(ani, time);
        };
    }, DLD.widgets.Slider = function(el, time, type, opts) {
        var play, TIME = time || 1e4, o = opts ? opts : {}, curNum = 2, auto = o.auto || !0, pages = $(el).find("[data-page]"), block = !1, pNums = function() {
            for (var dNums, p = $(el).find('[data-role="pager"]')[0], i = 0, l = pages.length, content = ""; l > i; ++i) content += "<li><a class=''  data-action='fade' data-num = '" + (i + 1) + "' >" + (i + 1) + "</a></li>";
            return p.innerHTML = content, 
            dNums = $(p).find("[data-num]"), 
            dNums[0].className = "on", 
            function(num) {
                for (i = 0; l > i; ++i) dNums[i].className = "";
                dNums[num - 1].className = "on";
            };
        }(), typeFactory = function(type) {
            var T = {
                fade: {
                    cover: null,
                    init: function() {
                        var len = pages.length, i = 0;
                        for (this.els = [], 
                        this.MAX = len, i; len > i; ++i) pages[i].style.position = "absolute", 
                        pages[i].style.zIndex = len - i + 1, 
                        pages[i].style.display = "none";
                        pages[0].style.display = "", 
                        this.cover = pages[0];
                    },
                    resetIndex: function(num) {
                        for (var i = num, j = 0, len = pages.length; len > i; ++i) pages[i].style.zIndex = len - j++ + 1;
                        for (i = 0; num > i; ++i) pages[i].style.zIndex = len - j++ + 1;
                    },
                    animate: function(pNum) {
                        if (this.cover !== pages[pNum - 1]) {
                            block = !0;
                            var cover_index = parseInt(this.cover.style.zIndex, 10), that = this;
                            pages[pNum - 1].style.display = "", 
                            pages[pNum - 1].style.zIndex = cover_index - 1, 
                            $(this.cover).fadeOut(1e3, function() {
                                that.cover = pages[pNum - 1], 
                                that.resetIndex(pNum - 1), 
                                block = !1;
                            });
                        }
                    }
                }
            };
            return T[type];
        }, categoryObj = typeFactory(type);
        categoryObj.init(el), 
        play = new _.Player(TIME, function() {
            categoryObj.animate(curNum), 
            pNums(curNum), curNum === pages.length ? curNum = 1 : curNum++;
        }), play.start(auto), 
        $(el).click(function(e) {
            var event = e || window.event, cur = event.srcElement || event.target, action = cur.getAttribute("data-action");
            switch (action) {
              case "fade":
                var pageNum = parseInt(cur.getAttribute("data-num"), 10);
                block || (categoryObj.animate(pageNum), 
                curNum = pageNum, pNums(pageNum));
            }
        });
    }, _.getDefault = function(src, dest) {
        var p;
        for (p in src) src.hasOwnProperty(p) && (dest[p] = src[p]);
        return dest;
    }, /**
     * [Tab description]
     * @param {[type]} el   [description]
     * @param {[type]} opts [description]
     */
    DLD.widgets.Tab = function(el, opts) {
        if ("UL" !== el.tagName) throw {
            message: "Must UL element"
        };
        var lis = el.getElementsByTagName("LI"), l = lis.length, that = this, defaultOpts = _.getDefault(opts, {
            className: "selected"
        }), i = 0;
        for (this.opts = defaultOpts, 
        this.contents = defaultOpts.contents || [], 
        this.lis = lis, this.cName = defaultOpts.className; l > i; ++i) lis[i].setAttribute("data-tab", i);
        _.addEvent(el, "click", function(event) {
            var e = event || window.event, cur = e.target || e.srcElement;
            if ("UL" !== cur.tagName) {
                for (;"LI" !== cur.tagName; ) cur = cur.parentNode;
                var tab = cur.getAttribute("data-tab");
                that.select(tab);
            }
        }), defaultOpts.init && defaultOpts.init.call(this);
    }, DLD.widgets.Tab.prototype = {
        select: function(num) {
            for (var lis = this.lis, contents = this.contents, l = lis.length, i = 0; l > i; ++i) lis[i].className = "", 
            contents[i] && (contents[i].style.display = "none");
            lis[num].className = this.cName, 
            contents[num] && (contents[num].style.display = ""), 
            this.opts.onSelect[num] && this.opts.onSelect[num].call(lis[num], this);
        }
    };
}(window, void 0);
class ClassElement extends ClassBase {
    constructor(tag) {
        super();
        this._element_assets = {};
        this._element_assets.parent = null;
        this._element_assets.element = document.createElement(tag);
        this._element_assets.childList = [];
        this._element_assets.events = {};
        // 管理下のエレメントからのイベントを割り当てる
        this._element_assets.events.click = [];
        this._element_assets.element.addEventListener('click', this._listen.bind(this, 'click'));
    }
    // エレメントを取得する
    get element() {
        return this._element_assets.element;
    }
    // 親を取得する
    get parent() {
        return this._element_assets.parent;
    }
    // 子要素を取得する
    get childList() {
        return this._element_assets.childList;
    }
    // 子を追加する
    appendChild(classElement, pos) {
        classElement._element_assets.parent = this;
        pos = typeof pos === 'undefined' ? this.childList.length: parseInt(pos);
        let lef  = this.childList[pos] && this.childList[pos].element || null;
        this._element_assets.childList.splice(pos, 0, classElement);
        this.element.insertBefore(classElement.element, lef);
    }
    // 子を取り出す
    removeChild(pos) {
        if (typeof pos === 'undefined') {
            // 全部抜き出す
            let childList = [];
            let max = this.childList.length;
            let i;
            for (i=0; i<max; i++) {
                childList.push(this.removeChild(0));
            }
            if (this.childList.length > 0) {
                throw new Error("コードがバグっている可能性！");
            }
            return childList;
        } else {
            // 任意のひとつを抜き出す
            let child = this.childList[pos] || null;
            if (child === null) {
                return child;
            }
            this.childList[pos]._element_assets.parent = null;
            pos = typeof pos === 'undefined' ? this.childList.length: parseInt(pos);
            this._element_assets.childList.splice(pos, 1);
            this.element.removeChild(child.element);
            return child;
        }
    }
    // 子を検索する
    findChild(func) {
        for (let i=0;i<this.childList.length; i++) {
            if (func(this.childList[i])) {
                return i;
            }
        }
        return null;
    }
    // イベントの伝播に対応したイベント発行
    emit(ev_name, params, bubbling) {
        bubbling = typeof bubbling === 'undefined' ? true: bubbling;
        super.emit(ev_name, params);
        if (bubbling) {
            let current, i, limit;
            current  = this._element_assets.parent;
            limit = 1000;
            for (i=0; i<limit; i++) {
                if (!current) {
                    break;
                }
                current.emit(ev_name, params, false);
                current = current._element_assets.parent;
            }
            if (i >= limit) {
                throw new Error('イベント伝播階層が深すぎます。');
            }
        }
    }
    // クリックイベントの登録
    onClick(func) {
        this._on('click', func);
    }
    // クリックイベントの削除
    offClick(func) {
        this._off('click', func);
    }

    // 管理下エレメントからのイベントを受け付ける
    _listen(ev_name, event) {
        for (let i=0; i<this._element_assets.events[ev_name].length; i++) {
            this._element_assets.events[ev_name][i](...[event, this]);
        }
    }
    // 管理下エレメントからのイベント用処理の登録
    _on(ev_name, func) {
        if (typeof func !== 'function') {
            throw new Error("イベントには関数を登録してください。");
        }
        this._element_assets.events[ev_name].push(func);
    }
    // 管理下エレメントからのイベント用処理の削除
    _off(ev_name, func) {
        if (typeof func === 'function') {
            for (let i=0; i<this._element_assets.events[ev_name].length; i++) {
                if (this._element_assets.events[ev_name][i] === func) {
                    this._element_assets.events[ev_name].splice(i, 1);
                    i--;
                }
            }
        } else {
            this._element_assets.events[ev_name] = [];
        }
    }
}
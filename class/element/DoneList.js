class ClassDoneList extends ClassElement {
    constructor() {
        super("div");
        this.element.classList.add("done_frame");
        this._done_list_assets = {};
        this._done_list_assets.label = this._createLabel();
        this._done_list_assets.list = this._createList();
        this.appendChild(this._done_list_assets.label);
        this.appendChild(this._done_list_assets.list);
    }
    _createLabel() {
        let ele = new ClassElement('span');
        ele.element.classList.add("done_label");
        ele.element.innerText = "完了リスト";
        return ele;
    }
    _createList() {
        let ele = new ClassElement('div');
        ele.element.classList.add("done_list");
        return ele;
    }
    // アイテム初期化
    initItem(data, pos) {
        pos = pos || 0;
        let list = this._done_list_assets.list;
        let item= new ClassDoneItem(data);
        item.element.classList.add('init');
        list.appendChild(item, pos);
    }
    // アイテム追加
    addItem(data, pos) {
        pos = pos || 0;
        let list = this._done_list_assets.list;
        let item= new ClassDoneItem(data);
        item.element.classList.add('fade_in');
        list.appendChild(item, pos);
    }
    // アイテム削除
    deleteItem(id) {
        let eles;
        let list = this._done_list_assets.list;
        eles = list.findChildAll(v => v.id == id);
        for (let i=0; i<eles.length; i++) {
            let ele = eles[i];
            ele.element.classList.add('fade_out');
            setTimeout(((ele) => {
                list.removeChild(ele);
            }).bind(null, ele),150);
        }
        return eles.length;
    }
}
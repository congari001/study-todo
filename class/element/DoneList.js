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
    // アイテム追加
    addItem(data, pos) {
        pos = pos || 0;
        let list = this._done_list_assets.list;
        let item= new ClassDoneItem(data);
        list.appendChild(item, pos);
    }
    // アイテム削除
    deleteItem(id) {
        let pos, cnt=0;
        let list = this._done_list_assets.list;
        while ((pos = list.findChild(v => v.id == id)) !== null) {
            list.removeChild(pos);
            cnt++;
        }
        return cnt;
    }
}
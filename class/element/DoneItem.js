class ClassDoneItem extends ClassElement {
    constructor(task) {
        super("div");
        this._done_item_assets = {};
        this._done_item_assets.id = task.id;
        this._done_item_assets.textElement = this._createText(task.text);
        this._done_item_assets.restoreBtnElement = this._createRestoreButton();
        this._done_item_assets.deleteBtnElement = this._createDeleteButton();
        this.appendChild(this._done_item_assets.textElement);
        this.appendChild(this._done_item_assets.restoreBtnElement);
        this.appendChild(this._done_item_assets.deleteBtnElement);
    }
    _createText(text) {
        let ele = new ClassElement("span");
        ele.element.innerText = text;
        return ele;
    }
    _createRestoreButton() {
        let ele = new ClassElement("button");
        ele.element.innerText = "戻す";
        ele.onClick((event, self) => {
            self.emit("report_restore_done_item", {id:self.parent.id});
        });
        return ele;
    }
    _createDeleteButton() {
        let ele = new ClassElement("button");
        ele.element.innerText = "削除";
        ele.onClick((event, self) => {
            self.emit("report_delete_done_item", {id:self.parent.id});
        });
        return ele;
    }
    get id() {
        return this._done_item_assets.id;
    }
}
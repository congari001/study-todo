class ClassDoneItem extends ClassElement {
    constructor(task) {
        super("div");
        this._id = task.id;
        this._textElement = this._createText(task.text);
        this._restoreBtnElement = this._createRestoreButton();
        this._deleteBtnElement = this._createDeleteButton();
        this.appendChild(this._textElement);
        this.appendChild(this._restoreBtnElement);
        this.appendChild(this._deleteBtnElement);
    }
    _createText(text) {
        let ele = new ClassElement("span");
        ele.element.innerText = text;
        return ele;
    }
    _createRestoreButton(id) {
        let ele = new ClassElement("button");
        ele.element.innerText = "戻す";
        ele.onClick((event, self) => {
            self.emit("report_restore_done_item", {id:self.parent._id});
        });
        return ele;
    }
    _createDeleteButton() {
        let ele = new ClassElement("button");
        ele.element.innerText = "削除";
        ele.onClick((event, self) => {
            self.emit("report_delete_done_item", {id:self.parent._id});
        });
        return ele;
    }
    get id() {
        return this._id;
    }
}
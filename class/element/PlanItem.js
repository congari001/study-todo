class ClassPlanItem extends ClassElement {
    constructor(task) {
        super("div");
        this._id = task.id;
        this._textElement = this._createText(task.text);
        this._doneBtnElement = this._createDoneButton();
        this._deleteBtnElement = this._createDeleteButton();
        this.appendChild(this._textElement);
        this.appendChild(this._doneBtnElement);
        this.appendChild(this._deleteBtnElement);
    }
    _createText(text) {
        let ele = new ClassElement("span");
        ele.element.innerText = text;
        return ele;
    }
    _createDoneButton() {
        let ele = new ClassElement("button");
        ele.element.innerText = "完了";
        ele.onClick((event, self) => {
            self.emit("report_done_plan_item", {id:self.parent._id});
        });
        return ele;
    }
    _createDeleteButton() {
        let ele = new ClassElement("button");
        ele.element.innerText = "削除";
        ele.onClick((event, self) => {
            self.emit("report_delete_plan_item", {id:self.parent._id});
        });
        return ele;
    }
    get id() {
        return this._id;
    }
}
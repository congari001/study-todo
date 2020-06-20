class ClassPlanItem extends ClassElement {
    constructor(task) {
        super("div");
        this.element.classList.add("list_item");
        this._plan_item_assets = {};
        this._plan_item_assets.id = task.id;
        this._plan_item_assets.textElement = this._createText(task.text);
        this._plan_item_assets.doneBtnElement = this._createDoneButton();
        this._plan_item_assets.deleteBtnElement = this._createDeleteButton();
        this.appendChild(this._plan_item_assets.textElement);
        this.appendChild(this._plan_item_assets.doneBtnElement);
        this.appendChild(this._plan_item_assets.deleteBtnElement);
    }
    _createText(text) {
        let ele = new ClassElement("span");
        ele.element.classList.add("list_item_text");
        ele.element.innerText = text;
        return ele;
    }
    _createDoneButton() {
        let ele = new ClassElement("a");
        ele.element.classList.add("list_item_button1");
        ele.element.innerText = "完了";
        ele.onClick((event, self) => {
            self.emit("report_done_plan_item", {id:self.parent.id});
        });
        return ele;
    }
    _createDeleteButton() {
        let ele = new ClassElement("a");
        ele.element.classList.add("list_item_button2");
        ele.element.innerText = "削除";
        ele.onClick((event, self) => {
            self.emit("report_delete_plan_item", {id:self.parent.id});
        });
        return ele;
    }
    get id() {
        return this._plan_item_assets.id;
    }
}
class ClassAddForm extends ClassElement {
    constructor() {
        super("div");
        this._plan_item_assets = {};
        this._plan_item_assets.textElement = this._createText();
        this._plan_item_assets.addBtnElement = this._createAddButton();
        this.appendChild(this._plan_item_assets.textElement);
        this.appendChild(this._plan_item_assets.addBtnElement);
        // 入力値の初期化
        this.initInput();
    }
    _createText(text) {
        let ele = new ClassElement("input");
        ele.element.setAttribute("type", "text");
        ele.element.value = "";
        return ele;
    }
    _createAddButton() {
        let ele = new ClassElement("button");
        ele.element.innerText = "追加";
        ele.onClick((event, self) => {
            self.emit("report_add_plan_item", {id:self.parent.id});
        });
        return ele;
    }
    // 入力値の取得
    getInput() {
        let item = {};
        item.text = this._plan_item_assets.textElement.element.value;
        return item;
    }
    // 入力値の初期化
    initInput() {
        this._plan_item_assets.textElement.element.value = "";
    }
}
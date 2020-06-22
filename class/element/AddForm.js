class ClassAddForm extends ClassElement {
    // 定数
    static get TEXT_MIN() {return 1};
    static get TEXT_MAX() {return 16};

    constructor() {
        super("div");
        this.element.classList.add("input_frame");
        this._add_form_assets = {};
        this._add_form_assets.labelElement = this._createLabel();
        this._add_form_assets.textElement = this._createText();
        this._add_form_assets.attentionElement = this._createAttention();
        this._add_form_assets.addBtnElement = this._createAddButton();
        this.appendChild(this._add_form_assets.labelElement);
        this.appendChild(this._add_form_assets.textElement);
        this.appendChild(this._add_form_assets.addBtnElement);
        // 入力値の初期化
        this.initInput();
    }
    _createLabel() {
        let ele = new ClassElement("label");
        ele.element.classList.add("input_label");
        ele.element.innerText = "新規作業登録";
        return ele;
    }
    _createText() {
        let ele = new ClassElement("input");
        ele.element.classList.add("input_text");
        ele.element.type = "text";
        ele.element.placeholder = "Input new task...";
        ele.element.value = "";
        ele.onChange((event, self) => {
            let params = {};
            params.value = self.element.value;
            params.type = "str";
            params.callback = self.parent.validated.bind(self.parent);
            params.minNum = ClassAddForm.TEXT_MIN;
            params.maxNum = ClassAddForm.TEXT_MAX;
            self.emit("report_validation", params);
        });
        return ele;
    }
    _createAttention() {
        let ele = new ClassElement("a");
        ele.element.classList.add("input_attention");
        ele.element.innerText = "＊";
        return ele;
    }
    _createAddButton() {
        let ele = new ClassElement("a");
        ele.element.classList.add("input_new_item_button");
        ele.element.innerText = "追加";
        ele.onClick((event, self) => {
            self.emit("report_add_plan_item", {id:self.parent.id});
        });
        return ele;
    }
    // 入力値の取得
    getInput() {
        let item = {};
        item.text = this._add_form_assets.textElement.element.value;
        return item;
    }
    // 入力値の初期化
    initInput() {
        this._add_form_assets.textElement.element.value = "";
    }
    // 値の検証結果を表示
    validated(result) {
        this.removeChild(this._add_form_assets.attentionElement);
        if (result.error.length) {
            this.appendChild(this._add_form_assets.attentionElement);
        }
    }
    // 検証結果の削除
    removeAttention() {
        this.removeChild(this._add_form_assets.attentionElement);
    }
}
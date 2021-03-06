class ClassToDoManager extends ClassElement {
    constructor(divId) {
        super('div');
        this._todo_manager_assets = {};
        // イベント
        this._initEvents();
        // データ管理
        this._todo_manager_assets.dataManager = null;
        // 要素
        this._todo_manager_assets.addForm = null;
        this._todo_manager_assets.inputArea = null;
        this._todo_manager_assets.planList = null;
        this._todo_manager_assets.doneList = null;
        this._todo_manager_assets.viewArea = null;
        document.getElementById(divId).appendChild(this.element);
    }
    // API
    // todoリストデータ読み込み
    async read(dataKey) {
        // プロパティリセット
        this._initDataManager(dataKey);
        this._initElements();
        // 初期データ作成
        let dataManager, planList, doneList;
        dataManager = this._todo_manager_assets.dataManager;
        planList = this._todo_manager_assets.planList;
        doneList = this._todo_manager_assets.doneList;
        // リスト全更新
        await dataManager.load();
        for (let data of dataManager.each) {
            switch(data.status) {
                case ClassTaskData.STATUS_PLAN:
                    planList.initItem(data);
                break;
                case ClassTaskData.STATUS_DONE:
                    doneList.initItem(data);
                break;
                default:
                    throw new Error(`指定されたステータス${data.status}が不正です。`);
                break;
            }
        }
    }
    // データ管理の初期化
    _initDataManager(dataKey) {
        let storage = new ClassStorage();
        this._todo_manager_assets.dataManager = new ClassDataManager(storage, dataKey);
    }
    // 要素の初期化
    _initElements() {
        let af = new ClassAddForm();
        let ia = new ClassInputArea(af);
        let pl = new ClassPlanList();
        let dl = new ClassDoneList();
        let va = new ClassViewArea(pl, dl);
        this._todo_manager_assets.addForm = af;
        this._todo_manager_assets.inputArea = ia;
        this._todo_manager_assets.planList = pl;
        this._todo_manager_assets.doneList = dl;
        this._todo_manager_assets.viewArea = va;
        this.removeChild();
        this.appendChild(ia);
        this.appendChild(va);
    }
    // イベントの初期化
    _initEvents() {
        this.on("report_add_plan_item", this._reportAddPlanItem.bind(this));
        this.on("report_done_plan_item", this._reportDonePlanItem.bind(this));
        this.on("report_delete_plan_item", this._reportDeletePlanItem.bind(this));
        this.on("report_restore_done_item", this._reportRestoreDoneItem.bind(this));
        this.on("report_delete_done_item", this._reportDeleteDoneItem.bind(this));
        this.on("report_validation", this._reportValidation.bind(this));
    }
    // イベント用処理
    // 新しい計画を追加する
    async _reportAddPlanItem() {
        let input, opt, check, data, addForm, dataManager, planList;
        addForm = this._todo_manager_assets.addForm;
        dataManager = this._todo_manager_assets.dataManager;
        planList = this._todo_manager_assets.planList;
        input = addForm.getInput();
        // 入力データ検証
        opt = {};
        opt.minNum = ClassAddForm.TEXT_MIN;
        opt.maxNum = ClassAddForm.TEXT_MAX;
        check = this._validation(input.text, 'str', opt);
        if (check.error.length) {
            addForm.validated(check);
            return;
        }
        // 新規データ作成
        addForm.initInput();
        data = {};
        data.id = dataManager.newId;
        data.text = input.text;
        data.status = ClassTaskData.STATUS_PLAN;
        // 新規データ登録
        dataManager.update(data);
        await dataManager.save();
        // 計画リストにタスク追加
        planList.addItem(data);
    }
    // 計画リストのアイテムを完了リストに移動させる
    async _reportDonePlanItem(event) {
        let targetId, data, pos, dataManager, planList, doneList;
        targetId = event.detail.id;
        dataManager = this._todo_manager_assets.dataManager;
        planList = this._todo_manager_assets.planList;
        doneList = this._todo_manager_assets.doneList;
        // データのステータス更新
        data = dataManager.select(targetId);
        data.status = ClassTaskData.STATUS_DONE;
        // 更新データの確定
        dataManager.update(data);
        await dataManager.save();
        // タスクの移動
        if (!planList.deleteItem(targetId) ) {
            throw new Error(`指定のID[${targetId}]は計画リストに存在しません。`);
        }
        pos = dataManager.pos(targetId);
        doneList.addItem(data, pos);
    }
    // 計画リストから削除する
    async _reportDeletePlanItem(event) {
        let targetId, dataManager, planList;
        targetId = event.detail.id;
        dataManager = this._todo_manager_assets.dataManager;
        planList = this._todo_manager_assets.planList;
        // データの削除
        dataManager.delete(targetId);
        await dataManager.save();
        // タスクの削除
        planList.deleteItem(targetId);
    }
    // 完了リストから計画リストへ戻す
    async _reportRestoreDoneItem(event) {
        let targetId, data, pos, dataManager, doneList, planList;
        targetId = event.detail.id;
        dataManager = this._todo_manager_assets.dataManager;
        doneList = this._todo_manager_assets.doneList;
        planList = this._todo_manager_assets.planList;
        // データのステータス更新
        data = dataManager.select(targetId);
        data.status = ClassTaskData.STATUS_PLAN;
        // 更新データの確定
        dataManager.update(data);
        await dataManager.save();
        // タスクの移動
        if (!doneList.deleteItem(targetId) ) {
            throw new Error(`指定のID[${targetId}]は完了リストに存在しません。`);
        }
        pos = dataManager.pos(targetId);
        planList.addItem(data, pos);
    }
    // 完了リストから削除する
    async _reportDeleteDoneItem(event) {
        let targetId, dataManager, doneList;
        targetId = event.detail.id;
        dataManager = this._todo_manager_assets.dataManager;
        doneList = this._todo_manager_assets.doneList;
        // データの削除
        dataManager.delete(targetId);
        await dataManager.save();
        // タスクの削除
        doneList.deleteItem(targetId);
    }
    // 値をチェックする
    _reportValidation(event) {
        // 必須パラメータ
        let val = event.detail.value;
        let type = event.detail.type;
        let cb = event.detail.callback;
        // オプション
        let opt = {};
        opt.maxNum = typeof event.detail.maxNum === "undefined" ? null: event.detail.maxNum;
        opt.minNum = typeof event.detail.minNum === "undefined" ? null: event.detail.minNum;
        // 検証
        let result = this._validation(val, type, opt);
        return cb(result);
    }

    // util的なやつ
    // 値の検証
    _validation(val, type, option) {
        // オプション設定の取得
        option = option || {};
        let maxNum = typeof option.maxNum === "undefined" ? null: option.maxNum;
        let minNum = typeof option.minNum === "undefined" ? null: option.minNum;

        let result = {};
        result.error = [];
        switch (type) {
            case "str":
                // 文字数のチェック
                if (maxNum !== null) {
                    if (val.length > maxNum) {
                        result.error.push(`上限文字数[${maxNum}]を超えています。`);
                    }
                }
                if (minNum !== null) {
                    if (val.length < minNum) {
                        result.error.push(`下限文字数[${minNum}]を満たしていません。`);
                    }
                }
            break;

            default:
                throw new Error(`指定されたtype[${type}]が不正です。`);
            break;
        }
        return result;
    }
}
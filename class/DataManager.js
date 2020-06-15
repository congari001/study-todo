class ClassDataManager extends ClassBase {
    constructor(storage, dataKey) {
        super();
        this._data_manager_assets = {};
        this._data_manager_assets.storage = storage;
        this._data_manager_assets.dataKey = dataKey;
        this._data_manager_assets.datas = null;
        this._data_manager_assets.maxId = 0;
    }
    // データ読み込み
    async load() {
        let maxId, arr, datas, dataKey, storage;
        maxId = 0;
        storage = this._data_manager_assets.storage;
        dataKey = this._data_manager_assets.dataKey;
        datas = [];
        try {
            arr = JSON.parse(await storage.getItem(dataKey));
            if (Array.isArray(arr)) {
                for(let i=0; i<arr.length; i++) {
                    if (typeof arr[i].id !== 'number') {
                        continue;
                    }
                    if (maxId<arr[i].id) {
                        maxId = arr[i].id;
                    }
                    datas.push(new ClassTaskData(arr[i]));
                }
            }
        }catch(e) {
            console.log(e.message);
        }
        this._data_manager_assets.datas = datas;
        this._data_manager_assets.maxId = maxId;
    }
    // データ保存
    async save() {
        let dataKey, storage, datas;
        let arr = [];
        storage = this._data_manager_assets.storage;
        dataKey = this._data_manager_assets.dataKey;
        datas = this._data_manager_assets.datas;
        for (let i=0; i<datas.length; i++) {
            arr.push(datas[i].get());
        }
        await storage.setItem(dataKey, JSON.stringify(arr));
    }
    // データの取得
    select(id) {
        let datas = this._data_manager_assets.datas;
        if (typeof id === 'undefined') {
            let list = [];
            for (let i=0; i<datas.length; i++) {
                list.push(datas[i].get());
            }
            return list;
        } else {
            let find = datas.find((v) => v.get().id == id);
            return find ? find.get(): undefined;
        }
    }
    // 位置取得
    pos(id) {
        let datas = this._data_manager_assets.datas;
        let pos = {};
        for (let i=datas.length-1; 0<=i; i--) {
            let data = datas[i].get();
            pos[data.status] = typeof pos[data.status] === 'undefined' ? 0: pos[data.status]+1;
            if (id==data.id) {
                return pos[data.status];
            }
        }
        console.log("位置取得できなかった");
        return 0;
    }
    // データの全件ループ用ジェネレータ
    get each() {
        let datas = this._data_manager_assets.datas;
        return {
            *[Symbol.iterator]() {
                for (let i=0; i<datas.length; i++) {
                    yield datas[i].get();
                }
            }
        }
    }
    // idの最大値取得
    get maxId() {
        return this._data_manager_assets.maxId;
    }
    // 新しいidを発行する
    get newId() {
        return ++this._data_manager_assets.maxId;
    }
    // データの追加＆更新
    update(data) {
        let datas = this._data_manager_assets.datas;
        let find = datas.find((v) => v.get().id == data.id);
        if (find) {
            find.set(data);
        } else {
            datas.push(new ClassTaskData(data));
        }
    }
    // データの削除
    delete(id) {
        let datas = this._data_manager_assets.datas;
        let befNum = datas.length;
        this._data_manager_assets.datas = datas.filter((v) => v.get().id != id);
        let isDelete = befNum != this._data_manager_assets.datas.length;
        return isDelete;
    }
}
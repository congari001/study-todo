class ClassStorage extends ClassBase {
    constructor() {
        super();
        this._storage_assets = {};
        this._storage_assets.storage = null;
        if (this._storageAvailable("localStorage") ) {
            this._storage_assets.storage = window.localStorage;
        } else {
            alert("ローカルストレージが使えないのでデータは保存されません。");
            this._storage_assets.storage = this._getDummyStorage();
        }
        this._storage_assets.board = this._createBoard();
        this._storage_assets.connecting = false;
        this._storage_assets.conecting_ms = 1000;
    }
    // API
    setItem(key, value) {
        let api = this._storage_assets.storage.setItem.bind(this._storage_assets.storage, key, value);
        return this._conectingDummy(api);
    }
    getItem(key) {
        let api = this._storage_assets.storage.getItem.bind(this._storage_assets.storage, key);
        return this._conectingDummy(api);
    }
    removeItem(key) {
        let api = this._storage_assets.storage.getItem.removeItem(this._storage_assets.storage, key);
        return this._conectingDummy(api);
    }
    get length() {
        return this._storage_assets.storage.length;
    }

    // なんちゃってストレージ
    _getDummyStorage() {
        let __length = 1;
        let __item = {};
        return  {
            setItem: (key, value) => {
                if (typeof key !== 'string') {
                    throw new Error(`キーには文字列を指定してください。`);
                }
                if (typeof value !== 'string') {
                    throw new Error(`値には文字列を指定してください。`);
                }
                __item[key] = value;
            },
            getItem: (key) => {
                if (typeof key !== 'string') {
                    throw new Error(`キーには文字列を指定してください。`);
                }
                return __item[key];
            },
            removeItem: (key) => {
                if (typeof key !== 'string') {
                    throw new Error(`キーには文字列を指定してください。`);
                }
                delete __item[key];
                return true;
            },
            length: __length,
        }
    }
    // ローカルストレージ有効判定（MDNコピペ）
    _storageAvailable(type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }
    // くるくる板作成
    _createBoard() {
        let board, kurukuru;
        // 操作抑制のための板作成
        board = document.createElement("div");
        board.style.position = "fixed";
        board.style.top = 0;
        board.style.left = 0;
        board.style.width = "100%";
        board.style.height = "100%";
        board.style.zIndex = 9999;
        board.style.display = "none";
        // 板の上に表示するもの作成
        kurukuru = document.createElement("div");
        kurukuru.classList.add("loader");
        kurukuru.innerText = "通信している雰囲気を再現！！";
        board.appendChild(kurukuru);
        // 設置
        document.body.appendChild(board);
        return board;
    }
    // くるくるON
    _connectingOn() {
        this._storage_assets.board.style.display = "block";
    }
    // くるくるOFF
    _connectingOff() {
        this._storage_assets.board.style.display = "none";
    }
    // くるくる表示させたいためだけのなんちゃって通信化
    _conectingDummy(api) {
        let self = this;
        return new Promise((resolve, reject) => {
            if (self._storage_assets.connecting) {
                console.log("なんちゃって通信中！！！");
                return resolve();
            }
            self._storage_assets.connecting = true;
            self._connectingOn();
            setTimeout(() => {
                let error = false;
                let result = null;
                try {
                    result = api();
                }catch(e) {
                    return reject(e.message);
                }
                self._storage_assets.connecting = false;
                self._connectingOff();
                return resolve(result);
            }, self._storage_assets.conecting_ms);
        });
    }
}
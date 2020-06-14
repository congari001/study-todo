class ClassTaskData extends ClassBase {
    static get STATUS_PLAN() {return 1;}
    static get STATUS_DONE() {return 2;}

    constructor(task) {
        super();
        task = task || {};
        this._data = {};
        this.set(task);
    }

    get() {
        let ret = {};
        for (let key in this._data) {
            ret[key] = this._data[key];
        }
        return ret;
    }
    set(task) {
        task = {
            id: typeof task.id !== 'undefined' ? parseInt(task.id, 10): this._data.id,
            text: typeof task.text !== 'undefined' ? task.text.toString(): this._data.text,
            status: typeof task.status !== 'undefined' ? parseInt(task.status, 10): this._data.status,
        };
        this._data = task;
    }
}
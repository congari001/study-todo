class ClassPlanList extends ClassElement {
    constructor() {
        super();
    }
    // アイテム追加
    addItem(data, pos) {
        pos = pos || 0;
        let item= new ClassPlanItem(data);
        this.appendChild(item, pos);
    }
    // アイテム削除
    deleteItem(id) {
        let pos, cnt=0;
        while ((pos = this.findChild(v => v.id == id)) !== null) {
            this.removeChild(pos);
            cnt++;
        }
        return cnt;
    }
}
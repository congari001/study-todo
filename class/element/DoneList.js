class ClassDoneList extends ClassElement {
    constructor() {
        super();
    }
    // アイテム追加
    addItem(data) {
        let item= new ClassDoneItem(data);
        this.appendChild(item, 0);
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
class ClassDoneList extends ClassElement {
    constructor() {
        super();
        this.on('operate_add_item', (event) => {
            let doneItem = event.detail.doneItem;
            this.appendChild(doneItem, 0);
        });
        this.on('operate_delete_item', (event) => {
            let targetId = event.detail.id;
            let pos = this.findChild(v => v.id == targetId);
            this.removeChild(pos);
        });
    }
}
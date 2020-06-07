class ClassPlanList extends ClassElement {
    constructor() {
        super();
        this.on('operate_add_item', (event) => {
            let newItem = event.detail.newItem;
            this.appendChild(newItem, 0);
        });
        this.on('operate_delete_item', (event) => {
            let targetId = event.detail.id;
            let pos;
            while ((pos = this.findChild(v => v.id == targetId)) !== null) {
                this.removeChild(pos);
            }
        });
    }
}
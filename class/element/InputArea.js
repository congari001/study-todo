class ClassInputArea extends ClassElement {
    constructor(addForm) {
        super('div');
        this._view_area_assets = {};
        this._view_area_assets.addForm = addForm;
        this.appendChild(this._view_area_assets.addForm);
    }
}
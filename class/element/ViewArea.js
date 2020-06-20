class ClassViewArea extends ClassElement {
    constructor(planList, doneList) {
        super('div');
        this.element.classList.add("view_area");
        this._view_area_assets = {};
        this._view_area_assets.planList = planList;
        this._view_area_assets.doneList = doneList;
        this.appendChild(this._view_area_assets.planList);
        this.appendChild(this._view_area_assets.doneList);
    }
}
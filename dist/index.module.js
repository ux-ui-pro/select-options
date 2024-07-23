const $643fcf18b2d2e76f$var$CLASSES = {
    selectContainer: "select-option-container",
    select: "select-option",
    floatingLabel: "floating-label",
    notchedOutline: "notched-outline",
    notchedOutlineNotch: "notched-outline__notch",
    notchedOutlineLeading: "notched-outline__leading",
    notchedOutlineTrailing: "notched-outline__trailing",
    selectOptionTrigger: "select-option-trigger",
    selectOptionList: "select-option-list",
    selectOptionListItem: "select-option-list-item",
    selectOptionListItemSelected: "select-option-list-item--selected",
    selectOptionOpened: "select-option--opened",
    selectOptionMobile: "select-option--mobile",
    selectOptionSelected: "select-option--selected",
    selectOptionLabeled: "select-option--labeled",
    selectOptionUnlabeled: "select-option--unlabeled",
    selectOptionDownstairs: "select-option--downstairs"
};
class $643fcf18b2d2e76f$var$SelectOptions {
    selectContainer = [];
    floatingLabel = [];
    notches = [];
    customSelects = [];
    openSelect = null;
    resizeObserver;
    mobileMode = false;
    constructor({ mobileMode: mobileMode = false } = {}){
        this.mobileMode = mobileMode;
        this.selectContainer = Array.from(document.querySelectorAll(`.${$643fcf18b2d2e76f$var$CLASSES.selectContainer} select`));
        this.floatingLabel = Array.from(document.querySelectorAll(`.${$643fcf18b2d2e76f$var$CLASSES.floatingLabel}`));
        this.resizeObserver = new ResizeObserver((entries)=>{
            entries.forEach((entry)=>{
                const notchElement = entry.target.closest(`.${$643fcf18b2d2e76f$var$CLASSES.notchedOutline}`)?.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.notchedOutlineNotch}`);
                if (notchElement) $643fcf18b2d2e76f$var$SelectOptions.setNotchWidth(notchElement, $643fcf18b2d2e76f$var$SelectOptions.getNotchWidth(notchElement));
            });
        });
    }
    notched() {
        this.floatingLabel.forEach((label)=>{
            const notchedOutline = label.closest(`.${$643fcf18b2d2e76f$var$CLASSES.notchedOutline}`) ?? $643fcf18b2d2e76f$var$SelectOptions.createNotchedOutline(label);
            const notch = notchedOutline.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.notchedOutlineNotch}`);
            this.notches.push({
                container: notchedOutline.parentNode,
                notch: notch
            });
            $643fcf18b2d2e76f$var$SelectOptions.setNotchWidth(notch, $643fcf18b2d2e76f$var$SelectOptions.getNotchWidth(notch));
            this.resizeObserver.observe(label);
        });
    }
    static createNotchedOutline(label) {
        const notchedOutline = document.createElement("div");
        notchedOutline.classList.add($643fcf18b2d2e76f$var$CLASSES.notchedOutline);
        notchedOutline.innerHTML = `
      <div class="${$643fcf18b2d2e76f$var$CLASSES.notchedOutlineLeading}"></div>
      <div class="${$643fcf18b2d2e76f$var$CLASSES.notchedOutlineNotch}">${label.outerHTML}</div>
      <div class="${$643fcf18b2d2e76f$var$CLASSES.notchedOutlineTrailing}"></div>
    `;
        label.replaceWith(notchedOutline);
        return notchedOutline;
    }
    static setNotchWidth(notchElement, width) {
        const newNotchElement = notchElement;
        newNotchElement.style.width = width;
    }
    static getNotchWidth(notch) {
        const label = notch.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.floatingLabel}`);
        return label ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px` : "auto";
    }
    setupCustomSelect(selectElement, customSelect, options) {
        const selectTrigger = customSelect.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.selectOptionTrigger}`) || document.createElement("div");
        const selectItems = customSelect.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.selectOptionList}`) || document.createElement("div");
        selectTrigger.classList.add($643fcf18b2d2e76f$var$CLASSES.selectOptionTrigger);
        selectItems.classList.add($643fcf18b2d2e76f$var$CLASSES.selectOptionList);
        customSelect.append(selectTrigger, selectItems);
        this.createOptions(selectElement, selectTrigger, selectItems, options);
        selectTrigger.addEventListener("click", (e)=>this.toggleDropdown(e, customSelect));
        $643fcf18b2d2e76f$var$SelectOptions.updateCustomSelectState(customSelect, selectElement);
        this.customSelects.push(customSelect);
        selectElement.addEventListener("change", ()=>{
            this.updateCustomSelect(selectElement, customSelect, options);
        });
        if (this.mobileMode && $643fcf18b2d2e76f$var$SelectOptions.isMobileDevice()) customSelect.classList.add($643fcf18b2d2e76f$var$CLASSES.selectOptionMobile);
    }
    createOptions(selectElement, selectTrigger, selectItems, options) {
        const newSelectTrigger = selectTrigger;
        const newSelectItems = selectItems;
        newSelectItems.innerHTML = "";
        options.forEach((option, index)=>{
            const selectItem = document.createElement("div");
            selectItem.classList.add($643fcf18b2d2e76f$var$CLASSES.selectOptionListItem);
            selectItem.textContent = option.textContent;
            const customValue = option.getAttribute("data-custom");
            if (customValue) selectItem.classList.add(`${$643fcf18b2d2e76f$var$CLASSES.selectOptionListItem}--${customValue}`);
            if (option.selected) {
                selectItem.classList.add($643fcf18b2d2e76f$var$CLASSES.selectOptionListItemSelected);
                newSelectTrigger.textContent = option.textContent;
                if (customValue) newSelectTrigger.classList.add(`${$643fcf18b2d2e76f$var$CLASSES.selectOptionTrigger}--${customValue}`);
            }
            selectItem.addEventListener("click", ()=>this.selectItem(selectItem, newSelectTrigger, selectElement, index, newSelectItems));
            newSelectItems.appendChild(selectItem);
        });
    }
    updateCustomSelect(selectElement, customSelect, options) {
        const selectTrigger = customSelect.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.selectOptionTrigger}`);
        const selectItems = customSelect.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.selectOptionList}`);
        const { selectedIndex: selectedIndex } = selectElement;
        const selectedOption = options[selectedIndex];
        const customValue = selectedOption.getAttribute("data-custom");
        selectTrigger.textContent = selectedOption.textContent;
        $643fcf18b2d2e76f$var$SelectOptions.updateClasses(selectTrigger, `${$643fcf18b2d2e76f$var$CLASSES.selectOptionTrigger}--${customValue}`);
        customSelect.classList.toggle($643fcf18b2d2e76f$var$CLASSES.selectOptionSelected, selectedIndex > 0);
        this.createOptions(selectElement, selectTrigger, selectItems, options);
    }
    selectItem(selectItem, selectTrigger, selectElement, index, selectItems) {
        const newSelectElement = selectElement;
        newSelectElement.selectedIndex = index;
        newSelectElement.dispatchEvent(new Event("change"));
        this.createOptions(newSelectElement, selectTrigger, selectItems, Array.from(newSelectElement.options));
        this.closeDropdown(selectTrigger.closest(`.${$643fcf18b2d2e76f$var$CLASSES.select}`));
    }
    closeDropdown(customSelect) {
        customSelect.classList.remove($643fcf18b2d2e76f$var$CLASSES.selectOptionOpened);
        this.openSelect = null;
    }
    openDropdown(customSelect) {
        this.closeOpenedDropdowns();
        customSelect.classList.add($643fcf18b2d2e76f$var$CLASSES.selectOptionOpened);
        this.openSelect = customSelect;
    }
    closeOpenedDropdowns(e) {
        this.customSelects.forEach((dropdown)=>{
            if (!e || !dropdown.contains(e.target)) dropdown.classList.remove($643fcf18b2d2e76f$var$CLASSES.selectOptionOpened);
        });
        this.openSelect = null;
    }
    toggleDropdown(e, customSelect) {
        e.stopPropagation();
        if (this.openSelect === customSelect) this.closeDropdown(customSelect);
        else this.openDropdown(customSelect);
    }
    static checkAndSetDownstairsClass(customSelect) {
        const rect = customSelect.getBoundingClientRect();
        customSelect.classList.toggle($643fcf18b2d2e76f$var$CLASSES.selectOptionDownstairs, rect.bottom + 160 > window.innerHeight);
    }
    handleResize() {
        this.customSelects.forEach($643fcf18b2d2e76f$var$SelectOptions.checkAndSetDownstairsClass);
    }
    static isMobileOS() {
        return /android/i.test(navigator.userAgent || navigator.vendor) || /iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor) && !("MSStream" in window);
    }
    static isTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    }
    static isMobileDevice() {
        return $643fcf18b2d2e76f$var$SelectOptions.isTouchDevice() || $643fcf18b2d2e76f$var$SelectOptions.isMobileOS();
    }
    static updateCustomSelectState(customSelect, selectElement) {
        const hasLabel = customSelect.querySelector(`label.${$643fcf18b2d2e76f$var$CLASSES.floatingLabel}`) !== null;
        customSelect.classList.toggle($643fcf18b2d2e76f$var$CLASSES.selectOptionLabeled, hasLabel);
        customSelect.classList.toggle($643fcf18b2d2e76f$var$CLASSES.selectOptionUnlabeled, !hasLabel);
        customSelect.classList.toggle($643fcf18b2d2e76f$var$CLASSES.selectOptionSelected, hasLabel && selectElement.selectedIndex > 0);
    }
    static updateClasses(element, className) {
        element.classList.remove(...Array.from(element.classList).filter((cls)=>cls.startsWith(`${$643fcf18b2d2e76f$var$CLASSES.selectOptionTrigger}--`)));
        if (className) element.classList.add(className);
    }
    updateSelects() {
        this.selectContainer.forEach((selectElement)=>{
            const customSelect = selectElement.closest(`.${$643fcf18b2d2e76f$var$CLASSES.selectContainer}`)?.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.select}`);
            const options = Array.from(selectElement.options);
            if (customSelect) this.updateCustomSelect(selectElement, customSelect, options);
        });
    }
    async init() {
        this.notched();
        this.selectContainer.forEach((selectElement)=>{
            const customSelect = selectElement.closest(`.${$643fcf18b2d2e76f$var$CLASSES.selectContainer}`)?.querySelector(`.${$643fcf18b2d2e76f$var$CLASSES.select}`);
            const options = Array.from(selectElement.options);
            if (customSelect) {
                this.setupCustomSelect(selectElement, customSelect, options);
                $643fcf18b2d2e76f$var$SelectOptions.checkAndSetDownstairsClass(customSelect);
            }
        });
        document.addEventListener("click", this.closeOpenedDropdowns.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
        window.addEventListener("scroll", this.handleResize.bind(this));
    }
}
var $643fcf18b2d2e76f$export$2e2bcd8739ae039 = $643fcf18b2d2e76f$var$SelectOptions;


export {$643fcf18b2d2e76f$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.module.js.map

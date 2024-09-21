
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", function () { return $a196c1ed25598f0e$export$2e2bcd8739ae039; });
const $a196c1ed25598f0e$var$CLASSES = {
    selectContainer: "select-option-container",
    selectOption: "select-option",
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
class $a196c1ed25598f0e$var$SelectOptions {
    selectContainer = [];
    floatingLabel = [];
    customSelects = [];
    openSelect = null;
    resizeObserver;
    mobileMode = false;
    constructor({ mobileMode: mobileMode = false } = {}){
        this.mobileMode = mobileMode;
        this.selectContainer = Array.from(document.querySelectorAll(`.${$a196c1ed25598f0e$var$CLASSES.selectContainer} select`));
        this.floatingLabel = Array.from(document.querySelectorAll(`.${$a196c1ed25598f0e$var$CLASSES.floatingLabel}`));
        this.resizeObserver = new ResizeObserver((entries)=>{
            entries.forEach((entry)=>{
                const notchElement = entry.target.closest(`.${$a196c1ed25598f0e$var$CLASSES.notchedOutline}`)?.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.notchedOutlineNotch}`);
                if (notchElement) $a196c1ed25598f0e$var$SelectOptions.setNotchWidth(notchElement, $a196c1ed25598f0e$var$SelectOptions.getNotchWidth(notchElement));
            });
        });
    }
    notched() {
        this.floatingLabel.forEach((label)=>{
            let notchedOutline = label.closest(`.${$a196c1ed25598f0e$var$CLASSES.notchedOutline}`);
            let notch;
            if (!notchedOutline) {
                notchedOutline = $a196c1ed25598f0e$var$SelectOptions.createNotchedOutline(label);
                notch = notchedOutline.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.notchedOutlineNotch}`);
                label = notch.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.floatingLabel}`);
            } else {
                notch = notchedOutline.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.notchedOutlineNotch}`);
                label = notch.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.floatingLabel}`);
            }
            $a196c1ed25598f0e$var$SelectOptions.setNotchWidth(notch, $a196c1ed25598f0e$var$SelectOptions.getNotchWidth(notch));
            this.resizeObserver.observe(label);
        });
    }
    static createNotchedOutline(label) {
        const notchedOutline = document.createElement("div");
        notchedOutline.classList.add($a196c1ed25598f0e$var$CLASSES.notchedOutline);
        notchedOutline.innerHTML = `
      <div class="${$a196c1ed25598f0e$var$CLASSES.notchedOutlineLeading}"></div>
      <div class="${$a196c1ed25598f0e$var$CLASSES.notchedOutlineNotch}">${label.outerHTML}</div>
      <div class="${$a196c1ed25598f0e$var$CLASSES.notchedOutlineTrailing}"></div>
    `;
        label.replaceWith(notchedOutline);
        return notchedOutline;
    }
    static setNotchWidth(notchElement, width) {
        notchElement.style.width = width;
    }
    static getNotchWidth(notch) {
        const label = notch.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.floatingLabel}`);
        return label ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px` : "auto";
    }
    setupCustomSelect(selectElement, customSelect, options) {
        const selectTrigger = customSelect.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.selectOptionTrigger}`) || document.createElement("div");
        const selectItems = customSelect.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.selectOptionList}`) || document.createElement("div");
        selectTrigger.classList.add($a196c1ed25598f0e$var$CLASSES.selectOptionTrigger);
        selectItems.classList.add($a196c1ed25598f0e$var$CLASSES.selectOptionList);
        customSelect.append(selectTrigger, selectItems);
        this.createOptions(selectElement, selectTrigger, selectItems, options);
        selectTrigger.addEventListener("click", (e)=>this.toggleDropdown(e, customSelect));
        $a196c1ed25598f0e$var$SelectOptions.updateCustomSelectState(customSelect, selectElement);
        this.customSelects.push(customSelect);
        selectElement.addEventListener("change", ()=>{
            this.updateCustomSelect(selectElement, customSelect, options);
        });
        if (this.mobileMode && $a196c1ed25598f0e$var$SelectOptions.isMobileDevice()) customSelect.classList.add($a196c1ed25598f0e$var$CLASSES.selectOptionMobile);
    }
    createOptions(selectElement, selectTrigger, selectItems, options) {
        const newSelectTrigger = selectTrigger;
        const newSelectItems = selectItems;
        newSelectItems.innerHTML = "";
        options.forEach((option, index)=>{
            const selectItem = document.createElement("div");
            selectItem.classList.add($a196c1ed25598f0e$var$CLASSES.selectOptionListItem);
            selectItem.textContent = option.textContent;
            const customValue = option.getAttribute("data-custom");
            if (customValue) selectItem.classList.add(`${$a196c1ed25598f0e$var$CLASSES.selectOptionListItem}--${customValue}`);
            if (option.selected) {
                selectItem.classList.add($a196c1ed25598f0e$var$CLASSES.selectOptionListItemSelected);
                newSelectTrigger.textContent = option.textContent;
                if (customValue) newSelectTrigger.classList.add(`${$a196c1ed25598f0e$var$CLASSES.selectOptionTrigger}--${customValue}`);
            }
            selectItem.addEventListener("click", ()=>this.selectItem(newSelectTrigger, selectElement, index, newSelectItems));
            newSelectItems.appendChild(selectItem);
        });
    }
    updateCustomSelect(selectElement, customSelect, options) {
        const selectTrigger = customSelect.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.selectOptionTrigger}`);
        const selectItems = customSelect.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.selectOptionList}`);
        const { selectedIndex: selectedIndex } = selectElement;
        const selectedOption = options[selectedIndex];
        const customValue = selectedOption.getAttribute("data-custom");
        selectTrigger.textContent = selectedOption.textContent;
        $a196c1ed25598f0e$var$SelectOptions.updateClasses(selectTrigger, `${$a196c1ed25598f0e$var$CLASSES.selectOptionTrigger}--${customValue}`);
        customSelect.classList.toggle($a196c1ed25598f0e$var$CLASSES.selectOptionSelected, selectedIndex > 0);
        this.createOptions(selectElement, selectTrigger, selectItems, options);
    }
    selectItem(selectTrigger, selectElement, index, selectItems) {
        selectElement.selectedIndex = index;
        selectElement.dispatchEvent(new Event("change"));
        this.createOptions(selectElement, selectTrigger, selectItems, Array.from(selectElement.options));
        this.closeDropdown(selectTrigger.closest(`.${$a196c1ed25598f0e$var$CLASSES.selectOption}`));
    }
    closeDropdown(customSelect) {
        customSelect.classList.remove($a196c1ed25598f0e$var$CLASSES.selectOptionOpened);
        this.openSelect = null;
    }
    openDropdown(customSelect) {
        this.closeOpenedDropdowns();
        customSelect.classList.add($a196c1ed25598f0e$var$CLASSES.selectOptionOpened);
        this.openSelect = customSelect;
    }
    closeOpenedDropdowns(e) {
        this.customSelects.forEach((dropdown)=>{
            if (!e || !dropdown.contains(e.target)) dropdown.classList.remove($a196c1ed25598f0e$var$CLASSES.selectOptionOpened);
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
        customSelect.classList.toggle($a196c1ed25598f0e$var$CLASSES.selectOptionDownstairs, rect.bottom + 160 > window.innerHeight);
    }
    handleResize() {
        this.customSelects.forEach($a196c1ed25598f0e$var$SelectOptions.checkAndSetDownstairsClass);
    }
    static isMobileOS() {
        return /android/i.test(navigator.userAgent || navigator.vendor) || /iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor) && !("MSStream" in window);
    }
    static isTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    }
    static isMobileDevice() {
        return $a196c1ed25598f0e$var$SelectOptions.isTouchDevice() || $a196c1ed25598f0e$var$SelectOptions.isMobileOS();
    }
    static updateCustomSelectState(customSelect, selectElement) {
        const hasLabel = customSelect.querySelector(`label.${$a196c1ed25598f0e$var$CLASSES.floatingLabel}`) !== null;
        customSelect.classList.toggle($a196c1ed25598f0e$var$CLASSES.selectOptionLabeled, hasLabel);
        customSelect.classList.toggle($a196c1ed25598f0e$var$CLASSES.selectOptionUnlabeled, !hasLabel);
        customSelect.classList.toggle($a196c1ed25598f0e$var$CLASSES.selectOptionSelected, hasLabel && selectElement.selectedIndex > 0);
    }
    static updateClasses(element, className) {
        element.classList.remove(...Array.from(element.classList).filter((cls)=>cls.startsWith(`${$a196c1ed25598f0e$var$CLASSES.selectOptionTrigger}--`)));
        if (className) element.classList.add(className);
    }
    updateSelects() {
        this.selectContainer.forEach((selectElement)=>{
            const customSelect = selectElement.closest(`.${$a196c1ed25598f0e$var$CLASSES.selectContainer}`)?.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.selectOption}`);
            const options = Array.from(selectElement.options);
            if (customSelect) this.updateCustomSelect(selectElement, customSelect, options);
        });
    }
    async init() {
        this.notched();
        this.selectContainer.forEach((selectElement)=>{
            const customSelect = selectElement.closest(`.${$a196c1ed25598f0e$var$CLASSES.selectContainer}`)?.querySelector(`.${$a196c1ed25598f0e$var$CLASSES.selectOption}`);
            const options = Array.from(selectElement.options);
            if (customSelect) {
                this.setupCustomSelect(selectElement, customSelect, options);
                $a196c1ed25598f0e$var$SelectOptions.checkAndSetDownstairsClass(customSelect);
            }
        });
        document.addEventListener("pointerdown", this.closeOpenedDropdowns.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
        window.addEventListener("scroll", this.handleResize.bind(this));
    }
}
var $a196c1ed25598f0e$export$2e2bcd8739ae039 = $a196c1ed25598f0e$var$SelectOptions;


//# sourceMappingURL=index.js.map


function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", function () { return $a196c1ed25598f0e$export$2e2bcd8739ae039; });
class $a196c1ed25598f0e$var$SelectOptions {
    selectContainer = [];
    floatingLabel = [];
    notches = [];
    customSelects = [];
    openSelect = null;
    resizeObserver;
    mobileMode = false;
    constructor({ mobileMode: mobileMode = false } = {}){
        this.mobileMode = mobileMode;
        this.selectContainer = Array.from(document.querySelectorAll(".select-option-container select"));
        this.floatingLabel = Array.from(document.querySelectorAll(".floating-label"));
        this.resizeObserver = new ResizeObserver((entries)=>{
            entries.forEach((entry)=>{
                const notch = entry.target.closest(".notched-outline")?.querySelector(".notched-outline__notch");
                if (notch) $a196c1ed25598f0e$var$SelectOptions.setNotchWidth(notch, $a196c1ed25598f0e$var$SelectOptions.getNotchWidth(notch));
            });
        });
    }
    notched() {
        this.floatingLabel.forEach((label)=>{
            const notchedOutline = label.closest(".notched-outline") ?? $a196c1ed25598f0e$var$SelectOptions.createNotchedOutline(label);
            this.notches.push({
                container: notchedOutline.parentNode,
                notch: notchedOutline.querySelector(".notched-outline__notch")
            });
            const lastNotch = this.notches.at(-1)?.notch;
            if (lastNotch) {
                $a196c1ed25598f0e$var$SelectOptions.setNotchWidth(lastNotch, $a196c1ed25598f0e$var$SelectOptions.getNotchWidth(lastNotch));
                this.resizeObserver.observe(notchedOutline.querySelector(".floating-label"));
            }
        });
    }
    static createNotchedOutline(label) {
        const notchedOutline = document.createElement("div");
        notchedOutline.classList.add("notched-outline");
        notchedOutline.innerHTML = `
      <div class="notched-outline__leading"></div>
      <div class="notched-outline__notch">${label.outerHTML}</div>
      <div class="notched-outline__trailing"></div>
    `;
        label.replaceWith(notchedOutline);
        return notchedOutline;
    }
    static setNotchWidth(notch, width) {
        notch.style.width = width;
    }
    static getNotchWidth(notch) {
        const label = notch.querySelector(".floating-label");
        return label ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px` : "auto";
    }
    setupCustomSelect(selectElement, customSelect, options) {
        const selectTrigger = customSelect.querySelector(".select-option-trigger") ?? document.createElement("div");
        const selectItems = customSelect.querySelector(".select-option-list") ?? document.createElement("div");
        selectTrigger.classList.add("select-option-trigger");
        selectItems.classList.add("select-option-list");
        customSelect.append(selectTrigger, selectItems);
        this.createOptions(selectElement, selectTrigger, selectItems, options);
        if (!(this.mobileMode && $a196c1ed25598f0e$var$SelectOptions.isMobileDevice())) selectTrigger.addEventListener("click", (e)=>{
            e.stopPropagation();
            if (this.openSelect === customSelect) this.closeDropdown(customSelect);
            else this.openDropdown(customSelect);
        });
        $a196c1ed25598f0e$var$SelectOptions.updateCustomSelectState(customSelect, selectElement);
        this.customSelects.push(customSelect);
        selectElement.addEventListener("change", ()=>{
            this.updateCustomSelect(selectElement, customSelect, options);
        });
        if (this.mobileMode && $a196c1ed25598f0e$var$SelectOptions.isMobileDevice()) customSelect.classList.add("select-option--mobile");
    }
    createOptions(selectElement, selectTrigger, selectItems, options) {
        selectItems.innerHTML = "";
        options.forEach((option, index)=>{
            const selectItem = document.createElement("div");
            selectItem.classList.add("select-option-list-item");
            selectItem.textContent = option.textContent;
            const labelValue = option.getAttribute("label");
            if (labelValue) selectItem.classList.add(`select-option-list-item--${labelValue}`);
            if (option.selected) {
                selectItem.classList.add("select-option-list-item--selected");
                selectTrigger.textContent = option.textContent;
                if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
            }
            selectItem.addEventListener("click", ()=>this.selectItem(selectItem, selectTrigger, selectElement, index, selectItems));
            selectItems.appendChild(selectItem);
        });
    }
    updateCustomSelect(selectElement, customSelect, options) {
        const selectTrigger = customSelect.querySelector(".select-option-trigger");
        const selectItems = customSelect.querySelector(".select-option-list");
        const { selectedIndex: selectedIndex } = selectElement;
        const selectedOption = options[selectedIndex];
        const labelValue = selectedOption.getAttribute("label");
        selectTrigger.textContent = selectedOption.textContent;
        selectTrigger.classList.remove(...Array.from(selectTrigger.classList).filter((cls)=>cls.startsWith("select-option-trigger--")));
        if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
        customSelect.classList.toggle("select-option--selected", selectedIndex > 0);
        this.createOptions(selectElement, selectTrigger, selectItems, options);
    }
    selectItem(selectItem, selectTrigger, selectElement, index, selectItems) {
        const customSelect = selectTrigger.closest(".select-option");
        const items = Array.from(selectItems.children);
        items.forEach((item)=>item.classList.remove("select-option-list-item--selected"));
        selectItem.classList.add("select-option-list-item--selected");
        selectTrigger.textContent = selectItem.textContent;
        selectElement.selectedIndex = index;
        selectTrigger.classList.remove(...Array.from(selectTrigger.classList).filter((cls)=>cls.startsWith("select-option-trigger--")));
        const selectedOption = selectElement.options[index];
        const labelValue = selectedOption.getAttribute("label");
        if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
        customSelect.classList.toggle("select-option--selected", index > 0);
        selectElement.dispatchEvent(new Event("change"));
        this.closeDropdown(customSelect);
    }
    closeDropdown(customSelect) {
        customSelect.classList.remove("select-option--opened");
        this.openSelect = null;
    }
    openDropdown(customSelect) {
        this.closeOpenedDropdowns();
        customSelect.classList.add("select-option--opened");
        this.openSelect = customSelect;
    }
    closeOpenedDropdowns(e) {
        this.customSelects.forEach((dropdown)=>{
            if (!e || !dropdown.contains(e.target)) dropdown.classList.remove("select-option--opened");
        });
        this.openSelect = null;
    }
    static checkAndSetDownstairsClass(customSelect) {
        const rect = customSelect.getBoundingClientRect();
        customSelect.classList.toggle("select-option--downstairs", rect.bottom + 160 > window.innerHeight);
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
        const hasLabel = customSelect.querySelector("label.floating-label") !== null;
        customSelect.classList.toggle("select-option--labeled", hasLabel);
        customSelect.classList.toggle("select-option--unlabeled", !hasLabel);
        customSelect.classList.toggle("select-option--selected", hasLabel && selectElement.selectedIndex > 0);
    }
    async init() {
        this.notched();
        this.selectContainer.forEach((selectElement)=>{
            const customSelect = selectElement.closest(".select-option-container")?.querySelector(".select-option");
            const options = Array.from(selectElement.options);
            if (customSelect) {
                this.setupCustomSelect(selectElement, customSelect, options);
                $a196c1ed25598f0e$var$SelectOptions.checkAndSetDownstairsClass(customSelect);
            }
        });
        document.addEventListener("click", this.closeOpenedDropdowns.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
        window.addEventListener("scroll", this.handleResize.bind(this));
    }
}
var $a196c1ed25598f0e$export$2e2bcd8739ae039 = $a196c1ed25598f0e$var$SelectOptions;


//# sourceMappingURL=index.js.map


function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", function () { return $2cd3d18b6faf2ef8$export$2e2bcd8739ae039; });
class $2cd3d18b6faf2ef8$var$SelectOptions {
    constructor(){}
    init() {
        const selectElements = document.querySelectorAll('.select-option-container select[name="select"]');
        selectElements.forEach((selectElement)=>{
            const customSelect = this.#createCustomSelect(selectElement);
            selectElement.style.display = "none";
            selectElement.parentNode.insertBefore(customSelect, selectElement.nextSibling);
        });
        document.addEventListener("click", this.#closeOpenDropdowns);
    }
    #createCustomSelect(selectElement) {
        const customSelect = document.createElement("div");
        customSelect.classList.add("select-option");
        const selectTrigger = document.createElement("div");
        selectTrigger.classList.add("select-option-trigger");
        customSelect.appendChild(selectTrigger);
        const selectItems = document.createElement("div");
        selectItems.classList.add("select-option-items");
        customSelect.appendChild(selectItems);
        this.#createOptions(selectElement, selectTrigger, selectItems);
        selectTrigger.addEventListener("click", ()=>{
            customSelect.classList.toggle("select-option--open");
        });
        return customSelect;
    }
    #createOptions(selectElement, selectTrigger, selectItems) {
        const options = selectElement.querySelectorAll("option");
        options.forEach((option, index)=>{
            const selectItem = document.createElement("div");
            selectItem.classList.add("select-option-item");
            selectItem.textContent = option.textContent;
            const labelValue = option.getAttribute("label");
            if (labelValue) selectItem.classList.add(`select-option-item--${labelValue}`);
            if (option.selected) {
                selectItem.classList.add("select-option-item--selected");
                selectTrigger.textContent = option.textContent;
            }
            selectItem.addEventListener("click", ()=>{
                this.#selectItem(selectItem, selectTrigger, selectElement, index, selectItems);
            });
            selectItems.appendChild(selectItem);
        });
    }
    #selectItem(selectItem, selectTrigger, selectElement, index, selectItems) {
        selectItems.querySelectorAll(".select-option-item").forEach((item)=>{
            item.classList.remove("select-option-item--selected");
        });
        selectItem.classList.add("select-option-item--selected");
        selectTrigger.textContent = selectItem.textContent;
        selectElement.selectedIndex = index;
        const event = new Event("change");
        selectElement.dispatchEvent(event);
        selectItem.closest(".select-option").classList.remove("select-option--open");
    }
    #closeOpenDropdowns(e) {
        const openDropdown = document.querySelector(".select-option.select-option--open");
        if (openDropdown && !openDropdown.contains(e.target)) openDropdown.classList.remove("select-option--open");
    }
}
var $2cd3d18b6faf2ef8$export$2e2bcd8739ae039 = $2cd3d18b6faf2ef8$var$SelectOptions;


//# sourceMappingURL=select-options.js.map

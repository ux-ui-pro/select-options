class $eb1aa2dd460bfb6b$var$SelectOptions {
    #selectContainer;
    #floatingLabel;
    #notches = [];
    #customSelects = [];
    #openSelect = null;
    #resizeObserver;
    #mobileMode = false;
    constructor({ mobileMode: mobileMode = false } = {}){
        this.#mobileMode = mobileMode;
        this.#selectContainer = [
            ...document.querySelectorAll(".select-option-container select")
        ];
        this.#floatingLabel = [
            ...document.querySelectorAll(".floating-label")
        ];
        this.#resizeObserver = new ResizeObserver((entries)=>{
            entries.forEach((entry)=>{
                const notch = entry.target.closest(".notched-outline")?.querySelector(".notched-outline__notch");
                if (notch) this.#setNotchWidth(notch, this.#getNotchWidth(notch));
            });
        });
    }
    #notched = ()=>{
        this.#floatingLabel.forEach((label)=>{
            const notchedOutline = label.closest(".notched-outline") ?? this.#createNotchedOutline(label);
            this.#notches.push({
                container: notchedOutline.parentNode,
                notch: notchedOutline.querySelector(".notched-outline__notch")
            });
            const lastNotch = this.#notches.at(-1).notch;
            this.#setNotchWidth(lastNotch, this.#getNotchWidth(lastNotch));
            this.#resizeObserver.observe(notchedOutline.querySelector(".floating-label"));
        });
    };
    #createNotchedOutline(label) {
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
    #setNotchWidth = (notch, width)=>notch.style.width = width;
    #getNotchWidth = (notch)=>{
        const label = notch.querySelector(".floating-label");
        return label ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px` : "auto";
    };
    #setupCustomSelect = (selectElement, customSelect, options)=>{
        const selectTrigger = customSelect.querySelector(".select-option-trigger") ?? document.createElement("div");
        const selectItems = customSelect.querySelector(".select-option-list") ?? document.createElement("div");
        selectTrigger.classList.add("select-option-trigger");
        selectItems.classList.add("select-option-list");
        customSelect.append(selectTrigger, selectItems);
        this.#createOptions(selectElement, selectTrigger, selectItems, options);
        if (!(this.#mobileMode && this.#isMobileDevice())) selectTrigger.addEventListener("click", (e)=>{
            e.stopPropagation();
            this.#openSelect === customSelect ? this.#closeDropdown(customSelect) : this.#openDropdown(customSelect);
        });
        this.#updateCustomSelectState(customSelect, selectElement);
        this.#customSelects.push(customSelect);
        selectElement.addEventListener("change", ()=>{
            this.#updateCustomSelect(selectElement, customSelect, options);
        });
        if (this.#mobileMode && this.#isMobileDevice()) customSelect.classList.add("select-option--mobile");
    };
    #createOptions = (selectElement, selectTrigger, selectItems, options)=>{
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
            selectItem.addEventListener("click", ()=>this.#selectItem(selectItem, selectTrigger, selectElement, index, selectItems));
            selectItems.appendChild(selectItem);
        });
    };
    #updateCustomSelect = (selectElement, customSelect, options)=>{
        const selectTrigger = customSelect.querySelector(".select-option-trigger");
        const selectItems = customSelect.querySelector(".select-option-list");
        const { selectedIndex: selectedIndex } = selectElement;
        const selectedOption = options[selectedIndex];
        const labelValue = selectedOption.getAttribute("label");
        selectTrigger.textContent = selectedOption.textContent;
        selectTrigger.classList.remove(...Array.from(selectTrigger.classList).filter((cls)=>cls.startsWith("select-option-trigger--")));
        if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
        customSelect.classList.toggle("select-option--selected", selectedIndex > 0);
        this.#createOptions(selectElement, selectTrigger, selectItems, options);
    };
    #selectItem = (selectItem, selectTrigger, selectElement, index, selectItems)=>{
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
        this.#closeDropdown(customSelect);
    };
    #closeDropdown = (customSelect)=>{
        customSelect.classList.remove("select-option--opened");
        this.#openSelect = null;
    };
    #openDropdown = (customSelect)=>{
        this.#closeOpenedDropdowns();
        customSelect.classList.add("select-option--opened");
        this.#openSelect = customSelect;
    };
    #closeOpenedDropdowns = (e)=>{
        this.#customSelects.forEach((dropdown)=>{
            if (!e || !dropdown.contains(e.target)) dropdown.classList.remove("select-option--opened");
        });
        this.#openSelect = null;
    };
    #checkAndSetDownstairsClass = (customSelect)=>{
        const rect = customSelect.getBoundingClientRect();
        customSelect.classList.toggle("select-option--downstairs", rect.bottom + 160 > window.innerHeight);
    };
    #handleResize = ()=>{
        this.#customSelects.forEach(this.#checkAndSetDownstairsClass);
    };
    #isMobileOS = ()=>/android/i.test(navigator.userAgent || navigator.vendor || window.opera) || /iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream;
    #isTouchDevice = ()=>"ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    #isMobileDevice = ()=>this.#isTouchDevice() || this.#isMobileOS();
    #updateCustomSelectState = (customSelect, selectElement)=>{
        const hasLabel = customSelect.querySelector("label.floating-label") !== null;
        customSelect.classList.toggle("select-option--labeled", hasLabel);
        customSelect.classList.toggle("select-option--unlabeled", !hasLabel);
        customSelect.classList.toggle("select-option--selected", hasLabel && selectElement.selectedIndex > 0);
    };
    init = async ()=>{
        this.#notched();
        this.#selectContainer.forEach((selectElement)=>{
            const customSelect = selectElement.closest(".select-option-container")?.querySelector(".select-option");
            const options = [
                ...selectElement.options
            ];
            if (customSelect) {
                this.#setupCustomSelect(selectElement, customSelect, options);
                this.#checkAndSetDownstairsClass(customSelect);
            }
        });
        document.addEventListener("click", this.#closeOpenedDropdowns);
        window.addEventListener("resize", this.#handleResize);
        window.addEventListener("scroll", this.#handleResize);
    };
}
var $eb1aa2dd460bfb6b$export$2e2bcd8739ae039 = $eb1aa2dd460bfb6b$var$SelectOptions;


export {$eb1aa2dd460bfb6b$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.module.js.map

class $eb1aa2dd460bfb6b$var$SelectOptions {
    #notches = [];
    openSelect = null;
    #resizeObserver = new ResizeObserver((entries)=>entries.forEach((entry)=>{
            const notch = entry.target.closest(".notched-outline")?.querySelector(".notched-outline__notch");
            if (notch) this.#setNotchWidth(notch, this.#getNotchWidth(notch));
        }));
    #notched = ()=>{
        document.querySelectorAll(".floating-label").forEach((label)=>{
            let notchedOutline = label.closest(".notched-outline") ?? document.createElement("div");
            if (!notchedOutline.classList.contains("notched-outline")) {
                notchedOutline.classList.add("notched-outline");
                notchedOutline.innerHTML = `
          <div class="notched-outline__leading"></div>
          <div class="notched-outline__notch">${label.outerHTML}</div>
          <div class="notched-outline__trailing"></div>
        `;
                label.replaceWith(notchedOutline);
            }
            this.#notches.push({
                container: notchedOutline.parentNode,
                notch: notchedOutline.querySelector(".notched-outline__notch")
            });
            const lastNotch = this.#notches.at(-1).notch;
            this.#setNotchWidth(lastNotch, this.#getNotchWidth(lastNotch));
            this.#resizeObserver.observe(notchedOutline.querySelector(".floating-label"));
        });
    };
    #setNotchWidth = (notch, width)=>notch.style.width = width;
    #getNotchWidth = (notch)=>{
        const label = notch.querySelector(".floating-label");
        return label ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px` : "auto";
    };
    #setupCustomSelect = (selectElement, customSelect)=>{
        const selectTrigger = customSelect.querySelector(".select-option-trigger") ?? document.createElement("div");
        const selectItems = customSelect.querySelector(".select-option-list") ?? document.createElement("div");
        selectTrigger.classList.add("select-option-trigger");
        selectItems.classList.add("select-option-list");
        if (!customSelect.contains(selectTrigger)) customSelect.appendChild(selectTrigger);
        if (!customSelect.contains(selectItems)) customSelect.appendChild(selectItems);
        this.#createOptions(selectElement, selectTrigger, selectItems);
        selectTrigger.addEventListener("click", (e)=>{
            e.stopPropagation();
            this.openSelect === customSelect ? this.#closeDropdown(customSelect) : this.#openDropdown(customSelect);
        });
        const hasLabel = customSelect.querySelector("label.floating-label") !== null;
        customSelect.classList.toggle("select-option--labeled", hasLabel);
        customSelect.classList.toggle("select-option--unlabeled", !hasLabel);
        customSelect.classList.toggle("select-option--selected", hasLabel && selectElement.selectedIndex > 0);
    };
    #createOptions = (selectElement, selectTrigger, selectItems)=>{
        selectItems.innerHTML = "";
        selectElement.querySelectorAll("option").forEach((option, index)=>{
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
    #selectItem = (selectItem, selectTrigger, selectElement, index, selectItems)=>{
        const customSelect = selectTrigger.closest(".select-option");
        selectItems.querySelectorAll(".select-option-list-item").forEach((item)=>item.classList.remove("select-option-list-item--selected"));
        selectItem.classList.add("select-option-list-item--selected");
        selectTrigger.textContent = selectItem.textContent;
        selectElement.selectedIndex = index;
        selectTrigger.classList.remove(...Array.from(selectTrigger.classList).filter((cls)=>cls.startsWith("select-option-trigger--")));
        const selectedOption = selectElement.options[index];
        const labelValue = selectedOption.getAttribute("label");
        if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
        customSelect.classList.toggle("select-option--selected", index > 0);
        selectElement.dispatchEvent(new Event("change"));
        customSelect.classList.remove("select-option--opened");
        this.openSelect = null;
    };
    #closeDropdown = (customSelect)=>{
        customSelect.classList.remove("select-option--opened");
        this.openSelect = null;
    };
    #openDropdown = (customSelect)=>{
        this.#closeOpenedDropdowns();
        customSelect.classList.add("select-option--opened");
        this.openSelect = customSelect;
    };
    #closeOpenedDropdowns = (e)=>{
        document.querySelectorAll(".select-option.select-option--opened").forEach((dropdown)=>{
            if (!e || !dropdown.contains(e.target)) dropdown.classList.remove("select-option--opened");
        });
        this.openSelect = null;
    };
    #checkAndSetDownstairsClass = (customSelect)=>{
        const rect = customSelect.getBoundingClientRect();
        customSelect.classList.toggle("select-option--downstairs", rect.bottom + 160 > window.innerHeight);
    };
    #handleResize = ()=>{
        document.querySelectorAll(".select-option-container .select-option").forEach(this.#checkAndSetDownstairsClass);
    };
    init = async ()=>{
        await this.#notched();
        document.querySelectorAll(".select-option-container select").forEach((selectElement)=>{
            const customSelect = selectElement.closest(".select-option-container")?.querySelector(".select-option");
            if (customSelect) {
                this.#setupCustomSelect(selectElement, customSelect);
                selectElement.style.display = "none";
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
//# sourceMappingURL=select-options.module.js.map

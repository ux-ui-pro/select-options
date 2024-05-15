class SelectOptions {
  constructor() {
    this.openSelect = null;
  }

  #setupCustomSelect(selectElement, customSelect) {
    let selectTrigger = customSelect.querySelector('.select-option-trigger');
    let selectItems = customSelect.querySelector('.select-option-items');

    if (!selectTrigger) {
      selectTrigger = document.createElement('div');

      selectTrigger.classList.add('select-option-trigger');

      customSelect.appendChild(selectTrigger);
    }

    if (!selectItems) {
      selectItems = document.createElement('div');

      selectItems.classList.add('select-option-items');

      customSelect.appendChild(selectItems);
    }

    this.#createOptions(selectElement, selectTrigger, selectItems);

    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();

      if (this.openSelect === customSelect) {
        customSelect.classList.remove('select-option--open');

        this.openSelect = null;
      } else {
        this.#closeOpenDropdowns();

        customSelect.classList.add('select-option--open');

        this.openSelect = customSelect;
      }
    });
  }

  #createOptions(selectElement, selectTrigger, selectItems) {
    selectItems.innerHTML = '';

    const options = selectElement.querySelectorAll('option');

    options.forEach((option, index) => {
      const selectItem = document.createElement('div');

      selectItem.classList.add('select-option-item');
      selectItem.textContent = option.textContent;

      const labelValue = option.getAttribute('label');

      if (labelValue) {
        selectItem.classList.add(`select-option-item--${labelValue}`);
      }

      if (option.selected) {
        selectItem.classList.add('select-option-item--selected');
        selectTrigger.textContent = option.textContent;
      }

      selectItem.addEventListener('click', () => {
        this.#selectItem(selectItem, selectTrigger, selectElement, index, selectItems);
      });

      selectItems.appendChild(selectItem);
    });
  }

  #selectItem(selectItem, selectTrigger, selectElement, index, selectItems) {
    selectItems.querySelectorAll('.select-option-item').forEach(item => {
      item.classList.remove('select-option-item--selected');
    });

    selectItem.classList.add('select-option-item--selected');
    selectTrigger.textContent = selectItem.textContent;
    selectElement.selectedIndex = index;

    const event = new Event('change');

    selectElement.dispatchEvent(event);
    selectItem.closest('.select-option').classList.remove('select-option--open');

    this.openSelect = null;
  }

  #closeOpenDropdowns(e) {
    const openDropdowns = document.querySelectorAll('.select-option.select-option--open');

    openDropdowns.forEach(dropdown => {
      if (!e || !dropdown.contains(e.target)) {
        dropdown.classList.remove('select-option--open');
      }
    });

    this.openSelect = null;
  }

  #checkAndSetDownstairsClass(customSelect) {
    const rect = customSelect.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom + 230 > viewportHeight) {
      customSelect.classList.add('select-option--downstairs');
    } else {
      customSelect.classList.remove('select-option--downstairs');
    }
  }

  #handleResize() {
    const selectElements = document.querySelectorAll('.select-option-container .select-option');

    selectElements.forEach(customSelect => {
      this.#checkAndSetDownstairsClass(customSelect);
    });
  }

  init() {
    const selectElements = document.querySelectorAll('.select-option-container select[name="select"]');

    selectElements.forEach(selectElement => {
      const customSelect = selectElement.closest('.select-option-container').querySelector('.select-option');

      if (customSelect) {
        this.#setupCustomSelect(selectElement, customSelect);

        selectElement.style.display = 'none';

        this.#checkAndSetDownstairsClass(customSelect);
      }
    });

    document.addEventListener('click', this.#closeOpenDropdowns.bind(this));

    window.addEventListener('resize', this.#handleResize.bind(this));
    window.addEventListener('scroll', this.#handleResize.bind(this));
  }
}

export default SelectOptions;

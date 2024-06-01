class SelectOptions {
  private selectContainer: HTMLSelectElement[] = [];
  private floatingLabel: HTMLElement[] = [];
  private notches: { container: HTMLElement, notch: HTMLElement }[] = [];
  private customSelects: HTMLElement[] = [];
  private openSelect: HTMLElement | null = null;
  private resizeObserver: ResizeObserver;
  private readonly mobileMode: boolean = false;

  constructor({ mobileMode = false }: { mobileMode?: boolean } = {}) {
    this.mobileMode = mobileMode;
    this.selectContainer = Array.from(document.querySelectorAll('.select-option-container select'));
    this.floatingLabel = Array.from(document.querySelectorAll('.floating-label'));

    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const notch = entry.target.closest('.notched-outline')?.querySelector('.notched-outline__notch') as HTMLElement | null;

        if (notch) SelectOptions.setNotchWidth(notch, SelectOptions.getNotchWidth(notch));
      });
    });
  }

  private notched() {
    this.floatingLabel.forEach((label) => {
      const notchedOutline = label.closest('.notched-outline') ?? SelectOptions.createNotchedOutline(label);

      this.notches.push({ container: notchedOutline.parentNode as HTMLElement, notch: notchedOutline.querySelector('.notched-outline__notch')! });

      const lastNotch = this.notches.at(-1)?.notch as HTMLElement | null;

      if (lastNotch) {
        SelectOptions.setNotchWidth(lastNotch, SelectOptions.getNotchWidth(lastNotch));

        this.resizeObserver.observe(notchedOutline.querySelector('.floating-label') as HTMLElement);
      }
    });
  }

  private static createNotchedOutline(label: HTMLElement): HTMLElement {
    const notchedOutline = document.createElement('div');

    notchedOutline.classList.add('notched-outline');
    notchedOutline.innerHTML = `
      <div class="notched-outline__leading"></div>
      <div class="notched-outline__notch">${label.outerHTML}</div>
      <div class="notched-outline__trailing"></div>
    `;
    label.replaceWith(notchedOutline);

    return notchedOutline;
  }

  private static setNotchWidth(notch: HTMLElement, width: string) {
    notch.style.width = width;
  }

  private static getNotchWidth(notch: HTMLElement): string {
    const label = notch.querySelector('.floating-label') as HTMLElement;

    return label ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px` : 'auto';
  }

  private setupCustomSelect(selectElement: HTMLSelectElement, customSelect: HTMLElement, options: HTMLOptionElement[]) {
    const selectTrigger = customSelect.querySelector('.select-option-trigger') as HTMLElement ?? document.createElement('div');
    const selectItems = customSelect.querySelector('.select-option-list') as HTMLElement ?? document.createElement('div');

    selectTrigger.classList.add('select-option-trigger');
    selectItems.classList.add('select-option-list');
    customSelect.append(selectTrigger, selectItems);

    this.createOptions(selectElement, selectTrigger, selectItems, options);

    if (!(this.mobileMode && SelectOptions.isMobileDevice())) {
      selectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();

        if (this.openSelect === customSelect) {
          this.closeDropdown(customSelect);
        } else {
          this.openDropdown(customSelect);
        }
      });
    }

    SelectOptions.updateCustomSelectState(customSelect, selectElement);
    this.customSelects.push(customSelect);

    selectElement.addEventListener('change', () => {
      this.updateCustomSelect(selectElement, customSelect, options);
    });

    if (this.mobileMode && SelectOptions.isMobileDevice()) {
      customSelect.classList.add('select-option--mobile');
    }
  }

  private createOptions(selectElement: HTMLSelectElement, selectTrigger: HTMLElement, selectItems: HTMLElement, options: HTMLOptionElement[]) {
    selectItems.innerHTML = '';

    options.forEach((option, index) => {
      const selectItem = document.createElement('div');

      selectItem.classList.add('select-option-list-item');
      selectItem.textContent = option.textContent;

      const labelValue = option.getAttribute('label');

      if (labelValue) selectItem.classList.add(`select-option-list-item--${labelValue}`);

      if (option.selected) {
        selectItem.classList.add('select-option-list-item--selected');
        selectTrigger.textContent = option.textContent;

        if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
      }

      selectItem.addEventListener('click', () => this.selectItem(selectItem, selectTrigger, selectElement, index, selectItems));
      selectItems.appendChild(selectItem);
    });
  }

  private updateCustomSelect(selectElement: HTMLSelectElement, customSelect: HTMLElement, options: HTMLOptionElement[]) {
    const selectTrigger = customSelect.querySelector('.select-option-trigger') as HTMLElement;
    const selectItems = customSelect.querySelector('.select-option-list') as HTMLElement;
    const { selectedIndex } = selectElement;
    const selectedOption = options[selectedIndex];
    const labelValue = selectedOption.getAttribute('label');

    selectTrigger.textContent = selectedOption.textContent;
    selectTrigger.classList.remove(...Array.from(selectTrigger.classList).filter((cls) => cls.startsWith('select-option-trigger--')));

    if (labelValue) {
      selectTrigger.classList.add(`select-option-trigger--${labelValue}`);
    }

    customSelect.classList.toggle('select-option--selected', selectedIndex > 0);

    this.createOptions(selectElement, selectTrigger, selectItems, options);
  }

  private selectItem(selectItem: HTMLElement, selectTrigger: HTMLElement, selectElement: HTMLSelectElement, index: number, selectItems: HTMLElement) {
    const customSelect = selectTrigger.closest('.select-option') as HTMLElement;
    const items = Array.from(selectItems.children);

    items.forEach((item) => item.classList.remove('select-option-list-item--selected'));
    selectItem.classList.add('select-option-list-item--selected');

    selectTrigger.textContent = selectItem.textContent;
    selectElement.selectedIndex = index;

    selectTrigger.classList.remove(...Array.from(selectTrigger.classList).filter((cls) => cls.startsWith('select-option-trigger--')));

    const selectedOption = selectElement.options[index];
    const labelValue = selectedOption.getAttribute('label');

    if (labelValue) selectTrigger.classList.add(`select-option-trigger--${labelValue}`);

    customSelect.classList.toggle('select-option--selected', index > 0);
    selectElement.dispatchEvent(new Event('change'));

    this.closeDropdown(customSelect);
  }

  private closeDropdown(customSelect: HTMLElement) {
    customSelect.classList.remove('select-option--opened');

    this.openSelect = null;
  }

  private openDropdown(customSelect: HTMLElement) {
    this.closeOpenedDropdowns();

    customSelect.classList.add('select-option--opened');

    this.openSelect = customSelect;
  }

  private closeOpenedDropdowns(e?: MouseEvent) {
    this.customSelects.forEach((dropdown) => {
      if (!e || !dropdown.contains(e.target as Node)) dropdown.classList.remove('select-option--opened');
    });

    this.openSelect = null;
  }

  private static checkAndSetDownstairsClass(customSelect: HTMLElement) {
    const rect = customSelect.getBoundingClientRect();

    customSelect.classList.toggle('select-option--downstairs', rect.bottom + 160 > window.innerHeight);
  }

  private handleResize() {
    this.customSelects.forEach(SelectOptions.checkAndSetDownstairsClass);
  }

  private static isMobileOS(): boolean {
    return (/android/i.test(navigator.userAgent || navigator.vendor)) || ((/iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor)) && !('MSStream' in window));
  }

  private static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }

  private static isMobileDevice(): boolean {
    return SelectOptions.isTouchDevice() || SelectOptions.isMobileOS();
  }

  private static updateCustomSelectState(customSelect: HTMLElement, selectElement: HTMLSelectElement) {
    const hasLabel = customSelect.querySelector('label.floating-label') !== null;

    customSelect.classList.toggle('select-option--labeled', hasLabel);
    customSelect.classList.toggle('select-option--unlabeled', !hasLabel);
    customSelect.classList.toggle('select-option--selected', hasLabel && selectElement.selectedIndex > 0);
  }

  async init() {
    this.notched();

    this.selectContainer.forEach((selectElement) => {
      const customSelect = selectElement.closest('.select-option-container')?.querySelector('.select-option') as HTMLElement;
      const options = Array.from(selectElement.options) as HTMLOptionElement[];

      if (customSelect) {
        this.setupCustomSelect(selectElement, customSelect, options);

        SelectOptions.checkAndSetDownstairsClass(customSelect);
      }
    });

    document.addEventListener('click', this.closeOpenedDropdowns.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleResize.bind(this));
  }
}

export default SelectOptions;

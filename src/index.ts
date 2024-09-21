const CLASSES = {
  selectContainer: 'select-option-container',
  selectOption: 'select-option',
  floatingLabel: 'floating-label',
  notchedOutline: 'notched-outline',
  notchedOutlineNotch: 'notched-outline__notch',
  notchedOutlineLeading: 'notched-outline__leading',
  notchedOutlineTrailing: 'notched-outline__trailing',
  selectOptionTrigger: 'select-option-trigger',
  selectOptionList: 'select-option-list',
  selectOptionListItem: 'select-option-list-item',
  selectOptionListItemSelected: 'select-option-list-item--selected',
  selectOptionOpened: 'select-option--opened',
  selectOptionMobile: 'select-option--mobile',
  selectOptionSelected: 'select-option--selected',
  selectOptionLabeled: 'select-option--labeled',
  selectOptionUnlabeled: 'select-option--unlabeled',
  selectOptionDownstairs: 'select-option--downstairs',
};

class SelectOptions {
  private selectContainer: HTMLSelectElement[] = [];

  private floatingLabel: HTMLElement[] = [];

  private customSelects: HTMLElement[] = [];

  private openSelect: HTMLElement | null = null;

  private resizeObserver: ResizeObserver;

  private readonly mobileMode: boolean = false;

  constructor({ mobileMode = false }: { mobileMode?: boolean } = {}) {
    this.mobileMode = mobileMode;
    this.selectContainer = Array.from(
      document.querySelectorAll(`.${CLASSES.selectContainer} select`),
    );
    this.floatingLabel = Array.from(
      document.querySelectorAll(`.${CLASSES.floatingLabel}`),
    );
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const notchElement = entry.target
          .closest(`.${CLASSES.notchedOutline}`)
          ?.querySelector(
            `.${CLASSES.notchedOutlineNotch}`,
          ) as HTMLElement | null;

        if (notchElement) {
          SelectOptions.setNotchWidth(
            notchElement,
            SelectOptions.getNotchWidth(notchElement),
          );
        }
      });
    });
  }

  private notched() {
    this.floatingLabel.forEach((label) => {
      let notchedOutline = label.closest(`.${CLASSES.notchedOutline}`);
      let notch: HTMLElement;

      if (!notchedOutline) {
        notchedOutline = SelectOptions.createNotchedOutline(label);
        notch = notchedOutline.querySelector(
          `.${CLASSES.notchedOutlineNotch}`,
        ) as HTMLElement;

        label = notch.querySelector(`.${CLASSES.floatingLabel}`) as HTMLElement;
      } else {
        notch = notchedOutline.querySelector(
          `.${CLASSES.notchedOutlineNotch}`,
        ) as HTMLElement;

        label = notch.querySelector(`.${CLASSES.floatingLabel}`) as HTMLElement;
      }

      SelectOptions.setNotchWidth(notch, SelectOptions.getNotchWidth(notch));

      this.resizeObserver.observe(label);
    });
  }

  private static createNotchedOutline(label: HTMLElement): HTMLElement {
    const notchedOutline = document.createElement('div');

    notchedOutline.classList.add(CLASSES.notchedOutline);
    notchedOutline.innerHTML = `
      <div class="${CLASSES.notchedOutlineLeading}"></div>
      <div class="${CLASSES.notchedOutlineNotch}">${label.outerHTML}</div>
      <div class="${CLASSES.notchedOutlineTrailing}"></div>
    `;

    label.replaceWith(notchedOutline);

    return notchedOutline;
  }

  private static setNotchWidth(notchElement: HTMLElement, width: string) {
    notchElement.style.width = width;
  }

  private static getNotchWidth(notch: HTMLElement): string {
    const label = notch.querySelector(`.${CLASSES.floatingLabel}`) as HTMLElement;

    return label
      ? `${(parseFloat(getComputedStyle(label).width) + 13) * 0.75}px`
      : 'auto';
  }

  private setupCustomSelect(
    selectElement: HTMLSelectElement,
    customSelect: HTMLElement,
    options: HTMLOptionElement[],
  ) {
    const selectTrigger = customSelect.querySelector(`.${CLASSES.selectOptionTrigger}`)
      || document.createElement('div');
    const selectItems = customSelect.querySelector(`.${CLASSES.selectOptionList}`)
      || document.createElement('div');

    selectTrigger.classList.add(CLASSES.selectOptionTrigger);
    selectItems.classList.add(CLASSES.selectOptionList);
    customSelect.append(selectTrigger, selectItems);

    this.createOptions(
      selectElement,
        selectTrigger as HTMLElement,
        selectItems as HTMLElement,
        options,
    );

    selectTrigger.addEventListener('click', (e) => this.toggleDropdown(e, customSelect));

    SelectOptions.updateCustomSelectState(customSelect, selectElement);

    this.customSelects.push(customSelect);

    selectElement.addEventListener('change', () => {
      this.updateCustomSelect(selectElement, customSelect, options);
    });

    if (this.mobileMode && SelectOptions.isMobileDevice()) {
      customSelect.classList.add(CLASSES.selectOptionMobile);
    }
  }

  private createOptions(
    selectElement: HTMLSelectElement,
    selectTrigger: HTMLElement,
    selectItems: HTMLElement,
    options: HTMLOptionElement[],
  ) {
    const newSelectTrigger = selectTrigger;
    const newSelectItems = selectItems;

    newSelectItems.innerHTML = '';

    options.forEach((option, index) => {
      const selectItem = document.createElement('div');

      selectItem.classList.add(CLASSES.selectOptionListItem);
      selectItem.textContent = option.textContent;

      const customValue = option.getAttribute('data-custom');

      if (customValue) {
        selectItem.classList.add(
          `${CLASSES.selectOptionListItem}--${customValue}`,
        );
      }

      if (option.selected) {
        selectItem.classList.add(CLASSES.selectOptionListItemSelected);
        newSelectTrigger.textContent = option.textContent;

        if (customValue) {
          newSelectTrigger.classList.add(
            `${CLASSES.selectOptionTrigger}--${customValue}`,
          );
        }
      }

      selectItem.addEventListener('click', () => this.selectItem(
        newSelectTrigger as HTMLElement,
        selectElement,
        index,
        newSelectItems,
      ));

      newSelectItems.appendChild(selectItem);
    });
  }

  private updateCustomSelect(
    selectElement: HTMLSelectElement,
    customSelect: HTMLElement,
    options: HTMLOptionElement[],
  ) {
    const selectTrigger = customSelect.querySelector(
      `.${CLASSES.selectOptionTrigger}`,
    ) as HTMLElement;
    const selectItems = customSelect.querySelector(
      `.${CLASSES.selectOptionList}`,
    ) as HTMLElement;
    const { selectedIndex } = selectElement;
    const selectedOption = options[selectedIndex];
    const customValue = selectedOption.getAttribute('data-custom');

    selectTrigger.textContent = selectedOption.textContent;

    SelectOptions.updateClasses(
      selectTrigger,
      `${CLASSES.selectOptionTrigger}--${customValue}`,
    );

    customSelect.classList.toggle(
      CLASSES.selectOptionSelected,
      selectedIndex > 0,
    );

    this.createOptions(selectElement, selectTrigger, selectItems, options);
  }

  private selectItem(
    selectTrigger: HTMLElement,
    selectElement: HTMLSelectElement,
    index: number,
    selectItems: HTMLElement,
  ) {
    selectElement.selectedIndex = index;
    selectElement.dispatchEvent(new Event('change'));

    this.createOptions(
      selectElement,
      selectTrigger,
      selectItems,
        Array.from(selectElement.options) as HTMLOptionElement[],
    );
    this.closeDropdown(
        selectTrigger.closest(`.${CLASSES.selectOption}`) as HTMLElement,
    );
  }

  private closeDropdown(customSelect: HTMLElement) {
    customSelect.classList.remove(CLASSES.selectOptionOpened);

    this.openSelect = null;
  }

  private openDropdown(customSelect: HTMLElement) {
    this.closeOpenedDropdowns();

    customSelect.classList.add(CLASSES.selectOptionOpened);

    this.openSelect = customSelect;
  }

  private closeOpenedDropdowns(e?: MouseEvent) {
    this.customSelects.forEach((dropdown) => {
      if (!e || !dropdown.contains(e.target as Node)) {
        dropdown.classList.remove(CLASSES.selectOptionOpened);
      }
    });

    this.openSelect = null;
  }

  private toggleDropdown(e: Event, customSelect: HTMLElement) {
    e.stopPropagation();

    if (this.openSelect === customSelect) {
      this.closeDropdown(customSelect);
    } else {
      this.openDropdown(customSelect);
    }
  }

  private static checkAndSetDownstairsClass(customSelect: HTMLElement) {
    const rect = customSelect.getBoundingClientRect();

    customSelect.classList.toggle(
      CLASSES.selectOptionDownstairs,
      rect.bottom + 160 > window.innerHeight,
    );
  }

  private handleResize() {
    this.customSelects.forEach(SelectOptions.checkAndSetDownstairsClass);
  }

  private static isMobileOS(): boolean {
    return (
      /android/i.test(navigator.userAgent || navigator.vendor)
        || (/iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor)
          && !('MSStream' in window))
    );
  }

  private static isTouchDevice(): boolean {
    return (
      'ontouchstart' in window
        || navigator.maxTouchPoints > 0
        || window.matchMedia('(hover: none) and (pointer: coarse)').matches
    );
  }

  private static isMobileDevice(): boolean {
    return SelectOptions.isTouchDevice() || SelectOptions.isMobileOS();
  }

  private static updateCustomSelectState(
    customSelect: HTMLElement,
    selectElement: HTMLSelectElement,
  ) {
    const hasLabel = customSelect.querySelector(`label.${CLASSES.floatingLabel}`) !== null;

    customSelect.classList.toggle(CLASSES.selectOptionLabeled, hasLabel);
    customSelect.classList.toggle(CLASSES.selectOptionUnlabeled, !hasLabel);
    customSelect.classList.toggle(
      CLASSES.selectOptionSelected,
      hasLabel && selectElement.selectedIndex > 0,
    );
  }

  private static updateClasses(element: HTMLElement, className: string) {
    element.classList.remove(
      ...Array.from(element.classList).filter((cls) => cls.startsWith(`${CLASSES.selectOptionTrigger}--`)),
    );

    if (className) element.classList.add(className);
  }

  public updateSelects() {
    this.selectContainer.forEach((selectElement) => {
      const customSelect = selectElement
        .closest(`.${CLASSES.selectContainer}`)
        ?.querySelector(`.${CLASSES.selectOption}`) as HTMLElement;
      const options = Array.from(selectElement.options) as HTMLOptionElement[];

      if (customSelect) {
        this.updateCustomSelect(selectElement, customSelect, options);
      }
    });
  }

  async init() {
    this.notched();

    this.selectContainer.forEach((selectElement) => {
      const customSelect = selectElement
        .closest(`.${CLASSES.selectContainer}`)
        ?.querySelector(`.${CLASSES.selectOption}`) as HTMLElement;
      const options = Array.from(selectElement.options) as HTMLOptionElement[];

      if (customSelect) {
        this.setupCustomSelect(selectElement, customSelect, options);

        SelectOptions.checkAndSetDownstairsClass(customSelect);
      }
    });

    document.addEventListener('pointerdown', this.closeOpenedDropdowns.bind(this));

    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleResize.bind(this));
  }
}

export default SelectOptions;

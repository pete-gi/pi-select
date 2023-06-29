import template from "../templates/pi-select.template.html?raw";
import { PiSelectAttribute } from "../types/PiSelectAttribute";
import PiOptGroup from "./pi-optgroup";
import PiOption from "./pi-option";

export default class PiSelect extends HTMLElement {
  public static formAssociated = true;
  public static observedAttributes: PiSelectAttribute[] = [
    "multiple",
    "placeholder",
    "name",
    "required",
    "disabled",
    "validationmessage",
  ];

  public shadowRoot: ShadowRoot;
  public internals: ElementInternals;
  public tabIndex: number = 0;

  private _value: string | null;
  public get value(): string | null {
    return this._value;
  }
  public set value(v: string | null) {
    this._value = v || null;
    this.onUpdateValue();
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(v: string) {
    this._title = v;
    this.buttonElement.title = this._title;
  }

  private _multiple: boolean = false;
  public get multiple(): boolean {
    return this._multiple;
  }
  public set multiple(v: boolean) {
    this._multiple = v;
  }

  private _disabled: boolean = false;
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(v: boolean) {
    this._disabled = v;
  }

  private _placeholder: string = "";
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(v: string) {
    this._placeholder = v;
    this.placeholderElement.innerText = this._placeholder;
  }

  private _name: string = "";
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
    if (this.getAttribute("name") !== this._name) {
      this.setAttribute("name", this._name);
    }
  }

  private _required: boolean;
  public get required(): boolean {
    return this._required;
  }
  public set required(v: boolean) {
    this._required = v;
    this.toggleAttribute("required", this._required);
  }

  public validationmessage: string = "Value must be selected.";

  public get form() {
    return this.internals.form;
  }
  public get type() {
    return this.localName;
  }
  public get validity() {
    return this.internals.validity;
  }

  public get validationMessage() {
    return this.internals.validationMessage;
  }
  public get willValidate() {
    return this.internals.willValidate;
  }

  private _isOpen: boolean;
  public get isOpen(): boolean {
    return this._isOpen;
  }
  public set isOpen(v: boolean) {
    this._isOpen = v;
    if (this._isOpen) {
      this.listboxElement.setAttribute("open", "");
    } else {
      this.listboxElement.removeAttribute("open");
    }
  }

  private get buttonElement(): HTMLButtonElement {
    return this.shadowRoot.querySelector<HTMLButtonElement>('[part="button"]')!;
  }

  private get placeholderElement(): HTMLSpanElement {
    return this.shadowRoot.querySelector<HTMLSpanElement>(
      '[part="placeholder"]'
    )!;
  }

  private get valueElement(): HTMLSpanElement {
    return this.shadowRoot.querySelector<HTMLSpanElement>('[part="value"]')!;
  }

  private get listboxElement(): HTMLDivElement {
    return this.shadowRoot.querySelector<HTMLDivElement>('[part="listbox"]')!;
  }

  public get allOptions(): PiOption[] {
    return Array.from(this.querySelectorAll<PiOption>("pi-option") || []);
  }

  public get options(): PiOption[] {
    return this.allOptions.filter(
      (option) =>
        !option.disabled && option.optGroup && !option.optGroup?.disabled
    );
  }

  public get allOptGroups(): PiOptGroup[] {
    return Array.from(this.querySelectorAll<PiOptGroup>("pi-optgroup") || []);
  }

  public get optGroups(): PiOptGroup[] {
    return this.allOptGroups.filter((group) => !group.disabled);
  }

  private get currentOption(): PiOption | null {
    const optionElement = document.activeElement as PiOption | null;
    if (optionElement && this.options.includes(optionElement)) {
      return optionElement;
    }
    return null;
  }

  private get currentOptionIndex(): number | null {
    if (this.currentOption) {
      const index = this.options.findIndex(
        (option) => option === this.currentOption
      );
      if (index >= 0) {
        return index;
      }
    }
    return null;
  }

  private get isFirstElement(): boolean {
    return this.currentOptionIndex === 0;
  }

  private get isLastElement(): boolean {
    return this.currentOptionIndex === this.options.length - 1;
  }

  private get nextOption(): PiOption {
    if (this.currentOptionIndex !== null) {
      if (!this.isLastElement) {
        return this.options[this.currentOptionIndex + 1];
      }
    }
    return this.options[0];
  }

  private get prevOption(): PiOption {
    if (this.currentOptionIndex) {
      if (!this.isFirstElement) {
        return this.options[this.currentOptionIndex - 1];
      }
    }
    return this.options[this.options.length - 1];
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
    this.appendTemplate();
  }

  private appendTemplate() {
    const tmpl = document.createElement("template");
    tmpl.innerHTML = template;
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }

  public connectedCallback() {
    this.listenForButtonClickEvent();
    this.listenForCloseEvents();
    this.listenForBlurEvent();
    this.listenForNavigationEvents();
  }

  public attributeChangedCallback(
    attr: PiSelectAttribute,
    _: any,
    value: string | string[] | null
  ) {
    switch (attr) {
      case "placeholder":
        this.placeholder = value ? value.toString() : "";
        break;
      case "name":
        this.name = value?.toString() || "";
        break;
      case "validationmessage":
        this.validationmessage = value?.toString() || "";
        break;
      case "multiple":
        if (value !== null && value !== "false") {
          this.multiple = true;
        } else {
          this.multiple = false;
        }
        break;
      case "required":
        if (value !== null && value !== "false") {
          this.required = true;
        } else {
          this.required = false;
        }
        break;
      case "disabled":
        if (value !== null && value !== "false") {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
        break;
    }
  }

  public checkValidity() {
    return this.internals.checkValidity();
  }

  public reportValidity() {
    return this.internals.reportValidity();
  }

  public formResetCallback() {
    this.options.forEach((option) => {
      option.selected = false;
    });
  }

  private listenForButtonClickEvent() {
    this.buttonElement.addEventListener("click", () => {
      this.toggle();
    });
  }

  private listenForCloseEvents() {
    document.addEventListener("click", () => {
      this.close();
    });
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.close();
      }
    });
    this.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  private listenForBlurEvent() {
    this.shadowRoot.addEventListener(
      "blur",
      () => {
        if (this.matches(":not(:focus-within)")) {
          this.close();
        }
      },
      { capture: true }
    );
  }

  private listenForNavigationEvents() {
    this.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowDown":
            this.next();
            break;
          case "ArrowUp":
            this.prev();
            break;
        }
      },
      { capture: true }
    );
  }

  public getValue(): string | null {
    if (this.multiple) {
      const value: string[] = [];
      this.options.forEach((option) => {
        if (option.selected) {
          value.push(option.value);
        }
      });
      return value.join(",");
    } else {
      return this.options.find((option) => option.selected)?.value || null;
    }
  }

  private onUpdateValue() {
    if (this.matches(":disabled") || (this.required && this.value === null)) {
      this.internals.setValidity(
        { valueMissing: true },
        this.validationmessage
      );
    } else {
      this.internals.setValidity({});
    }
    this.internals.setFormValue(this._value || null);
    this.title = this.setValueElementValue();
  }

  private setValueElementValue() {
    const selectedOptions = this.options.filter((option) => option.selected);
    const value = selectedOptions
      .reduce((acc: string[], option) => {
        acc.push(option.label);
        return acc;
      }, [])
      .join(", ");

    if (value) {
      this.placeholderElement.hidden = true;
    } else {
      this.placeholderElement.hidden = false;
    }

    this.valueElement.textContent = value;
    return value;
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }

  public next() {
    this.nextOption.inputElement.focus();
  }

  public prev() {
    this.prevOption.inputElement.focus();
  }
}

window.customElements.define("pi-select", PiSelect);

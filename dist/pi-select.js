const h = `<button part="button" type="button">
  <span part="label">
    <span part="placeholder"></span>
    <span part="value"></span>
  </span>
  <span part="marker">
    <slot name="marker">⏷</slot>
  </span>
</button>
<div part="listbox">
  <slot></slot>
</div>

<style>
  :host {
    display: inline-block;
    position: relative;
    text-align: left;
  }

  [part="button"] {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  [part="placeholdervalue"] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  [part="listbox"] {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 10rem;
    border: 1px solid black;
    background: white;
    overflow-y: auto;
    z-index: 1;
  }

  [part="listbox"][open] {
    display: block;
  }

  [disabled] {
    color: grey;
  }
</style>
`;
class i extends HTMLElement {
  constructor() {
    super(), this.tabIndex = 0, this._multiple = !1, this._disabled = !1, this._placeholder = "", this._name = "", this.validationmessage = "Value must be selected.", this.internals = this.attachInternals(), this.attachShadow({ mode: "open" }), this.appendTemplate();
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this._value = e || null, this.onUpdateValue();
  }
  get title() {
    return this._title;
  }
  set title(e) {
    this._title = e, this.buttonElement.title = this._title;
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(e) {
    this._multiple = e;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(e) {
    this._disabled = e;
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(e) {
    this._placeholder = e, this.placeholderElement.innerText = this._placeholder;
  }
  get name() {
    return this._name;
  }
  set name(e) {
    this._name = e, this.getAttribute("name") !== this._name && this.setAttribute("name", this._name);
  }
  get required() {
    return this._required;
  }
  set required(e) {
    this._required = e, this.toggleAttribute("required", this._required);
  }
  get form() {
    return this.internals.form;
  }
  get type() {
    return this.localName;
  }
  get validity() {
    return this.internals.validity;
  }
  get validationMessage() {
    return this.internals.validationMessage;
  }
  get willValidate() {
    return this.internals.willValidate;
  }
  get isOpen() {
    return this._isOpen;
  }
  set isOpen(e) {
    this._isOpen = e, this._isOpen ? this.listboxElement.setAttribute("open", "") : this.listboxElement.removeAttribute("open");
  }
  get buttonElement() {
    return this.shadowRoot.querySelector('[part="button"]');
  }
  get placeholderElement() {
    return this.shadowRoot.querySelector(
      '[part="placeholder"]'
    );
  }
  get valueElement() {
    return this.shadowRoot.querySelector('[part="value"]');
  }
  get listboxElement() {
    return this.shadowRoot.querySelector('[part="listbox"]');
  }
  get allOptions() {
    return Array.from(this.querySelectorAll("pi-option") || []);
  }
  get options() {
    return this.allOptions.filter(
      (e) => {
        var s;
        return !e.disabled && e.optGroup && !((s = e.optGroup) != null && s.disabled);
      }
    );
  }
  get allOptGroups() {
    return Array.from(this.querySelectorAll("pi-optgroup") || []);
  }
  get optGroups() {
    return this.allOptGroups.filter((e) => !e.disabled);
  }
  get currentOption() {
    const e = document.activeElement;
    return e && this.options.includes(e) ? e : null;
  }
  get currentOptionIndex() {
    if (this.currentOption) {
      const e = this.options.findIndex(
        (s) => s === this.currentOption
      );
      if (e >= 0)
        return e;
    }
    return null;
  }
  get isFirstElement() {
    return this.currentOptionIndex === 0;
  }
  get isLastElement() {
    return this.currentOptionIndex === this.options.length - 1;
  }
  get nextOption() {
    return this.currentOptionIndex !== null && !this.isLastElement ? this.options[this.currentOptionIndex + 1] : this.options[0];
  }
  get prevOption() {
    return this.currentOptionIndex && !this.isFirstElement ? this.options[this.currentOptionIndex - 1] : this.options[this.options.length - 1];
  }
  appendTemplate() {
    const e = document.createElement("template");
    e.innerHTML = h, this.shadowRoot.appendChild(e.content.cloneNode(!0));
  }
  connectedCallback() {
    this.listenForButtonClickEvent(), this.listenForCloseEvents(), this.listenForBlurEvent(), this.listenForNavigationEvents();
  }
  attributeChangedCallback(e, s, t) {
    switch (e) {
      case "placeholder":
        this.placeholder = t ? t.toString() : "";
        break;
      case "name":
        this.name = (t == null ? void 0 : t.toString()) || "";
        break;
      case "validationmessage":
        this.validationmessage = (t == null ? void 0 : t.toString()) || "";
        break;
      case "multiple":
        t !== null && t !== "false" ? this.multiple = !0 : this.multiple = !1;
        break;
      case "required":
        t !== null && t !== "false" ? this.required = !0 : this.required = !1;
        break;
      case "disabled":
        t !== null && t !== "false" ? this.disabled = !0 : this.disabled = !1;
        break;
    }
  }
  checkValidity() {
    return this.internals.checkValidity();
  }
  reportValidity() {
    return this.internals.reportValidity();
  }
  formResetCallback() {
    this.options.forEach((e) => {
      e.selected = !1;
    });
  }
  listenForButtonClickEvent() {
    this.buttonElement.addEventListener("click", () => {
      this.toggle();
    });
  }
  listenForCloseEvents() {
    document.addEventListener("click", () => {
      this.close();
    }), document.addEventListener("keydown", (e) => {
      e.key === "Escape" && this.close();
    }), this.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
  listenForBlurEvent() {
    this.shadowRoot.addEventListener(
      "blur",
      () => {
        this.matches(":not(:focus-within)") && this.close();
      },
      { capture: !0 }
    );
  }
  listenForNavigationEvents() {
    this.addEventListener(
      "keydown",
      (e) => {
        switch (e.key) {
          case "ArrowDown":
            this.next();
            break;
          case "ArrowUp":
            this.prev();
            break;
        }
      },
      { capture: !0 }
    );
  }
  getValue() {
    var e;
    if (this.multiple) {
      const s = [];
      return this.options.forEach((t) => {
        t.selected && s.push(t.value);
      }), s.join(",");
    } else
      return ((e = this.options.find((s) => s.selected)) == null ? void 0 : e.value) || null;
  }
  onUpdateValue() {
    this.matches(":disabled") || this.required && this.value === null ? this.internals.setValidity(
      { valueMissing: !0 },
      this.validationmessage
    ) : this.internals.setValidity({}), this.internals.setFormValue(this._value || null), this.title = this.setValueElementValue();
  }
  setValueElementValue() {
    const s = this.options.filter((t) => t.selected).reduce((t, n) => (t.push(n.label), t), []).join(", ");
    return s ? this.placeholderElement.hidden = !0 : this.placeholderElement.hidden = !1, this.valueElement.textContent = s, s;
  }
  open() {
    this.isOpen = !0;
  }
  close() {
    this.isOpen = !1;
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  next() {
    this.nextOption.inputElement.focus();
  }
  prev() {
    this.prevOption.inputElement.focus();
  }
}
i.formAssociated = !0;
i.observedAttributes = [
  "multiple",
  "placeholder",
  "name",
  "required",
  "disabled",
  "validationmessage"
];
window.customElements.define("pi-select", i);
const d = `<label part="wrapper">
  <input part="input" />
  <span part="label">
    <slot></slot>
  </span>
</label>

<style>
  :host {
    display: block;
  }

  :has(:disabled),
  :host([disabled]) {
    color: grey;
  }
</style>
`;
class r extends HTMLElement {
  constructor() {
    super(), this._value = "on", this._disabled = !1, this.attachShadow({ mode: "open" }), this.appendTemplate();
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this._value = e, this.inputElement.value = this._value;
  }
  get selected() {
    return this._selected;
  }
  set selected(e) {
    this._selected = e, this.inputElement.checked = this._selected, this.setParentValue();
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(e) {
    this._disabled = e, this.inputElement.disabled = this._disabled;
  }
  get type() {
    return this.parent.multiple ? "checkbox" : "radio";
  }
  get parent() {
    return this.closest("pi-select");
  }
  get optGroup() {
    return this.closest("pi-optgroup");
  }
  get label() {
    return this.labelElement.querySelector("slot").assignedNodes().reduce((n, o) => (n.push(o.textContent || ""), n), []).join("").trim();
  }
  // private get wrapperElement(): HTMLLabelElement {
  //   return this.shadowRoot.querySelector<HTMLLabelElement>('[part="wrapper"]')!;
  // }
  get inputElement() {
    return this.shadowRoot.querySelector('[part="input"]');
  }
  get labelElement() {
    return this.shadowRoot.querySelector('[part="label"]');
  }
  appendTemplate() {
    const e = document.createElement("template");
    e.innerHTML = d, this.shadowRoot.appendChild(e.content.cloneNode(!0));
  }
  connectedCallback() {
    this.inputElement.type = this.type, this.inputElement.value = this.value, this.inputElement.name = this.parent.name, this.listenForInputChangeEvent(), this.checkForRequiredAttribute(), this.setParentValue();
  }
  attributeChangedCallback(e, s, t) {
    switch (e) {
      case "value":
        this.value = t || this.label;
        break;
      case "selected":
        t !== null && t !== "false" ? this.selected = !0 : this.selected = !1;
        break;
      case "disabled":
        t !== null && t !== "false" ? this.disabled = !0 : this.disabled = !1;
        break;
    }
  }
  listenForInputChangeEvent() {
    this.inputElement.addEventListener("change", () => {
      this.parent.multiple ? this.selected = this.inputElement.checked : this.parent.options.forEach((e) => {
        e !== this ? e.selected = !1 : e.selected = this.inputElement.checked;
      });
    });
  }
  checkForRequiredAttribute() {
    this.parent.required && (this.inputElement.required = !0);
  }
  setParentValue() {
    this.parent.value = this.parent.getValue();
  }
}
r.observedAttributes = [
  "value",
  "selected",
  "disabled"
];
window.customElements.define("pi-option", r);
const p = `<span part="label"></span>
<div part="options">
  <slot></slot>
</div>

<style>
  :host {
    display: block;
  }

  :host([disabled]) {
    color: grey;
  }

  [part="label"] {
    font-weight: bold;
  }

  [part="label"]:empty {
    display: none;
  }

  [part="options"] {
    padding-inline-start: 0.5rem;
  }
</style>
`;
class a extends HTMLElement {
  constructor() {
    super(), this._disabled = !1, this.attachShadow({ mode: "open" }), this.appendTemplate();
  }
  get label() {
    return this._label;
  }
  set label(e) {
    this._label = e || "", this.labelElement.innerText = this._label;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(e) {
    this._disabled = e, this.allOptions.forEach((s) => {
      s.disabled = this._disabled;
    });
  }
  get labelElement() {
    return this.shadowRoot.querySelector('[part="label"]');
  }
  get allOptions() {
    return Array.from(this.querySelectorAll("pi-option") || []);
  }
  get options() {
    return this.allOptions.filter((e) => !e.disabled);
  }
  connectedCallback() {
  }
  attributeChangedCallback(e, s, t) {
    switch (e) {
      case "label":
        this.label = t;
        break;
      case "disabled":
        t !== null && t !== "false" ? this.disabled = !0 : this.disabled = !1;
        break;
    }
  }
  appendTemplate() {
    const e = document.createElement("template");
    e.innerHTML = p, this.shadowRoot.appendChild(e.content.cloneNode(!0));
  }
}
a.observedAttributes = [
  "label",
  "disabled"
];
window.customElements.define("pi-optgroup", a);
export {
  i as default
};

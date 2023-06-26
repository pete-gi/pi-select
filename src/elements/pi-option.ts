import template from "../templates/pi-option.template.html?raw";
import { PiOptionAttribute } from "../types/PiOptionAttribute";
import { PiOptionType } from "../types/PiOptionType";
import PiSelect from "./pi-select";

export default class PiOption extends HTMLElement {
  public static observedAttributes: PiOptionAttribute[] = ["value", "selected"];

  public shadowRoot: ShadowRoot;

  private _value: string = "on";
  public get value(): string {
    return this._value;
  }
  public set value(v: string) {
    this._value = v;
    this.inputElement.value = this._value;
  }

  private _selected: boolean;
  public get selected(): boolean {
    return this._selected;
  }
  public set selected(v: boolean) {
    this._selected = v;
    this.inputElement.checked = this._selected;
    this.setParentValue();
  }

  public get type(): PiOptionType {
    return this.parent.multiple ? "checkbox" : "radio";
  }

  private get parent(): PiSelect {
    return this.closest<PiSelect>("pi-select")!;
  }

  public get label(): string {
    const slotElement = this.labelElement.querySelector("slot");
    const slotNodes: Text[] = slotElement!.assignedNodes() as Text[];
    const value = slotNodes
      .reduce((acc: string[], textNode: Text) => {
        acc.push(textNode.textContent || "");
        return acc;
      }, [])
      .join("")
      .trim();

    return value;
  }

  // private get wrapperElement(): HTMLLabelElement {
  //   return this.shadowRoot.querySelector<HTMLLabelElement>('[part="wrapper"]')!;
  // }

  public get inputElement(): HTMLInputElement {
    return this.shadowRoot.querySelector<HTMLInputElement>('[part="input"]')!;
  }

  private get labelElement(): HTMLSpanElement {
    return this.shadowRoot.querySelector<HTMLSpanElement>('[part="label"]')!;
  }

  constructor() {
    super();
    this.attachInternals();
    this.attachShadow({ mode: "open" });
    this.appendTemplate();
  }

  private appendTemplate() {
    const tmpl = document.createElement("template");
    tmpl.innerHTML = template;
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }

  public connectedCallback() {
    this.inputElement.type = this.type;
    this.inputElement.value = this.value;
    this.inputElement.name = this.parent.name;
    this.listenForInputChangeEvent();
    this.checkForRequiredAttribute();
    this.setParentValue();
  }

  public attributeChangedCallback(
    attr: PiOptionAttribute,
    _: any,
    value: string | null
  ) {
    switch (attr) {
      case "value":
        this.value = value || this.label;
        break;
      case "selected":
        if (value !== null && value !== "false") {
          this.selected = true;
        } else {
          this.selected = false;
        }
    }
  }

  private listenForInputChangeEvent() {
    this.inputElement.addEventListener("change", () => {
      if (!this.parent.multiple) {
        this.parent.options.forEach((option) => {
          if (option !== this) {
            option.selected = false;
          } else {
            option.selected = this.inputElement.checked;
          }
        });
      } else {
        this.selected = this.inputElement.checked;
      }
    });
  }

  private checkForRequiredAttribute() {
    if (this.parent.required) {
      this.inputElement.required = true;
    }
  }

  private setParentValue() {
    this.parent.value = this.parent.getValue();
  }
}

window.customElements.define("pi-option", PiOption);

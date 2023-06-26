import template from "../templates/pi-optgroup.template.html?raw";
import { PiOptGroupAttribute } from "../types/PiOptGroupAttribute";
import PiOption from "./pi-option";

export default class PiOptGroup extends HTMLElement {
  public static observedAttributes: PiOptGroupAttribute[] = ["label"];

  public shadowRoot: ShadowRoot;

  private _label: string;
  public get label(): string {
    return this._label;
  }
  public set label(v: string | null) {
    this._label = v || "";
    this.labelElement.innerText = this._label;
  }

  private get labelElement(): HTMLSpanElement {
    return this.shadowRoot.querySelector<HTMLSpanElement>('[part="label"]')!;
  }

  public get options(): PiOption[] {
    return Array.from(this.querySelectorAll<PiOption>("pi-option") || []);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.appendTemplate();
  }

  public connectedCallback() {}

  public attributeChangedCallback(
    attr: PiOptGroupAttribute,
    _: any,
    value: string | null
  ) {
    switch (attr) {
      case "label":
        this.label = value;
        break;
    }
  }

  private appendTemplate() {
    const tmpl = document.createElement("template");
    tmpl.innerHTML = template;
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }
}

window.customElements.define("pi-optgroup", PiOptGroup);

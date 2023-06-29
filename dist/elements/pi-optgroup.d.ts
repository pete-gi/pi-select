import { PiOptGroupAttribute } from "../types/PiOptGroupAttribute";
import PiOption from "./pi-option";
export default class PiOptGroup extends HTMLElement {
    static observedAttributes: PiOptGroupAttribute[];
    shadowRoot: ShadowRoot;
    private _label;
    get label(): string;
    set label(v: string | null);
    private _disabled;
    get disabled(): boolean;
    set disabled(v: boolean);
    private get labelElement();
    get allOptions(): PiOption[];
    get options(): PiOption[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(attr: PiOptGroupAttribute, _: any, value: string | null): void;
    private appendTemplate;
}

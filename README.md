# PiSelect

[WIP component]

Till we don't have `<selectmenu>` element, this CustomElement can be used insted of classic `<select>` elements.
Works similar to the original and has similar part names as the one we're waiting for, with the exception of how the options are made - _they're using checkbox and radio inputs_.

CustomElement is `formAssociated` so it should work with the forms out of the box.

Styles are pretty raw, just to position elements in the right way. Buttons and inputs have mostly user-agent styles.

## Requirements

Default raw stylings are made using `flex` and `:has()` selector. You can change them if you'd like to, as it's possible to style every part of the component.

CustomElement doesn't have any dependencies other than `vite` used to build things up (devDep only).

## Instalation

```
npm install @pete-gi/pi-select
```

## Usage

```
// Include the script
import "path-to-@pete-gi/pi-select"
// or
<script src="path-to-@pete-gi/pi-select"></script>

// Use in your HTML
<form>
  <pi-select
    placeholder="Choose the number"
    name="number"
    multiple
    required
  >
    <pi-optgroup label="First four numbers">
      <pi-option value="one">One</pi-option>
      <pi-option value="two">Two</pi-option>
      <pi-option value="three" disabled>Three</pi-option>
      <pi-option value="four">Four</pi-option>
    </pi-optgroup>
    <pi-optgroup label="Next four numbers" disabled>
      <pi-option value="five">Five</pi-option>
      <pi-option value="six">Six</pi-option>
      <pi-option value="seven">Seven</pi-option>
      <pi-option value="eight">Eight</pi-option>
    </pi-optgroup>
  </pi-select>
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
```

## Elements

| Name        | Description          |
| ----------- | -------------------- |
| pi-select   | Main element         |
| pi-option   | Option element       |
| pi-optgroup | Option group element |

### Attributes

#### pi-select

| Name              | Type    | Description                                                                      |
| ----------------- | ------- | -------------------------------------------------------------------------------- |
| multiple          | boolean | Should the options be checkboxes or radio buttons                                |
| placeholder       | string  | Placeholder value for the select                                                 |
| name              | string  | Name of the field used for form submition                                        |
| required          | boolean | Is the field required                                                            |
| disabled          | boolean | Is the field disabled                                                            |
| validationmessage | string  | When the field is required, message of your choice if no value has been selected |

#### pi-option

| Name     | Type    | Description            |
| -------- | ------- | ---------------------- |
| value    | string  | Value of the option    |
| selected | boolean | Is the option selected |
| disabled | boolean | Is the field disabled  |

#### pi-optgroup

| Name     | Type    | Description           |
| -------- | ------- | --------------------- |
| label    | string  | Name of the group     |
| disabled | boolean | Is the field disabled |

### Parts and slots

Custom Element parts are useful for styling the components's inner elements.
Slots on the other hand, are used to place your content inside them.

PiSelect allows you to style all of the elements on your own.
Below you can see how each of the component is built, with all of it's parts and slots.

#### pi-select

```
<button part="button" type="button">
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
```

#### pi-option

```
<label part="wrapper">
  <input part="input" />
  <span part="label">
    <slot></slot>
  </span>
</label>
```

#### pi-optgroup

```
<span part="label"></span>
<div part="options">
  <slot></slot>
</div>
```

## Licence

MIT

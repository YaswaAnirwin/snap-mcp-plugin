# CheckboxGroup Component

## Overview
The `CheckboxGroup` component allows users to select multiple options from a list. It is a wrapper around a set of `Checkbox` components, providing a convenient way to manage their collective state.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | `CheckboxGroupItem<TValue>[]` | `[]` | An array of objects to be rendered as checkboxes. Each item object must have an `id` and a `name`. |
| `value` | `TValue[]` | `[]` | An array containing the `id`s of the selected items. |
| `onValueChange` | `(newValue: TValue[]) => void` | - | Callback function that is triggered when the selection changes. It receives the new array of selected `id`s. |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Defines the layout direction of the checkboxes within the group. |
| `isDisabled` | `boolean` | `false` | If true, all checkboxes in the group will be disabled. |
| `isReadonly` | `boolean` | `false` | If true, the user cannot change the selection. |
| `isInvalid` | `boolean` | `false` | If true, the component gets a red border, indicating a validation error. |
| `size` | `'24' \| '30' \| '36' \| '48'` | `'36'` | Sets the size for all checkboxes in the group. |
| `rawProps` | `React.FieldsetHTMLAttributes<HTMLFieldSetElement>` | - | Provides access to the raw HTML attributes of the underlying `fieldset` element. |

### `CheckboxGroupItem<TValue>` Type
The `items` prop takes an array of objects with the following structure:

| Key | Type | Description |
|-----|------|-------------|
| `id` | `TValue` | A unique identifier for the checkbox item. |
| `name` | `React.ReactNode` | The label to be displayed next to the checkbox. |
| `renderName`| `() => React.ReactNode` | Optional render function for the label. If omitted, the `name` prop value will be rendered. |
| `...rest` | `Omit<CheckboxProps, 'id' \| 'onValueChange' \| 'value'>` | Any other props from the `Checkbox` component can be passed to individual items. |

## Usage Examples

### Basic Usage
Here's a standard vertical `CheckboxGroup`.

```jsx
import React, { useState } from 'react';
import { CheckboxGroup } from '@epam/uui';

export default function BasicCheckboxGroupExample() {
    const [selectedValues, setSelectedValues] = useState([1]);

    const checkboxItems = [
        { id: 1, name: 'Mentee' },
        { id: 2, name: 'Mentor' },
        { id: 3, name: 'Coordinator' },
    ];

    return (
        <CheckboxGroup
            items={checkboxItems}
            value={selectedValues}
            onValueChange={setSelectedValues}
        />
    );
}
```

### Horizontal and Disabled
This example shows a horizontally-aligned `CheckboxGroup` in a disabled state.

```jsx
import React, { useState } from 'react';
import { CheckboxGroup } from '@epam/uui';

export default function HorizontalCheckboxGroupExample() {
    const [selectedValues, setSelectedValues] = useState([4, 6]);

    const checkboxItems = [
        { id: 4, name: 'Receive email notifications' },
        { id: 5, name: 'Receive notifications via SMS' },
        { id: 6, name: 'Receive notifications via WhatsApp' },
    ];

    return (
        <CheckboxGroup
            items={checkboxItems}
            value={selectedValues}
            onValueChange={setSelectedValues}
            direction="horizontal"
            isDisabled={true}
        />
    );
}
```

### Invalid State
You can mark the entire group as invalid, which is useful for form validation.

```jsx
import React, { useState } from 'react';
import { CheckboxGroup } from '@epam/uui';

export default function InvalidCheckboxGroupExample() {
    const [selectedValues, setSelectedValues] = useState([]);

    const checkboxItems = [
        { id: 1, name: 'I agree to the terms and conditions' },
        { id: 2, name: 'I want to subscribe to the newsletter' },
    ];

    // Example: Mark as invalid if no option is selected
    const isInvalid = selectedValues.length === 0;

    return (
        <CheckboxGroup
            items={checkboxItems}
            value={selectedValues}
            onValueChange={setSelectedValues}
            isInvalid={isInvalid}
        />
    );
}
```

## Best Practices
*   **Layout:** Use the `direction` prop to best fit your layout. For long lists of options, `'vertical'` is usually more readable. For a small number of short options, `'horizontal'` can save space.
*   **Labels:** Ensure that the `name` for each item is clear and concise.
*   **State Management:** Always control the component's state by providing the `value` and `onValueChange` props.
*   **Validation:** Use the `isInvalid` prop to provide visual feedback to the user when their selection is not valid according to your application's rules.
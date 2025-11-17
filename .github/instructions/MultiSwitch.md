# MultiSwitch Component

## Overview
The `MultiSwitch` component allows users to select a single option from a set of 2-5 mutually exclusive choices. It's typically used for toggling between different views, modes, or filtering criteria. It presents the options horizontally as a single, connected control.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | `IDataSource<TItem, TId>[]` | `[]` | An array of objects representing the switchable options. Each object must have at least an `id` and a `caption`. **Required**. |
| `value` | `TId` | - | The `id` of the currently selected item. This makes it a controlled component. **Required**. |
| `onValueChange` | `(newValue: TId) => void` | - | Callback function that is triggered when the user selects a new option. **Required**. |
| `size` | `'24' \| '30' \| '36' \| '42'` | `'36'` | Defines the size (height) of the component. |
| `color` | `'blue' \| 'gray'` | `'blue'` | The color theme of the component. |
| `isDisabled` | `boolean` | `false` | If `true`, the entire component is disabled and non-interactive. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows passing any standard HTML attributes to the root `div` element. |

### `items` Array Structure
Each object in the `items` array should have the following shape:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string \| number` | A unique identifier for the switch option. **Required**. |
| `caption` | `string` | The text label to display for the option. **Required**. |

## Usage Examples

### Basic Usage
A simple `MultiSwitch` for toggling between two options, controlled by `useState`.

```jsx
import React, { useState } from 'react';
import { MultiSwitch } from '@epam/uui';

export default function BasicMultiSwitchExample() {
    const [value, onValueChange] = useState('left');

    const switchItems = [
        { id: 'left', caption: 'Option 1' },
        { id: 'right', caption: 'Option 2' },
    ];

    return (
        <MultiSwitch
            items={ switchItems }
            value={ value }
            onValueChange={ onValueChange }
        />
    );
}
```

### Advanced Usage

#### Different Sizes and Colors
This example demonstrates how to configure the `size` and `color` of the `MultiSwitch`.

```jsx
import React, { useState } from 'react';
import { MultiSwitch, FlexCell, LabeledInput } from '@epam/uui';

export default function AdvancedMultiSwitchExample() {
    const [size, setSize] = useState('36');
    const [color, setColor] = useState('blue');

    const viewItems = [
        { id: 'grid', caption: 'Grid' },
        { id: 'list', caption: 'List' },
        { id: 'table', caption: 'Table' },
    ];

    return (
        <FlexCell width={400}>
            <LabeledInput label="Size: 30, Color: blue">
                <MultiSwitch
                    items={ viewItems }
                    value={ size }
                    onValueChange={ setSize }
                    size='30'
                    color='blue'
                />
            </LabeledInput>

            <LabeledInput label="Size: 42, Color: gray">
                <MultiSwitch
                    items={ viewItems }
                    value={ color }
                    onValueChange={ setColor }
                    size='42'
                    color='gray'
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

#### Disabled MultiSwitch
You can disable the entire component by setting the `isDisabled` prop to `true`.

```jsx
import React from 'react';
import { MultiSwitch } from '@epam/uui';

export default function DisabledMultiSwitchExample() {
    const items = [
        { id: 'on', caption: 'On' },
        { id: 'off', caption: 'Off' },
    ];

    return (
        <MultiSwitch
            items={ items }
            value="on"
            onValueChange={ () => {} } // No-op
            isDisabled={ true }
        />
    );
}
```

## Best Practices
*   **Use for Limited Options:** `MultiSwitch` is most effective for a small set of options (typically 2 to 5). For a larger set, consider using `Tabs` or a `PickerInput`.
*   **Controlled Component:** Always use `MultiSwitch` as a controlled component by managing its state via the `value` and `onValueChange` props.
*   **Clear Captions:** Keep the `caption` for each item short, clear, and distinct to avoid ambiguity.
*   **Use Cases:** `MultiSwitch` is ideal for view switchers (e.g., List/Grid), environment selectors (e.g., Dev/Test/Prod), or simple mode toggles (e.g., Light/Dark).
*   **Avoid for Forms:** For form data submission where options are not modes or views, `RadioGroup` is often a more semantically appropriate choice.

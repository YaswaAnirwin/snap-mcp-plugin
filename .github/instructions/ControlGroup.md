
# ControlGroup Component

## Overview
The `ControlGroup` component is a container that visually groups related controls, such as buttons, inputs, and dropdowns, into a single, cohesive unit. It removes the spacing between the elements and merges their borders to create a seamless block.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to be placed inside the ControlGroup. Typically, this will be a set of controls like `Button`, `TextInput`, or `PickerInput`. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the raw HTML attributes of the underlying `div` element. |

## Usage Examples

### Basic Usage with Buttons
A common use case is to group a set of buttons.

```jsx
import React from 'react';
import { Button, ControlGroup, Dropdown, DropdownMenuButton, DropdownMenuBody } from '@epam/uui';
import { ReactComponent as menuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';

export default function BasicExample() {
    const renderBody = () => {
        return (
            <DropdownMenuBody>
                <DropdownMenuButton caption="Duplicate" onClick={() => {}} />
                <DropdownMenuButton caption="Rename" onClick={() => {}} />
                <DropdownMenuButton caption="Delete" onClick={() => {}} />
            </DropdownMenuBody>
        );
    };

    return (
        <ControlGroup>
            <Button size="36" caption="Preset" fill="solid" onClick={() => {}} />
            <Dropdown
                renderBody={renderBody}
                renderTarget={(props) => <Button {...props} fill="solid" icon={menuIcon} size="36" isDropdown={false} />}
                placement="bottom-end"
            />
        </ControlGroup>
    );
}
```

### With Inputs and Addons
`ControlGroup` is also useful for creating input fields with prefixes or suffixes.

```jsx
import React, { useState } from 'react';
import { ControlGroup, TextInput, NumericInput, InputAddon } from '@epam/uui';

export default function PrefixExample() {
    const [valueTI, onValueTIChange] = useState(null);
    const [valueUSD, onValueUSDChange] = useState(0);

    return (
        <>
            <ControlGroup>
                <InputAddon content="$" />
                <NumericInput value={valueUSD} onValueChange={onValueUSDChange} />
            </ControlGroup>

            <ControlGroup>
                <TextInput value={valueTI} onValueChange={onValueTIChange} placeholder="05" />
                <InputAddon content="h" />
            </ControlGroup>
        </>
    );
}
```

### Combining Different Controls
You can mix and match various components within a `ControlGroup`.

```jsx
import React, { useState } from 'react';
import { ControlGroup, PickerInput, TimePicker } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';

const vendorsList = [
    { id: 2, name: 'Victor Grudenberg' },
    { id: 3, name: 'John Halivanger' },
    { id: 4, name: 'Alex Yetisport' },
];

export default function CombinedExample() {
    const [timeValue, onTimeValueChange] = useState(null);
    const [pickerValue, onPickerValueChange] = useState(null);

    const dataSource = useArrayDataSource({ items: vendorsList }, []);

    return (
        <ControlGroup>
            <PickerInput
                dataSource={dataSource}
                value={pickerValue}
                onValueChange={onPickerValueChange}
                getName={(item) => item.name}
                entityName="Vendor"
                placeholder="Select Vendor"
                selectionMode="single"
                valueType="id"
            />
            <TimePicker value={timeValue} onValueChange={onTimeValueChange} />
        </ControlGroup>
    );
}
```

## Best Practices
*   **Related Controls:** Only group controls that are functionally related to each other. For example, a "Save" button and a "Cancel" button are good candidates for a `ControlGroup`.
*   **Consistent Sizing:** For a visually harmonious appearance, use controls of the same `size` within a `ControlGroup`.
*   **Fill and Style:** When grouping buttons, consider using different `fill` styles (e.g., `solid` for the primary action, `none` for secondary actions) to guide the user.
*   **Addons:** Use the `InputAddon` component to add prefixes or suffixes to inputs within a `ControlGroup` for better context.
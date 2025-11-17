# RadioInput Component

## Overview
The `RadioInput` component is a single radio button. It is the most basic building block for creating a set of mutually exclusive options. While it can be used as a standalone component, it is **strongly recommended** to use the `RadioGroup` component instead. `RadioGroup` automatically handles the state, accessibility, and keyboard navigation for a set of radio buttons, which is the standard and expected behavior.

Use `RadioInput` directly only in rare, custom scenarios where `RadioGroup` does not fit your needs.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `boolean` | - | **Required.** The checked state of the radio button. `true` if selected, `false` otherwise. |
| `onValueChange` | `(newValue: boolean) => void` | - | **Required.** Callback function that is triggered when the radio button is clicked. |
| `label` | `React.ReactNode` | - | The content to be displayed as the radio button's label. |
| `isDisabled` | `boolean` | `false` | If true, the radio button is disabled and cannot be interacted with. |
| `isReadonly` | `boolean` | `false` | If true, the user cannot change the value of the radio button. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style to the component, typically for validation feedback. |
| `size` | `'12' \| '18'` | `'18'` | The size of the radio input control. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows you to pass any standard HTML attributes to the root `div` element of the component. |

## Usage Examples

### 1. Standalone RadioInput
This example shows a single `RadioInput`. Note that this is not a common use case, as radio buttons are almost always used in groups.

```jsx
import React, { useState } from 'react';
import { RadioInput, FlexCell } from '@epam/uui';

export default function StandaloneRadioInputExample() {
    const [isSelected, setIsSelected] = useState(false);

    return (
        <FlexCell width={300}>
            <RadioInput
                label="Enable Notifications"
                value={isSelected}
                onValueChange={setIsSelected}
            />
        </FlexCell>
    );
}
```

### 2. Manual Grouping (Not Recommended)
This example demonstrates how to manually create a group of `RadioInput`s. This approach requires you to manage the selection logic yourself and is provided to illustrate why the `RadioGroup` component is the preferred method.

```jsx
import React, { useState } from 'react';
import { RadioInput, FlexCell, Text } from '@epam/uui';

export default function ManualRadioGroupExample() {
    const [selectedFruit, setSelectedFruit] = useState('apple');

    return (
        <FlexCell width={300}>
            <Text>Select a fruit:</Text>
            <RadioInput
                label="Apple"
                // The value is true only if this item is the selected one
                value={selectedFruit === 'apple'}
                // When clicked, update the state to this item's value
                onValueChange={() => setSelectedFruit('apple')}
            />
            <RadioInput
                label="Orange"
                value={selectedFruit === 'orange'}
                onValueChange={() => setSelectedFruit('orange')}
            />
            <RadioInput
                label="Banana"
                value={selectedFruit === 'banana'}
                onValueChange={() => setSelectedFruit('banana')}
            />
        </FlexCell>
    );
}
```

### 3. States and Sizes
Demonstration of the `isDisabled`, `isReadonly`, `isInvalid`, and `size` props.

```jsx
import React, { useState } from 'react';
import { RadioInput, FlexRow, VPanel } from '@epam/uui';

export default function StatesRadioInputExample() {
    const [value, setValue] = useState(true);

    return (
        <VPanel>
            <FlexRow spacing="18">
                <RadioInput value={value} onValueChange={setValue} label="Default" />
                <RadioInput value={value} onValueChange={setValue} label="Disabled" isDisabled />
                <RadioInput value={value} onValueChange={setValue} label="Readonly" isReadonly />
                <RadioInput value={value} onValueChange={setValue} label="Invalid" isInvalid />
            </FlexRow>
            <FlexRow spacing="18" cx="uui-margin-top-12">
                <RadioInput value={value} onValueChange={setValue} label="Size 18" size="18" />
                <RadioInput value={value} onValueChange={setValue} label="Size 12" size="12" />
            </FlexRow>
        </VPanel>
    );
}
```

## Best Practices
*   **Use `RadioGroup`:** This is the most important best practice. For any scenario involving more than one radio button, you should use the `RadioGroup` component. It simplifies development by managing state, keyboard navigation (arrow keys), and accessibility (`role="radiogroup"`) for the entire set, which is crucial for a good user experience.
*   **Controlled Component:** `RadioInput` is a controlled component. You must provide the `value` and `onValueChange` props to control its state.
*   **Accessibility:** If you must use `RadioInput`s standalone, you are responsible for manually implementing the accessibility requirements for a group of radio buttons. This includes wrapping them in an element with `role="radiogroup"`, providing a group label with `aria-label` or `aria-labelledby`, and managing focus and keyboard navigation. `RadioGroup` handles all of this for you.
*   **Labels are Essential:** Always provide a meaningful `label` for each `RadioInput`. This is critical for all users to understand the purpose of the option.
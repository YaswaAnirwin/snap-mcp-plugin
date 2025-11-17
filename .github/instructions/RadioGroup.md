# RadioGroup Component

## Overview
The `RadioGroup` component is used to present a list of mutually exclusive options from which a user can select only one. It's an essential component for forms and settings where a single choice from a small set is required. It wraps a collection of `RadioInput` components, ensuring they are semantically linked and properly managed.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | `TItem[]` | - | **Required.** An array of items to be rendered as radio buttons. |
| `value` | `TValue` | - | **Required.** The value of the currently selected item in the group. |
| `onValueChange` | `(newValue: TValue) => void` | - | **Required.** Callback function that is triggered when the user selects a new option. |
| `getName` | `(item: TItem) => string` | `item => item.name` | A function to get the display name (label) for an item. |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | The layout direction of the radio buttons. |
| `isDisabled` | `boolean` | `false` | If true, all radio buttons in the group will be disabled. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style to the component, typically for validation feedback. |
| `isReadonly` | `boolean` | `false` | If true, the user cannot change the selection. |
| `size` | `'12' \| '18'` | `'18'` | The size of the radio input controls. |
| `renderLabel` | `(item: TItem) => React.ReactNode` | - | A function to render a custom label for each item, allowing for more complex content than a simple string. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows you to pass any standard HTML attributes to the root `div` element of the group. |

## Usage Examples

### 1. Basic Vertical RadioGroup
This is the most common use case, with options arranged vertically.

```jsx
import React, { useState } from 'react';
import { RadioGroup, FlexCell } from '@epam/uui';

const deliveryOptions = [
    { id: 1, name: 'Standard (3-5 days)' },
    { id: 2, name: 'Express (1-2 days)' },
    { id: 3, name: 'Same-day' },
];

export default function BasicRadioGroupExample() {
    const [selectedValue, setSelectedValue] = useState(1);

    return (
        <FlexCell width={300}>
            <RadioGroup
                items={deliveryOptions}
                value={selectedValue}
                onValueChange={setSelectedValue}
            />
        </FlexCell>
    );
}
```

### 2. Horizontal RadioGroup
Use the `direction` prop to arrange the options in a row. This is useful for compact forms.

```jsx
import React, { useState } from 'react';
import { RadioGroup, FlexCell } from '@epam/uui';

const roles = [
    { id: 'admin', name: 'Admin' },
    { id: 'editor', name: 'Editor' },
    { id: 'viewer', name: 'Viewer' },
];

export default function HorizontalRadioGroupExample() {
    const [roleId, setRoleId] = useState('editor');

    return (
        <FlexCell width="100%">
            <RadioGroup
                items={roles}
                value={roleId}
                onValueChange={setRoleId}
                direction="horizontal" // Arrange items in a row
            />
        </FlexCell>
    );
}
```

### 3. Disabled and Invalid States
You can easily disable the entire group or mark it as invalid for form validation.

```jsx
import React, { useState } from 'react';
import { RadioGroup, FlexCell, LabeledInput } from '@epam/uui';

const feedbackOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
];

export default function StatesRadioGroupExample() {
    const [value, setValue] = useState('yes');

    return (
        <FlexCell width={400}>
            <LabeledInput label="Disabled RadioGroup">
                <RadioGroup
                    items={feedbackOptions}
                    value={value}
                    onValueChange={setValue}
                    isDisabled={true}
                />
            </LabeledInput>

            <LabeledInput label="Invalid RadioGroup" validationMessage="This field is required.">
                <RadioGroup
                    items={feedbackOptions}
                    value={null} // No value selected
                    onValueChange={setValue}
                    isInvalid={true}
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

### 4. Custom Label Rendering
For more complex option layouts, use the `renderLabel` prop. This allows you to include descriptions, icons, or other components within each option's label.

```jsx
import React, { useState } from 'react';
import { RadioGroup, FlexCell, Text } from '@epam/uui';

const subscriptionPlans = [
    { id: 'free', name: 'Free', description: 'Basic features, for individual use.' },
    { id: 'pro', name: 'Pro', description: 'Advanced features, for professionals.' },
    { id: 'team', name: 'Team', description: 'Collaboration tools, for organizations.' },
];

export default function CustomLabelRadioGroupExample() {
    const [plan, setPlan] = useState('pro');

    return (
        <FlexCell width={400}>
            <RadioGroup
                value={plan}
                onValueChange={setPlan}
                items={subscriptionPlans}
                renderLabel={item => (
                    <div style={{ marginLeft: '12px' }}>
                        <Text color="primary" fontSize="16">{item.name}</Text>
                        <Text color="secondary" fontSize="12">{item.description}</Text>
                    </div>
                )}
            />
        </FlexCell>
    );
}
```

## Best Practices
*   **Use for Single Selection:** `RadioGroup` should only be used when a user must select one option from a set. For multiple selections, use a `CheckboxGroup`.
*   **Keep Lists Short:** Radio groups are best for a small number of options (typically 2-5). For longer lists, consider using a `PickerInput` (dropdown) to save space.
*   **Default Selection:** It is highly recommended to have one radio button selected by default. This ensures that a value is always submitted with the form. If a default selection is not possible, you must handle the `null` or `undefined` state.
*   **Accessibility:** The component is accessible by default. Using `RadioGroup` is better than creating a set of standalone `RadioInput`s because it automatically groups them semantically (`role="radiogroup"`), which is essential for screen reader users. Always provide clear, concise labels for each option.
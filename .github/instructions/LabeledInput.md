# LabeledInput Component

## Overview
The `LabeledInput` is a wrapper component that enhances standard input controls by adding a label, validation message display, and other contextual information. It's designed to work with any UUI input component (like `TextInput`, `PickerInput`, `DatePicker`, etc.) to create well-structured and user-friendly forms.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | - | The text to be displayed as the label for the input. |
| `children` | `React.ReactNode` | - | The input component that the label is associated with. This is a **required** prop. |
| `size` | `'30' \| '36' \| '42' \| '48'` | `'36'` | Defines the size of the component, affecting the label font size and spacing. |
| `isInvalid` | `boolean` | `false` | If `true`, the input is styled to indicate a validation error. |
| `validationMessage` | `string` | - | The error message to display below the input when `isInvalid` is `true`. |
| `info` | `string` | - | Additional explanatory text or help message displayed below the input. |
| `isRequired` | `boolean` | `false` | If `true`, a red asterisk is displayed next to the label to indicate a required field. |
| `labelPosition` | `'top' \| 'left'` | `'top'` | Determines the position of the label relative to the input. |
| `htmlFor` | `string` | - | The `id` of the input element. This is crucial for accessibility, as it links the `<label>` to the input. |
| `sidenote` | `React.ReactNode` | - | A React node to render on the right side of the label, often used for tooltips or badges. |

## Usage Examples

### Basic Usage
Here is a `LabeledInput` wrapping a `TextInput`. The `htmlFor` prop is used to correctly associate the label with the input's `id`.

```jsx
import React from 'react';
import { LabeledInput, TextInput } from '@epam/uui';

export default function BasicLabeledInputExample() {
    const [value, onValueChange] = React.useState('');

    return (
        <LabeledInput label="User Name" htmlFor="userNameInput">
            <TextInput
                value={ value }
                onValueChange={ onValueChange }
                id="userNameInput" // ID must match htmlFor
                placeholder="Enter your name"
            />
        </LabeledInput>
    );
}
```

### Advanced Usage

#### Validation and Help Text
This example shows how to display validation errors, required field indicators, and informational text.

```jsx
import React from 'react';
import { LabeledInput, TextInput, FlexCell } from '@epam/uui';

export default function AdvancedLabeledInputExample() {
    const [email, setEmail] = React.useState('invalid-email');
    const isEmailInvalid = !email.includes('@');

    return (
        <FlexCell width={300}>
            <LabeledInput
                label="Email Address"
                isRequired={ true }
                info="We will not share your email with anyone."
                isInvalid={ isEmailInvalid }
                validationMessage="Please enter a valid email address."
                htmlFor="emailInput"
            >
                <TextInput
                    value={ email }
                    onValueChange={ setEmail }
                    id="emailInput"
                    placeholder="e.g., user@example.com"
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

#### Label Position and Sidenote
You can position the label to the left of the input and add extra content, like a `Tooltip`, in a `sidenote`.

```jsx
import React from 'react';
import { LabeledInput, TextInput, Tooltip, FlexCell } from '@epam/uui';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-18.svg';

export default function LabelPositionExample() {
    const [password, setPassword] = React.useState('');

    return (
        <FlexCell width={450}>
            <LabeledInput
                label="Password"
                labelPosition="left" // Position label on the left
                htmlFor="passwordInput"
                sidenote={
                    <Tooltip content="Password must be at least 8 characters long">
                        <InfoIcon />
                    </Tooltip>
                }
            >
                <TextInput
                    value={ password }
                    onValueChange={ setPassword }
                    id="passwordInput"
                    type="password"
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

## Best Practices
*   **Accessibility First:** Always use the `htmlFor` prop and ensure it matches the `id` of the child input. This allows users of assistive technologies to understand the relationship between the label and the input, and also allows all users to click the label to focus the input.
*   **Clear and Concise Labels:** The `label` text should be brief and clearly describe the data you expect the user to enter.
*   **Actionable Validation:** When an input is invalid, provide a clear and helpful `validationMessage` that explains *why* it's invalid and how to fix it.
*   **Use with `Form`:** `LabeledInput` is most powerful when used inside the UUI `Form` component. The `Form` component can automatically pass down validation status (`isInvalid`, `validationMessage`) to the `LabeledInput`, simplifying your form logic significantly.
*   **Consistent Sizing:** Use the `size` prop to match the size of other components in your form for a visually consistent UI.

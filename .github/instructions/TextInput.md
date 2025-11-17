# TextInput Component

## Overview
The `TextInput` component is a fundamental form element that allows users to enter and edit a single line of text. It is a highly versatile and customizable component, serving as the foundation for most forms in a React application.

It is designed as a controlled component, meaning its value should be managed by the parent component's state.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | - | The current value of the input. This is required for a controlled component. |
| `onValueChange` | `(newValue: string) => void` | - | Callback function that is invoked when the input value changes. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | The visual size of the input field. |
| `placeholder` | `string` | - | Placeholder text to display when the input is empty. |
| `isDisabled` | `boolean` | `false` | If true, the input is disabled and cannot be interacted with. |
| `isReadonly` | `boolean` | `false` | If true, the user cannot modify the value of the input. |
| `isInvalid` | `boolean` | `false` | If true, the input is styled to indicate a validation error (e.g., a red border). |
| `type` | `'text' \| 'password' \| 'email' \| 'number'` | `'text'` | The `type` attribute for the underlying HTML `<input>` element. |
| `icon` | `React.ReactNode` | - | An icon element to be displayed inside the input field. |
| `iconPosition` | `'left' \| 'right'` | `'left'` | The position of the icon within the input field. |
| `onCancel` | `() => void` | - | If provided, a clear (x) button will be displayed when the input has a value. This callback is fired when the button is clicked. |
| `cx` | `IHasCX` | - | Allows adding custom CSS class names to the component for custom styling. |
| `rawProps` | `React.InputHTMLAttributes<HTMLInputElement>` | - | Allows adding standard HTML attributes (like `id`, `name`, `maxLength`) to the underlying `input` element. |

## Usage Examples

### Basic Usage
A simple, controlled text input for capturing a user's name.

```jsx
import React, { useState } from 'react';
import { TextInput } from '@uui/components';

export default function BasicTextInputExample() {
    const [name, setName] = useState('');

    return (
        <TextInput
            value={name}
            onValueChange={setName}
            placeholder="Enter your name"
            // It's crucial to add an ID for the label to connect to
            rawProps={{ id: 'user-name-input' }}
        />
    );
}
```

### Advanced Usage

#### Input with Icon and Clear Button
This example shows an input with a search icon on the left and a clear button that appears when the user types.

```jsx
import React, { useState } from 'react';
import { TextInput } from '@uui/components';
import { SearchIcon } from '@uui/icons'; // Assuming an icon library

export default function IconAndClearExample() {
    const [query, setQuery] = useState('');

    return (
        <TextInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search..."
            icon={SearchIcon}
            iconPosition="left"
            // The onCancel callback enables the clear button
            onCancel={() => setQuery('')}
        />
    );
}
```

#### Input with Validation State
Style the input to show a validation error based on the component's state.

```jsx
import React, { useState } from 'react';
import { TextInput } from '@uui/components';

export default function ValidationExample() {
    const [email, setEmail] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleBlur = () => {
        // Simple validation: check if email contains '@'
        const isValid = email.includes('@');
        setHasError(!isValid && email.length > 0);
    };

    return (
        <div>
            <label htmlFor="email-input">Email Address</label>
            <TextInput
                value={email}
                onValueChange={setEmail}
                placeholder="user@example.com"
                type="email"
                // The isInvalid prop controls the error styling
                isInvalid={hasError}
                rawProps={{ 
                    id: 'email-input',
                    onBlur: handleBlur // Trigger validation on blur
                }}
            />
            {hasError && <div style={{ color: 'red', marginTop: '4px' }}>Please enter a valid email.</div>}
        </div>
    );
}
```

#### Disabled and Read-only States

```jsx
import React from 'react';
import { TextInput, FlexRow } from '@uui/components';

export default function StateExamples() {
    return (
        <FlexRow spacing="18">
            <TextInput
                value="You can't change this"
                isDisabled={true} // Completely disabled
                placeholder="Disabled Input"
            />
            <TextInput
                value="You can read this, but not edit"
                isReadonly={true} // Read-only, but still focusable and selectable
                placeholder="Read-only Input"
            />
        </FlexRow>
    );
}
```

## Best Practices and Warnings

### **Accessibility: Always Use Labels**
**Warning:** A `placeholder` is not a substitute for a `<label>`. Screen readers do not consistently treat placeholders as labels, and they disappear once the user starts typing. Always associate a `TextInput` with a `<label>` element for accessibility. Use the `htmlFor` attribute on the label and a matching `id` (passed via `rawProps`) on the input.

```jsx
// Correct
<label htmlFor="first-name">First Name</label>
<TextInput
    value={firstName}
    onValueChange={setFirstName}
    rawProps={{ id: 'first-name' }}
/>

// Incorrect (Avoid this)
<TextInput
    value={firstName}
    onValueChange={setFirstName}
    placeholder="First Name" 
/>
```

### **Controlled Components**
The `TextInput` is designed to be a controlled component. You must manage its `value` in your component's state and update it via the `onValueChange` callback. This makes your form data predictable and easy to manage.

### **Validation Feedback**
The `isInvalid` prop is purely for visual feedback. Your application is responsible for all validation logic (e.g., checking for empty fields, correct formats, etc.) and deciding when to set `isInvalid` to `true`.
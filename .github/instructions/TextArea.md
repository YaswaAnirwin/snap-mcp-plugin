# TextArea Component

## Overview
The `TextArea` component is a multi-line text input control, ideal for forms where users need to enter a significant amount of text, such as comments, descriptions, or messages. It supports features like automatic resizing, character limits, and various styling states.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | - | The current value of the textarea. |
| `onValueChange` | `(newValue: string) => void` | - | **Required.** Callback function that is called when the text content changes. |
| `size` | `'24' \| '30' \| '36' \| '42' \| '48'` | `'36'` | The size (height) of the textarea. |
| `mode` | `'form' \| 'inline' \| 'cell'` | `'form'` | The visual style of the textarea. `cell` mode is optimized for use in tables and automatically enables `autoSize`. |
| `placeholder` | `string` | - | Placeholder text to display when the textarea is empty. |
| `rows` | `number` | - | The number of visible text lines. If specified, `autoSize` is disabled. |
| `maxLength` | `number` | - | The maximum number of characters allowed. |
| `autoSize` | `boolean` | `false` | If true, the textarea will automatically adjust its height to fit the content. |
| `isDisabled` | `boolean` | `false` | If true, the textarea is disabled and cannot be edited. |
| `isReadonly` | `boolean` | `false` | If true, the textarea value cannot be changed by the user. |
| `isInvalid` | `boolean` | `false` | If true, the textarea is displayed in an invalid state (e.g., with a red border). |
| `onFocus` | `(e?: React.FocusEvent<HTMLTextAreaElement>) => void` | - | Callback for the focus event. |
| `onBlur` | `(e?: React.FocusEvent<HTMLTextAreaElement>) => void` | - | Callback for the blur event. |
| `cx` | `cx` | - | Allows for adding custom CSS classes. |
| `rawProps` | `React.TextareaHTMLAttributes<HTMLTextAreaElement>` | - | Provides access to the native `textarea` element's attributes. |

## Usage Examples

### Basic Usage
This example demonstrates the basic states of the `TextArea` component within a `LabeledInput` for context.

```jsx
import React, { useState } from 'react';
import { FlexCell, TextArea, LabeledInput } from '@epam/uui';

export default function BasicTextAreaExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexCell width={350} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Standard TextArea */}
            <LabeledInput label="Label">
                <TextArea value={value} onValueChange={onValueChange} placeholder="Type text" />
            </LabeledInput>

            {/* Disabled TextArea */}
            <LabeledInput label="Disabled">
                <TextArea isDisabled value={value} onValueChange={onValueChange} placeholder="Type text" />
            </LabeledInput>

            {/* Readonly TextArea */}
            <LabeledInput label="Readonly">
                <TextArea isReadonly value="This is a readonly text" onValueChange={onValueChange} />
            </LabeledInput>

            {/* Invalid TextArea */}
            <LabeledInput label="Invalid">
                <TextArea isInvalid value={value} onValueChange={onValueChange} placeholder="Type text" />
            </LabeledInput>
        </FlexCell>
    );
}
```

### Height Configuration
You can control the height of the `TextArea` using either the `rows` prop for a fixed number of lines or the `autoSize` prop for a dynamic height that grows with the content.

```jsx
import React, { useState } from 'react';
import { FlexCell, TextArea } from '@epam/uui';

export default function HeightConfigurationExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexCell width={350} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Fixed height with 6 rows */}
            <TextArea 
                rows={6} 
                value={value} 
                onValueChange={onValueChange} 
                placeholder="Fixed height (6 rows)" 
            />

            {/* Autosize for dynamic height */}
            <TextArea 
                autoSize 
                value={value} 
                onValueChange={onValueChange} 
                placeholder="Autosizing height" 
            />
        </FlexCell>
    );
}
```

### Character Limit
Use the `maxLength` prop to restrict the number of characters a user can enter. For a better user experience, pair it with a `LabeledInput` to show the character count.

```jsx
import React, { useState } from 'react';
import { FlexCell, TextArea, LabeledInput } from '@epam/uui';

export default function WithMaxLengthCounter() {
    const [value, onValueChange] = useState('');

    return (
        <FlexCell width={350}>
            <LabeledInput label="Description" value={value} maxLength={120} charCounter={true}>
                <TextArea 
                    maxLength={120} 
                    value={value} 
                    onValueChange={onValueChange} 
                    placeholder="Enter a description (max 120 characters)" 
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

## Best Practices
*   **Use `LabeledInput`:** Always wrap `TextArea` with a `LabeledInput` to provide a clear, accessible label and validation messages.
*   **Choose Height Wisely:** Use `rows` for predictable layouts where a consistent height is necessary. Use `autoSize` for comment boxes or other inputs where the content length is highly variable, as it provides a better user experience by expanding the input area as the user types.
*   **Provide Feedback:** Use the `isInvalid` prop to give users immediate visual feedback on validation errors.
*   **Guide Users:** Use the `placeholder` prop to provide a hint or example of the expected input.
*   **Character Counter:** When using `maxLength`, also use the `charCounter` prop on the parent `LabeledInput` to inform users of the remaining characters.
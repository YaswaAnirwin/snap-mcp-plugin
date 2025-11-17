# RichTextEditor Component

## Overview
The `RichTextEditor` is a full-featured "What You See Is What You Get" (WYSIWYG) editor for creating and editing formatted text content. It is built on top of the powerful [Slate.js](https://www.slatejs.org/) framework, providing a reliable and extensible foundation for rich text editing. It comes with a standard toolbar for common formatting options like bold, italics, lists, links, and more.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `any` | - | **Required.** The value of the editor content. This is a Slate-specific object (an array of nodes), not a plain string. |
| `onValueChange` | `(newValue: any) => void` | - | **Required.** Callback function that is triggered when the content of the editor changes. |
| `mode` | `'form' \| 'inline'` | `'form'` | The display mode. `'form'` renders the editor with a toolbar and a border, suitable for form fields. `'inline'` renders a seamless editor without a border or a dedicated toolbar, suitable for in-place editing. |
| `isReadonly` | `boolean` | `false` | If true, the content is for display only and cannot be edited. The toolbar is hidden. |
| `isDisabled` | `boolean` | `false` | If true, the component is disabled and cannot be interacted with. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style to the component, typically for validation feedback. |
| `placeholder` | `string` | `''` | Placeholder text to display when the editor is empty. |
| `minHeight` | `number` | `100` | The minimum height of the editor area in pixels. |
| `onFocus` | `(event: React.FocusEvent) => void` | - | Callback for the focus event. |
| `onBlur` | `(event: React.FocusEvent) => void` | - | Callback for the blur event. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows you to pass any standard HTML attributes to the root `div` element of the component. |

## Usage Examples

### 1. Basic Form Editor
This example shows a standard `RichTextEditor` inside a form, with a toolbar and border.

```jsx
import React, { useState } from 'react';
import { RichTextEditor, FlexCell } from '@epam/uui';

// The initial value for a Slate editor is an array of nodes.
// This represents a single empty paragraph.
const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

export default function BasicRTEExample() {
    const [value, setValue] = useState(initialValue);

    return (
        <FlexCell width="100%">
            <RichTextEditor
                value={value}
                onValueChange={setValue}
                placeholder="Enter your text here..."
                mode="form"
                minHeight={200}
            />
        </FlexCell>
    );
}
```

### 2. Read-only Mode for Displaying Content
Use `isReadonly` to display saved HTML content without editing capabilities.

```jsx
import React from 'react';
import { RichTextEditor, VPanel, Text } from '@epam/uui';

// Example of saved content from the editor
const savedContent = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is some ' },
            { text: 'bold', bold: true },
            { text: ' and ' },
            { text: 'italic', italic: true },
            { text: ' text.' },
        ],
    },
    {
        type: 'bulleted-list',
        children: [
            { type: 'list-item', children: [{ text: 'First item' }] },
            { type: 'list-item', children: [{ text: 'Second item' }] },
        ],
    },
];

export default function ReadonlyRTEExample() {
    return (
        <VPanel>
            <Text fontSize="18" fontWeight="600">Article Content</Text>
            <RichTextEditor
                value={savedContent}
                isReadonly={true}
            />
        </VPanel>
    );
}
```

### 3. Inline Mode
The `inline` mode provides a seamless editing experience, perfect for editing content directly on the page without the visual clutter of a form field.

```jsx
import React, { useState } from 'react';
import { RichTextEditor, VPanel, Text } from '@epam/uui';

const initialTitle = [
    {
        type: 'paragraph',
        children: [{ text: 'Click to Edit This Title' }],
    },
];

export default function InlineRTEExample() {
    const [value, setValue] = useState(initialTitle);

    return (
        <VPanel>
            <Text>The editor below has no border or permanent toolbar. The toolbar appears when text is selected.</Text>
            <div style={{ border: '1px dashed #ccc', padding: '12px', marginTop: '12px' }}>
                <RichTextEditor
                    value={value}
                    onValueChange={setValue}
                    mode="inline"
                />
            </div>
        </VPanel>
    );
}
```

## Best Practices
*   **Controlled Component:** `RichTextEditor` is a controlled component. You must manage its `value` and `onValueChange` props in your application's state.
*   **Value Structure:** The `value` of the editor is a Slate.js document structure (an array of node objects), not an HTML string. You must provide an initial value with at least one paragraph node, even if it's empty.
*   **Serialization:** The Slate.js value object is not directly storable in a database field that expects a string. Before saving to a server, you must serialize it (e.g., using `JSON.stringify(value)`). When loading the data, you must deserialize it back into a JavaScript object (e.g., using `JSON.parse(storedValue)`).
*   **Customization:** The default `RichTextEditor` includes a standard set of formatting tools. For advanced use cases, such as adding custom buttons, plugins, or creating a completely unique toolbar, you may need to compose your own editor using the lower-level `SlateEditor` and `RichTextToolbar` components provided by UUI.
*   **Performance:** Rich text editors can be resource-intensive. Be mindful of the number of editor instances you render on a single page.
*   **Placeholders:** Use the `placeholder` prop to guide users on what to enter, especially in an empty editor.
# DropdownContainer Component

## Overview
The `DropdownContainer` is a simple but essential layout component used to wrap the content within a dropdown's body. It provides consistent padding, width, and styling, ensuring that custom dropdowns align with the UUI design system. It is most often used inside the `renderBody` prop of the `Dropdown` component.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to be rendered inside the container. |
| `padding` | `'6' \| '12' \| '18' \| '24'` | - | Sets the padding on all four sides of the container. |
| `vPadding` | `'6' \| '12' \| '18' \| '24'` | - | Sets the vertical padding (top and bottom). |
| `width` | `number` | - | Sets the width of the container in pixels. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the raw HTML attributes of the underlying `div` element. |

## Usage Examples

### Basic Container
This example shows a `DropdownContainer` with basic styling. While it can be used standalone, its primary purpose is within a `Dropdown`.

```jsx
import React from 'react';
import { DropdownContainer, Text, FlexCell } from '@epam/uui';

export default function BasicExample() {
    return (
        <FlexCell width={400}>
            <DropdownContainer padding="12" width={300}>
                <Text>This is a DropdownContainer.</Text>
                <Text>It standardizes the look of dropdown content.</Text>
            </DropdownContainer>
        </FlexCell>
    );
}
```

### In a Custom Dropdown with Scroll
This is the most common use case. The `DropdownContainer` wraps the content of a `Dropdown`, and a `ScrollView` is added to handle content that might overflow.

```jsx
import React from 'react';
import { Dropdown, Button, DropdownContainer, ScrollView, Text } from '@epam/uui';

export default function CustomDropdownExample() {
    const renderCustomBody = (props) => (
        // The DropdownContainer provides the outer padding and width
        <DropdownContainer {...props} padding="12" width={360}>
            {/* ScrollView handles overflow for long content */}
            <ScrollView height={150}>
                <Text fontSize="16" lineHeight="24">
                    Custom Dropdown Content
                </Text>
                <Text>
                    The DropdownContainer is a wrapper that gives your custom dropdowns a consistent look and feel.
                    When you have a lot of content, you can place a ScrollView inside it to make the area scrollable.
                    This prevents the dropdown from becoming too tall and breaking the page layout.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
            </ScrollView>
        </DropdownContainer>
    );

    return (
        <Dropdown
            renderTarget={(props) => <Button {...props} caption="Show Custom Dropdown" />}
            renderBody={renderCustomBody}
            placement="bottom-start"
        />
    );
}
```

## Best Practices
*   **Primary Use Case:** Use `DropdownContainer` as the root element within the `renderBody` function of a `Dropdown` to create custom dropdown layouts.
*   **Combine with `ScrollView`:** For dropdowns with dynamic or potentially long content, always place a `ScrollView` inside the `DropdownContainer` to ensure the content is scrollable and doesn't break the UI.
*   **Consistency:** Use `DropdownContainer` to enforce consistent width and padding for all custom dropdowns across your application, creating a more predictable user experience.
*   **When Not to Use:** You do not need to use `DropdownContainer` when using pre-styled dropdown bodies like `DropdownMenuBody`, as they already include the necessary container styling. `DropdownContainer` is specifically for building your own layouts from scratch.
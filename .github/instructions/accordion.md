# Accordion Component

## Overview
The Accordion component is a vertically stacked set of interactive headings that each contain a title, summary, or thumbnail. When clicked, tapped, or activated by keyboard, the heading reveals or hides its associated content in a collapsible panel. This component is useful for showing and hiding content to save space and reduce cognitive load for the user.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | `string` | - | The title text displayed in the accordion header. |
| `children` | `React.ReactNode` | - | The content to be displayed within the collapsible panel. |
| `mode` | `'block' \| 'inline'` | `'block'` | The visual style of the accordion. `block` is for standalone accordions, `inline` is for use within other components. |
| `value` | `boolean` | `false` | Controls the expanded (`true`) or collapsed (`false`) state. Use with `onValueChange` for a controlled component. |
| `onValueChange` | `(newValue: boolean) => void` | - | Callback function triggered when the accordion is clicked, passing the new boolean state. |
| `isDisabled` | `boolean` | `false` | If `true`, the accordion is disabled and cannot be interacted with. |
| `renderTitle` | `() => React.ReactNode` | - | A render function to create a custom title component, overriding the `title` prop. |
| `padding` | `string` | - | Sets the CSS padding for the content area when the accordion is expanded. |

## Usage Examples

### Basic Usage
Here are examples of basic accordions in both `block` and `inline` modes.

```jsx
import React from 'react';
import { Accordion, FlexCell, Text } from '@uui/components';

export default function BasicAccordionExample() {
  return (
    <FlexCell width="100%">
      {/* Block mode is suitable for main page sections */}
      <Accordion title="Block Mode Accordion" mode="block">
        <Text fontSize="16">
          This is the content for the block mode accordion. It's typically used for major sections of a page.
        </Text>
      </Accordion>

      {/* Inline mode is more compact and fits well inside panels or forms */}
      <Accordion title="Inline Mode Accordion" mode="inline">
        <Text fontSize="16">
          This is the content for the inline mode accordion. It has less prominent styling.
        </Text>
      </Accordion>

      {/* A disabled accordion cannot be opened */}
      <Accordion title="Disabled Accordion" mode="block" isDisabled>
        <Text fontSize="16">
          You cannot see this content because the accordion is disabled.
        </Text>
      </Accordion>
    </FlexCell>
  );
}
```

### Controlled Accordion
You can control the accordion's state (expanded/collapsed) from a parent component by using the `value` and `onValueChange` props.

```jsx
import React, { useState } from 'react';
import { Accordion, FlexCell, Text, Button } from '@uui/components';

export default function ControlledAccordionExample() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <FlexCell width="100%">
            <Button 
              caption={isExpanded ? 'Collapse' : 'Expand'} 
              onClick={() => setIsExpanded(!isExpanded)} 
              style={{ marginBottom: '12px' }}
            />
            <Accordion 
              title="Controlled Accordion" 
              mode="block" 
              value={isExpanded} 
              onValueChange={setIsExpanded}
            >
                <Text fontSize="16">
                    This accordion's state is managed by the parent component.
                    The button outside the accordion controls whether it is open or closed.
                </Text>
            </Accordion>
        </FlexCell>
    );
}
```

### Custom Title
Use the `renderTitle` prop to create a completely custom header with complex layouts or additional components.

```jsx
import React from 'react';
import { Accordion, FlexCell, FlexRow, Text, Avatar, Badge, FlexSpacer } from '@uui/components';

export default function CustomAccordionExample() {
    // Custom render function for the accordion title
    const renderCustomTitle = () => (
        <FlexCell grow={1}>
            <FlexRow columnGap="12" padding="6">
                <Avatar alt="User Avatar" img="https://.../avatar.svg" size="30" />
                <Text fontSize="16" fontWeight="600">
                    John Doe
                </Text>
                <FlexSpacer />
                <Badge color="success" fill="outline" indicator caption="Active" />
            </FlexRow>
        </FlexCell>
    );

    return (
        <FlexCell grow={1}>
            <Accordion renderTitle={renderCustomTitle} mode="block" value={true}>
                <Text fontSize="16">
                    This accordion uses a custom render function for its title, allowing for complex layouts and components in the header.
                </Text>
            </Accordion>
        </FlexCell>
    );
}
```

## Best Practices
*   **Choosing a Mode**: Use `mode="block"` for major page sections to visually separate content. Use `mode="inline"` for accordions inside other components like side panels, forms, or tables where a more subtle look is required.
*   **Controlled vs. Uncontrolled**: For simple use cases where the accordion manages its own state, you can omit `value` and `onValueChange`. For scenarios where the state needs to be controlled by a parent component (e.g., expanding all accordions at once), use the controlled props `value` and `onValueChange`.
*   **Accessibility**: The Accordion is built with accessibility in mind. Users can navigate and toggle it using `Tab` and `Enter`/`Space` keys. Ensure you provide a clear and descriptive `title` or a `renderTitle` function that is accessible.
*   **Complex Titles**: When your accordion title needs more than just text (e.g., icons, badges, avatars), use the `renderTitle` prop instead of trying to pass complex JSX into the `title` prop. This keeps the component's API clean and predictable.
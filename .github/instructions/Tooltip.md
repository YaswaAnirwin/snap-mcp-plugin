Of course. Here is the comprehensive documentation for the React Tooltip component from the UUI library, designed to be clear and informative for GitHub Copilot.

---
~~~markdown
# Tooltip Component (React)

## Overview
The Tooltip component provides a text label that appears when a user hovers over, focuses on, or clicks an element. It's used to display brief, informational messages without cluttering the UI. The tooltip's position is dynamically adjusted to ensure it remains visible in the viewport.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | **Required.** The element that will trigger the tooltip. |
| `content` | `React.ReactNode` | - | The content to be displayed inside the tooltip. Can be a string or any React node. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | The preferred position of the tooltip relative to the trigger element. |
| `color` | `'primary' \| 'secondary' \| 'gray'` | `'gray'` | The color scheme of the tooltip. |
| `trigger` | `'hover' \| 'click' \| 'focus'` | `'hover'` | The event that triggers the tooltip to show. |
| `offset` | `[number, number]` | `[0, 5]` | An array `[skidding, distance]` to offset the tooltip from its trigger. |
| `isOpen` | `boolean` | - | A prop to control the visibility of the tooltip programmatically. |
| `onValueChange` | `(isOpen: boolean) => void` | - | Callback function that is executed when the tooltip's visibility state changes. |
| `renderContent` | `() => React.ReactNode` | - | A render function for creating complex tooltip content. Overrides the `content` prop. |
| `rawProps` | `HTMLAttributes<HTMLDivElement>` | - | HTML attributes to be applied to the tooltip's root element. |
| `cx` | `CX` | - | Allows for adding custom CSS classes for additional styling. |

## Usage Examples

### Basic Usage
Here is a simple example of a `Tooltip` appearing on hover over a button.

```jsx
import React from 'react';
import { Tooltip, Button } from '@uui/components';

export function BasicTooltipExample() {
  return (
    <Tooltip content="Save your changes">
      <Button>Save</Button>
    </Tooltip>
  );
}
```

### Advanced Usage
This example demonstrates more advanced configurations, including different placements, colors, and a click trigger.

```jsx
import React from 'react';
import { Tooltip, Button, Icon } from '@uui/components';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export function AdvancedTooltipExample() {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '50px' }}>
      {/* Tooltip with 'bottom' placement and 'primary' color */}
      <Tooltip
        content="This is a primary tooltip."
        placement="bottom"
        color="primary"
      >
        <Button>Bottom Tooltip</Button>
      </Tooltip>

      {/* Tooltip triggered by a click event on an icon */}
      <Tooltip
        content="You clicked the icon!"
        placement="right"
        trigger="click"
      >
        <Icon icon={faInfoCircle} />
      </Tooltip>
    </div>
  );
}
```

### Custom and Interactive Content
You can pass complex JSX to the `content` prop or use the `renderContent` prop for dynamic or interactive tooltip content.

```jsx
import React from 'react';
import { Tooltip, LinkButton, Button } from '@uui/components';

export function CustomContentTooltipExample() {
  const customContent = (
    <div>
      <strong>More Information</strong>
      <p>Visit our documentation for details.</p>
      <LinkButton caption="Learn More" href="/docs" size="24" />
    </div>
  );

  return (
    <Tooltip content={customContent} placement="bottom">
      <Button>Help</Button>
    </Tooltip>
  );
}
```

## Best Practices
*   **Keep it Brief:** Tooltips should contain short, concise, and non-essential information. For critical information, use a more prominent UI element.
*   **Accessibility:** Ensure that the trigger element is focusable (e.g., a `<button>` or an element with `tabIndex="0"`) so that keyboard users can access the tooltip. Interactive content inside a tooltip is generally discouraged as it can be difficult for some users to access.
*   **Avoid Redundancy:** Don't repeat information that is already obvious from the UI element itself. For example, a button with the text "Delete" should not have a tooltip that says "Deletes the item." Instead, it could clarify *what* will be deleted (e.g., "Permanently delete this user").

## Notes
*   The `Tooltip` component is built on top of a Popper.js-like positioning engine, ensuring it stays in view and repositions itself intelligently when the viewport changes or the page is scrolled.
*   When controlling the tooltip's visibility programmatically with the `isOpen` prop, you must also provide the `onValueChange` callback to handle state updates in your application.
~~~
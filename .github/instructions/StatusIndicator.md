# StatusIndicator Component

## Overview
The `StatusIndicator` is a simple, non-interactive visual component used to represent the status of an item or entity. It typically renders as a small, colored dot, making it ideal for use in tables, lists, and dashboards to convey information at a glance.

Common use cases include indicating online/offline status, success/failure of an operation, or the state of a workflow (e.g., 'New', 'In Progress', 'Completed').

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | The semantic color of the indicator, which visually represents the status. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | The size of the indicator dot. |
| `isAnimated` | `boolean` | `false` | If true, the indicator will have a subtle pulsing animation. This is useful for drawing attention to "live" or "in-progress" statuses. |
| `cx` | `IHasCX` | - | Allows adding custom CSS class names to the component for custom styling. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows adding standard HTML attributes to the root `div` element, useful for adding tooltips or accessibility attributes. |

## Usage Examples

### Basic Color Variants
This example shows the different semantic colors available for the `StatusIndicator`.

```jsx
import React from 'react';
import { StatusIndicator, FlexRow } from '@uui/components';

export default function BasicStatusIndicatorExample() {
    return (
        <FlexRow spacing="18" alignItems="center">
            <StatusIndicator color="success" />
            <span>Success</span>
            <StatusIndicator color="warning" />
            <span>Warning</span>
            <StatusIndicator color="danger" />
            <span>Danger</span>
            <StatusIndicator color="info" />
            <span>Info</span>
            <StatusIndicator color="neutral" />
            <span>Neutral</span>
        </FlexRow>
    );
}
```

### Sizing and Animation
You can adjust the size of the indicator and apply an animation to draw attention to it.

```jsx
import React from 'react';
import { StatusIndicator, FlexRow } from '@uui/components';

export default function SizingAndAnimationExample() {
    return (
        <FlexRow spacing="18" alignItems="center">
            {/* Different Sizes */}
            <StatusIndicator color="info" size="small" />
            <StatusIndicator color="info" size="medium" />
            <StatusIndicator color="info" size="large" />

            {/* Animated Indicator */}
            <div style={{ marginLeft: '40px' }}>
                <FlexRow spacing="18" alignItems="center">
                    <StatusIndicator color="success" isAnimated={true} />
                    <span>Live Update</span>
                </FlexRow>
            </div>
        </FlexRow>
    );
}
```

### Advanced Usage: In a User List
A common use case is to display the online/offline status of users in a list.

```jsx
import React from 'react';
import { StatusIndicator, FlexRow } from '@uui/components';

const users = [
    { name: 'Alice', status: 'success' }, // Online
    { name: 'Bob', status: 'neutral' },   // Offline
    { name: 'Charlie', status: 'warning' }, // Away
];

export default function UserListWithStatus() {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '12px', width: '250px' }}>
            <h4>Team Members</h4>
            <ul>
                {users.map(user => (
                    <li key={user.name} style={{ listStyle: 'none', marginBottom: '12px' }}>
                        <FlexRow spacing="6" alignItems="center">
                            <StatusIndicator 
                                color={user.status} 
                                // Add a title for accessibility and hover information
                                rawProps={{ title: `Status: ${user.status}` }}
                            />
                            <span>{user.name}</span>
                        </FlexRow>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

## Best Practices and Warnings

### **Accessibility is Crucial**
**Warning:** Color should not be the only way to convey information. A user with color blindness may not be able to distinguish between 'success' (green) and 'danger' (red).

*   **Always provide a textual equivalent.** The status indicator should always be placed next to a text label that describes its meaning.
*   **Use tooltips.** For icon-only statuses in a dense UI like a table, use the `rawProps` parameter to add a `title` attribute or integrate with a `Tooltip` component to provide the status information on hover.

```jsx
// Good practice: Adding a title for accessibility
<StatusIndicator color="danger" rawProps={{ title: 'Status: Error' }} />
```

### **Use Animation Purposefully**
The `isAnimated` prop is effective for drawing attention but can also be distracting if overused. Reserve it for statuses that are truly "live," "in-progress," or require immediate user attention.

### **Maintain Consistency**
Define a clear and consistent meaning for each status color within your application. Document this color system so that all team members use the indicators consistently, ensuring a predictable and intuitive user experience.
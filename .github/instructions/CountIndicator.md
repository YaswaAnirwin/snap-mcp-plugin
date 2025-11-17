# CountIndicator Component

## Overview
The `CountIndicator` is a small, circular component used to display a count or draw attention to a specific element. It's commonly used for notifications, new item counts, or status indicators.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `React.ReactNode` | - | The content displayed inside the indicator, typically a number. |
| `color` | `'white' \| 'gray' \| 'night' \| 'blue' \| 'cyan' \| 'green' \| 'amber' \| 'red' \| 'purple'` | `'gray'` | The background color of the indicator. |
| `size` | `'12' \| '18' \| '24'` | `'24'` | The height and minimum width of the indicator in pixels. |
| `onClick` | `(e: React.MouseEvent<HTMLDivElement>) => void` | - | A callback function that is triggered when the indicator is clicked. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the raw HTML attributes of the underlying `div` element. |

## Usage Examples

### Basic Usage
A simple `CountIndicator` with a default color and size.

```jsx
import React from 'react';
import { CountIndicator, FlexRow } from '@epam/uui';

export default function BasicExample() {
    return (
        <FlexRow spacing="12">
            <CountIndicator caption={5} />
            <CountIndicator caption="99+" />
        </FlexRow>
    );
}
```

### Different Colors
Use the `color` prop to convey semantic meaning.

```jsx
import React from 'react';
import { CountIndicator, FlexRow } from '@epam/uui';

export default function ColorsExample() {
    return (
        <FlexRow spacing="12">
            {/* Use 'blue' for informational counts */}
            <CountIndicator color="blue" caption={12} />
            {/* Use 'green' to indicate success or new items */}
            <CountIndicator color="green" caption={3} />
            {/* Use 'red' for errors or urgent notifications */}
            <CountIndicator color="red" caption={1} />
            {/* Use 'amber' for warnings */}
            <CountIndicator color="amber" caption={7} />
            {/* Use 'gray' for neutral or read items */}
            <CountIndicator color="gray" caption={25} />
        </FlexRow>
    );
}
```

### Different Sizes
The `size` prop controls the dimensions of the indicator.

```jsx
import React from 'react';
import { CountIndicator, FlexRow } from '@epam/uui';

export default function SizesExample() {
    return (
        <FlexRow spacing="12" vPadding="12">
            <CountIndicator color="blue" size="12" caption={5} />
            <CountIndicator color="blue" size="18" caption={5} />
            <CountIndicator color="blue" size="24" caption={5} />
        </FlexRow>
    );
}
```

### Clickable Indicator
You can attach an `onClick` handler to make the indicator interactive.

```jsx
import React from 'react';
import { CountIndicator } from '@epam/uui';

export default function ClickableExample() {
    const handleClick = () => {
        alert('Notifications clicked!');
    };

    return (
        <CountIndicator
            color="red"
            caption={3}
            onClick={handleClick}
        />
    );
}
```

## Best Practices
*   **Context is Key:** Place the `CountIndicator` close to the element it relates to, such as a navigation item, a tab, or a user avatar.
*   **Semantic Colors:** Use colors purposefully. `red` should be reserved for critical notifications or errors, while `blue` or `green` can be used for general information or new content.
*   **Keep it Simple:** The `caption` should be concise. It's best for short numbers or symbols. For counts over 99, consider using "99+".
*   **Accessibility:** If the count indicator is interactive, ensure it has a clear purpose and provides feedback to the user upon interaction.
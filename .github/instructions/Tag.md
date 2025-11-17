# Tag Component

## Overview
The `Tag` component is used to display keywords, attributes, or categories. It's a compact element that can be used for labeling, categorization, and filtering. Tags can include text, an icon, a count, and a clear button.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `string` | - | The text content of the tag. |
| `size` | `'18' \| '24' \| '30' \| '36' \| '42' \| '48'` | `'36'` | The size of the tag. |
| `color` | `'info' \| 'success' \| 'warning' \| 'critical' \| 'neutral'` | `'neutral'` | The color of the tag, used to convey semantic meaning. |
| `fill` | `'solid' \| 'outline'` | `'solid'` | The visual style of the tag. |
| `icon` | `IHasIcon['icon']` | - | An icon to display within the tag. |
| `iconPosition`| `'left' \| 'right'` | `'left'` | The position of the icon relative to the caption. |
| `onIconClick`| `(e: React.MouseEvent) => void` | - | Callback for when the icon is clicked. |
| `count` | `React.ReactNode` | - | A count indicator to display within the tag. |
| `onClick` | `(e: React.MouseEvent) => void` | - | Callback function triggered when the tag is clicked. |
| `onClear` | `(e: React.MouseEvent) => void` | - | If provided, a clear icon is displayed. This is the callback for when the clear icon is clicked. |
| `clearIcon` | `Icon` | - | A custom icon for the clear button. |
| `isDropdown`| `boolean` | `false` | If true, a dropdown indicator icon is displayed. |
| `isOpen` | `boolean` | `false` | If true, the dropdown indicator is flipped to an "open" state. Used with `isDropdown`. |
| `dropdownIcon`| `Icon` | - | A custom icon for the dropdown indicator. |
| `isDisabled`| `boolean` | `false` | If true, the tag is disabled and does not respond to user interaction. |
| `cx` | `cx` | - | Allows for adding custom CSS classes. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the native `div` element's attributes. |

## Usage Examples

### Basic Usage
Here are some basic examples of the `Tag` component with different props.

```jsx
import React, { useState } from 'react';
import { Tag } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-account-18.svg';

export default function BasicTagExample() {
    const [value] = useState(123);

    return (
        <div style={{ display: 'flex', gap: '12px' }}>
            {/* A simple, non-interactive tag */}
            <Tag caption="Simple Tag" />

            {/* A tag with a clear button */}
            <Tag caption="Clearable Tag" onClear={() => alert('Cleared!')} />

            {/* A tag with a custom icon */}
            <Tag caption="Name Surname" icon={MyIcon} />

            {/* A tag with a count */}
            <Tag caption="items selected" count={value} />
        </div>
    );
}
```

### Color Variants
Use the `color` and `fill` props to change the appearance of the tag. This is useful for conveying status or category.

```jsx
import React from 'react';
import { Tag, FlexRow } from '@epam/uui';

export default function ColorVariantsExample() {
    return (
        <FlexRow spacing="12">
            <Tag color="info" caption="Info" />
            <Tag color="success" caption="Success" />
            <Tag color="warning" caption="Warning" />
            <Tag color="critical" caption="Critical" />
            <Tag color="neutral" fill="outline" caption="Neutral Outline" />
        </FlexRow>
    );
}
```

### Size Variants
The `size` prop controls the height of the tag.

```jsx
import React from 'react';
import { Tag, FlexRow } from '@epam/uui';

export default function SizeVariantsExample() {
    return (
        <FlexRow spacing="12" alignItems="center">
            <Tag size="18" caption="Size 18" />
            <Tag size="24" caption="Size 24" />
            <Tag size="30" caption="Size 30" />
            <Tag size="36" caption="Size 36" />
            <Tag size="42" caption="Size 42" />
            <Tag size="48" caption="Size 48" />
        </FlexRow>
    );
}
```

### Clickable and Dropdown Tags
Tags can be made clickable or act as a toggler for a dropdown.

```jsx
import React from 'react';
import { Tag, FlexRow } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-account-18.svg';

export default function InteractiveTagsExample() {
    return (
        <FlexRow spacing="12">
            {/* A clickable tag with an onClick handler */}
            <Tag
                caption="Click Me"
                onClick={() => alert('Tag clicked!')}
                icon={MyIcon}
                onIconClick={() => alert('Icon clicked!')}
            />

            {/* A tag configured to look like a dropdown toggler */}
            <Tag
                caption="Dropdown"
                isDropdown={true}
                onClick={() => alert('Toggle dropdown!')}
            />
        </FlexRow>
    );
}
```

## Best Practices
*   **Semantic Colors:** Use colors purposefully. `info` for neutral information, `success` for positive outcomes, `warning` for potential issues, and `critical` for errors.
*   **Concise Captions:** Keep the `caption` text short and descriptive.
*   **Interactive Tags:** Use the `onClick` prop for actions like filtering a list. Use `onClear` to allow users to remove tags, for example, from a selection in a `PickerInput`.
*   **Readability:** When using the `outline` fill, ensure there is sufficient contrast with the background.
*   **Consistency:** Use consistent sizes and styles for tags within the same context to maintain a clean UI.
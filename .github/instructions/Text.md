# Tag Component

## Overview
The `Tag` component is used for displaying metadata, keywords, or filter tags. It's a compact element that can include a caption, an icon, a count, and actions like clearing or opening a dropdown.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `React.ReactNode` | - | The content or label of the tag. |
| `size` | `'18' \| '24' \| '30' \| '36' \| '42' \| '48'` | `'36'` | The size of the tag. |
| `color` | `'info' \| 'success' \| 'warning' \| 'critical' \| 'neutral'` | `'neutral'` | The color of the tag, used to convey semantic meaning. |
| `fill` | `'solid' \| 'outline'` | `'solid'` | The visual style of the tag. |
| `icon` | `Icon` | - | An icon to be displayed within the tag. |
| `iconPosition`| `'left' \| 'right'` | `'left'` | The position of the icon relative to the caption. |
| `count` | `React.ReactNode` | - | A value to display in a `CountIndicator` within the tag. |
| `onClick` | `(e?: any) => void` | - | Callback function triggered when the tag is clicked. |
| `onClear` | `(e?: any) => void` | - | If provided, a clear icon is displayed. This callback is triggered when the clear icon is clicked. |
| `clearIcon` | `Icon` | `settings.tag.icons.clearIcon` | Custom icon for the clear button. |
| `isDropdown` | `boolean` | `false` | If true, a dropdown indicator icon is displayed. |
| `isOpen` | `boolean` | `false` | If true, the dropdown icon is flipped to indicate an open state. |
| `isDisabled`| `boolean` | `false` | Disables the tag and all its interactive elements. |
| `link` | `Link` | - | A `Link` object for client-side navigation. |
| `href` | `string` | - | An URL for standard browser navigation. |
| `target` | `'_blank'` | - | The target for the `href` link. |
| `cx` | `cx` | - | Allows for adding custom CSS classes. |
| `rawProps` | `React.HTMLAttributes<HTMLElement>` | - | Provides access to the native element's attributes. |

## Usage Examples

### Basic Usage & Colors
Tags can be styled with different `color` and `fill` props to match the application's design and convey meaning.

```jsx
import React from 'react';
import { FlexRow, Tag } from '@uui/components';

export default function ColorsExample() {
    return (
        <>
            {/* Solid Fill */}
            <FlexRow spacing="12" vPadding="12">
                <Tag color="info" caption="Info" />
                <Tag color="success" caption="Success" />
                <Tag color="warning" caption="Warning" />
                <Tag color="critical" caption="Critical" />
                <Tag color="neutral" caption="Neutral" />
            </FlexRow>

            {/* Outline Fill */}
            <FlexRow spacing="12" vPadding="12">
                <Tag fill="outline" color="info" caption="Info" />
                <Tag fill="outline" color="success" caption="Success" />
                <Tag fill="outline" color="warning" caption="Warning" />
                <Tag fill="outline" color="critical" caption="Critical" />
                <Tag fill="outline" color="neutral" caption="Neutral" />
            </FlexRow>
        </>
    );
}
```

### Sizing
The `Tag` component comes in various sizes to fit different layouts.

```jsx
import React from 'react';
import { FlexRow, Tag } from '@uui/components';

export default function SizingExample() {
    return (
        <FlexRow spacing="12" alignItems="top">
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

### Advanced Usage
Combine icons, counts, and event handlers for more complex interactions.

```jsx
import React, { useState } from 'react';
import { FlexRow, Tag } from '@uui/components';
import { ReactComponent as AccountIcon } from '@epam/assets/icons/common/action-account-18.svg';
import { ReactComponent as CancelIcon } from '@epam/assets/icons/common/navigation-cancel-12.svg';


export default function AdvancedTagExample() {
    const [isTagVisible, setIsTagVisible] = useState(true);

    return (
        <FlexRow spacing="12">
            {/* Tag with icon and count */}
            <Tag 
                icon={ AccountIcon } 
                caption="Users" 
                count={ 12 } 
            />

            {/* Clickable tag with dropdown indicator */}
            <Tag 
                caption="Filter" 
                isDropdown 
                onClick={() => alert('Dropdown clicked!')} 
            />

            {/* Removable tag */}
            {isTagVisible && (
                <Tag 
                    caption="Removable" 
                    onClear={() => setIsTagVisible(false)}
                    clearIcon={ CancelIcon }
                />
            )}
        </FlexRow>
    );
}
```

## Best Practices
*   **Concise Labels:** Keep the `caption` text short and descriptive.
*   **Semantic Colors:** Use the `color` prop to indicate status or category. For example, `critical` for errors, `success` for completed tasks.
*   **Interactive Tags:** Use the `onClick` prop for actions like filtering lists. Use the `onClear` prop to allow users to remove tags, commonly seen in multi-picker inputs.
*   **Accessibility:** When a tag is interactive (`onClick` or `onClear`), it's rendered as a `<button>`, ensuring it's accessible to keyboard users.
*   **Consistency:** Maintain a consistent `size` and `fill` style for tags within the same context to ensure a clean UI.
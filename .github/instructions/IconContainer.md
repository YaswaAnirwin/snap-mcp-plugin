# IconContainer Component

## Overview
The `IconContainer` is a simple yet powerful component used to wrap icons. It provides a consistent way to size, style, and align icons within your application, ensuring they fit harmoniously with other UI elements like text and inputs. It is primarily a layout and styling utility.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon` | `IComponentIcon` | - | The icon component to be rendered. This is a **required** prop. |
| `size` | `number \| 'auto'` | `'auto'` | The size (width and height) of the container in pixels. If `'auto'`, the container adapts to the icon's intrinsic size. |
| `style` | `React.CSSProperties` | - | Custom CSS properties to apply to the container `div`. |
| `cx` | `any` | - | Allows you to pass custom CSS class names to the component. |
| `onClick` | `(e: React.MouseEvent<HTMLDivElement>) => void` | - | A callback function that is triggered when the icon container is clicked. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows passing any standard HTML attributes to the root `div` element. |

## Usage Examples

### Basic Usage
Here's how to use `IconContainer` to display an icon inline with text. The container will automatically size itself to the icon.

```jsx
import React from 'react';
import { IconContainer, FlexRow, Text } from '@epam/uui';
// Import an icon from the UUI assets library
import { ReactComponent as UserIcon } from '@epam/assets/icons/common/action-user-18.svg';

export default function BasicIconContainerExample() {
    return (
        <FlexRow>
            <Text>User Profile</Text>
            <IconContainer icon={ UserIcon } />
        </FlexRow>
    );
}
```

### Advanced Usage

#### Sizing and Styling
You can control the size and apply custom styles to the `IconContainer`. This is useful for creating visual hierarchy or matching a specific design.

```jsx
import React from 'react';
import { IconContainer, FlexRow } from '@epam/uui';
import { ReactComponent as SuccessIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as WarningIcon } from '@epam/assets/icons/common/notification-warning-24.svg';

export default function SizedIconContainerExample() {
    return (
        <FlexRow spacing='18' vPadding='12'>
            {/* Control the size explicitly */}
            <IconContainer icon={ SuccessIcon } size={ 18 } />
            <IconContainer icon={ SuccessIcon } size={ 24 } />
            <IconContainer icon={ SuccessIcon } size={ 36 } />

            {/* Apply custom styles for unique effects */}
            <IconContainer
                icon={ WarningIcon }
                size={ 36 }
                style={{ 
                    fill: '#fcaa00', // Change icon color
                    backgroundColor: '#fff5d9', 
                    borderRadius: '50%',
                }}
            />
        </FlexRow>
    );
}
```

#### Clickable Icon Container
While `IconButton` is preferred for actions, you can make an `IconContainer` clickable if needed.

```jsx
import React from 'react';
import { IconContainer, Text, FlexRow } from '@epam/uui';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-24.svg';

export default function ClickableIconContainerExample() {
    const handleInfoClick = () => {
        alert('This is an informational icon.');
    };

    return (
        <FlexRow 
            onClick={ handleInfoClick } 
            cx="uui-clickable" // Use UUI class for pointer cursor
        >
            <Text>Click for info</Text>
            <IconContainer icon={ InfoIcon } />
        </FlexRow>
    );
}
```

## Best Practices
*   **When to Use:** Use `IconContainer` for icons that are decorative or displayed inline with text (e.g., an icon next to a label).
*   **Use `IconButton` for Actions:** For icons that trigger an action (like save, delete, close), you should always use the `IconButton` component. `IconButton` is built for interaction and includes important accessibility features like focus states and keyboard support.
*   **Sizing:** Use the `size` prop to align icons with the line-height of adjacent text for a clean, balanced look. Standard sizes (12, 18, 24, 30, 36, 48) are recommended to maintain visual consistency.
*   **Accessibility:** If an icon is purely decorative, it doesn't require any special accessibility attributes. If it conveys information that isn't available through text, ensure the context provides an accessible description. For example, the text in the clickable example above describes the icon's purpose.

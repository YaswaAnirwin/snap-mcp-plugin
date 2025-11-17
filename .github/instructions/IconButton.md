# IconButton Component

## Overview
The `IconButton` is a compact button that displays only an icon. It's perfect for use in toolbars, headers, or any place where a full-text button would take up too much space. It's designed to be simple, accessible, and easily customizable.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon` | `IComponentIcon` | - | The icon to be displayed within the button. This is a **required** prop. |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | - | Callback function triggered when the button is clicked. |
| `isDisabled` | `boolean` | `false` | If `true`, the button will be disabled and non-interactive. |
| `color` | `'blue' \| 'green' \| 'red' \| 'gray50'` | `'gray50'` | Defines the color of the icon. |
| `size` | `number` | `36` | The size (width and height) of the button in pixels. Common values are 24, 30, 36, 42, 48. |
| `href` | `string` | - | If provided, the component will be rendered as an `<a>` tag instead of a `<button>`. |
| `rawProps` | `React.HTMLAttributes<HTMLButtonElement \| HTMLAnchorElement>` | - | Allows passing any standard HTML attributes to the root element, e.g., `aria-label`. |

## Usage Examples

### Basic Usage
A simple `IconButton` with a click handler and a default appearance.

```jsx
import React from 'react';
import { IconButton } from '@epam/uui';
// Import an icon from the UUI assets library
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';

export default function BasicIconButtonExample() {
    return (
        <IconButton
            icon={ AddIcon }
            onClick={ () => alert('Add button clicked!') }
            // Best practice: Always provide an aria-label for accessibility
            rawProps={{ 'aria-label': 'Add item' }}
        />
    );
}
```

### Advanced Usage

#### Different Colors and Sizes
You can easily change the color and size of the `IconButton` to fit your design needs.

```jsx
import React from 'react';
import { IconButton, FlexRow } from '@epam/uui';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';
import { ReactComponent as OkIcon } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as ClearIcon } from '@epam/assets/icons/common/navigation-close-18.svg';

export default function AdvancedIconButtonExample() {
    return (
        <FlexRow spacing='18'>
            {/* Different colors */}
            <IconButton icon={ AddIcon } color='blue' onClick={() => {}} rawProps={{ 'aria-label': 'Add' }} />
            <IconButton icon={ OkIcon } color='green' onClick={() => {}} rawProps={{ 'aria-label': 'Confirm' }} />
            <IconButton icon={ ClearIcon } color='red' onClick={() => {}} rawProps={{ 'aria-label': 'Clear' }} />

            {/* Different sizes */}
            <IconButton icon={ AddIcon } color='blue' size={24} onClick={() => {}} rawProps={{ 'aria-label': 'Add small' }} />
            <IconButton icon={ AddIcon } color='blue' size={48} onClick={() => {}} rawProps={{ 'aria-label': 'Add large' }} />
        </FlexRow>
    );
}
```

#### Disabled and Link Buttons
The button can be disabled or rendered as a hyperlink.

```jsx
import React from 'react';
import { IconButton, FlexRow } from '@epam/uui';
import { ReactComponent as HomeIcon } from '@epam/assets/icons/common/action-home-18.svg';
import { ReactComponent as SettingsIcon } from '@epam/assets/icons/common/action-settings-18.svg';

export default function StatesIconButtonExample() {
    return (
        <FlexRow spacing='18'>
            {/* A disabled button */}
            <IconButton
                icon={ SettingsIcon }
                isDisabled={ true }
                rawProps={{ 'aria-label': 'Settings (disabled)' }}
            />

            {/* A button rendered as a link */}
            <IconButton
                icon={ HomeIcon }
                href='/'
                rawProps={{ 'aria-label': 'Go to Home' }}
            />
        </FlexRow>
    );
}
```

## Best Practices
*   **Accessibility is Key:** Since there is no visible text label, screen readers rely on other attributes. **Always provide a descriptive `aria-label`** via the `rawProps` prop to ensure your UI is accessible to all users.
*   **Use Tooltips:** For sighted users, the meaning of an icon may not be immediately obvious. It is highly recommended to wrap the `IconButton` in a `Tooltip` component to provide a text label on hover.
*   **Choose Clear Icons:** Use icons that are universally understood and clearly represent the action they perform. Consistency in your application's iconography is crucial for a good user experience.
*   **Interaction Feedback:** The button provides visual feedback on hover and click by default. Ensure this is not overridden unless you are providing a clear alternative feedback mechanism.

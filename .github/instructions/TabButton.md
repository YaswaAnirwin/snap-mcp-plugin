# TabButton Component

## Overview
The `TabButton` component is a specialized button designed for use in tab-based navigation. It represents a single tab within a set and is typically used horizontally in a group. It provides clear visual states for active, inactive, and disabled tabs, and can be customized with icons and notification counts. `TabButton` is the fundamental building block for creating tab bars, often used within layout containers like `MainMenu` or `FlexRow`.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `string` | - | The text label displayed on the tab. |
| `onClick` | `(e: React.MouseEvent) => void` | - | Callback function that fires when the tab is clicked. Usually used to set the active tab. |
| `isActive` | `boolean` | `false` | If true, the tab is styled as the currently active/selected tab. |
| `isDisabled` | `boolean` | `false` | If true, the tab is disabled and cannot be interacted with. |
| `size` | `'36' \| '48'` | `'36'` | The size (height) of the tab button. |
| `icon` | `Icon` | - | An icon to display on the tab. |
| `iconPosition`| `'left' \| 'right'` | `'left'` | The position of the icon relative to the caption. |
| `count` | `React.ReactNode` | - | A numeric or dot indicator, typically used for notifications. |
| `href` | `string` | - | If provided, the component will be rendered as an `<a>` tag instead of a `<button>`. |
| `target` | `string` | - | The `target` attribute for the link when `href` is used. |
| `cx` | `cx` | - | Allows for adding custom CSS classes for styling. |
| `rawProps` | `React.ButtonHTMLAttributes<HTMLButtonElement> \| React.AnchorHTMLAttributes<HTMLAnchorElement>` | - | Provides access to the native element's attributes. |

## Usage Examples

### Basic Tab Navigation
This example demonstrates a common use case: creating a simple tab bar to switch between different content views. The active state is managed using `useState`.

```jsx
import React, { useState } from 'react';
import { TabButton, FlexRow, Panel, Text } from '@uui/components';

export default function BasicTabsExample() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <>
            {/* Tab container with ARIA role for accessibility */}
            <FlexRow role="tablist" background="surface-main" padding="12">
                <TabButton
                    caption="Profile"
                    isActive={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                />
                <TabButton
                    caption="Account"
                    isActive={activeTab === 'account'}
                    onClick={() => setActiveTab('account')}
                />
                <TabButton
                    caption="Settings"
                    isActive={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                />
            </FlexRow>

            {/* Panel to display the content of the active tab */}
            <Panel margin="24">
                {activeTab === 'profile' && <Text>Profile Content</Text>}
                {activeTab === 'account' && <Text>Account Content</Text>}
                {activeTab === 'settings' && <Text>Settings Content</Text>}
            </Panel>
        </>
    );
}
```

### Advanced Usage with Icons, Counts, and States
This example showcases more advanced features, including icons, notification counts, different sizes, and a disabled state.

```jsx
import React, { useState } from 'react';
import { TabButton, FlexRow, Panel, Text } from '@uui/components';
import { ReactComponent as UserIcon } from '@epam/assets/icons/common/action-user-18.svg';
import { ReactComponent as MailIcon } from '@epam/assets/icons/common/communication-mail-18.svg';
import { ReactComponent as GearIcon } from '@epam/assets/icons/common/action-settings-18.svg';

export default function AdvancedTabsExample() {
    const [activeTab, setActiveTab] = useState('inbox');

    return (
        <>
            <FlexRow role="tablist" background="surface-main" padding="12" borderBottom>
                {/* Tab with an icon and a count indicator */}
                <TabButton
                    caption="Inbox"
                    isActive={activeTab === 'inbox'}
                    onClick={() => setActiveTab('inbox')}
                    icon={MailIcon}
                    count={5}
                    size="48" // Using a larger size
                />
                {/* Tab with an icon positioned on the right */}
                <TabButton
                    caption="Profile"
                    isActive={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                    icon={UserIcon}
                    iconPosition="right"
                    size="48"
                />
                {/* A disabled tab */}
                <TabButton
                    caption="Admin"
                    icon={GearIcon}
                    isDisabled={true}
                    size="48"
                />
            </FlexRow>

            <Panel margin="24">
                {activeTab === 'inbox' && <Text>Inbox - You have 5 unread messages.</Text>}
                {activeTab === 'profile' && <Text>Your Profile Information</Text>}
            </Panel>
        </>
    );
}
```

## Best Practices
*   **State Management:** Always control the `isActive` prop by managing the state of the selected tab in your parent component. There should only be one active tab in a set at any given time.
*   **Accessibility:** For proper accessibility, the container holding the `TabButton` components should have `role="tablist"`. The `TabButton` itself automatically handles `role="tab"` and `aria-selected` attributes.
*   **Use in a Group:** `TabButton` is meant to be used in a group to represent a set of related content panels. Avoid using a single `TabButton` in isolation.
*   **Concise Captions:** Keep the `caption` text short and descriptive for a clean and understandable UI.
*   **Use `href` for Links:** If your tabs correspond to distinct URLs, use the `href` prop. This will render the tab as a proper anchor tag (`<a>`), which is better for SEO and allows users to open tabs in a new window.
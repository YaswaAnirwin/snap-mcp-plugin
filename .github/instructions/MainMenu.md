# MainMenu Component

## Overview
The `MainMenu` component is a primary navigation element for an application. It typically resides on the left side of the screen and provides top-level navigation links, often with icons, labels, and support for hierarchical sub-menus. It also includes slots for a logo and an application version number.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | `IMainMenu[]` | `[]` | An array of menu item objects to be displayed. |
| `value` | `string` | - | The `id` of the currently selected menu item. Used for controlled component behavior. |
| `onValueChange` | `(newId: string) => void` | - | Callback function that is triggered when the selected menu item changes. |
| `renderMenuItem` | `(item: IMainMenu, props: MainMenuButtonProps) => React.ReactNode` | - | A custom render function for a menu item. Allows for complete override of the default rendering. |
| `logo` | `IComponentIcon` | - | An icon component to be displayed as the logo at the top of the menu. |
| `logoHref` | `string` | `'/'` | The URL to navigate to when the logo is clicked. |
| `logoWidth` | `number` | `120` | The width of the logo container in pixels. |
| `appVersion` | `string` | - | A version string to display at the bottom of the menu. |
| `renderBurger` | `(props: { onClose: () => void, isVisible: boolean }) => React.ReactNode` | - | A custom render function for the "burger" menu icon, used in responsive layouts. |

### IMainMenu Item Structure
The `items` array consists of objects with the following shape:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | A unique identifier for the menu item. **Required**. |
| `caption` | `string` | The text label for the menu item. **Required**. |
| `link` | `{ pathname: string, search?: string }` | A React Router-compatible link object for navigation. |
| `icon` | `IComponentIcon` | An icon component to display next to the caption. |
| `children` | `IMainMenu[]` | An array of child menu items to create a collapsible sub-menu. |
| `type` | `'item' \| 'divider'` | The type of the item. Use `'divider'` to render a horizontal line. |
| `priority` | `number` | A number that determines the order of the item in the menu. Lower numbers appear first. |

## Usage Examples

### Basic Usage
A simple `MainMenu` with a flat list of navigation items. This example uses `useState` to manage the currently active link.

```jsx
import React, { useState } from 'react';
import { MainMenu } from '@epam/uui';
import { ReactComponent as HomeIcon } from '@epam/assets/icons/common/action-home-24.svg';
import { ReactComponent as SettingsIcon } from '@epam/assets/icons/common/action-settings-24.svg';

const menuItems = [
    { id: 'home', caption: 'Home', link: { pathname: '/home' }, icon: HomeIcon, priority: 1 },
    { id: 'settings', caption: 'Settings', link: { pathname: '/settings' }, icon: SettingsIcon, priority: 2 },
];

export default function BasicMainMenuExample() {
    const [selectedItem, setSelectedItem] = useState('home');

    return (
        <div style={{ width: '240px', height: '100vh' }}>
            <MainMenu
                items={ menuItems }
                value={ selectedItem }
                onValueChange={ setSelectedItem }
            />
        </div>
    );
}
```

### Advanced Usage
A more complex example featuring a logo, sub-menus, a divider, and an application version.

```jsx
import React, { useState } from 'react';
import { MainMenu } from '@epam/uui';
// Import your application's logo
import { ReactComponent as MyAppLogo } from './myAppLogo.svg'; 
// Import icons
import {
    ReactComponent as HomeIcon,
    ReactComponent as ReportsIcon,
    ReactComponent as AnalyticsIcon,
    ReactComponent as AdminIcon,
    ReactComponent as UsersIcon,
    ReactComponent as RolesIcon,
} from '@epam/assets/icons/common'; // Assuming a barrel export for icons

const advancedMenuItems = [
    { id: 'home', caption: 'Home', link: { pathname: '/' }, icon: HomeIcon, priority: 1 },
    { 
        id: 'reports', 
        caption: 'Reports', 
        link: { pathname: '/reports' }, 
        icon: ReportsIcon, 
        priority: 2,
        // This item has a sub-menu
        children: [
            { id: 'analytics', caption: 'Analytics', link: { pathname: '/reports/analytics' }, icon: AnalyticsIcon, priority: 1 },
        ],
    },
    { type: 'divider', priority: 3 }, // A visual separator
    { 
        id: 'admin', 
        caption: 'Administration', 
        icon: AdminIcon, 
        priority: 4,
        children: [
            { id: 'users', caption: 'User Management', link: { pathname: '/admin/users' }, icon: UsersIcon, priority: 1 },
            { id: 'roles', caption: 'Role Management', link: { pathname: '/admin/roles' }, icon: RolesIcon, priority: 2 },
        ],
    },
];

export default function AdvancedMainMenuExample() {
    const [selectedItem, setSelectedItem] = useState('home');

    return (
        <div style={{ width: '240px', height: '100vh' }}>
            <MainMenu
                items={ advancedMenuItems }
                value={ selectedItem }
                onValueChange={ setSelectedItem }
                logo={ MyAppLogo }
                logoHref="/"
                appVersion="v1.2.3"
            />
        </div>
    );
}
```

## Best Practices
*   **Router Integration:** The `MainMenu` is designed to work with a routing library like React Router. The `link` property in the `IMainMenu` item structure should be used to define the navigation paths. The component will handle rendering the correct `<a>` tags.
*   **Controlled Component:** Always use `MainMenu` as a controlled component by providing the `value` and `onValueChange` props. This allows the application state to be the single source of truth for which menu item is currently active.
*   **Keep it Concise:** While sub-menus are supported, try to keep the navigation hierarchy as flat as possible. Overly nested menus can be difficult for users to navigate.
*   **Use Icons:** Icons provide quick visual cues for users, improving scannability. Use clear and consistent icons for all menu items.
*   **Accessibility:** The component is built with accessibility in mind. Ensure you provide meaningful `caption` text for each item, as this is used for screen reader announcements.

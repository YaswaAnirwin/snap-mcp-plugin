# Dropdown Menu Components

## Overview
The Dropdown Menu is a set of pre-styled components designed to be used together within the `renderBody` prop of a `Dropdown`. They provide a consistent, accessible, and easy-to-use way to build action menus, context menus, and other list-based pop-ups.

The primary components are:
*   `DropdownMenuBody`: The main container for the menu items.
*   `DropdownMenuButton`: The clickable action item within the menu.
*   `DropdownMenuSplitter`: A visual divider to group related items.
*   `DropdownMenuHeader`: A non-interactive title for a section of the menu.

## API Reference

### `DropdownMenuBody`
The main container for the menu items. It's a styled `Panel` that provides the correct background, padding, and keyboard navigation support. It accepts standard layout props from `Panel`.

### `DropdownMenuButton`
The interactive action item within the menu. It is a specially styled `Button`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `React.ReactNode` | - | **Required.** The text label for the menu item. |
| `onClick` | `(e: React.MouseEvent) => void` | - | Callback function triggered when the button is clicked. |
| `icon` | `React.ComponentType<IHasCX & IHasRawProps>` | - | An icon to display next to the caption. |
| `iconPosition` | `'left' \| 'right'` | `'left'` | The position of the icon relative to the caption. |
| `isDisabled` | `boolean` | `false` | If true, the button is non-interactive and visually disabled. |
| `isSelected` | `boolean` | `false` | If true, the button is visually highlighted as the selected item. |
| `href` | `string` | - | If provided, the button will be rendered as an `<a>` tag, making it a link. |
| `target` | `string` | - | The `target` attribute for the link (e.g., `'_blank'`), used when `href` is set. |
| `...other` | `ButtonProps` | - | Inherits other props from the `Button` component. |

### `DropdownMenuSplitter`
A visual divider used to create logical groups of menu items. It has no unique props.

### `DropdownMenuHeader`
A non-interactive title for a section of the menu.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `React.ReactNode` | - | **Required.** The text to be displayed as the header. |

## Usage Examples

### Basic Menu
A standard dropdown menu with a few actions, triggered by a simple icon button.

```jsx
import React from 'react';
import { Dropdown, Button, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter } from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';

export default function BasicMenuExample() {
    const handleAction = (action: string) => {
        alert(`${action} clicked!`);
    };

    const renderMenu = (props) => (
        <DropdownMenuBody {...props}>
            <DropdownMenuButton caption="Edit" onClick={() => handleAction('Edit')} />
            <DropdownMenuButton caption="Duplicate" onClick={() => handleAction('Duplicate')} />
            <DropdownMenuSplitter />
            <DropdownMenuButton caption="Delete" onClick={() => handleAction('Delete')} />
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            renderTarget={(props) => <Button {...props} icon={MoreIcon} fill="none" color="secondary" />}
            renderBody={renderMenu}
            placement="bottom-end"
        />
    );
}
```

### Advanced Menu with Icons and Headers
A more complex menu demonstrating headers, icons, and disabled/selected states to build a view switcher.

```jsx
import React from 'react';
import { Dropdown, Button, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, DropdownMenuHeader } from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as EditIcon } from '@epam/assets/icons/common/action-edit-18.svg';
import { ReactComponent as ViewIcon } from '@epam/assets/icons/common/action-eye-18.svg';
import { ReactComponent as ShareIcon } from '@epam/assets/icons/common/social-share-18.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/common/action-delete-18.svg';

export default function AdvancedMenuExample() {
    const [currentView, setCurrentView] = React.useState('edit');

    const renderAdvancedMenu = (props) => (
        <DropdownMenuBody {...props}>
            <DropdownMenuHeader caption="VIEW" />
            <DropdownMenuButton
                caption="Edit Mode"
                icon={EditIcon}
                onClick={() => setCurrentView('edit')}
                isSelected={currentView === 'edit'}
            />
            <DropdownMenuButton
                caption="Read-Only Mode"
                icon={ViewIcon}
                onClick={() => setCurrentView('view')}
                isSelected={currentView === 'view'}
            />
            <DropdownMenuSplitter />
            <DropdownMenuHeader caption="ACTIONS" />
            <DropdownMenuButton caption="Share" icon={ShareIcon} onClick={() => alert('Sharing!')} />
            <DropdownMenuButton caption="Delete" icon={DeleteIcon} onClick={() => alert('Deleting!')} isDisabled={true} />
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            renderTarget={(props) => <Button {...props} caption="Actions" icon={MoreIcon} iconPosition="right" />}
            renderBody={renderAdvancedMenu}
            placement="bottom-end"
        />
    );
}
```

## Best Practices
*   **Composition:** Always use these components together. The `DropdownMenuBody` should be the root element passed to the `Dropdown`'s `renderBody` prop.
*   **Grouping:** Use `DropdownMenuSplitter` to create logical groups of actions. For even clearer separation, use `DropdownMenuHeader` to give each group a title.
*   **Clarity:** Keep `caption` text concise and action-oriented (e.g., "Save", "Export as PDF", "Delete Item").
*   **State Indication:** Use the `isSelected` prop to indicate the currently active state or selection, providing clear feedback to the user.
*   **Accessibility:** These components are built with accessibility in mind. Using them correctly ensures that your menus are keyboard-navigable (up/down arrows, Enter, Escape) and work with screen readers.
*   **Avoid Overcrowding:** If a menu has too many items, consider breaking it down into sub-menus (by nesting dropdowns) or rethinking the UI to avoid a long, hard-to-scan list.
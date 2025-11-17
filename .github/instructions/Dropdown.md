# Dropdown Component

## Overview
The `Dropdown` is a fundamental container component that displays a body of content when a target element is activated (e.g., by a click or hover). It serves as the engine for many other UUI components like `PickerInput` and `DropdownMenu`, providing a flexible way to create pop-up and pop-over interfaces.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `renderTarget` | `(props: IDropdownToggler) => React.ReactNode` | - | **Required.** A render function for the element that triggers the dropdown. It receives props (`ref`, `onClick`, `isOpen`, etc.) that **must be spread** onto the target element for the dropdown to function correctly. |
| `renderBody` | `(props: IHasCX & IHasRawProps<...>) => React.ReactNode` | - | **Required.** A render function for the content that appears when the dropdown is open. |
| `value` | `boolean` | - | Controls the open/closed state of the dropdown. Use with `onValueChange` to create a controlled component. |
| `onValueChange` | `(newValue: boolean) => void` | - | Callback function that is triggered when the open state changes. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` with `'-start'`/`'-end'` variations | `'bottom-start'` | The position of the dropdown body relative to the target. |
| `openOnHover` | `boolean` | `false` | If `true`, the dropdown opens on mouse hover instead of on click. |
| `closeOnClickOutside` | `boolean` | `true` | If `true`, the dropdown will close when the user clicks outside of its body. |
| `closeOnTargetClick` | `boolean` | `true` | If `true`, the dropdown will close when the user clicks the target element again. |
| `closeOnMouseLeave` | `'toggler' \| 'boundary' \| false` | `false` | Defines if the dropdown should close when the mouse leaves the target (`'toggler'`) or the dropdown body (`'boundary'`). |
| `portalTarget` | `HTMLElement` | - | A specific DOM element to render the dropdown body into using a React Portal. Useful for escaping clipping contexts. |
| `modifiers` | `Popper.Modifier<any>[]` | - | An array of [Popper.js modifiers](https://popper.js.org/docs/v2/modifiers/) for advanced positioning and behavior customization. |

## Usage Examples

### Basic Dropdown Menu
This example shows a standard dropdown menu that opens when a button is clicked.

```jsx
import React from 'react';
import { Dropdown, Button, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter } from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';

export default function BasicDropdownExample() {
    const renderDropdownBody = (props) => (
        <DropdownMenuBody {...props}>
            <DropdownMenuButton caption="Profile" onClick={() => alert('Profile clicked')} />
            <DropdownMenuButton caption="Settings" onClick={() => alert('Settings clicked')} />
            <DropdownMenuSplitter />
            <DropdownMenuButton caption="Log Out" onClick={() => alert('Log Out clicked')} />
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            renderTarget={(props) => (
                // The props passed to renderTarget must be spread onto the target element
                <Button
                    {...props}
                    caption="User Menu"
                    icon={MoreIcon}
                    iconPosition="right"
                    fill="solid"
                />
            )}
            renderBody={renderDropdownBody}
            placement="bottom-end"
        />
    );
}
```

### Advanced: Hover-activated with Custom Body
This example demonstrates a dropdown that opens on hover and contains a custom panel instead of a standard menu.

```jsx
import React from 'react';
import { Dropdown, Avatar, Panel, Text, FlexRow } from '@epam/uui';

export default function HoverDropdownExample() {
    const user = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        avatarUrl: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg',
    };

    // The target element that triggers the dropdown on hover
    const renderAvatarTarget = (props) => (
        <Avatar
            {...props} // Spread props to handle hover events and ARIA attributes
            img={user.avatarUrl}
            size="48"
        />
    );

    // The custom body to display inside the dropdown
    const renderCustomBody = (props) => (
        <Panel {...props} shadow background="surface-main" margin={12}>
            <FlexRow padding="12" vPadding="24">
                <Avatar img={user.avatarUrl} size="60" />
                <div style={{ marginLeft: '12px' }}>
                    <Text fontSize="16" fontWeight="600">{user.name}</Text>
                    <Text fontSize="14" color="secondary">{user.email}</Text>
                </div>
            </FlexRow>
        </Panel>
    );

    return (
        <Dropdown
            renderTarget={renderAvatarTarget}
            renderBody={renderCustomBody}
            openOnHover={true} // Open on hover instead of click
            placement="bottom"
            // Close when the mouse leaves the dropdown body
            closeOnMouseLeave='boundary'
        />
    );
}
```

## Best Practices
*   **Spread Target Props:** It is critical to spread the props received by `renderTarget` onto your target component (`<MyComponent {...props} />`). These props include the `ref` for positioning and event handlers (`onClick`, `onKeyDown`, etc.) for triggering the dropdown and ensuring accessibility.
*   **Controlled vs. Uncontrolled:** For simple cases, the `Dropdown` can manage its own state. For more complex scenarios where the open/closed state needs to be controlled from a parent component (e.g., closing one dropdown when another opens), use it as a controlled component by managing the `value` and `onValueChange` props.
*   **Accessibility:** Use focusable elements like `Button` as dropdown targets. When using `DropdownMenuBody`, keyboard navigation (arrow keys, Escape) is handled automatically. For fully custom bodies, ensure the content is accessible and keyboard-navigable.
*   **Use Case:** `Dropdown` is a low-level primitive. Use it when you need to build a custom pop-up or pop-over experience that isn't covered by higher-level components like `PickerInput`, `Tooltip`, or `MainMenu`.
*   **Portals:** If the dropdown is inside a container with `overflow: hidden` or other clipping properties, use the `portalTarget` prop to render the dropdown body at the top level of the DOM, preventing it from being cut off.
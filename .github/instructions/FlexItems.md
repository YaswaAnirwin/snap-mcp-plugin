# Flex Layout Components

## Overview
UUI provides a set of powerful and easy-to-use layout components based on CSS Flexbox. These are the fundamental building blocks for creating responsive and adaptive user interfaces. The main components in this system are:

*   **`FlexRow`**: A container that arranges its children in a horizontal line. It controls the alignment, spacing, and wrapping of the items within it.
*   **`FlexCell`**: A wrapper for any component placed inside a `FlexRow`. It controls the individual item's sizing (width, growing, shrinking) and alignment.
*   **`FlexSpacer`**: An invisible, flexible element used to push adjacent items to the opposite ends of a `FlexRow`.

## `FlexRow` API Reference
A container for creating horizontal layouts.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The `FlexCell` or other components to be arranged in a row. |
| `spacing` | `'6' \| '12' \| '18' \| '24'` | - | Sets a consistent horizontal gap between each child element. |
| `vPadding` | `'6' \| '12' \| '18' \| '24'` | - | Sets the vertical padding (top and bottom) for the row. |
| `padding` | `'6' \| '12' \| '18' \| '24'` | - | Sets horizontal row padding |
| `alignItems` | `'top' \| 'center' \| 'bottom' \| 'stretch'` | `'top'` | Vertically aligns all items within the row. |
| `justifyContent` | `'start' \| 'end' \| 'center' \| 'between'` | `'start'` | Horizontally distributes items within the row. `'between'` pushes the first and last items to the edges. |
| `size` | `'24' \| '30' \| '36' \| '42' \| '48'` | - | Sets a fixed height for the row, which is useful for aligning form inputs and buttons. |
| `topShadow` | `boolean` | `false` | Adds a subtle shadow to the top of the row, often used for headers. |
| `borderBottom` | `boolean` | `false` | Adds a border to the bottom of the row. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the raw HTML attributes of the underlying `div` element. |

## `FlexCell` API Reference
A wrapper for items inside a `FlexRow`, controlling their size and alignment.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the cell. |
| `width` | `number \| 'auto' \| '100%'` | `'auto'` | Sets the base width of the cell. Use a number for pixels or `'100%'` to fill the container. |
| `minWidth` | `number` | - | Sets the minimum width of the cell in pixels, preventing it from shrinking too much. |
| `grow` | `number` | `0` | A flex-grow factor. A cell with `grow={1}` will expand to fill available space. |
| `shrink` | `number` | `1` | A flex-shrink factor. Defines how much a cell will shrink relative to others if there is not enough space. |
| `textAlign` | `'left' \| 'center' \| 'right'` | - | Sets the text alignment of the content within the cell. |
| `alignSelf` | `'top' \| 'center' \| 'bottom' \| 'stretch'` | - | Overrides the `alignItems` property of the parent `FlexRow` for this specific cell. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the raw HTML attributes of the underlying `div` element. |

## `FlexSpacer` API Reference
An empty, expanding element that pushes items apart. It has no unique props but is equivalent to a `FlexCell` with `grow={1}`.

## Usage Examples

### Basic Row with Spacing
This example demonstrates a simple `FlexRow` with consistent spacing and vertical alignment.

```jsx
import React from 'react';
import { FlexRow, FlexCell, Button, Text } from '@epam/uui';

export default function BasicFlexExample() {
    return (
        <FlexRow spacing="12" vPadding="24" alignItems="center">
            <FlexCell width="auto">
                <Text>User Settings</Text>
            </FlexCell>
            <FlexCell width="auto">
                <Button caption="Profile" onClick={() => {}} />
            </FlexCell>
            <FlexCell width="auto">
                <Button caption="Notifications" onClick={() => {}} />
            </FlexCell>
            <FlexCell width="auto">
                <Button caption="Security" onClick={() => {}} />
            </FlexCell>
        </FlexRow>
    );
}
```

### Advanced Layout with Flexible Cells and Spacer
This example shows a common header layout with a logo, a flexible search bar, and actions pushed to the right.

```jsx
import React, { useState } from 'react';
import { FlexRow, FlexCell, FlexSpacer, Button, TextInput, IconContainer } from '@epam/uui';
import { ReactComponent as LogoIcon } from '@epam/assets/icons/common/epam-logo-white-18.svg';
import { ReactComponent as UserIcon } from '@epam/assets/icons/common/action-user-18.svg';

export default function AdvancedFlexExample() {
    const [searchValue, setSearchValue] = useState('');

    return (
        <FlexRow
            padding="12"
            size="48" // Sets a fixed height for the row
            alignItems="center" // Vertically centers all items
            borderBottom
            rawProps={{ style: { backgroundColor: '#f5f5f5' } }}
        >
            {/* Logo on the left */}
            <FlexCell width={50}>
                <IconContainer icon={LogoIcon} style={{ fill: '#000' }} />
            </FlexCell>

            {/* Search bar that grows to fill available space */}
            <FlexCell grow={1} minWidth={200}>
                <TextInput
                    value={searchValue}
                    onValueChange={setSearchValue}
                    placeholder="Search..."
                />
            </FlexCell>

            {/* An invisible spacer that pushes the next items to the right */}
            <FlexSpacer />

            {/* Action buttons on the right */}
            <FlexCell width="auto">
                <Button caption="Help" fill="none" color="secondary" onClick={() => {}} />
            </FlexCell>
            <FlexCell width="auto">
                <Button icon={UserIcon} fill="none" color="secondary" onClick={() => {}} />
            </FlexCell>
        </FlexRow>
    );
}
```

## Best Practices
*   **Foundation of Layout:** Use `FlexRow` and `FlexCell` as your primary tools for arranging components. They are highly optimized and cover the vast majority of layout needs.
*   **Consistent Spacing:** Always prefer using the `spacing` prop on `FlexRow` over adding manual margins to children. This ensures consistent, theme-aligned spacing.
*   **Fluid Layouts:** The `grow` prop on `FlexCell` is the key to creating fluid and responsive layouts that adapt to different screen sizes. A common pattern is to have one or more cells with `grow={1}` to fill the available space.
*   **`FlexSpacer` vs. `justifyContent`:**
    *   Use `FlexSpacer` when you want to push a specific group of items to the end of the row.
    *   Use `justifyContent: 'between'` on `FlexRow` when you want to distribute all items evenly, with the first item at the start and the last item at the end.
*   **Nesting:** Don't hesitate to nest `FlexRow`s within `FlexCell`s to create complex, multi-dimensional layouts that resemble grids.
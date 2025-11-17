# AdaptivePanel Component

## Overview
The `AdaptivePanel` is a smart container component that arranges items horizontally and gracefully collapses them into a dropdown or other container when the available width is limited. It prioritizes which items to show or hide based on a `priority` property, ensuring the most important items remain visible.

## API Reference

### AdaptivePanel Props

| Parameter  | Type                                     | Default | Description                                                                                                |
|------------|------------------------------------------|---------|------------------------------------------------------------------------------------------------------------|
| `items`    | `AdaptiveItemProps[]`                    | `[]`    | An array of item configurations to be displayed in the panel. This is a required prop.                     |
| `itemsGap` | `number`                                 | -       | The spacing in pixels between the items in the panel.                                                      |
| `cx`       | `cx`                                     | -       | Allows applying custom CSS class names to the component.                                                   |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>`   | -       | Allows passing standard HTML attributes to the root `div` element of the component.                        |

### AdaptiveItemProps Interface
Each object in the `items` array must conform to the `AdaptiveItemProps` interface.

| Parameter            | Type                                                              | Default | Description                                                                                                                                                           |
|----------------------|-------------------------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                 | `string`                                                          | -       | A unique identifier for the item. Required.                                                                                                                           |
| `priority`           | `number`                                                          | -       | Determines the order of collapsing. Items with lower priority are hidden first. Required.                                                                             |
| `render`             | `(item, hiddenItems) => React.ReactNode`                          | -       | A function that returns the React element to be rendered. It receives the item's own props and an array of items that are currently hidden. Required.                 |
| `collapsedContainer` | `boolean`                                                         | `false` | When set to `true`, this item acts as the container for all hidden items. Its `render` function will be invoked to display the collapsed items (e.g., in a dropdown). |
| `data`               | `T`                                                               | -       | An optional property to hold any custom data associated with the item.                                                                                                |

## Usage Examples

### Basic Usage
Here's a basic example of an `AdaptivePanel` that displays a list of buttons. As the container width decreases, items with lower priority will be hidden and accessible through a "Hidden items" dropdown.

```jsx
import React, { useState } from 'react';
import { AdaptiveItemProps, AdaptivePanel } from '@epam/uui-components';
import { Button, Dropdown, FlexCell, VerticalTabButton, Slider, DropdownMenuBody } from '@epam/uui';

export default function BasicAdaptivePanelExample() {
    // State to control the width of the panel for demonstration
    const [width, setWidth] = useState<number>(100);
    const [value, onValueChange] = useState('');

    // Render function for regular items
    const renderItem = (item: AdaptiveItemProps<{ data?: { caption: string } }>) => {
        return (
            <Button key={ item.id } caption={ item.data.caption } onClick={ () => {} } />
        );
    };

    // Configuration for all items in the panel
    const items: AdaptiveItemProps<{ data?: { caption: string } }>[] = [
        { id: '2', render: renderItem, priority: 1, data: { caption: 'Administrators' } },
        { id: '3', render: renderItem, priority: 1, data: { caption: 'Developers' } },
        { id: '4', render: renderItem, priority: 2, data: { caption: 'Managers' } },
        { id: '6', render: renderItem, priority: 3, data: { caption: 'Senior Admins' } },
        { id: '7', render: renderItem, priority: 4, data: { caption: 'Consultants' } },
        { id: '8', render: renderItem, priority: 5, data: { caption: 'Architects' } },
        {
            id: '5',
            // This item is the designated container for hidden items
            collapsedContainer: true,
            priority: 10, // High priority to keep it visible
            render: (item, hiddenItems) => (
                <Dropdown
                    renderTarget={ (props) => <Button caption="Hidden items" { ...props } /> }
                    renderBody={ (props) => (
                        <DropdownMenuBody { ...props }>
                            {/* Map through the hidden items to create dropdown entries */}
                            {hiddenItems.map((i) => (
                                <VerticalTabButton
                                    key={i.id}
                                    caption={ i.data.caption }
                                    onClick={ () => onValueChange(i.data.caption) }
                                    isLinkActive={ i.data.caption === value }
                                />
                            ))}
                        </DropdownMenuBody>
                    ) }
                />
            ),
        },
    ];

    return (
        <FlexCell grow={ 1 }>
            {/* Slider to dynamically change the panel's width */}
            <Slider value={ width } onValueChange={ setWidth } min={ 0 } max={ 100 } step={ 1 } />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <AdaptivePanel itemsGap={6} items={ items } />
            </div>
        </FlexCell>
    );
}
```

## Best Practices

*   **Prioritize Correctly:** The `priority` prop is crucial. Assign lower numbers to less critical items that should disappear first. Assign higher numbers to essential actions that should remain visible as long as possible.
*   **Unique IDs:** Ensure every item in the `items` array has a unique `id`. React uses this for efficient rendering and state management.
*   **Implement `collapsedContainer`:** Always include an item with `collapsedContainer: true`. This provides a fallback UI for users to access items that are hidden due to space constraints. Without it, hidden items become inaccessible.
*   **Keep it Simple:** The `render` function for items should be straightforward. If an item has complex logic, consider encapsulating it in its own component.
*   **Performance:** `AdaptivePanel` measures its items to determine the layout. For optimal performance, avoid frequent re-renders with different item configurations if possible.
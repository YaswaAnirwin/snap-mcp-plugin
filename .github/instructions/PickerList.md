# PickerList Component

## Overview
The `PickerList` component is a foundational element of the UUI picker family. It is responsible for rendering a virtualized, selectable list of items. While it's used internally by `PickerInput`, it can also be used directly to build custom selection controls or display standalone lists where items can be chosen. It supports single and multi-selection, hierarchical data (trees), and full customization of row rendering.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `dataSource` | `IDataSource<TItem, TId, TFilter>` | - | **Required.** An instance of a data source, created by `useArrayDataSource`, `useAsyncDataSource`, or `useLazyDataSource`. |
| `value` | `any` | - | **Required.** The currently selected value(s). The exact type depends on `selectionMode` and `valueType`. |
| `onValueChange` | `(newValue: any) => void` | - | **Required.** Callback function triggered when the selection changes. |
| `selectionMode` | `'single' \| 'multi'` | `'single'` | Defines whether one or multiple items can be selected. |
| `valueType` | `'id' \| 'entity'` | `'id'` | Specifies whether the `value` prop holds the item's ID or the entire item object. |
| `renderRow` | `(props: DataRowProps<TItem, TId>) => React.ReactNode` | - | Custom renderer for each row in the list. If not provided, it defaults to `DataPickerRow`. |
| `cascadeSelection` | `boolean \| 'implicit'` | `false` | Enables cascading selection in hierarchical (tree-like) data sources. `'implicit'` auto-selects children when a parent is selected. |
| `rows` | `DataRowProps<TItem, TId>[]` | - | The array of row props to render. Usually obtained from the `dataSource`'s `getVisibleRows()` method. |
| `maxHeight` | `number` | `300` | The maximum height of the list in pixels. The list will become scrollable if the content exceeds this height. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style to the selection. |
| `renderNotFound` | `(props: { search: string; onClose: () => void; }) => React.ReactNode` | Renders a custom block when a search yields no results. |
| `scheduleUpdate` | `() => void` | - | A function to manually trigger a re-render of the virtual list. Useful in rare cases where dimensions change. |

## Usage Examples

### 1. Basic Single-Select List

This example shows a standalone `PickerList` for selecting a single item from a local array.

```jsx
import React, { useState, useMemo } from 'react';
import { PickerList, FlexCell } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';

const programmingLanguages = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'Java' },
    { id: 4, name: 'TypeScript' },
    { id: 5, name: 'Go' },
];

export default function BasicPickerListExample() {
    const [selectedValue, setSelectedValue] = useState(1);

    const dataSource = useArrayDataSource({
        items: programmingLanguages,
    }, []);

    // Get the rows to render from the data source view
    const view = dataSource.useView(selectedValue, setSelectedValue, {});
    const rows = view.getVisibleRows();

    return (
        <FlexCell width={300}>
            <PickerList
                value={selectedValue}
                onValueChange={setSelectedValue}
                dataSource={dataSource}
                rows={rows}
                maxHeight={200}
                selectionMode="single"
                valueType="id"
            />
        </FlexCell>
    );
}
```

### 2. Multi-Select List with Hierarchical Data (Tree)

`PickerList` excels at handling tree-like data structures. This example demonstrates multi-selection with `cascadeSelection` enabled, where checking a parent node also checks all its children.

```jsx
import React, { useState } from 'react';
import { PickerList, FlexCell } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';

// Sample hierarchical data
const fileSystem = [
    { id: 'd1', name: 'Documents', parentId: undefined },
    { id: 'f1', name: 'report.docx', parentId: 'd1' },
    { id: 'f2', name: 'presentation.pptx', parentId: 'd1' },
    { id: 'p1', name: 'Pictures', parentId: undefined },
    { id: 'f3', name: 'vacation.jpg', parentId: 'p1' },
    { id: 'f4', name: 'family.png', parentId: 'p1' },
];

export default function TreePickerListExample() {
    const [selected, setSelected] = useState(['d1']); // Select the 'Documents' folder by default

    const dataSource = useArrayDataSource({
        items: fileSystem,
        getParentId: item => item.parentId, // Specify how to build the hierarchy
    }, []);

    const view = dataSource.useView(selected, setSelected, {});
    const rows = view.getVisibleRows();

    return (
        <FlexCell width={400}>
            <PickerList
                value={selected}
                onValueChange={setSelected}
                dataSource={dataSource}
                rows={rows}
                maxHeight={300}
                selectionMode="multi"
                valueType="id"
                cascadeSelection={true} // Enable cascading selection
            />
        </FlexCell>
    );
}
```

### 3. Customizing Row Rendering

You can completely change the appearance of each row using the `renderRow` prop. This is useful for displaying complex data with icons, multiple text lines, or custom layouts.

```jsx
import React, { useState } from 'react';
import { PickerList, DataPickerRow, FlexCell, Text, IconContainer } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';
import { Svg } from '@epam/uui-components'; // Assuming an Svg component for icons

const users = [
    { id: 101, name: 'Alex Johnson', role: 'Developer', avatar: new Svg('path/to/dev/icon') },
    { id: 102, name: 'Maria Garcia', role: 'Designer', avatar: new Svg('path/to/design/icon') },
    { id: 103, name: 'James Miller', role: 'Project Manager', avatar: new Svg('path/to/pm/icon') },
];

export default function CustomRowPickerListExample() {
    const [selected, setSelected] = useState([]);
    const dataSource = useArrayDataSource({ items: users }, []);
    const view = dataSource.useView(selected, setSelected, {});

    return (
        <FlexCell width={350}>
            <PickerList
                value={selected}
                onValueChange={setSelected}
                dataSource={dataSource}
                rows={view.getVisibleRows()}
                maxHeight={250}
                selectionMode="multi"
                valueType="id"
                renderRow={(props) => (
                    <DataPickerRow
                        {...props}
                        key={props.id}
                        padding="12"
                        renderItem={(item) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <IconContainer icon={item.avatar} size={48} />
                                <div>
                                    <Text fontSize="16" lineHeight="24" color="primary">{item.name}</Text>
                                    <Text fontSize="12" lineHeight="18" color="secondary">{item.role}</Text>
                                </div>
                            </div>
                        )}
                    />
                )}
            />
        </FlexCell>
    );
}
```

## Best Practices
*   **Standalone Usage:** Use `PickerList` when you need a selectable list that is always visible, unlike the dropdown behavior of `PickerInput`. It's perfect for sidebars, configuration panels, or as a building block for more complex components.
*   **Data Source and View:** The `PickerList` itself is stateless regarding the data. You must create a `dataSource` and then use its `useView` hook to get the `rows` to render. This hook also manages the view's state (e.g., which nodes are folded in a tree).
*   **Virtualization:** The list is virtualized by default, meaning it only renders the rows currently visible in the viewport. This ensures excellent performance even with thousands of items. Ensure `maxHeight` is set to enable scrolling and virtualization.
*   **State Management:** As a controlled component, you are responsible for managing the `value` and `onValueChange` props in your component's state.
*   **Accessibility:** When using `renderRow`, ensure you pass through the props from the `renderRow` callback to your custom row component (e.g., `<DataPickerRow {...props}>`). This carries important accessibility attributes and selection logic.
# PickerModal Component

## Overview
The `PickerModal` provides a full-screen modal interface for selecting items from a list. It is particularly useful for complex selection tasks, on mobile devices where screen space is limited, or when the selection process needs to be a focused, interruptive action. It wraps a `PickerList` inside a `ModalWindow`, providing a complete solution with a header, search capabilities, and action buttons.

The most common way to use `PickerModal` is not by rendering it directly, but by using the `svc.uuiModals.show()` method from the UUI context.

## API Reference

These props are passed to the `PickerModal` component, typically within the `uuiModals.show()` call.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `dataSource` | `IDataSource<TItem, TId, TFilter>` | - | **Required.** An instance of a data source for the items to display. |
| `initialValue` | `any` | - | **Required.** The initial selection passed to the modal when it opens. |
| `selectionMode` | `'single' \| 'multi'` | `'single'` | Defines whether one or multiple items can be selected. |
| `valueType` | `'id' \| 'entity'` | `'id'` | Specifies whether the `value` holds the item's ID or the entire item object. |
| `title` | `string` | `Please select` | The text displayed in the modal's header. |
| `renderRow` | `(props: DataRowProps<TItem, TId>) => React.ReactNode` | - | Custom renderer for each row in the list. Defaults to `DataPickerRow`. |
| `filter` | `TFilter` | - | An initial filter to apply to the `dataSource`. |
| `sorting` | `{ field: keyof TItem, direction: 'asc' \| 'desc' }` | - | An initial sorting to apply to the `dataSource`. |
| `search` | `{ on: (item: TItem) => string[] }` | - | Enables local search. Provide a function that returns an array of strings for each item to search on. Not needed for `useLazyDataSource`. |
| `actions` | `ModalAction[]` | `[...]` | An array of action buttons for the modal footer. Defaults to a "Cancel" and a "Select" button. |

## Usage Examples

### 1. Basic Single-Item Selection Modal

This example demonstrates how to open a `PickerModal` to select a single "language level". The selection is initiated by a button click, which calls `svc.uuiModals.show()`.

```jsx
import React, { useState } from 'react';
import { Button, PickerModal } from '@epam/uui';
import { useUuiContext, useArrayDataSource } from '@epam/uui-core';

const languageLevels = [
    { id: 1, level: 'A1' }, { id: 2, level: 'A2' }, { id: 3, level: 'B1' },
    { id: 4, level: 'B2' }, { id: 5, level: 'C1' }, { id: 6, level: 'C2' },
];

export default function BasicPickerModalExample() {
    const svc = useUuiContext();
    const [selectedValue, setSelectedValue] = useState(3); // Initially 'B1'
    const [selectedLevelName, setSelectedLevelName] = useState('B1');

    const dataSource = useArrayDataSource({
        items: languageLevels,
    }, []);

    const openModal = () => {
        svc.uuiModals.show(props => (
            <PickerModal<any, number>
                {...props}
                dataSource={dataSource}
                initialValue={selectedValue}
                selectionMode="single"
                valueType="id"
                title="Select Language Level"
                getName={item => item.level}
            />
        ))
        .then(newSelection => {
            // This promise resolves when the user clicks the "Select" button
            setSelectedValue(newSelection);
            const selectedItem = languageLevels.find(item => item.id === newSelection);
            setSelectedLevelName(selectedItem?.level || '');
            console.log('New selection:', newSelection);
        })
        .catch(() => {
            // This promise rejects when the user clicks "Cancel" or closes the modal
            console.log('Selection cancelled');
        });
    };

    return (
        <>
            <Button
                caption={`Selected: ${selectedLevelName}`}
                onClick={openModal}
            />
        </>
    );
}
```

### 2. Advanced Multi-Select Modal with API Data

This example shows a more complex `PickerModal` for selecting multiple cities from a remote API. It uses `useLazyDataSource` for efficient data fetching and searching.

```jsx
import React, { useState } from 'react';
import { Button, PickerModal, Text } from '@epam/uui';
import { useUuiContext, useLazyDataSource } from '@epam/uui-core';
import { City } from '@epam/uui-docs'; // Assuming a City type definition

export default function AdvancedPickerModalExample() {
    const svc = useUuiContext();
    const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);

    // The dataSource is configured to fetch data from a remote API
    const dataSource = useLazyDataSource<City, string, any>({
        api: svc.api.demo.cities,
    }, []);

    const openModal = () => {
        svc.uuiModals.show(props => (
            <PickerModal<City, string>
                {...props}
                dataSource={dataSource}
                initialValue={selectedCityIds}
                selectionMode="multi"
                valueType="id"
                title="Select Cities"
                // Custom footer to show the count of selected items
                renderFooter={modalProps => (
                    <div style={{ padding: '12px', textAlign: 'center' }}>
                        <Text>{modalProps.selection.length} cities selected</Text>
                    </div>
                )}
            />
        ))
        .then(setSelectedCityIds) // Update state with the confirmed selection
        .catch(() => console.log('Selection cancelled'));
    };

    return (
        <>
            <Button
                caption={`Select Cities (${selectedCityIds.length} selected)`}
                onClick={openModal}
            />
            <Text>Selected IDs: {selectedCityIds.join(', ')}</Text>
        </>
    );
}
```

## Best Practices
*   **Use the Modal Service:** The idiomatic way to use `PickerModal` is via `svc.uuiModals.show()`. This handles the lifecycle (creation, rendering, destruction) of the modal and provides a promise-based API (`.then()` for success, `.catch()` for cancellation) to get the result.
*   **State Handling:** The modal manages its own internal selection state. The `initialValue` prop seeds this state. The final, confirmed selection is returned only when the user completes the action (e.g., clicks the "Select" button). Your page should only update its own state in the `.then()` callback.
*   **Choose the Right Data Source:**
    *   `useArrayDataSource`: For small, client-side arrays.
    *   `useLazyDataSource`: For large datasets that require server-side filtering, sorting, and lazy loading. This is the most common choice for modals fetching API data.
*   **Mobile-First:** `PickerModal` is the recommended component for picking items on mobile devices, as it provides a better user experience on small screens than a dropdown (`PickerInput`).
*   **Custom Actions:** You can override the default "Cancel" and "Select" buttons by providing a custom `actions` array. Each action object defines a `caption` and an `action` callback. Use `modalProps.success(selection)` to confirm the selection and close the modal, or `modalProps.abort()` to cancel.
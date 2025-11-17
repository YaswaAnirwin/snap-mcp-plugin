# PickerInput Component

## Overview
The `PickerInput` is a versatile and powerful component used for selecting one or multiple items from a list. It supports both local and remote data sources, lazy loading for large datasets, and extensive customization of its appearance and behavior. It's the foundation for dropdowns, multi-select inputs, and more complex selection controls.

## API Reference

### Main Props
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `dataSource` | `IDataSource<TItem, TId, TFilter>` | - | **Required.** An instance of a data source, created by `useArrayDataSource`, `useAsyncDataSource`, or `useLazyDataSource`. |
| `value` | `TId \| TId[] \| TItem \| TItem[]` | - | **Required.** The currently selected value(s). Its type depends on `selectionMode` and `valueType`. |
| `onValueChange` | `(newValue: any) => void` | - | **Required.** Callback function triggered when the selection changes. |
| `selectionMode` | `'single' \| 'multi'` | `'single'` | Defines whether one or multiple items can be selected. |
| `valueType` | `'id' \| 'entity'` | `'id'` | Specifies whether the `value` prop holds the item's ID or the entire item object. |
| `getName` | `(item: TItem) => string` | - | A function to get the display name for an item. Required if `valueType` is `'entity'` or for displaying names of selected items. |
| `entityName` | `string` | `''` | The name of the entity being picked (e.g., "City", "User"). Used in default placeholders. |
| `placeholder` | `string` | `Select ${entityName}` | Placeholder text for the input when no value is selected. |
| `searchPosition` | `'input' \| 'body' \| 'none'` | `'input'` (single) `'body'` (multi) | Determines the location of the search input. `'body'` places it in the dropdown. `'none'` disables search. |
| `size` | `'24' \| '30' \| '36' \| '42' \| '48'` | `'36'` | The size (height) of the input. |
| `isDisabled` | `boolean` | `false` | Disables the picker. |
| `isReadonly` | `boolean` | `false` | Makes the picker read-only. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style, usually for validation errors. |
| `maxItems` | `number` | `20` | In `multi` mode, the maximum number of selected tags to display before collapsing them into a "+N" badge. |
| `minCharsToSearch` | `number` | `1` | The minimum number of characters a user must type to trigger a search. |
| `cascadeSelection` | `boolean \| 'implicit'` | `false` | Enables cascading selection in hierarchical (tree-like) data sources. `'implicit'` auto-selects children when a parent is selected. |

### Customization Props
| Parameter | Type | Description |
|-----------|------|-------------|
| `renderRow` | `(props: DataRowProps<TItem, TId>) => React.ReactNode` | Custom renderer for each row in the dropdown list. |
| `renderTag` | `(props: PickerTogglerRenderItemParams<TItem, TId>) => React.ReactNode` | Custom renderer for the tags of selected items in `multi` mode. |
| `renderFooter` | `(props: PickerFooterProps<TItem, TId>) => React.ReactNode` | Custom renderer for the dropdown's footer area. |
| `renderToggler` | `(props: PickerTogglerProps<TItem, TId>) => React.ReactNode` | Replaces the entire input/toggler part of the component. |
| `renderNotFound` | `(props: { search: string; onClose: () => void; }) => React.ReactNode` | Renders a custom block when a search yields no results. |
| `icon` | `Icon` | An icon to display inside the input. |
| `iconPosition` | `'left' \| 'right'` | The position of the icon. |

## Usage Examples

### 1. Basic Multi-Select with a Local Array

This example shows a `PickerInput` for selecting multiple items from a simple JavaScript array.

```jsx
import React, { useState } from 'react';
import { PickerInput, FlexCell } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';

const languageLevels = [
    { id: 1, level: 'A1' }, { id: 2, level: 'A2' }, { id: 3, level: 'B1' },
    { id: 4, level: 'B2' }, { id: 5, level: 'C1' }, { id: 6, level: 'C2' },
];

export default function ArrayPickerInputExample() {
    const [pickerValue, setPickerValue] = useState([1, 5]);

    // Create a data source from the local array.
    // This hook should be used outside the render function for performance.
    const dataSource = useArrayDataSource({
        items: languageLevels,
    }, []);

    return (
        <FlexCell width={300}>
            <PickerInput
                dataSource={dataSource}
                value={pickerValue}
                onValueChange={setPickerValue}
                getName={(item) => item.level} // How to display the item's name
                entityName="Language level"
                selectionMode="multi"
                valueType="id" // The `value` is an array of item IDs
                maxItems={3} // Show up to 3 tags, then collapse
                sorting={{ field: 'level', direction: 'asc' }}
            />
        </FlexCell>
    );
}
```

### 2. Single-Select with Asynchronous Data

This example demonstrates loading data from a remote API. The `useLazyDataSource` hook is ideal for this, as it handles searching, filtering, and lazy loading automatically.

```jsx
import React, { useState, useCallback } from 'react';
import { PickerInput, FlexCell } from '@epam/uui';
import { useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs'; // Assuming a Person type definition

export default function AsyncPickerInputExample() {
    const svc = useUuiContext(); // Access to UUI services, including API calls
    const [value, onValueChange] = useState<number | null>(null);

    // The dataSource is configured to fetch data from an API endpoint
    const dataSource = useLazyDataSource({
        api: (request) => svc.api.demo.persons(request), // API function to call
    }, []);

    return (
        <FlexCell width={300}>
            <PickerInput
                dataSource={dataSource}
                value={value}
                onValueChange={onValueChange}
                entityName="Person"
                selectionMode="single"
                valueType="id"
                placeholder="Select a person"
            />
        </FlexCell>
    );
}
```

### 3. Linked Pickers (Cascading)

A common pattern is to have one picker's value filter the options of another.

```jsx
import React, { useState } from 'react';
import { City, Country } from '@epam/uui-docs';
import { useAsyncDataSource, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, LabeledInput, PickerInput } from '@epam/uui';

export default function LinkedPickersExample() {
    const svc = useUuiContext();
    const [countryId, setCountryId] = useState<string | null>(null);
    const [cityIds, setCityIds] = useState<string[] | null>([]);

    const countryDataSource = useAsyncDataSource<Country, string, any>({
        api: () => svc.api.demo.countries({}).then(r => r.items),
    }, []);

    const cityDataSource = useLazyDataSource<City, string, any>({
        api: svc.api.demo.cities,
    }, []);

    return (
        <FlexCell width={350}>
            <LabeledInput label="Select country">
                <PickerInput
                    dataSource={countryDataSource}
                    value={countryId}
                    onValueChange={setCountryId}
                    selectionMode="single"
                    valueType="id"
                />
            </LabeledInput>

            <LabeledInput label="Select city">
                <PickerInput
                    dataSource={cityDataSource}
                    value={cityIds}
                    onValueChange={setCityIds}
                    selectionMode="multi"
                    valueType="id"
                    isDisabled={!countryId} // Disable city picker until a country is selected
                    filter={{ country: countryId }} // Pass the selected country ID as a filter to the city API
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

### 4. Customizing the Dropdown Row

You can take full control over how each item is rendered in the list using `renderRow`.

```jsx
import React, { useState } from 'react';
import { PickerInput, DataPickerRow, Text, IconContainer } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';
import { Svg } from '@epam/uui-components'; // Assuming you have icons

// Mock data and icons
const users = [{ id: 1, name: 'John Doe', avatar: new Svg('path/to/avatar1') }, { id: 2, name: 'Jane Smith', avatar: new Svg('path/to/avatar2') }];

export default function CustomRowPickerExample() {
    const [value, setValue] = useState(null);
    const dataSource = useArrayDataSource({ items: users }, []);

    return (
        <PickerInput
            dataSource={dataSource}
            value={value}
            onValueChange={setValue}
            selectionMode="single"
            valueType="id"
            renderRow={(props) => (
                <DataPickerRow
                    {...props}
                    key={props.id}
                    renderItem={(item) => (
                        <>
                            <IconContainer icon={item.avatar} cx="uui-avatar" />
                            <Text>{item.name}</Text>
                        </>
                    )}
                />
            )}
        />
    );
}
```

## Best Practices
*   **Data Source Management:** Always define your data source outside the component's render function using the `useArrayDataSource`, `useAsyncDataSource`, or `useLazyDataSource` hooks. This prevents the data source from being recreated on every render, which is crucial for performance.
*   **Choose the Right Data Source:**
    *   `useArrayDataSource`: For small, client-side arrays of data.
    *   `useAsyncDataSource`: For loading a complete list of items from an API in a single request.
    *   `useLazyDataSource`: For large datasets that require server-side filtering, sorting, and pagination/lazy-loading. This is the most powerful and scalable option.
*   **`valueType` and `getName`:** Be clear about whether you are storing IDs (`valueType: 'id'`) or full objects (`valueType: 'entity'`). Using `'id'` is generally more efficient. When using `'entity'`, you must provide a `getName` function.
*   **Accessibility:** Always provide an `entityName`. This is used to generate accessible default placeholders and ARIA attributes, improving the user experience for screen reader users.
*   **Performance:** For large lists, use `useLazyDataSource`. Use the `searchDebounceDelay` prop (defaults to 1000ms) to control how frequently API requests are made while the user is typing.
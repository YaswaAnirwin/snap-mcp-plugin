# DataTables Component

## Overview
The `DataTable` component is a powerful and flexible tool for displaying and interacting with tabular data. It's built to handle both small and large datasets efficiently, offering features like sorting, filtering, selection, and lazy loading out of the box. It is composed of `DataTable` as the main container, `DataTableRow` for rows, and `DataTableCell` for cells. The columns are configured via the `columns` prop.

## API Reference

### DataTable Props (`IDataTableProps<TItem, TId, TFilter>`)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `DataTableState` | - | The current state of the table (sorting, filtering, selection, etc.). Should be managed via `onValueChange`. |
| `onValueChange` | `(newValue: DataTableState) => void` | - | Callback to update the table's state. |
| `getRows` | `(range?: Range) => DataRowProps<TItem, TId>[]` | - | A function that returns the rows to be rendered. It's provided by the data source hooks (`useArrayDataSource`, `useLazyDataSource`). |
| `columns` | `DataColumnProps<TItem, TId, TFilter>[]` | `[]` | **Required.** An array of column configuration objects. |
| `headerTextCase` | `'upper' \| 'normal'` | `'upper'` | Sets the text case for the table header titles. |
| `renderRow` | `(props: DataTableRowProps<TItem, TId>) => React.ReactNode` | - | Custom render function for a row. Use this to override the default row rendering. |
| `renderNoResultsBlock` | `() => React.ReactNode` | - | A function to render a custom block when the table has no data to display. |
| `...IDataTableProps` | | | Inherits all props from `IDataTableProps` from `@epam/uui-core`. |

### Column Props (`DataColumnProps<TItem, TId, TFilter>`)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `string` | - | **Required.** A unique key for the column. |
| `caption` | `React.ReactNode` | - | The content to be displayed in the column header. |
| `render` | `(item: TItem, rowProps: DataTableRowProps<TItem, TId>) => React.ReactNode` | - | **Required.** A function that renders the content of a cell for a given data item. |
| `width` | `number` | - | **Required.** The width of the column in pixels. |
| `fix` | `'left' \| 'right'` | - | Fixes the column to the left or right side of the table, making it horizontally scrollable. |
| `isSortable` | `boolean` | `false` | If true, the column can be sorted by clicking the header. |
| `isAlwaysVisible` | `boolean` | `false` | If true, this column cannot be hidden by the user (e.g., in a column configuration panel). |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Sets the text alignment for the cells in the column. |
| `info` | `React.ReactNode` | - | Renders a tooltip with additional information when the user hovers over the column header. |
| `...DataColumnProps` | | | Inherits all props from `DataColumnProps` from `@epam/uui-core`. |

## Usage Examples

### Basic Table with Static Data
This example demonstrates how to create a simple table using `useArrayDataSource` for client-side data.

```jsx
import React, { useMemo, useState } from 'react';
import { DataTable, Panel, Text } from '@epam/uui';
import { DataColumnProps, useArrayDataSource } from '@epam/uui-core';

// Define the structure of our data items
interface Person {
    id: number;
    name: string;
    email: string;
    department: string;
}

export default function BasicDataTableExample() {
    const [value, onValueChange] = useState({});

    // Sample data
    const items: Person[] = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing' },
        { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', department: 'Sales' },
    ];

    // Set up the data source
    const dataSource = useArrayDataSource<Person, number, unknown>({
        items: items,
    }, []);

    // Define the columns for the table
    const columns: DataColumnProps<Person>[] = useMemo(() => [
        {
            key: 'name',
            caption: 'Name',
            render: (item) => <Text>{item.name}</Text>,
            width: 200,
        },
        {
            key: 'email',
            caption: 'Email',
            render: (item) => <Text>{item.email}</Text>,
            width: 250,
        },
        {
            key: 'department',
            caption: 'Department',
            render: (item) => <Text>{item.department}</Text>,
            width: 150,
        },
    ], []);

    const view = dataSource.useView(value, onValueChange, {});

    return (
        <Panel shadow style={{ width: '100%' }}>
            <DataTable
                {...view.getListProps()}
                getRows={view.getRows}
                value={value}
                onValueChange={onValueChange}
                columns={columns}
                headerTextCase="upper"
            />
        </Panel>
    );
}
```

### Advanced Table with Sorting, Filtering, and Selection
This example uses `useLazyDataSource` to simulate fetching data from a server and includes controls for sorting, filtering, and row selection.

```jsx
import React, { useMemo, useState } from 'react';
import { DataTable, Panel, Text, Checkbox } from '@epam/uui';
import { DataColumnProps, useLazyDataSource, LazyDataSourceApi } from '@epam/uui-core';

// Define the structure of our data items and filter
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    inStock: boolean;
}

interface ProductFilter {
    category?: string;
}

// Mock API for fetching data
const api: LazyDataSourceApi<Product, number, ProductFilter> = async (request) => {
    // In a real app, this would be a fetch call to your backend
    // Here we simulate it with static data and filtering/sorting
    const allItems: Product[] = [
        { id: 101, name: 'Laptop', category: 'Electronics', price: 1200, inStock: true },
        { id: 102, name: 'Mouse', category: 'Electronics', price: 25, inStock: true },
        { id: 103, name: 'T-Shirt', category: 'Apparel', price: 20, inStock: false },
        { id: 104, name: 'Jeans', category: 'Apparel', price: 60, inStock: true },
    ];

    let items = allItems;

    if (request.filter?.category) {
        items = items.filter(i => i.category === request.filter.category);
    }

    if (request.sorting) {
        const { field, direction } = request.sorting[0];
        items.sort((a, b) => {
            if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return { items: items };
};

export default function AdvancedDataTableExample() {
    const [value, onValueChange] = useState({});

    const dataSource = useLazyDataSource<Product, number, ProductFilter>({ api }, []);

    const columns: DataColumnProps<Product>[] = useMemo(() => [
        {
            key: 'name',
            caption: 'Product Name',
            render: (item) => <Text>{item.name}</Text>,
            width: 200,
            isSortable: true,
        },
        {
            key: 'category',
            caption: 'Category',
            render: (item) => <Text>{item.category}</Text>,
            width: 150,
            isSortable: true,
        },
        {
            key: 'price',
            caption: 'Price',
            render: (item) => <Text>${item.price.toFixed(2)}</Text>,
            width: 100,
            isSortable: true,
            textAlign: 'right',
        },
        {
            key: 'inStock',
            caption: 'In Stock',
            render: (item, rowProps) => <Checkbox {...rowProps.checkbox} value={item.inStock} isDisabled />,
            width: 100,
            textAlign: 'center',
        },
    ], []);

    const view = dataSource.useView(value, onValueChange, {
        // You can set an initial filter here
        // filter: { category: 'Electronics' }
    });

    return (
        <Panel shadow style={{ width: '100%' }}>
            <DataTable
                {...view.getListProps()}
                getRows={view.getRows}
                value={value}
                onValueChange={onValueChange}
                columns={columns}
                // Enable row selection
                showColumnsConfig
            />
        </Panel>
    );
}
```

## Best Practices
*   **Data Source:** Choose the right data source for your needs.
    *   `useArrayDataSource`: Best for small, client-side datasets where all data is available at once. Sorting, filtering, and pagination are handled in the browser.
    *   `useLazyDataSource`: Ideal for large datasets that require server-side operations. It fetches data on-demand as the user scrolls, sorts, or filters, minimizing the initial load.
*   **Column Keys:** Always provide a unique, stable `key` for each column in the `columns` array. This is crucial for React's rendering performance and state preservation.
*   **Memoization:** Memoize the `columns` array with `useMemo` to prevent unnecessary re-renders of the table header and rows.
*   **Performance:** For tables with a large number of rows, use `useLazyDataSource`. Avoid complex calculations or heavy components inside the `render` function of your columns, as it runs for every visible cell.
*   **State Management:** The `value` and `onValueChange` props are the single source of truth for the table's state. Store this state in your component using `useState`.
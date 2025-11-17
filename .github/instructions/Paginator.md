# Paginator Component

## Overview
The Paginator component provides a user-friendly way to navigate through paginated content. It is commonly used with tables, lists, or any view that displays a subset of a larger dataset. The component intelligently displays page numbers, including spacers (...) for a large number of pages, to keep the interface clean.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `totalPages` | `number` | - | **Required.** The total number of pages available. |
| `value` | `number` | `1` | The currently selected page number. The component is controlled, so you must manage this value in your state. |
| `onValueChange` | `(newValue: number) => void` | - | **Required.** Callback function that is triggered when the user selects a new page. It receives the new page number as an argument. |
| `size` | `'24' \| '30'` | `'30'` | Defines the visual size of the paginator component. |
| `isDisabled` | `boolean` | `false` | If true, all navigation buttons in the paginator will be disabled. |
| `rawProps` | `React.HTMLAttributes<HTMLElement>` | - | Allows you to pass any standard HTML attributes to the root `nav` element of the component. |

## Usage Examples

### Basic Usage
Here's a simple example of a Paginator component. It displays navigation for 10 total pages and manages the current page in the component's state.

```jsx
import React, { useState } from 'react';
import { Paginator } from '@epam/uui';

export default function BasicPaginatorExample() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <Paginator
            totalPages={ 10 }
            value={ currentPage }
            onValueChange={ setCurrentPage }
        />
    );
}
```

### Advanced Usage (Different Sizes)
The Paginator can be rendered in different sizes to fit various layouts.

```jsx
import React, { useState } from 'react';
import { FlexCell, Paginator } from '@epam/uui';

export default function PaginatorSizeExample() {
    const [value, onValueChange] = useState(5);

    return (
        <FlexCell width="100%">
            {/* Default size: '30' */}
            <Paginator
                totalPages={ 10 }
                value={ value }
                onValueChange={ onValueChange }
            />

            {/* Small size: '24' */}
            <Paginator
                size="24"
                totalPages={ 10 }
                value={ value }
                onValueChange={ onValueChange }
            />
        </FlexCell>
    );
}
```

### Integration with a Data Table Footer
A common use case is to place the Paginator in the footer of a data table. This example shows how to integrate it with other controls like an "Items per page" selector.

```jsx
import React from 'react';
import { FlexRow, Paginator, Text, FlexSpacer } from '@epam/uui';
import { DataTableState } from '@epam/uui-core';

interface TableFooterProps {
    tableState: DataTableState;
    setTableState: (newState: DataTableState) => void;
    totalCount: number;
}

export function DataTableFooter({ tableState, setTableState, totalCount }: TableFooterProps) {
    const totalPages = tableState.pageSize ? Math.ceil(totalCount / tableState.pageSize) : 0;

    const handlePageChange = (newPage: number) => {
        setTableState({
            ...tableState,
            page: newPage,
            scrollTo: { index: 0 }, // Scroll to the top of the table on page change
        });
    };

    return (
        <FlexRow padding="24" vPadding="12">
            <FlexCell width="auto">
                <Text>{totalCount} items</Text>
            </FlexCell>
            <FlexSpacer />
            <Paginator
                value={ tableState.page }
                onValueChange={ handlePageChange }
                totalPages={ totalPages }
                size="24"
                isDisabled={ totalCount === 0 }
            />
        </FlexRow>
    );
}
```

## Best Practices
*   **Controlled Component:** The `Paginator` is a controlled component. You must manage the `value` (current page) and `onValueChange` callback in your application's state.
*   **State Management:** When used with a data table or list, ensure that the `totalPages` is correctly calculated based on the total number of items and the selected page size.
*   **Disabled State:** Use the `isDisabled` prop to prevent user interaction while data is being fetched or when there is no content to paginate (e.g., `totalPages` is 0 or 1).
*   **Accessibility:** The component is built with accessibility in mind, using a `<nav>` element and `aria` attributes. No special considerations are needed for basic usage.
*   **Page Indexing:** Note that the `value` prop is 1-based, meaning the first page is `1`, the second is `2`, and so on. This is a common convention for user-facing pagination controls.
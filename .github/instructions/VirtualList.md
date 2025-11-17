# VirtualList Component

## Overview
The `VirtualList` is a high-performance component designed to render long lists of items efficiently. It uses virtualization (or "windowing") to render only the items currently visible in the viewport, plus a small buffer. This approach prevents performance degradation and high memory usage when dealing with thousands or even millions of rows, as it keeps the number of DOM elements to a minimum.

It's built on top of the `useVirtualList` hook from `@epam/uui-core`.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rows` | `VirtualListRow[]` | - | **Required.** An array of row data objects, typically provided by a data source hook like `useList` or `useVirtualList`. |
| `rowsCount` | `number` | - | The total number of rows in the list. |
| `renderRow` | `(props: VirtualListRow) => React.ReactNode` | - | A function that takes row props and returns the React element to render for that row. |
| `value` | `VirtualListState` | - | **Required.** The current state of the list, including the scroll position and focused index. |
| `onValueChange` | `(newState: VirtualListState) => void` | - | **Required.** Callback function to handle changes in the `VirtualListState`. |
| `rowHeight` | `number` | `24` | The height of each row in pixels. Use this for lists with fixed-height rows for optimal performance. |
| `estimatedRowHeight` | `number` | `rowHeight` | The estimated height of each row. Use this for lists with variable-height rows to help the component calculate the scrollbar position. |
| `onScroll` | `(e: React.UIEvent<HTMLDivElement>) => void` | - | A standard `onScroll` event handler for the scroll container. |
| `role` | `string` | `'list'` | The ARIA role for the scroll container. |

### `VirtualListState`
The state object used by `value` and `onValueChange`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `topIndex` | `number` | The index of the first visible row. |
| `visibleCount` | `number` | The number of rows to render in the viewport. |
| `focusedIndex` | `number` | The index of the currently focused row. |
| `scrollTo` | `{ index: number; align?: 'top' \| 'bottom' \| 'center' }` | An object to programmatically scroll to a specific index. |

## Usage Examples

### Basic Usage (Fixed Row Height)
This is the most common and performant use case, where every row in the list has the same height.

```jsx
import React, { useState } from 'react';
import { VirtualList } from '@uui/components';
import { useList } from '@epam/uui-core';

// Sample data items
const myItems = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

export function SimpleVirtualList() {
  const [listState, setListState] = useState({});

  // The useList hook prepares the data for the VirtualList
  const { rows, getListProps } = useList({
    items: myItems,
    listState,
    onListStateChange: setListState,
  }, []);

  return (
    <div style={{ height: '500px', border: '1px solid #ccc' }}>
      <VirtualList
        {...getListProps()}
        // Provide a fixed row height for optimal performance
        rowHeight={36}
        renderRow={(props) => (
          <div
            key={props.key}
            // The style prop is crucial for positioning the row correctly
            style={props.style}
            // Attach other props for accessibility and event handling
            {...props.rowProps}
          >
            {props.value.name}
          </div>
        )}
      />
    </div>
  );
}
```

### Advanced Usage (Variable Row Height)
For lists where row heights can vary (e.g., due to wrapping text), you must provide an `estimatedRowHeight`. The component will measure the actual height of each rendered row and adjust the scroll position accordingly.

```jsx
import React, { useState } from 'react';
import { VirtualList } from '@uui/components';
import { useList } from '@epam/uui-core';

// Sample data with variable content length
const myItems = [
  { id: 1, text: 'Short item.' },
  { id: 2, text: 'This is a much longer item that will definitely wrap to multiple lines, making the row taller.' },
  { id: 3, text: 'Another short one.' },
  // ... more items
];

export function DynamicVirtualList() {
  const [listState, setListState] = useState({});

  const { rows, getListProps } = useList({
    items: myItems,
    listState,
    onListStateChange: setListState,
  }, []);

  return (
    <div style={{ height: '400px', border: '1px solid #ccc' }}>
      <VirtualList
        {...getListProps()}
        // Don't use rowHeight. Instead, provide an estimate.
        // A good estimate improves the scrollbar's accuracy.
        estimatedRowHeight={50}
        renderRow={(props) => (
          <div
            key={props.key}
            style={props.style}
            {...props.rowProps}
            // Add some padding and styles for demonstration
            className="p-2 border-b"
          >
            <p className="text-lg font-bold">Item #{props.value.id}</p>
            <p>{props.value.text}</p>
          </div>
        )}
      />
    </div>
  );
}
```

## Best Practices
*   **When to Use:** Use `VirtualList` for any list that could potentially contain more than 50-100 items. For short, fixed lists, a simple `Array.prototype.map` is sufficient.
*   **Provide `rowHeight`:** If your rows have a fixed height, always provide the `rowHeight` prop. This is significantly more performant than the variable-height mode.
*   **Accurate `estimatedRowHeight`:** When using variable row heights, provide the most accurate `estimatedRowHeight` you can. A good estimate prevents the scrollbar from jumping as the user scrolls and the component measures the actual row heights.
*   **Stable Keys:** The `rows` array passed to `VirtualList` must have stable keys. The `useList` hook handles this for you by default.
*   **Container Height:** The `VirtualList` component must be placed inside a container that has a defined height (e.g., `height: 500px` or `flex: 1` in a flex container). The component needs to know its viewport size to function correctly.

## Important Notes
*   The `VirtualList` component renders a scrollable `div` container and absolutely positions the rendered row elements within it.
*   The `style` prop on the object passed to `renderRow` is not optional. It contains the `top`, `left`, and `width` values needed to position the row correctly in the virtualized container. You must spread it onto your row's root element.
*   The `useList`, `useVirtualList`, `useLazyList`, and `useAsyncList` hooks from `@epam/uui-core` are the primary way to prepare data and state for the `VirtualList`. They handle state management, data loading, and row creation.
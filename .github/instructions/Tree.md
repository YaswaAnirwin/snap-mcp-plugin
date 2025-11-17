# Tree Component

## Overview
The `Tree` component is a powerful and flexible component for displaying hierarchical data in a tree-like structure. It's designed to handle large datasets efficiently with features like lazy loading, filtering, searching, and sorting. It is built on top of the `useTree` hook from `@epam/uui-core`.

## API Reference

The `Tree` component is highly configurable through the `useTree` hook. Here are the primary props for `useTree`:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | `TItem[]` | `[]` | An array of items to display in the tree. |
| `getId` | `(item: TItem) => TId` | - | **Required.** A function that returns a unique ID for each item. |
| `getParentId` | `(item: TItem) => TId \| undefined` | - | **Required.** A function that returns the parent's ID for an item. The root items should have a parentId of `undefined`. |
| `getChildCount` | `(item: TItem) => number` | - | A function that returns the number of children for a given item. Essential for lazy loading. |
| `dataSourceState` | `DataSourceState<TFilter, TId>` | `{}` | The state of the data source, including `search`, `sorting`, `checked`, `folded`, `focusedIndex`, `visibleCount`. |
| `onValueChange` | `(newState: DataSourceState<TFilter, TId>) => void` | - | Callback function to handle changes in the `dataSourceState`. |
| `cascadeSelection` | `boolean \| 'explicit' \| 'implicit'` | `false` | Enables cascade selection for checkboxes. `true` or `'explicit'` will check/uncheck children when a parent is checked/unchecked. `'implicit'` will only check the parent if all children are checked. |
| `getFilter` | `(filter: TFilter) => (item: TItem) => boolean` | - | A function that returns a predicate to filter the tree items based on the `filter` object in `dataSourceState`. |
| `getSearchFields` | `(item: TItem) => string[]` | - | A function that returns an array of strings from an item to be used for searching. |
| `sortBy` | `(item: TItem, sorting: DataSourceState['sorting']) => any` | - | A function that defines the sorting logic for the tree items. |
| `flattenSearchResults` | `boolean` | `true` | If `true`, the tree will be flattened to a plain list when a search query is active. |

### `DataSourceState`

The `dataSourceState` object is crucial for controlling the Tree's state.

| Parameter | Type | Description |
|-----------|------|-------------|
| `checked` | `TId[]` | An array of IDs for the currently checked items. |
| `folded` | `TId[]` | An array of IDs for the currently folded (collapsed) items. |
| `focusedIndex` | `number` | The index of the currently focused row. |
| `search` | `string` | The current search query. |
| `sorting` | `{ field: string; direction: 'asc' \| 'desc' }[]` | An array of sorting configurations. |
| `filter` | `TFilter` | The filter object used by `getFilter`. |
| `visibleCount`| `number` | The number of rows to display (for virtualization). |

## Usage Examples

### Basic Usage

Here's a basic example of a `Tree` component with a static list of items.

```jsx
import React, { useState } from 'react';
import { Tree, useTree, TreeItem } from '@uui/components'; // Assuming Tree and TreeItem components exist
import { DataSourceState } from '@epam/uui-core';

const items = [
  { id: 1, name: 'Root 1' },
  { id: 2, name: 'Child 1.1', parentId: 1 },
  { id: 3, name: 'Child 1.2', parentId: 1 },
  { id: 4, name: 'Root 2' },
  { id: 5, name: 'Child 2.1', parentId: 4 },
  { id: 6, name: 'Sub-child 2.1.1', parentId: 5 },
];

export function BasicTree() {
  const [dataSourceState, setDataSourceState] = useState<DataSourceState>({});

  const tree = useTree({
    items,
    getId: item => item.id,
    getParentId: item => item.parentId,
    dataSourceState,
    onValueChange: setDataSourceState,
  }, []);

  return (
    <div role="tree">
      {tree.getListProps().rows.map(row => (
        <TreeItem
          key={row.id}
          {...row.getProps()}
        />
      ))}
    </div>
  );
}
```

### Advanced Usage with Search and Cascade Selection

This example demonstrates a more advanced tree with search functionality and cascade selection.

```jsx
import React, { useState, useMemo } from 'react';
import { Tree, useTree, TreeItem, TextInput } from '@uui/components';
import { DataSourceState, DataQueryFilter } from '@epam/uui-core';

interface MyItem {
  id: number;
  name: string;
  parentId?: number;
}

const items: MyItem[] = [
  // ... same items as basic example
];

export function AdvancedTree() {
  const [dataSourceState, setDataSourceState] = useState<DataSourceState>({
    folded: {},
    checked: [],
  });

  const tree = useTree({
    items,
    getId: item => item.id,
    getParentId: item => item.parentId,
    dataSourceState,
    onValueChange: setDataSourceState,
    cascadeSelection: true,
    getSearchFields: item => [item.name],
  }, []);

  const handleSearch = (value: string) => {
    setDataSourceState(prevState => ({ ...prevState, search: value }));
  };

  return (
    <div>
      <TextInput
        value={dataSourceState.search || ''}
        onValueChange={handleSearch}
        placeholder="Search..."
      />
      <div role="tree">
        {tree.getListProps().rows.map(row => (
          <TreeItem
            key={row.id}
            {...row.getProps()}
            // Assuming TreeItem can show a checkbox
            isCheckable={true}
            isChecked={row.isChecked}
            isChildrenChecked={row.isChildrenChecked}
          />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

*   **Memoization:** For performance, especially with large datasets, wrap callbacks and complex objects passed to `useTree` in `React.useCallback` and `React.useMemo`.
*   **Unique IDs:** Ensure that the `getId` function returns a unique identifier for every item in the tree to prevent rendering issues and incorrect behavior.
*   **Data Structure:** The `getParentId` is fundamental to building the tree structure correctly. Ensure root items have an `undefined` or `null` `parentId`.
*   **Lazy Loading:** For very large or remote datasets, use the `api` prop of `useLazyDataSource` or `useAsyncDataSource` and provide a `getChildCount` function to enable lazy loading of children.
*   **State Management:** The `dataSourceState` and `onValueChange` props are the core of the component's interactivity. Manage this state carefully in your component.

## Important Notes

*   The `Tree` component itself is primarily a consumer of the `useTree` hook. The hook does the heavy lifting of processing the data, and the component renders the result.
*   When implementing features like lazy loading, search, or filtering with an API, you'll typically use `@epam/uui-core`'s `useLazyDataSource` or `useAsyncDataSource` hooks, which then integrate with the `useTree` hook.
*   The rendered output is highly customizable. The examples use a hypothetical `TreeItem` component. You would create your own component to render each row according to your application's needs, passing the props from `row.getProps()`.
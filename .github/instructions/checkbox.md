# Checkbox Component

## Overview
The Checkbox component allows users to select one or more options from a set. It can also be used for a single binary choice, like turning a setting on or off. It supports checked, unchecked, and indeterminate states.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `boolean` | - | The current checked state of the checkbox. `true` for checked, `false` for unchecked. |
| `onValueChange`| `(newValue: boolean) => void` | - | **Required.** Callback function that is invoked when the checkbox state changes. |
| `label` | `React.ReactNode` | - | The content to be displayed as a label next to the checkbox. |
| `isDisabled` | `boolean` | `false` | If `true`, the checkbox is non-interactive and visually disabled. |
| `isReadonly` | `boolean` | `false` | If `true`, the checkbox state cannot be changed by the user, but it remains focusable. |
| `isInvalid` | `boolean` | `false` | If `true`, the checkbox is styled to indicate a validation error. |
| `indeterminate`| `boolean` | `false` | If `true`, the checkbox displays a "mixed" or indeterminate state. This is a visual state only; the `value` prop is not affected. |
| `size` | `'12' \| '18'` | `'18'` | Defines the size of the checkbox. |
| `cx` | `any` | - | Allows for adding custom CSS class names. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the underlying HTML element's attributes. |

## Usage Examples

### Basic Usage

This example shows a simple checkbox with a label. Its state is controlled using React's `useState` hook.

```jsx
import React, { useState } from 'react';
import { Checkbox } from '@epam/uui';

export default function BasicCheckboxExample() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Checkbox
      label="I agree to the terms and conditions"
      value={isChecked}
      onValueChange={setIsChecked}
    />
  );
}
```

### States

Checkboxes can be disabled, read-only, or marked as invalid to reflect different UI states, commonly found in forms.

```jsx
import React, { useState } from 'react';
import { Checkbox, FlexRow } from '@epam/uui';

export default function StateCheckboxExample() {
  const [value, setValue] = useState(true);

  return (
    <FlexRow spacing="18">
      {/* A checked and disabled checkbox */}
      <Checkbox
        label="Disabled"
        value={true}
        onValueChange={() => {}}
        isDisabled={true}
      />
      
      {/* A read-only checkbox */}
      <Checkbox
        label="Read-only"
        value={true}
        onValueChange={() => {}}
        isReadonly={true}
      />
      
      {/* An invalid checkbox, often used for form validation feedback */}
      <Checkbox
        label="Invalid"
        value={false}
        onValueChange={() => {}}
        isInvalid={true}
      />
    </FlexRow>
  );
}
```

### Indeterminate State

The `indeterminate` state is useful in scenarios like a "Select All" checkbox that controls a list of items. If only some of the items are selected, the "Select All" checkbox becomes indeterminate.

```jsx
import React, { useState, useMemo } from 'react';
import { Checkbox, FlexCell, LabeledInput } from '@epam/uui';

const allItems = ['Apple', 'Banana', 'Orange'];

export default function IndeterminateCheckboxExample() {
  const [selectedItems, setSelectedItems] = useState(['Apple']);

  const handleSelectAll = (isChecked) => {
    setSelectedItems(isChecked ? allItems : []);
  };

  const handleSelectItem = (item, isChecked) => {
    setSelectedItems(prev => 
      isChecked ? [...prev, item] : prev.filter(i => i !== item)
    );
  };

  const isAllSelected = selectedItems.length === allItems.length;
  const isIndeterminate = selectedItems.length > 0 && !isAllSelected;

  return (
    <FlexCell>
      <Checkbox
        label="Select All"
        value={isAllSelected}
        onValueChange={handleSelectAll}
        indeterminate={isIndeterminate}
      />
      <div style={{ paddingLeft: '24px', marginTop: '12px' }}>
        {allItems.map(item => (
          <Checkbox
            key={item}
            label={item}
            value={selectedItems.includes(item)}
            onValueChange={(isChecked) => handleSelectItem(item, isChecked)}
          />
        ))}
      </div>
    </FlexCell>
  );
}
```

### Sizes

The Checkbox component is available in two standard sizes.

```jsx
import React from 'react';
import { Checkbox, FlexRow } from '@epam/uui';

export default function SizeCheckboxExample() {
  return (
    <FlexRow alignItems="center" spacing="18">
      <Checkbox
        label="Small (12px)"
        value={true}
        onValueChange={() => {}}
        size="12"
      />
      <Checkbox
        label="Default (18px)"
        value={true}
        onValueeChange={() => {}}
        size="18"
      />
    </FlexRow>
  );
}
```

## Best Practices
*   **Use for Multiple Selections:** Use a group of checkboxes when users can select any number of options from a list. For single-choice selections, use [Radio Buttons](./RadioInput) instead.
*   **Clear Labels:** Always provide a clear and concise `label` for each checkbox. The label should be positioned close to the checkbox to create a clear association.
*   **Indeterminate for Parent Items:** The `indeterminate` state should only be used for parent checkboxes that represent a mixed selection of child items. It should not be settable by a direct user click.
*   **Clickable Area:** The entire area including the checkbox and its label should be clickable to improve usability, which is the default behavior of this component.
*   **Accessibility:** The component is built with accessibility in mind. Providing a `label` ensures that screen readers can correctly announce the purpose of the checkbox.
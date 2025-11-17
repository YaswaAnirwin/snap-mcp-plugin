# RangeDatePicker Component

## Overview
The `RangeDatePicker` is a form input component that allows users to select a start and an end date from a calendar interface. It is ideal for scenarios requiring date range filtering, such as booking systems, report generation, or data analysis dashboards. The component is highly customizable, supporting predefined date ranges (presets), date filtering, and various display formats.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `{ from: string \| null, to: string \| null }` | - | **Required.** The currently selected date range. Dates should be in `YYYY-MM-DD` format. |
| `onValueChange` | `(newValue: { from: string \| null, to: string \| null }) => void` | - | **Required.** Callback function that is triggered when the start or end date changes. |
| `format` | `string` | `'MMM D, YYYY'` | The `dayjs`-compatible format for displaying the dates in the input field. |
| `presets` | `Record<string, { name: string, value: { from: string, to: string } }>` | - | An object defining a list of preset ranges. The key is a unique identifier, and the value contains the display `name` and the date range `value`. |
| `filter` | `(day: Dayjs) => boolean` | - | A function to disable specific dates in the calendar. It receives a `dayjs` object for each day and should return `true` to disable the date. |
| `size` | `'30' \| '36' \| '42'` | `'36'` | The size (height) of the input field. |
| `isDisabled` | `boolean` | `false` | If true, the component is disabled and cannot be interacted with. |
| `isReadonly` | `boolean` | `false` | If true, the user cannot change the selection. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style to the component, typically for validation feedback. |
| `renderFooter` | `() => React.ReactNode` | - | A function to render a custom footer in the calendar dropdown. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows you to pass any standard HTML attributes to the root `div` element of the component. |

## Usage Examples

### 1. Basic Usage
A standard `RangeDatePicker` for selecting a date range, with its state managed by the parent component.

```jsx
import React, { useState } from 'react';
import { RangeDatePicker, FlexCell } from '@epam/uui';

export default function BasicRangeDatePickerExample() {
    const [value, setValue] = useState({ from: '2023-10-01', to: '2023-10-10' });

    return (
        <FlexCell width={300}>
            <RangeDatePicker
                value={value}
                onValueChange={setValue}
            />
        </FlexCell>
    );
}
```

### 2. Using Presets for Quick Selection
Provide users with a list of common date ranges (e.g., "Last 7 Days", "This Month") to speed up selection.

```jsx
import React, { useState } from 'react';
import { RangeDatePicker, FlexCell } from '@epam/uui';
import dayjs from 'dayjs';

export default function PresetsRangeDatePickerExample() {
    const [value, setValue] = useState({ from: null, to: null });

    const datePresets = {
        last7Days: {
            name: 'Last 7 Days',
            value: {
                from: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
                to: dayjs().format('YYYY-MM-DD'),
            },
        },
        last30Days: {
            name: 'Last 30 Days',
            value: {
                from: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
                to: dayjs().format('YYYY-MM-DD'),
            },
        },
        thisMonth: {
            name: 'This Month',
            value: {
                from: dayjs().startOf('month').format('YYYY-MM-DD'),
                to: dayjs().endOf('month').format('YYYY-MM-DD'),
            },
        },
    };

    return (
        <FlexCell width={300}>
            <RangeDatePicker
                value={value}
                onValueChange={setValue}
                presets={datePresets}
                format="DD/MM/YYYY" // Custom display format
            />
        </FlexCell>
    );
}
```

### 3. Filtering Available Dates
Use the `filter` prop to prevent users from selecting certain dates, such as weekends or dates in the past.

```jsx
import React, { useState } from 'react';
import { RangeDatePicker, FlexCell } from '@epam/uui';
import { Dayjs } from 'dayjs';

export default function FilterRangeDatePickerExample() {
    const [value, setValue] = useState({ from: null, to: null });

    // Disable selection of weekends (Saturday and Sunday)
    const filterWeekends = (day: Dayjs) => {
        const dayOfWeek = day.day(); // 0 for Sunday, 6 for Saturday
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    return (
        <FlexCell width={300}>
            <RangeDatePicker
                value={value}
                onValueChange={setValue}
                filter={filterWeekends}
                placeholder="Select a range (weekdays only)"
            />
        </FlexCell>
    );
}
```

### 4. Validation State
Mark the component as invalid to indicate a validation error, often used in forms.

```jsx
import React, { useState } from 'react';
import { RangeDatePicker, FlexCell, LabeledInput } from '@epam/uui';

export default function InvalidRangeDatePickerExample() {
    const [value, setValue] = useState({ from: null, to: null });

    // In a real form, this would be based on validation logic
    const isInvalid = !value.from || !value.to;

    return (
        <FlexCell width={300}>
            <LabeledInput
                label="Booking Dates"
                isInvalid={isInvalid}
                validationMessage="Please select a valid date range."
            >
                <RangeDatePicker
                    value={value}
                    onValueChange={setValue}
                    isInvalid={isInvalid}
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

## Best Practices
*   **Controlled Component:** `RangeDatePicker` is a controlled component. You must manage its `value` and `onValueChange` props in your application's state.
*   **Date Format:** The `value` prop must always use the `YYYY-MM-DD` format for data consistency. Use the `format` prop to change the visual representation of the date for the user.
*   **Use Presets:** For any application that uses common date ranges (like reporting), providing `presets` is a significant user experience improvement.
*   **Date Library:** UUI components use `dayjs` for all date and time operations. When creating presets or filters, use `dayjs` to ensure compatibility.
*   **Clear Placeholders:** If the initial value can be empty, provide a clear placeholder to guide the user.
*   **Accessibility:** The component is built with accessibility in mind. For optimal accessibility, always associate it with a label, for example by wrapping it with a `LabeledInput`.
# DatePicker Component

## Overview
The `DatePicker` component provides a user-friendly interface for selecting a single date. It consists of a formatted input field that, when activated, displays a calendar view for date selection.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | - | The selected date, stored in ISO 8601 format (e.g., `'2023-10-27'`). |
| `onValueChange` | `(newValue: string) => void` | - | Callback function that is triggered when a date is selected. It receives the new date as an ISO string. |
| `format` | `string` | `'MMM D, YYYY'` | A `dayjs`-compatible string that defines how the date is displayed in the input field (e.g., `'DD/MM/YYYY'`). |
| `filter` | `(day: Dayjs) => boolean` | - | A function to disable specific dates in the calendar view. It receives a `dayjs` object for each day and should return `true` for selectable dates and `false` for disabled ones. |
| `renderFooter` | `(props: { onClose: () => void }) => React.ReactNode` | - | A render function to add custom content or actions, like a "Today" button, to the bottom of the calendar dropdown. |
| `isDisabled` | `boolean` | `false` | If true, the date picker is disabled and cannot be interacted with. |
| `isReadonly` | `boolean` | `false` | If true, the user cannot change the value. |
| `isInvalid` | `boolean` | `false` | If true, the component gets a red border, indicating a validation error. |
| `placeholder` | `string` | - | The placeholder text to display when no date is selected. Defaults to the `format` string. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the raw HTML attributes of the underlying `div` element. |

## Usage Examples

### Basic Usage
A standard `DatePicker` with state management and a custom display format.

```jsx
import React, { useState } from 'react';
import { DatePicker } from '@epam/uui';

export default function BasicDatePickerExample() {
    // The value is stored as an ISO 8601 string: 'YYYY-MM-DD'
    const [value, onValueChange] = useState<string | null>(null);

    return (
        <DatePicker
            value={value}
            onValueChange={onValueChange}
            // Custom format for displaying the date to the user
            format='DD/MM/YYYY'
        />
    );
}
```

### Filtering Available Dates
This example demonstrates how to use the `filter` prop to prevent users from selecting weekends.

```jsx
import React, { useState } from 'react';
import { DatePicker } from '@epam/uui';
import { Dayjs } from 'dayjs';

export default function FilterDatePickerExample() {
    const [value, onValueChange] = useState('2023-10-27');

    // This filter function disables Saturdays (6) and Sundays (0)
    const disableWeekends = (day: Dayjs) => {
        const dayOfWeek = day.day();
        return dayOfWeek !== 0 && dayOfWeek !== 6;
    };

    return (
        <DatePicker
            value={value}
            onValueChange={onValueChange}
            format='MMM D, YYYY'
            filter={disableWeekends}
        />
    );
}
```

### Advanced Usage with a Custom Footer
Use the `renderFooter` prop to add extra functionality, such as a "Today" button that quickly selects the current date.

```jsx
import React, { useState } from 'react';
import { DatePicker, Button, FlexRow } from '@epam/uui';
import dayjs from 'dayjs';

export default function FooterDatePickerExample() {
    const [value, onValueChange] = useState<string | null>(null);

    // Render a footer with a "Today" button
    const renderCustomFooter = ({ onClose }) => (
        <FlexRow padding='12'>
            <Button
                caption="Today"
                onClick={() => {
                    onValueChange(dayjs().format('YYYY-MM-DD'));
                    onClose(); // Close the calendar after selection
                }}
                fill="light"
                color="blue"
                size="30"
            />
        </FlexRow>
    );

    return (
        <DatePicker
            value={value}
            onValueChange={onValueChange}
            format='DD-MM-YYYY'
            renderFooter={renderCustomFooter}
        />
    );
}
```

## Best Practices
*   **Controlled Component:** Always use the `DatePicker` as a controlled component by managing its `value` and `onValueChange` props through component state.
*   **Date Format:** Store the `value` in the standard ISO 8601 format (`'YYYY-MM-DD'`) in your state. Use the `format` prop to control the visual representation for the user, which can be localized or customized as needed.
*   **User Experience:** Use the `filter` prop to guide users by disabling dates that are not valid for the given context (e.g., past dates for a future booking, or holidays for a business day selector).
*   **Form Validation:** Leverage the `isInvalid` prop to provide clear visual feedback when the selected date does not meet form validation requirements.
*   **Accessibility:** Ensure the `DatePicker` has a corresponding label or is used in a context that makes its purpose clear to all users.
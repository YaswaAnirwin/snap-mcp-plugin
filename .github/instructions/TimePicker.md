Of course, here is the comprehensive documentation for the React Time Picker component, tailored for GitHub Copilot's understanding.

---
~~~markdown
# Time Picker Component (React)

## Overview
The Time Picker component provides a user-friendly interface for selecting a specific time. It is highly customizable, supporting both 12-hour and 24-hour formats, configurable minute steps, and various sizes. It is designed to be easy to integrate into any React application.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `TimePickerValue` | `null` | The current time value, an object with `hours` and `minutes`. |
| `onValueChange` | `(newValue: TimePickerValue) => void` | - | **Required.** Callback function triggered when the time value changes. |
| `format` | `12 \| 24` | `12` | Sets the time format to either 12-hour (with AM/PM) or 24-hour. |
| `minutesStep` | `number` | `5` | The increment/decrement step for the minutes input. |
| `size` | `'24' \| '30' \| '36' \| '42' \| '48'` | `'36'` | Defines the size (height) of the component. |
| `disableClear` | `boolean` | `false` | If `true`, the clear button for resetting the value is hidden. |
| `disabled` | `boolean` | `false` | If `true`, the component is disabled and cannot be interacted with. |
| `isReadonly` | `boolean` | `false` | If `true`, the component is in a read-only state. |
| `isRequired` | `boolean` | `false` | If `true`, the component must have a value (used for form validation). |
| `id` | `string` | - | A unique identifier for the time picker's input element. |
| `renderTarget` | `(props: IDropdownToggler) => React.ReactNode` | - | A function to customize the rendering of the time picker's target (the input part). |
| `inputCx` | `CX` | - | Custom CSS class for the input element. |
| `bodyCx` | `CX` | - | Custom CSS class for the body of the time picker dropdown. |
| `rawProps` | `{ input?: HTMLAttributes, body?: HTMLAttributes }` | - | HTML attributes to be applied to the input and body elements. |

*Type `TimePickerValue`: `{ hours: number, minutes: number }`*

## Usage Examples

### Basic Usage
A simple implementation of the `TimePicker` using React hooks to manage its state.

```jsx
import React, { useState } from 'react';
import { TimePicker } from '@uui/components';
import { TimePickerValue } from '@uui/components';

export function BasicTimePickerExample() {
  const [time, setTime] = useState<TimePickerValue>({ hours: 14, minutes: 30 });

  return (
    <TimePicker
      value={time}
      onValueChange={setTime}
    />
  );
}
```

### Advanced Usage
This example showcases a `TimePicker` configured for a 24-hour format, a 15-minute step, a larger size, and with the clear button disabled.

```jsx
import React, { useState } from 'react';
import { TimePicker } from '@uui/components';
import { TimePickerValue } from '@uui/components';

export function AdvancedTimePickerExample() {
  const [time, setTime] = useState<TimePickerValue>({ hours: 18, minutes: 45 });

  return (
    <TimePicker
      value={time}
      onValueChange={setTime}
      format={24}
      minutesStep={15}
      size='48'
      disableClear={true}
    />
  );
}
```

### Disabled and Read-Only States
Demonstrates how to render the `TimePicker` in disabled and read-only states.

```jsx
import React, { useState } from 'react';
import { TimePicker } from '@uui/components';
import { TimePickerValue } from '@uui/components';

export function TimePickerStatesExample() {
  const [time, setTime] = useState<TimePickerValue>({ hours: 9, minutes: 0 });

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Disabled Time Picker */}
      <TimePicker
        value={time}
        onValueChange={setTime}
        disabled={true}
      />

      {/* Read-Only Time Picker */}
      <TimePicker
        value={time}
        onValueChange={setTime}
        isReadonly={true}
      />
    </div>
  );
}
```

## Best Practices
*   **State Management:** Always control the `TimePicker` component by managing its `value` and `onValueChange` props through React state (`useState`, `useReducer`, etc.).
*   **Form Integration:** When using this component in a form, leverage the `isRequired` prop for validation and associate it with a `<label>` using the `id` prop for better accessibility.
*   **User Experience:** Choose a `minutesStep` value that aligns with the precision required for your application (e.g., 15 or 30 minutes for scheduling applications is common).
*   **Accessibility:** Always provide an `id` for the component to link it with a `label` for better screen reader support.

## Notes
*   The `TimePickerValue` object `{ hours: number, minutes: number }` is used for the `value` prop and is the payload for the `onValueChange` callback. The `hours` are always in 24-hour format (0-23) regardless of the `format` prop.
*   The component is fully accessible out-of-the-box, supporting keyboard navigation for all interactive elements.
~~~
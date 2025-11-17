# Switch Component (React)

## Overview
The Switch component is a UI control that allows users to toggle between two states: on and off. It's commonly used for activating or deactivating settings and preferences.

The component is designed as a controlled component, meaning its state must be managed by the parent component. This provides a predictable and consistent state management pattern.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `boolean` | - | **Required.** The current state of the switch. `true` for on, `false` for off. |
| `onValueChange` | `(newValue: boolean) => void` | - | **Required.** Callback function that is invoked when the user clicks the switch. It receives the new boolean value. |
| `isDisabled` | `boolean` | `false` | If `true`, the switch is non-interactive and visually muted. |
| `isReadonly` | `boolean` | `false` | If `true`, the user cannot change the value, but the switch remains focusable. |
| `size` | `'12' \| '18' \| '24'` | `'18'` | The size of the switch control. |
| `label` | `React.ReactNode` | - | A label to be displayed next to the switch. |
| `labelPosition` | `'left' \| 'right'` | `'right'` | The position of the label relative to the switch control. |
| `cx` | `any` | - | Allows adding custom CSS class names to the component's root element. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Any native HTML attributes to be passed to the root `<div>` element. |

## Usage Examples

### Basic Usage
A standard `Switch` requires `value` and `onValueChange` props to control its state.

```jsx
import React, { useState } from 'react';
import { Switch } from '@uui/components';

export function BasicSwitchExample() {
    // Manage the switch's state (on/off)
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
        />
    );
}
```

### With a Label
You can provide a `label` to give context to the switch. The label's position can be controlled with `labelPosition`.

```jsx
import React, { useState } from 'react';
import { Switch, FlexRow } from '@uui/components';

export function LabeledSwitchExample() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <FlexRow>
            {/* Label on the default (right) side */}
            <Switch
                value={notifications}
                onValueChange={setNotifications}
                label="Enable Notifications"
            />

            {/* Label explicitly positioned on the left */}
            <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                label="Dark Mode"
                labelPosition="left"
            />
        </FlexRow>
    );
}
```

### Disabled and Read-Only States
The `isDisabled` prop prevents all interaction, while `isReadonly` prevents changes but allows focus.

```jsx
import React, { useState } from 'react';
import { Switch, FlexRow } from '@uui/components';

export function StateSwitchExample() {
    const [value, setValue] = useState(true);

    return (
        <FlexRow>
            {/* A disabled switch cannot be clicked or focused */}
            <Switch
                value={value}
                onValueChange={setValue}
                isDisabled
                label="Disabled"
            />

            {/* A read-only switch can be focused but not changed */}
            <Switch
                value={value}
                onValueChange={setValue}
                isReadonly
                label="Read-only"
            />
        </FlexRow>
    );
}
```

### Different Sizes
The `size` prop can be used to adjust the switch's dimensions to fit various layouts.

```jsx
import React, { useState } from 'react';
import { Switch, FlexRow } from '@uui/components';

export function SizedSwitchExample() {
    const [value, setValue] = useState(true);

    return (
        <FlexRow alignItems='center'>
            <Switch size="12" value={value} onValueChange={setValue} label="Small" />
            <Switch size="18" value={value} onValueChange={setValue} label="Medium (Default)" />
            <Switch size="24" value={value} onValueChange={setValue} label="Large" />
        </FlexRow>
    );
}
```

## Best Practices
*   **Controlled Component:** Always use the `Switch` as a controlled component by managing its state via `value` and `onValueChange`. This ensures predictable behavior and aligns with React's state management philosophy.
*   **Provide a Label:** Always associate a `label` with a switch. This is critical for accessibility (so screen readers can announce its purpose) and for user clarity.
*   **Use for Binary States:** A `Switch` is ideal for settings that have a clear binary state (e.g., on/off, enabled/disabled, true/false). For choices from a list, consider `RadioGroup` or `CheckboxGroup`.
*   **Immediate Effect:** The action of toggling a switch should ideally take effect immediately. If the action requires a final confirmation step (like saving a form), consider using a `Checkbox` instead.
*   **`isDisabled` vs. `isReadonly`:**
    *   Use `isDisabled` when a setting is not available to the user due to permissions or other dependencies.
    *   Use `isReadonly` when you want to display a setting's current state without allowing the user to change it.
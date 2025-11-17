# NumericInput Component

## Overview
The `NumericInput` is a specialized input field designed exclusively for handling numeric values. It enhances the standard text input by providing features like increment/decrement arrows (steppers), min/max value constraints, and built-in number formatting.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number \| null` | - | The current numeric value of the input. Using `null` represents an empty input. **Required**. |
| `onValueChange` | `(newValue: number \| null) => void` | - | Callback function that is triggered when the value changes. **Required**. |
| `min` | `number` | `Number.MIN_SAFE_INTEGER` | The minimum allowed value. The user cannot type or step below this value. |
| `max` | `number` | `Number.MAX_SAFE_INTEGER` | The maximum allowed value. The user cannot type or step above this value. |
| `step` | `number` | `1` | The amount to increment or decrement the value when the stepper arrows are used. |
| `size` | `'30' \| '36' \| '42'` | `'36'` | Defines the size (height) of the input component. |
| `isDisabled` | `boolean` | `false` | If `true`, the input is disabled and non-interactive. |
| `isReadonly` | `boolean` | `false` | If `true`, the user cannot change the value. |
| `disableArrows` | `boolean` | `false` | If `true`, the increment/decrement arrows are hidden. |
| `formatOptions` | `Intl.NumberFormatOptions` | - | An object to configure number formatting based on the `Intl.NumberFormat` API. |
| `rawProps` | `React.HTMLAttributes<HTMLInputElement>` | - | Allows passing any standard HTML attributes to the underlying `<input>` element. |

## Usage Examples

### Basic Usage
A simple `NumericInput` controlled by `useState`.

```jsx
import React, { useState } from 'react';
import { NumericInput, LabeledInput, FlexCell } from '@epam/uui';

export default function BasicNumericInputExample() {
    const [value, onValueChange] = useState<number | null>(10);

    return (
        <FlexCell width={200}>
            <LabeledInput label="Age">
                <NumericInput
                    value={ value }
                    onValueChange={ onValueChange }
                    placeholder="Enter your age"
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

### Advanced Usage

#### Constraining Value with Min, Max, and Step
This example shows how to limit the user's input to a specific range and control the step value.

```jsx
import React, { useState } from 'react';
import { NumericInput, LabeledInput, FlexCell } from '@epam/uui';

export default function RangeNumericInputExample() {
    const [quantity, setQuantity] = useState<number | null>(5);

    return (
        <FlexCell width={250}>
            <LabeledInput label="Quantity (0-20, steps of 5)">
                <NumericInput
                    value={ quantity }
                    onValueChange={ setQuantity }
                    min={ 0 }
                    max={ 20 }
                    step={ 5 } // Value changes by 5 with each arrow click
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

#### Formatting the Displayed Value
You can use `formatOptions` to display the number as a currency or with a specific number of decimal places. The underlying `value` remains a pure number.

```jsx
import React, { useState } from 'react';
import { NumericInput, LabeledInput, FlexCell } from '@epam/uui';

export default function FormattedNumericInputExample() {
    const [price, setPrice] = useState<number | null>(1234.56);
    const [percentage, setPercentage] = useState<number | null>(0.755);

    return (
        <FlexCell width={250}>
            <LabeledInput label="Price (USD)">
                <NumericInput
                    value={ price }
                    onValueChange={ setPrice }
                    // Formats the number as U.S. currency
                    formatOptions={{
                        style: 'currency',
                        currency: 'USD',
                    }}
                />
            </LabeledInput>

            <LabeledInput label="Tax Rate">
                <NumericInput
                    value={ percentage }
                    onValueChange={ setPercentage }
                    step={0.01}
                    // Formats the number as a percentage with 2 decimal places
                    formatOptions={{
                        style: 'percent',
                        minimumFractionDigits: 2,
                    }}
                />
            </LabeledInput>
        </FlexCell>
    );
}
```

## Best Practices
*   **Controlled Component:** Always use `NumericInput` as a controlled component by managing its state via the `value` and `onValueChange` props.
*   **Use `min` and `max`:** Whenever possible, provide `min` and `max` values. This provides immediate, client-side validation and prevents users from entering invalid data.
*   **Use `LabeledInput`:** Wrap `NumericInput` with `LabeledInput` to provide a clear description of the expected input and to ensure accessibility.
*   **Formatting for Display Only:** Remember that `formatOptions` only affects the visual representation of the number. The `value` you manage in your state will always be a `number` or `null`, making it easy to perform calculations without any parsing.
*   **When to Disable Arrows:** Consider setting `disableArrows` to `true` if the stepping feature is not relevant to the use case, which can provide a cleaner UI.

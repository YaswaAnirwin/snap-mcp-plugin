# SliderRating Component

## Overview
The `SliderRating` component provides an intuitive way for users to select a value from a discrete range, typically for providing a rating or feedback. It renders a series of steps (e.g., stars) on a slider, allowing users to click or drag to make a selection.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | - | The current selected rating value. |
| `onValueChange` | `(newValue: number) => void` | - | **Required.** Callback function that is called when the rating value changes. |
| `from` | `number` | `1` | The minimum value of the rating scale. |
| `to` | `number` | `5` | The maximum value of the rating scale. |
| `step` | `number` | `1` | The increment between selectable values. |
| `renderTooltip` | `(value: number) => React.ReactNode` | `(value) => value` | A function to render custom content inside the tooltip for each rating step. By default, it displays the numeric value. |
| `withoutTooltips`| `boolean` | `false` | If true, tooltips will not be shown on hover. |
| `isDisabled` | `boolean` | `false` | If true, the component is disabled and cannot be interacted with. |
| `isReadonly` | `boolean` | `false` | If true, the rating is displayed but cannot be changed by the user. |
| `cx` | `cx` | - | Allows for adding custom CSS classes. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the native `div` element's attributes. |

## Usage Examples

### Basic 5-Point Rating
This is the most common use case for a `SliderRating`, allowing users to select a value from 1 to 5.

```jsx
import React, { useState } from 'react';
import { SliderRating, LabeledInput } from '@epam/uui';

export default function BasicSliderRatingExample() {
    const [rating, setRating] = useState(3);

    return (
        <LabeledInput label={`Your rating: ${rating}`}>
            <SliderRating 
                value={rating} 
                onValueChange={setRating} 
                // The 'from' and 'to' props are optional for a 1-5 scale
                from={1}
                to={5}
            />
        </LabeledInput>
    );
}
```

### Advanced Usage with Custom Tooltips and Range
This example demonstrates a 1-10 rating scale and uses the `renderTooltip` prop to provide descriptive text for each rating value, improving the user experience.

```jsx
import React, { useState } from 'react';
import { SliderRating, LabeledInput, FlexRow, Switch } from '@epam/uui';

export default function AdvancedSliderRatingExample() {
    const [satisfaction, setSatisfaction] = useState(7);
    const [isDisabled, setIsDisabled] = useState(false);

    // Custom labels for the tooltip
    const renderSatisfactionTooltip = (value: number) => {
        if (value <= 3) return 'Not Satisfied';
        if (value <= 7) return 'Neutral';
        return 'Very Satisfied';
    };

    return (
        <>
            <FlexRow vPadding="12">
                <LabeledInput label="Disable Rating">
                    <Switch value={isDisabled} onValueChange={setIsDisabled} />
                </LabeledInput>
            </FlexRow>

            <LabeledInput label={`Satisfaction Score: ${satisfaction}/10`}>
                <SliderRating
                    value={satisfaction}
                    onValueChange={setSatisfaction}
                    from={1}
                    to={10}
                    step={1}
                    renderTooltip={renderSatisfactionTooltip}
                    isDisabled={isDisabled}
                />
            </LabeledInput>
        </>
    );
}
```

### Readonly Rating Display
Use the `isReadonly` prop to display a rating value that the user cannot change. This is useful for showing an average rating or a previously submitted score.

```jsx
import React from 'react';
import { SliderRating, LabeledInput } from '@epam/uui';

export default function ReadonlySliderRatingExample() {
    // This value could come from an API
    const averageRating = 4;

    return (
        <LabeledInput label={`Average community rating: ${averageRating}`}>
            <SliderRating 
                value={averageRating} 
                onValueChange={() => {}} // onValueChange is still required but can be a no-op
                isReadonly={true} 
            />
        </LabeledInput>
    );
}
```

## Best Practices
*   **Controlled Component:** Always use `SliderRating` as a controlled component by managing its state with `value` and `onValueChange`.
*   **Provide Context:** While the default numeric tooltips are useful, use `renderTooltip` to provide meaningful labels (e.g., "Poor", "Average", "Excellent") whenever possible. This clarifies the meaning of each step in the scale.
*   **Use `isReadonly` for Display:** When you need to show a rating that isn't interactive, use the `isReadonly` prop instead of `isDisabled`. The `isReadonly` prop maintains the visual appearance of a selected rating, whereas `isDisabled` styles it to indicate that the control is not active.
*   **Logical Scale:** Ensure the `from`, `to`, and `step` props create a logical and intuitive scale for the user. A 1-5 or 1-10 scale is standard for most rating scenarios.
# Slider Component

## Overview
The Slider component allows users to select a single value from a continuous or discrete range of values. It provides a visual representation of the range and a handle that the user can move to select a value.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | - | The current value of the slider. |
| `onValueChange` | `(newValue: number) => void` | - | Callback function that is called when the slider value changes. |
| `min` | `number` | `0` | The minimum value of the slider. |
| `max` | `number` | `100` | The maximum value of the slider. |
| `step` | `number` | `1` | The increment/decrement step of the slider. |
| `isDisabled` | `boolean` | `false` | If true, the slider is disabled and cannot be interacted with. |
| `splitAt` | `number` | - | Renders a scale with labels at each `splitAt` position. |
| `renderLabel` | `(value: number) => string` | - | A function to customize the rendering of the labels on the scale. |
| `showTooltip` | `boolean` | `true` | If true, a tooltip with the current value is shown when interacting with the handle. |
| `cx` | `IHasCX` | - | Allows adding custom CSS class names to the component. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows adding standard HTML attributes to the root element. |

## Usage Examples

### Basic Usage
A simple slider for selecting a value within a given range.

```jsx
import React, { useState } from 'react';
import { Slider } from '@uui/components';

export default function BasicSliderExample() {
    const [value, setValue] = useState(50);

    return (
        <Slider
            value={value}
            onValueChange={setValue}
            min={0}
            max={100}
            step={1}
        />
    );
}
```

### Advanced Usage

#### Slider with a Scale
Use the `splitAt` prop to show a scale with reference points.

```jsx
import React, { useState } from 'react';
import { Slider } from '@uui/components';

export default function ScaledSliderExample() {
    const [volume, setVolume] = useState(75);

    return (
        <Slider
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={150}
            step={5}
            splitAt={25} // Adds a marker and label every 25 units
        />
    );
}
```

#### Slider with Custom Labels
Use the `renderLabel` prop to format the labels on the scale, for example, to add a percentage sign.

```jsx
import React, { useState } from 'react';
import { Slider } from '@uui/components';

export default function CustomLabelSliderExample() {
    const [percentage, setPercentage] = useState(20);

    return (
        <Slider
            value={percentage}
            onValueChange={setPercentage}
            min={0}
            max={100}
            step={10}
            splitAt={20}
            renderLabel={(value) => `${value}%`} // Appends a '%' to each label
        />
    );
}
```

#### Disabled Slider
A disabled slider is not interactive and is visually styled to indicate its state.

```jsx
import React from 'react';
import { Slider } from '@uui/components';

export default function DisabledSliderExample() {
    return (
        <Slider
            value={50}
            onValueChange={() => {}}
            min={0}
            max={100}
            isDisabled={true} // Disables the slider
        />
    );
}
```

## Best Practices
*   **Accessibility**: The component is built with accessibility in mind, automatically handling `aria` attributes like `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
*   **Appropriate Range**: Choose `min`, `max`, and `step` values that make sense for the data being controlled. A large range with a small step might be difficult for users to interact with precisely.
*   **Visual Guidance**: Use the `splitAt` prop to provide users with clear reference points along the slider's track, especially for larger ranges.
*   **State Indication**: Ensure the slider's state (e.g., disabled) is clearly communicated to the user.

## Related Components
*   **RangeSlider**: For selecting a range of values (e.g., a minimum and maximum price) instead of a single value.
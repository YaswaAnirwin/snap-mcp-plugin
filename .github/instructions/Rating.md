# Rating Component

## Overview
The `Rating` component provides a user-friendly way to view and set a rating, typically represented by a series of icons like stars. It's commonly used for product reviews, user feedback, or any scenario where a graded evaluation is needed.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number \| null` | - | **Required.** The current rating value. `null` indicates no rating has been given. |
| `onValueChange` | `(newValue: number) => void` | - | **Required for interactive ratings.** Callback function that is triggered when the user selects a new rating. |
| `maxValue` | `number` | `5` | The maximum possible rating value (e.g., the total number of stars). |
| `size` | `'18' \| '24' \| '30'` | `'18'` | The size of the rating icons. |
| `isReadonly` | `boolean` | `false` | If true, the rating is for display only and cannot be changed by the user. |
| `isDisabled` | `boolean` | `false` | If true, the component is disabled and cannot be interacted with. |
| `isInvalid` | `boolean` | `false` | Applies an invalid style to the component, typically for validation feedback. |
| `icon` | `Icon` | `StarIcon` | The icon to use for an unselected rating point. |
| `filledIcon` | `Icon` | `FilledStarIcon` | The icon to use for a selected rating point. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows you to pass any standard HTML attributes to the root `div` element of the component. |

## Usage Examples

### 1. Basic Interactive Rating
A standard 5-star rating control that allows users to select a value.

```jsx
import React, { useState } from 'react';
import { Rating, FlexCell } from '@epam/uui';

export default function BasicRatingExample() {
    const [rating, setRating] = useState(3);

    return (
        <FlexCell width={200}>
            <Rating
                value={rating}
                onValueChange={setRating}
            />
        </FlexCell>
    );
}
```

### 2. Read-only and Different Sizes
Displaying a static rating value. This is useful for showing an average score or a previously submitted review.

```jsx
import React from 'react';
import { Rating, FlexCell, Text, VPanel } from '@epam/uui';

export default function ReadonlyRatingExample() {
    return (
        <VPanel>
            <FlexCell width={200}>
                <Text>Read-only Rating (size 18)</Text>
                <Rating value={3.5} isReadonly={true} size="18" />
            </FlexCell>
            <FlexCell width={200} cx="uui-margin-top-24">
                <Text>Read-only Rating (size 24)</Text>
                <Rating value={4} isReadonly={true} size="24" />
            </FlexCell>
             <FlexCell width={200} cx="uui-margin-top-24">
                <Text>Read-only Rating (size 30)</Text>
                <Rating value={5} isReadonly={true} size="30" />
            </FlexCell>
        </VPanel>
    );
}
```

### 3. Custom Maximum Value
You can easily create a rating scale with more or fewer than 5 stars by setting the `maxValue` prop.

```jsx
import React, { useState } from 'react';
import { Rating, FlexCell, Text } from '@epam/uui';

export default function MaxValueRatingExample() {
    const [tenStarRating, setTenStarRating] = useState(7);

    return (
        <FlexCell width={300}>
            <Text>10-Star Rating Scale</Text>
            <Rating
                value={tenStarRating}
                onValueChange={setTenStarRating}
                maxValue={10}
            />
        </FlexCell>
    );
}
```

### 4. Custom Icons
Replace the default star icons with any other icons to match your application's design.

```jsx
import React, { useState } from 'react';
import { Rating, FlexCell, Text } from '@epam/uui';
import { Svg } from '@epam/uui-components';

// Assuming you have custom SVG icons available
const HeartIcon = new Svg('path/to/empty/heart');
const FilledHeartIcon = new Svg('path/to/filled/heart');

export default function CustomIconRatingExample() {
    const [likes, setLikes] = useState(4);

    return (
        <FlexCell width={300}>
            <Text>Rate with Hearts</Text>
            <Rating
                value={likes}
                onValueChange={setLikes}
                icon={HeartIcon}
                filledIcon={FilledHeartIcon}
            />
        </FlexCell>
    );
}
```

### 5. Disabled State
A disabled rating prevents user interaction.

```jsx
import React from 'react';
import { Rating, FlexCell } from '@epam/uui';

export default function DisabledRatingExample() {
    return (
        <FlexCell width={200}>
            <Rating
                value={2}
                isDisabled={true}
            />
        </FlexCell>
    );
}
```

## Best Practices
*   **Controlled Component:** `Rating` is a controlled component. For it to be interactive, you must manage its `value` and `onValueChange` props in your application's state.
*   **Read-only vs. Disabled:**
    *   Use `isReadonly` to display a rating that is not meant for user input (e.g., showing an average score). The component remains focusable and accessible to screen readers.
    *   Use `isDisabled` when a rating input exists but is not currently available for interaction (e.g., the user must complete another action first). The component will be non-interactive and skipped in tab navigation.
*   **Provide Context:** Always provide a label or clear context for the rating so users understand what they are evaluating. This can be done by wrapping the `Rating` component with a `LabeledInput` or placing it next to a `Text` component.
*   **Accessibility:** The component is accessible by default, using ARIA attributes to convey its state to screen readers. No extra configuration is needed for this.
*   **Handling Null Values:** The `value` can be `null`, which represents that no rating has been given. This is the recommended initial state for a rating that a user needs to fill out.
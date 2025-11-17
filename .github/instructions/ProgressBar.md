# ProgressBar Component

## Overview
The `ProgressBar` component is a visual indicator used to show the completion status of a task or process that has a determinate duration. It helps to manage user expectations during loading or processing times by providing feedback on the progress of an operation.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `progress` | `number` | - | **Required.** A number between 0 and 100 representing the percentage of completion. |
| `size` | `'12' \| '24'` | `'12'` | The height of the progress bar in pixels. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows you to pass any standard HTML attributes to the root `div` element of the component. |

## Usage Examples

### 1. Basic Usage
A simple progress bar showing a fixed progress value.

```jsx
import React from 'react';
import { ProgressBar, FlexCell } from '@epam/uui';

export default function BasicProgressBarExample() {
    return (
        <FlexCell width={400}>
            {/* A progress bar showing 60% completion */}
            <ProgressBar progress={60} />
        </FlexCell>
    );
}
```

### 2. Dynamic Progress
This example demonstrates a progress bar that updates over time, simulating a file upload or a background task.

```jsx
import React, { useState, useEffect } from 'react';
import { ProgressBar, Button, FlexCell, Text } from '@epam/uui';

export default function DynamicProgressBarExample() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timer;
        if (isLoading && progress < 100) {
            timer = setInterval(() => {
                setProgress(prevProgress => Math.min(prevProgress + 10, 100));
            }, 500);
        } else if (progress >= 100) {
            setIsLoading(false);
        }
        return () => clearInterval(timer);
    }, [isLoading, progress]);

    const handleStart = () => {
        setProgress(0);
        setIsLoading(true);
    };

    return (
        <FlexCell width={400}>
            <Text>Simulating file processing...</Text>
            <ProgressBar progress={progress} />
            <Button
                caption={isLoading ? 'Processing...' : 'Start Process'}
                onClick={handleStart}
                isDisabled={isLoading}
                cx="uui-margin-top-12" // Utility class for margin
            />
        </FlexCell>
    );
}
```

### 3. Different Sizes
The `ProgressBar` component can be rendered in different sizes to fit various layouts.

```jsx
import React from 'react';
import { ProgressBar, FlexCell, Text } from '@epam/uui';

export default function ProgressBarSizesExample() {
    return (
        <FlexCell width={400}>
            <Text>Default size ('12')</Text>
            <ProgressBar progress={75} size="12" />

            <div style={{ marginTop: '24px' }}>
                <Text>Large size ('24')</Text>
                <ProgressBar progress={75} size="24" />
            </div>
        </FlexCell>
    );
}
```

## Best Practices
*   **Determinate vs. Indeterminate Processes:** Use the `ProgressBar` for operations with a calculable duration, where you can track and display the percentage of completion. For operations with an unknown duration (e.g., waiting for a server response), use an indeterminate indicator like `Spinner` or `Loader`.
*   **Provide Context:** A progress bar is most effective when the user understands what it represents. Always accompany it with a descriptive label (e.g., "Uploading your files...", "Processing report... 60%").
*   **Completion State:** When the progress reaches 100, the task is complete. Your UI should reflect this by, for example, removing the progress bar and displaying the result, or changing the bar's state to a "completed" visual.
*   **Accessibility:** The `ProgressBar` component is built with accessibility in mind. It automatically includes the necessary ARIA roles and attributes (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`) to be understood by screen readers. No extra configuration is required for basic accessibility.
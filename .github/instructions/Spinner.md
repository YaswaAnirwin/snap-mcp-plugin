# Spinner Component

## Overview
The Spinner component provides a visual indicator that an operation is in progress. It's used to signify an indeterminate waiting period, letting the user know that the application is busy and has not frozen.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | `number` | `36` | The width and height of the spinner in pixels. |
| `color` | `'blue' \| 'white' \| 'gray'` | `'blue'` | The color of the spinner. Use `'white'` for dark backgrounds. |
| `cx` | `any` | - | Allows adding custom CSS class names to the component for advanced styling. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows adding native HTML attributes to the root `div` element of the spinner. |

## Usage Examples

### Basic Usage
The default spinner is blue and 36x36 pixels.

```jsx
import { Spinner } from '@uui/components';

export function BasicSpinnerExample() {
  return <Spinner />;
}
```

### Different Sizes
You can easily change the size of the spinner by providing a number to the `size` prop.

```jsx
import { Spinner, FlexRow } from '@uui/components';

export function SpinnerSizesExample() {
  return (
    <FlexRow spacing='18' vPadding='12'>
      {/* A smaller spinner */}
      <Spinner size={24} />

      {/* The default size spinner */}
      <Spinner size={36} />

      {/* A larger spinner */}
      <Spinner size={48} />
    </FlexRow>
  );
}
```

### Custom Colors
The spinner color can be adjusted for different backgrounds. Use the `white` color for dark or colored surfaces.

```jsx
import { Spinner, FlexRow } from '@uui/components';

export function SpinnerColorExample() {
  const darkBgStyle = {
    backgroundColor: '#2c2f33', // A dark background
    padding: '24px',
    borderRadius: '6px',
  };

  return (
    <FlexRow spacing='18'>
      {/* Default blue spinner */}
      <Spinner />

      {/* Gray spinner */}
      <Spinner color='gray' />

      {/* White spinner on a dark background */}
      <div style={darkBgStyle}>
        <Spinner color='white' />
      </div>
    </FlexRow>
  );
}
```

### Integration with other components
A common use case is to display a spinner inside a button or over a content area to indicate a loading state.

```jsx
import React, { useState, useEffect } from 'react';
import { Spinner, Button, FlexCell } from '@uui/components';

export function SpinnerIntegrationExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <FlexCell width='auto'>
      <Button
        caption={isLoading ? 'Loading...' : 'Click to Load'}
        onClick={handleClick}
        // Use the spinner as the button icon when loading
        icon={isLoading ? () => <Spinner color='white' size={18} /> : undefined}
        isDisabled={isLoading}
      />
    </FlexCell>
  );
}
```

## Best Practices
*   **Context is Key**: Place the `Spinner` in the context of the content that is loading. For example, if a data table is refreshing, show the spinner overlaid on the table.
*   **Avoid Layout Shift**: When a spinner appears, it can cause the page layout to shift. To prevent this, place the spinner inside a container that has a fixed height and width (e.g., `min-height`).
*   **Use with Text**: For better user experience, consider pairing the `Spinner` with a descriptive text like "Loading data..." so users understand what is happening.
*   **Accessibility**: The `Spinner` component has an `aria-live="polite"` attribute to inform screen reader users that a process is active. When using it to block UI, ensure the container being loaded has `aria-busy="true"`.
*   **Don't Overuse**: Use spinners for operations that take a noticeable amount of time (typically > 500ms). For very fast operations, a spinner might flash on the screen, which can be distracting.
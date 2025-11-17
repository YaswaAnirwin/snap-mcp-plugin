# Blocker Component

## Overview
The Blocker component is used to prevent user interaction with a part of the UI and to indicate that an operation is in progress (e.g., loading data, submitting a form). It overlays the content with a semi-transparent layer and an optional loading spinner.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `isEnabled` | `boolean` | - | **Required.** Turns the blocker on (`true`) or off (`false`). |
| `hideSpinner` | `boolean` | `false` | If set to `true`, the loading spinner will not be displayed. |
| `spacerHeight`| `number` | - | Sets a minimum height in pixels for the blocker. This is useful when the content being blocked is not yet rendered and has no height, preventing the blocker from collapsing. |
| `renderSpinner`| `(props: any) => React.ReactNode` | - | A render function to replace the default spinner with a custom component. |
| `cx` | `any` | - | Allows for adding custom CSS class names to the component. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Provides access to the underlying HTML `div` element's attributes. |

## Usage Examples

### Basic Usage

This example demonstrates how to block a `Panel` component while data is being fetched. A button simulates the start and end of a loading process.

```jsx
import React, { useState } from 'react';
import { Panel, Blocker, Button, FlexRow } from '@epam/uui';

export default function BasicBlockerExample() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Button
        caption={isLoading ? 'Loading...' : 'Load Data'}
        onClick={toggleLoading}
        isDisabled={isLoading}
      />
      
      <Panel shadow style={{ marginTop: '12px', height: '200px', position: 'relative' }}>
        {/* Some content inside the panel */}
        <FlexRow padding="12">
          Content that will be blocked.
        </FlexRow>
        
        {/* The Blocker is enabled based on the isLoading state */}
        <Blocker isEnabled={isLoading} />
      </Panel>
    </div>
  );
}
```

### Advanced Usage

This example shows a more advanced configuration where the content area is initially empty.
- `spacerHeight` is used to give the blocker a visible area.
- `renderSpinner` is used to provide a custom loading indicator.
- `hideSpinner` is used to demonstrate blocking without any indicator.

```jsx
import React, { useState } from 'react';
import { Blocker, Button, FlexCell, Text } from '@epam/uui';
import { ReactComponent as CustomSpinner } from '@epam/assets/icons/spinner.svg';

export default function AdvancedBlockerExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomSpinner, setShowCustomSpinner] = useState(false);
  const [hideAllSpinners, setHideAllSpinners] = useState(false);

  const startLoading = (custom, hide) => {
    setIsLoading(true);
    setShowCustomSpinner(custom);
    setHideAllSpinners(hide);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <FlexCell width="100%">
      <FlexCell>
        <Button
          caption="Load with Custom Spinner"
          onClick={() => startLoading(true, false)}
          isDisabled={isLoading}
        />
        <Button
          caption="Load with No Spinner"
          onClick={() => startLoading(false, true)}
          isDisabled={isLoading}
          style={{ marginLeft: '12px' }}
        />
      </FlexCell>

      <div style={{
        position: 'relative',
        marginTop: '12px',
        border: '1px dashed grey',
        textAlign: 'center'
      }}>
        {/* 
          When loading, the content is null, so spacerHeight is necessary 
          to give the Blocker a body.
        */}
        {!isLoading && <Text>Content appears here after loading</Text>}

        <Blocker
          isEnabled={isLoading}
          spacerHeight={150}
          hideSpinner={hideAllSpinners}
          renderSpinner={() => showCustomSpinner && <CustomSpinner />}
        />
      </div>
    </FlexCell>
  );
}
```

## Best Practices
*   **Scope the Blocker:** For a better user experience, apply the `Blocker` to the specific part of the UI that is loading (e.g., a data table, a form panel) rather than the entire page, if possible. This informs the user exactly what is unavailable.
*   **Use `spacerHeight` for Empty Content:** When loading content into a container that is initially empty, use `spacerHeight` to prevent the `Blocker` from collapsing to zero height. This ensures the loading indicator is visible.
*   **Provide Feedback:** While you can hide the spinner with `hideSpinner`, it's generally best to provide some form of visual feedback. If the default spinner is hidden, consider using `renderSpinner` to show a custom loading animation or message so the user understands why the UI is not interactive.
*   **Accessibility:** The `Blocker` component automatically adds `aria-busy="true"` to the container when enabled, which is important for screen reader users. Ensure your application's focus management is handled correctly after the blocker is disabled.
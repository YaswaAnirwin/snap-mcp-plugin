# Alert Component

## Overview
The Alert component is used to display important messages that grab the user's attention without interrupting their work. These alerts are non-modal and can be used for success, warning, error, or informational messages. The component also comes in pre-configured variants like `SuccessAlert`, `WarningAlert`, `ErrorAlert`, and `HintAlert`.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to be displayed inside the alert. |
| `color` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Sets the visual style and color of the alert. |
| `actions` | `{ name: string; action: () => void; }[]` | - | An array of action objects to display as buttons within the alert. |
| `onClose` | `() => void` | - | Callback function that is triggered when the close button is clicked. Renders a close button on the alert. |
| `icon` | `Icon` | - | A custom icon to display on the left side of the alert. |
| `size` | `'36' \| '48'` | `'48'` | Defines the size of the alert component. |

## Usage Examples

### Basic Usage
The UUI library provides pre-configured alert components for different notification types.

```jsx
import React from 'react';
import { SuccessAlert, WarningAlert, ErrorAlert, HintAlert, Text } from '@epam/uui';

export default function BasicAlertExample() {
    return (
        <>
            <SuccessAlert>
                <Text size="30">Success notification</Text>
            </SuccessAlert>
            <WarningAlert>
                <Text size="30">Warning notification</Text>
            </WarningAlert>
            <ErrorAlert>
                <Text size="30">Error notification</Text>
            </ErrorAlert>
            <HintAlert>
                <Text size="30">Hint notification</Text>
            </HintAlert>
        </>
    );
}
```

### Advanced Usage with Actions and Closing
You can add actions and a close button to any alert.

```jsx
import React from 'react';
import { Alert, Text } from '@epam/uui';
import { ReactComponent as AccountIcon } from '@epam/assets/icons/common/action-account-24.svg';

export default function AdvancedAlertExample() {
    const alertActions = [
        { name: 'ACTION 1', action: () => console.log('Action 1 clicked') },
        { name: 'ACTION 2', action: () => console.log('Action 2 clicked') }
    ];

    return (
        <Alert
            icon={ AccountIcon }
            color="warning"
            onClose={ () => alert('close action') }
            actions={ alertActions }
        >
            <Text size="30">Custom Alert notification with actions</Text>
        </Alert>
    );
}
```

### Different Sizes
The `size` prop can be used to change the alert's dimensions.

```jsx
import React from 'react';
import { SuccessAlert, WarningAlert, Text } from '@epam/uui';

export default function AlertSizesExample() {
    return (
        <>
            {/* Small size alert */}
            <SuccessAlert
                size="36"
                onClose={() => alert('close action')}
            >
                <Text size="30">Success notification (size = 36)</Text>
            </SuccessAlert>

            {/* Default size alert */}
            <WarningAlert
                size="48"
                onClose={() => alert('close action')}
            >
                <Text size="30">Warning notification (default size = 48)</Text>
            </WarningAlert>
        </>
    );
}
```

## Best Practices
*   **Use Appropriate Colors:** Match the `color` of the alert to the nature of the message. Use `success` for positive feedback, `warning` for potential issues, `error` for failures, and `info` for neutral information.
*   **Keep Content Concise:** Alert messages should be brief and easy to understand at a glance.
*   **Provide Clear Actions:** If an alert requires user interaction, the `actions` should have clear and descriptive names.
*   **Use `onClose` for Dismissible Alerts:** Only include the `onClose` prop if the alert is meant to be dismissible by the user.
*   **Avoid Overuse:** Do not clutter the UI with too many alerts at once, as this can overwhelm the user. Prioritize the most important notifications.
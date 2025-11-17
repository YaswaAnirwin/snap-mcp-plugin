# NotificationCard and Notifications API

## Overview
UUI provides a robust system for displaying "toast" notifications. This system is composed of two main parts:
1.  The `NotificationCard` component, which is the visual representation of a single notification.
2.  The `uuiNotifications` service, which is an imperative API used to trigger and manage a queue of notifications.

Instead of rendering `<NotificationCard>` directly in your component tree, you should use the `uuiNotifications.show()` method, accessed via the `useUuiContext` hook. This service handles the positioning, queuing, and lifecycle of the notifications for you.

## Notifications API (`uuiNotifications`)

### `useUuiContext` Hook
This is the entry point to access the notifications API.

```jsx
import { useUuiContext } from '@epam/uui-core';

const { uuiNotifications } = useUuiContext();
```

### `uuiNotifications.show()` Method
This function displays a notification and returns a promise that resolves when an action is taken or the notification is closed.

| Parameter | Type | Description |
|-----------|------|-------------|
| `render` | `(props: INotification) => React.ReactNode` | A function that returns the `NotificationCard` component. It receives props to control the notification's state. **Required**. |
| `options` | `INotificationOptions` | An optional configuration object for the notification's behavior. |
| **Returns** | `Promise<TResult>` | A promise that resolves with the value passed to the `onSuccess` callback. |

### `INotification` (Props for the render function)
The props object passed to your `render` function.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | A unique ID for the notification. |
| `key` | `string` | A unique React key. |
| `onClose` | `() => void` | A function to close/dismiss the notification. |
| `onSuccess` | `(result: TResult) => void` | A function to close the notification and resolve the `show()` promise with a result. |

### `INotificationOptions` (Configuration for `show()`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `duration` | `number` | `5` | The time in seconds after which the notification will automatically close. Use `0` for a persistent notification. |
| `position` | `'top-right'` | `'top-right'` | The position on the screen where the notification will appear. |
| `color` | `'gray' \| 'blue' \| 'green' \| 'amber' \| 'red'` | `'gray'` | A shortcut to set the color of the `NotificationCard`. |

---

## `NotificationCard` Component API
This is the component you will return from the `render` function passed to `uuiNotifications.show()`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The main content/message of the notification. **Required**. |
| `color` | `'gray' \| 'blue' \| 'green' \| 'amber' \| 'red'` | `'gray'` | The color of the card, which also determines the default icon. |
| `onClose` | `() => void` | - | Callback to close the notification. This is provided by the `INotification` props. **Required**. |
| `actions` | `{ name: string; action: () => void; }[]` | `[]` | An array of action objects to render as buttons on the card. |
| `icon` | `IComponentIcon` | - | An icon to override the default icon associated with the `color`. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows passing any standard HTML attributes to the root `div` element. |

## Usage Examples

### Basic Success Notification
This example shows how to trigger a simple, auto-dismissing success notification.

```jsx
import React from 'react';
import { Button, NotificationCard, Text } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

export default function BasicNotificationExample() {
    const { uuiNotifications } = useUuiContext();

    const showSuccessToast = () => {
        uuiNotifications.show(
            // The render function receives props from the service
            (props) => (
                <NotificationCard { ...props } color="green">
                    <Text>Your changes have been saved successfully!</Text>
                </NotificationCard>
            ),
            // Options object
            { duration: 3 } // Auto-dismiss after 3 seconds
        );
    };

    return <Button caption="Save Changes" onClick={ showSuccessToast } />;
}
```

### Advanced Error Notification with Actions
This example shows a persistent error notification with user actions. The `show()` method's promise is used to handle the result of the "Undo" action.

```jsx
import React from 'react';
import { Button, NotificationCard, Text } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

export default function AdvancedNotificationExample() {
    const { uuiNotifications } = useUuiContext();

    const deleteItem = () => {
        console.log('Item deleted.');

        uuiNotifications.show(
            (props) => (
                <NotificationCard
                    { ...props }
                    color="amber" // Amber is often used for undoable actions
                    actions={[
                        // The action calls props.onSuccess to resolve the promise
                        { name: 'Undo', action: () => props.onSuccess('undone') },
                    ]}
                >
                    <Text>The item has been deleted.</Text>
                </NotificationCard>
            ),
            { duration: 0 } // Persistent until closed or action is taken
        ).then(result => {
            if (result === 'undone') {
                console.log('Delete operation has been undone.');
                // Here you would add your logic to restore the item
            }
        });
    };

    return <Button caption="Delete Item" onClick={ deleteItem } color="red" />;
}
```

## Best Practices
*   **Use the Imperative API:** Always use `uuiNotifications.show()` to create notifications. This ensures they are managed correctly in the application's layout and lifecycle.
*   **Choose the Right Color:**
    *   `green`: For success messages.
    *   `red`: For errors or critical failures.
    *   `amber`: For warnings or undoable actions.
    *   `blue`: For informational messages.
    *   `gray`: For neutral or general information.
*   **Keep Messages Concise:** Notification text should be short and to the point. For more detailed information, link to another page or modal.
*   **Actionable Notifications:** When an action can be taken in response to a notification (e.g., "Undo", "Retry", "View Details"), provide it in the `actions` array. This greatly improves user experience.
*   **Auto-Dismissal:** Use `duration` to automatically dismiss simple informational or success notifications. For critical errors or messages with actions, it's often better to make them persistent (`duration: 0`) so the user has time to react.

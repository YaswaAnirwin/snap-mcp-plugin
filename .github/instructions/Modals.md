# Modals

## Overview
The UUI modal system provides a powerful, imperative API to display modal dialogs. Instead of declaratively rendering a `<Modal>` component in your JSX, you call a service function to open a modal. This approach simplifies state management for modals, especially when they need to be triggered from deep within your application logic (e.g., after a data request).

The system is accessed via the `useUuiContext` hook, which provides the `uuiModals` service. This service's `show()` method returns a promise that resolves or rejects when the user closes the modal, making it easy to handle modal results asynchronously.

## API Reference

### `useUuiContext` Hook
This is the entry point to access the modals API.

```jsx
import { useUuiContext } from '@epam/uui-core';

const { uuiModals } = useUuiContext();
```

### `uuiModals.show()` Method
This function opens a modal and returns a promise.

| Parameter | Type | Description |
|-----------|------|-------------|
| `render` | `(props: IModalRenderProps<TResult>) => React.ReactNode` | A function that returns the React elements to be rendered inside the modal. It receives props to control the modal's state. **Required**. |
| `props` | `IModalProps` | An optional configuration object for the modal's appearance and behavior. |
| **Returns** | `Promise<TResult>` | A promise that resolves with the value passed to the `success` callback, or rejects if the `abort` callback is called or the modal is closed by other means (ESC key, overlay click). |

### `IModalRenderProps<TResult>`
The props object passed to your `render` function.

| Property | Type | Description |
|----------|------|-------------|
| `success` | `(result: TResult) => void` | A function to close the modal and resolve the promise with a result. |
| `abort` | `() => void` | A function to close the modal and reject the promise. |
| `zIndex` | `number` | The z-index of the modal. This should be passed to the `ModalBlocker` component. |

### `IModalProps`
The configuration object passed as the second argument to `uuiModals.show()`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | - | A unique key for the modal. |
| `zIndex` | `number` | `1000` | The base z-index for the modal. |
| `width` | `number \| 'auto'` | `480` | The width of the modal window in pixels. |
| `height` | `number \| 'auto'` | `'auto'` | The height of the modal window. |
| `disableCloseByEsc` | `boolean` | `false` | If `true`, pressing the Escape key will not close the modal. |
| `disableCloseByClickOutside` | `boolean` | `false` | If `true`, clicking the overlay will not close the modal. |

## Modal Components
These are the building blocks used inside the `render` function to construct your modal.

*   **`ModalBlocker`**: The full-screen overlay that blocks interaction with the page content. It requires the `zIndex` and `abort` props from the render function.
*   **`ModalWindow`**: The container for your modal's content.
*   **`ModalHeader`**: The header section, which typically contains a title and a close button.
*   **`ModalBody`**: The main content area of the modal.
*   **`ModalFooter`**: The footer section, typically used for action buttons like "Save", "Confirm", or "Cancel".

## Usage Examples

### Basic Confirmation Dialog
This example shows how to open a simple "Are you sure?" dialog and wait for the user's response using `async/await`.

```jsx
import React from 'react';
import { Button, ModalBlocker, ModalWindow, ModalHeader, ModalBody, ModalFooter, FlexRow } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

export default function ConfirmModalExample() {
    const { uuiModals } = useUuiContext();

    const showConfirmationModal = async () => {
        try {
            // The promise resolves with `true` if 'Confirm' is clicked
            const result = await uuiModals.show<boolean>(
                (props) => (
                    <ModalBlocker { ...props }>
                        <ModalWindow>
                            <ModalHeader title="Confirm Action" onClose={ props.abort } />
                            <ModalBody>
                                <p>Are you sure you want to proceed with this action?</p>
                            </ModalBody>
                            <ModalFooter>
                                <FlexRow spacing='12'>
                                    {/* Abort rejects the promise */}
                                    <Button caption="Cancel" onClick={ props.abort } color='gray50' />
                                    {/* Success resolves the promise with the provided value */}
                                    <Button caption="Confirm" onClick={ () => props.success(true) } color='green' />
                                </FlexRow>
                            </ModalFooter>
                        </ModalWindow>
                    </ModalBlocker>
                )
            );

            if (result) {
                alert('Action Confirmed!');
            }
        } catch {
            alert('Action Canceled.');
        }
    };

    return <Button caption="Show Confirmation" onClick={ showConfirmationModal } />;
}
```

### Modal with a Form
This example demonstrates opening a modal with a form to collect user data. The promise resolves with the form data upon successful submission.

```jsx
import React from 'react';
import { Button, ModalBlocker, ModalWindow, ModalHeader, ModalBody, ModalFooter, FlexRow, Form, LabeledInput, TextInput } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

interface UserData {
    name: string;
    email: string;
}

export default function FormModalExample() {
    const { uuiModals } = useUuiContext();

    const openFormModal = async () => {
        try {
            // The promise will resolve with the UserData object on success
            const userData = await uuiModals.show<UserData>((props) => (
                <ModalBlocker { ...props }>
                    <Form<UserData>
                        onSave={ (data) => Promise.resolve(props.success(data)) } // On save, resolve the modal promise
                        renderForm={ ({ lens, save, isInvalid }) => (
                            <ModalWindow>
                                <ModalHeader title="Enter Your Details" onClose={ props.abort } />
                                <ModalBody>
                                    <LabeledInput label="Name" { ...lens.prop('name').toProps() }>
                                        <TextInput placeholder="John Doe" { ...lens.prop('name').toProps() } />
                                    </LabeledInput>
                                    <LabeledInput label="Email" { ...lens.prop('email').toProps() }>
                                        <TextInput placeholder="example@epam.com" { ...lens.prop('email').toProps() } />
                                    </LabeledInput>
                                </ModalBody>
                                <ModalFooter>
                                    <Button caption="Cancel" onClick={ props.abort } color='gray50' />
                                    <Button caption="Save" onClick={ save } isDisabled={ isInvalid } color='green' />
                                </ModalFooter>
                            </ModalWindow>
                        )}
                    />
                </ModalBlocker>
            ));

            alert(`User saved: ${userData.name} (${userData.email})`);
        } catch {
            alert('Form canceled.');
        }
    };

    return <Button caption="Open Form Modal" onClick={ openFormModal } />;
}
```

## Best Practices
*   **Handle Promises:** Always handle the promise returned by `uuiModals.show()`. Use `async/await` in a `try...catch` block or use `.then().catch()` to manage both success and abort scenarios.
*   **Use for Focused Tasks:** Modals are best for tasks that require the user's full attention and must be completed or dismissed before they can continue, such as confirming a destructive action or filling out a short, critical form.
*   **Provide Clear Exits:** Always give users a clear and obvious way to close the modal. This includes a "Cancel" or "Close" button (which should call `abort`) and the 'X' icon in the `ModalHeader` (which calls `onClose`, also typically `abort`).
*   **Keep it Simple:** Avoid overly complex content or workflows within a single modal. If a task is too complex, consider using a dedicated page instead.
*   **Accessibility:** The UUI modal system automatically handles focus trapping, so the user cannot tab to elements outside the modal. Ensure all interactive elements inside your modal are accessible.

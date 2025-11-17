# Form Component

## Overview
The `Form` component is a container that simplifies form state management, validation, and submission. It works seamlessly with various UUI input components, providing a robust way to handle user input and data persistence.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `T` | - | An object representing the form's data. |
| `onSave` | `(value: T) => Promise<any>` | - | A callback function that is triggered when the form is submitted. It should return a promise that resolves when the save operation is complete. |
| `onSuccess` | `(result: any) => void` | - | A callback function that is triggered when the `onSave` promise resolves successfully. |
| `onError` | `(error: any) => void` | - | A callback function that is triggered when the `onSave` promise is rejected. |
| `renderForm` | `(props: IFormApi<T>) => React.ReactNode` | - | A render function that receives form props and should return the form's body. |
| `getMetadata` | `(value: T) => Metadata<T>` | - | A function that returns metadata for the form fields, including validation rules. |
| `settings` | `IFormSettings` | - | Configuration object for the form's behavior, such as when to validate fields. |

### IFormApi<T>

The `renderForm` function receives an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `lens` | `Lens<T>` | A lens object to bind form fields to the form's state. |
| `save` | `() => void` | A function to manually trigger the form's save action. |
| `undo` | `() => void` | A function to revert the form to its last saved state. |
| `redo` | `() => void` | A function to re-apply changes that were undone. |
| `revert` | `() => void` | A function to revert all changes to their initial state. |
| `isInvalid` | `boolean` | `true` if the form has validation errors. |
| `isChanged` | `boolean` | `true` if the form has unsaved changes. |
| `isInProgress` | `boolean` | `true` if the form is currently saving. |

## Usage Examples

### Basic Usage
Here's a simple example of a login form with two text inputs and a submit button.

```jsx
import React from 'react';
import { Form, TextInput, Button, Panel, FlexRow, FlexSpacer } from '@epam/uui';

interface LoginForm {
    email?: string;
    password?: string;
}

export default function BasicFormExample() {
    return (
        <Form<LoginForm>
            onSave={ (value) => Promise.resolve({ /* send data to server */ }) }
            onSuccess={ () => alert('Login successful!') }
            renderForm={ ({ lens, save, isInvalid }) => (
                <Panel>
                    <FlexRow>
                        <TextInput
                            { ...lens.prop('email').toProps() }
                            placeholder="Email"
                        />
                    </FlexRow>
                    <FlexRow>
                        <TextInput
                            { ...lens.prop('password').toProps() }
                            type="password"
                            placeholder="Password"
                        />
                    </FlexRow>
                    <FlexRow>
                        <FlexSpacer />
                        <Button
                            caption="Login"
                            onClick={ save }
                            isDisabled={ isInvalid }
                        />
                    </FlexRow>
                </Panel>
            ) }
        />
    );
}
```

### Advanced Usage with Validation

This example demonstrates how to add validation to the form fields using the `getMetadata` prop.

```jsx
import React from 'react';
import { Form, TextInput, Button, Panel, FlexRow, FlexSpacer } from '@epam/uui';
import { Metadata } from '@epam/uui-core';

interface UserForm {
    name?: string;
    email?: string;
}

export default function ValidationFormExample() {
    const userMetadata: Metadata<UserForm> = {
        props: {
            name: { isRequired: true },
            email: {
                isRequired: true,
                validators: [
                    (value: string) => !value.includes('@') && ['Please enter a valid email'],
                ],
            },
        },
    };

    return (
        <Form<UserForm>
            onSave={ (value) => Promise.resolve({ /* save user data */ }) }
            onSuccess={ () => alert('User saved!') }
            getMetadata={ () => userMetadata }
            renderForm={ ({ lens, save, isInvalid }) => (
                <Panel>
                    <FlexRow>
                        <TextInput
                            { ...lens.prop('name').toProps() }
                            placeholder="Name"
                        />
                    </FlexRow>
                    <FlexRow>
                        <TextInput
                            { ...lens.prop('email').toProps() }
                            placeholder="Email"
                        />
                    </FlexRow>
                    <FlexRow>
                        <FlexSpacer />
                        <Button
                            caption="Save"
                            onClick={ save }
                            isDisabled={ isInvalid }
                        />
                    </FlexRow>
                </Panel>
            ) }
        />
    );
}
```

## Best Practices
*   **Centralized State:** Use the `Form` component to manage the state of all related inputs in one place.
*   **Validation:** Always provide validation rules through the `getMetadata` prop to ensure data integrity and a good user experience.
*   **User Feedback:** Use the `onSuccess` and `onError` callbacks to provide clear feedback to the user about the result of their submission.
*   **Disabling Submit:** The `isInvalid` prop from `renderForm` should be used to disable the submit button to prevent invalid data submissions.
*   **Lens API:** The `lens` object is a powerful tool for binding inputs to the form state. Use `lens.prop('fieldName').toProps()` to easily spread all necessary props to a UUI input component.

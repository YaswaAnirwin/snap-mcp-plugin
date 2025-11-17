# LinkButton Component

## Overview
The `LinkButton` component renders a button that is styled to look like a hyperlink. It is ideal for secondary or tertiary actions, navigation links, or actions placed within blocks of text where a standard button would be too visually prominent.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `string` | - | The text content to be displayed within the button. This is a **required** prop. |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement \| HTMLAnchorElement>) => void` | - | Callback function triggered when the button is clicked. |
| `href` | `string` | - | If provided, the component will be rendered as an `<a>` tag with this URL. This is recommended for actual navigation. |
| `isDisabled` | `boolean` | `false` | If `true`, the button will be disabled and non-interactive. |
| `size` | `'30' \| '36' \| '42' \| '48'` | `'36'` | Defines the size of the component, affecting the font size and padding. |
| `icon` | `IComponentIcon` | - | An optional icon to be displayed next to the caption. |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Determines the position of the icon relative to the caption. |
| `rawProps` | `React.HTMLAttributes<HTMLButtonElement \| HTMLAnchorElement>` | - | Allows passing any standard HTML attributes to the root element, e.g., `target="_blank"`. |

## Usage Examples

### Basic Usage
A simple `LinkButton` that triggers an action on click. It renders as a `<button>` element because no `href` is provided.

```jsx
import React from 'react';
import { LinkButton } from '@epam/uui';

export default function BasicLinkButtonExample() {
    return (
        <LinkButton
            caption="Clear Filters"
            onClick={ () => alert('Filters cleared!') }
        />
    );
}
```

### Advanced Usage

#### LinkButton as a Hyperlink
By providing the `href` prop, the component renders as an `<a>` tag, which is the correct semantic element for navigation.

```jsx
import React from 'react';
import { LinkButton, FlexRow } from '@epam/uui';
import { ReactComponent as ExternalLinkIcon } from '@epam/assets/icons/common/action-external-link-18.svg';

export default function LinkButtonAsAnchorExample() {
    return (
        <FlexRow spacing='18'>
            <LinkButton
                caption="Visit EPAM Website"
                href="https://www.epam.com"
                // Use rawProps to add standard anchor attributes like target
                rawProps={{ target: '_blank' }}
            />
            <LinkButton
                caption="External Link with Icon"
                href="https://www.uui.epam.com"
                icon={ ExternalLinkIcon }
                iconPosition="right"
                rawProps={{ target: '_blank' }}
            />
        </FlexRow>
    );
}
```

#### LinkButton with Icons and Disabled State
You can add icons and disable the `LinkButton` just like a standard `Button`.

```jsx
import React from 'react';
import { LinkButton, FlexRow } from '@epam/uui';
import { ReactComponent as NextIcon } from '@epam/assets/icons/common/navigation-arrow-right-18.svg';
import { ReactComponent as PrevIcon } from '@epam/assets/icons/common/navigation-arrow-left-18.svg';

export default function LinkButtonStatesExample() {
    return (
        <FlexRow spacing='18'>
            {/* Icon on the left */}
            <LinkButton
                caption="Previous"
                onClick={() => {}}
                icon={ PrevIcon }
                iconPosition="left"
            />
            {/* Icon on the right */}
            <LinkButton
                caption="Next"
                onClick={() => {}}
                icon={ NextIcon }
                iconPosition="right"
            />
            {/* Disabled LinkButton */}
            <LinkButton
                caption="Cannot Proceed"
                onClick={() => {}}
                isDisabled={ true }
            />
        </FlexRow>
    );
}
```

## Best Practices
*   **Semantic HTML:** Use the `href` prop for actual navigation. This renders an `<a>` tag, which is semantically correct and provides users with expected browser functionality (e.g., right-click to open in a new tab). Use the `onClick` prop for in-page actions that don't change the URL.
*   **Clarity:** The `caption` should clearly describe the action or destination. Avoid ambiguous text like "Click Here."
*   **Placement:** `LinkButton` is effective for secondary actions. For the primary call-to-action on a page, a standard `Button` is usually more appropriate as it has greater visual weight.
*   **Accessibility:** When using `href`, the link's purpose is clear. When using `onClick`, ensure the action is perceivable to all users. The component is keyboard-navigable and screen-reader-friendly by default.

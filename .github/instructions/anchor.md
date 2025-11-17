# Anchor Component

## Overview
The Anchor component is used to create hyperlinks, allowing users to navigate to different pages or resources. It can be used for both external URLs and internal application routes. It's styled to fit seamlessly with other UUI components and can contain text, icons, or other custom elements.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to be displayed inside the anchor. Can be text or any React node. |
| `href` | `string` | - | The URL to navigate to when the anchor is clicked. Use for external links. |
| `link` | `Link` | - | An object for client-side routing, typically with `pathname` and `query` properties. |
| `target` | `string` | - | Specifies where to open the linked document (e.g., `_blank`, `_self`). |
| `isDisabled` | `boolean` | `false` | If true, the anchor is disabled and cannot be clicked. |
| `onClick` | `(e: React.MouseEvent) => void` | - | Callback function triggered when the anchor is clicked. |
| `rawProps` | `React.HTMLAttributes<HTMLAnchorElement>` | - | Allows passing any standard HTML anchor attributes to the underlying `<a>` element. |

## Usage Examples

### Basic Text Link
This example shows how to create a simple text link within a paragraph.

```jsx
import React from 'react';
import { Anchor, RichTextView } from '@epam/uui';

export default function AnchorInTextExample() {
    return (
        <RichTextView>
            <p>
                This is a sample text with a link to the{' '}
                <Anchor href="https://uui.epam.com/">UUI documentation</Anchor>.
            </p>
        </RichTextView>
    );
}
```

### Link with Icon
The Anchor component can wrap other components, like an `IconContainer`, to create clickable icons.

```jsx
import React from 'react';
import { Anchor, FlexRow, IconContainer, Panel, Text } from '@epam/uui';
import { ReactComponent as ReactIcon } from '@epam/assets/icons/common/social-network-react-18.svg';

export default function IconLinkExample() {
    return (
        <Panel style={{ padding: '12px' }}>
            <FlexRow spacing="6">
                <Text>Visit the ReactJS website:</Text>
                <Anchor 
                    href="https://reactjs.org/" 
                    target="_blank"
                    rawProps={{ 'aria-label': 'ReactJS Website' }}
                >
                    <IconContainer icon={ReactIcon} />
                </Anchor>
            </FlexRow>
        </Panel>
    );
}
```

### Internal Navigation
For navigating within a single-page application (SPA), use the `link` prop instead of `href`.

```jsx
import React from 'react';
import { Anchor, Text } from '@epam/uui';

export default function InternalLinkExample() {
    // This assumes you have a router that can handle this link object structure.
    const internalLink = { pathname: '/profile', query: { user: '123' } };

    return (
        <Text>
            Go to user <Anchor link={internalLink}>Profile Page</Anchor>.
        </Text>
    );
}
```

### Disabled Link
A disabled anchor is not interactive and is visually styled to indicate its state.

```jsx
import React from 'react';
import { Anchor, Text } from '@epam/uui';

export default function DisabledLinkExample() {
    return (
        <Text>
            You cannot visit this <Anchor href="https://uui.epam.com/" isDisabled={true}>disabled link</Anchor>.
        </Text>
    );
}
```

## Best Practices
*   **External vs. Internal Links:** Use the `href` prop for navigating to external websites. For internal navigation within your application, use the `link` prop to enable client-side routing without a full page reload.
*   **Accessibility:** When an anchor contains non-textual content like an icon, always provide a descriptive `aria-label` via `rawProps` for screen readers.
*   **Disabling Links:** Use the `isDisabled` prop to prevent navigation. Avoid simply removing the `href` or `link` prop, as this can lead to inconsistent behavior and styling.
*   **Wrapping Content:** The `Anchor` component can wrap any valid React node. This is useful for making complex cards, images, or custom components clickable.
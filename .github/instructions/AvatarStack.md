# AvatarStack Component

## Overview
The `AvatarStack` component is used to display a series of `Avatar` components in a stacked, overlapping fashion. It's useful for showing a list of users or participants, with an option to limit the number of visible avatars and show a count of the remainder.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `avatarSize` | `'24' \| '36' \| '48' \| '144'` | - | **Required.** The size of each avatar in the stack. |
| `urlArray` | `string[]` | - | **Required.** An array of image URLs to be displayed as avatars. |
| `direction` | `'right' \| 'left'` | `'right'` | The direction in which the avatars are stacked. |
| `avatarsCount` | `number` | - | The maximum number of avatars to display. If the `urlArray` length is greater, a counter with the remaining number will be shown. |
| `renderItem` | `(url: string) => React.ReactElement<any>` | - | A custom render function for each avatar. This allows for adding custom wrappers, tooltips, or other elements. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Standard HTML attributes to be applied to the root `div` element. |

## Usage Examples

### Basic Usage
This example shows a default `AvatarStack` displaying a limited number of avatars from an array.

```jsx
import React from 'react';
import { AvatarStack, FlexRow } from '@epam/uui';

// Array of avatar image URLs
const avatarUrls = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=1&radius=50&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=2&radius=50&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=3&radius=50&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=4&radius=50&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=5&radius=50&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=6&radius=50&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=7&radius=50&backgroundColor=b6e3f4',
];

export default function BasicAvatarStackExample() {
  return (
    <FlexRow>
      <AvatarStack
        urlArray={avatarUrls}
        avatarsCount={5} // Show 5 avatars and a counter for the rest (+2)
        direction='right'
        avatarSize='36'
      />
    </FlexRow>
  );
}
```

### Advanced Usage with Custom Rendering
This example uses the `renderItem` prop to wrap each `Avatar` in a `Tooltip` component, showing a custom message on hover.

```jsx
import React from 'react';
import { AvatarStack, Avatar, Tooltip, FlexRow } from '@epam/uui';

const teamMembers = [
  { id: 1, name: 'John Doe', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1&radius=50&backgroundColor=b6e3f4' },
  { id: 2, name: 'Jane Smith', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2&radius=50&backgroundColor=b6e3f4' },
  { id: 3, name: 'Peter Jones', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=3&radius=50&backgroundColor=b6e3f4' },
];

export default function CustomRenderAvatarStackExample() {
  return (
    <FlexRow>
      <AvatarStack
        urlArray={teamMembers.map(member => member.img)}
        avatarSize='48'
        direction='left'
        // Use renderItem to add a Tooltip to each avatar
        renderItem={(url, index) => {
          const member = teamMembers[index];
          return (
            <Tooltip content={member.name} placement='bottom'>
              <Avatar
                key={member.id}
                img={url}
                size='48'
                alt={member.name}
              />
            </Tooltip>
          );
        }}
      />
    </FlexRow>
  );
}
```

## Best Practices
- **Performance:** For very large lists, use the `avatarsCount` prop to limit the number of rendered DOM elements and maintain good performance.
- **Accessibility:** When using `renderItem` to create custom avatars, ensure you provide meaningful `alt` text or other accessibility attributes for screen readers.
- **UI Consistency:** Use a consistent `avatarSize` across your application where `AvatarStack` is implemented to maintain a uniform look and feel.
- **Tooltips:** The `renderItem` prop is ideal for adding tooltips to individual avatars, providing users with more context, such as names or statuses.

## Important Notes
- The component calculates the negative overlap of avatars automatically based on the `avatarSize` prop (specifically, `-${avatarSize / 4}px`).
- If `avatarsCount` is not provided, the component will render all avatars from the `urlArray`. Be mindful of this when dealing with a large number of items.
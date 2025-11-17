# Avatar Component

## Overview
The Avatar component is used to display a user's profile picture. If an image is not available or fails to load, it gracefully falls back to displaying the user's initials or a default icon. It's commonly used in user profiles, navigation bars, comments, and lists.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `img` | `string` | - | The URL of the image to be displayed. |
| `size` | `'12' \| '18' \| '24' \| '30' \| '36' \| '42' \| '48' \| '54' \| '60' \| '72' \| '96' \| '120'` | `'48'` | The size of the avatar in pixels. |
| `alt` | `string` | `''` | Alternative text for the image, important for accessibility. |
| `onClick` | `(e: React.MouseEvent) => void` | - | Callback function triggered when the avatar is clicked. |
| `href` | `string` | - | If provided, the avatar will be rendered as an anchor (`<a>`) tag. |
| `...IHasRawProps<HTMLDivElement>` | | | Allows passing any standard HTML attributes to the root element. |

## Usage Examples

### Basic Usage
A standard avatar with a specified image source and size.

```jsx
import React from 'react';
import { Avatar } from '@epam/uui';

export default function BasicAvatarExample() {
    return (
        <Avatar
            alt='John Doe'
            img='https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
            size='48'
        />
    );
}
```

### Fallback to Initials
If the `img` prop is not provided or the image fails to load, the component will display the first letters of the `alt` text.

```jsx
import React from 'react';
import { Avatar, FlexRow } from '@epam/uui';

export default function FallbackAvatarExample() {
    return (
        <FlexRow spacing='18'>
            {/* Avatar with no image source */}
            <Avatar
                alt='John Doe'
                size='48'
            />
            {/* Avatar with a broken image link */}
            <Avatar
                alt='Jane Smith'
                img='path/to/non-existent/image.jpg'
                size='48'
            />
        </FlexRow>
    );
}
```

### Different Sizes
The `size` prop can be used to control the dimensions of the avatar.

```jsx
import React from 'react';
import { Avatar, FlexRow } from '@epam/uui';

export default function AvatarSizesExample() {
    const imgUrl = 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg';
    return (
        <FlexRow alignItems='center' spacing='18'>
            <Avatar alt='Small' img={imgUrl} size='24' />
            <Avatar alt='Medium' img={imgUrl} size='48' />
            <Avatar alt='Large' img={imgUrl} size='72' />
            <Avatar alt='Extra Large' img={imgUrl} size='96' />
        </FlexRow>
    );
}
```

### Clickable Avatar
You can make an avatar interactive by adding an `onClick` handler or an `href` to turn it into a link.

```jsx
import React from 'react';
import { Avatar, FlexRow } from '@epam/uui';

export default function ClickableAvatarExample() {
    const imgUrl = 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg';
    return (
        <FlexRow spacing='18'>
            {/* Avatar with an onClick handler */}
            <Avatar
                alt='Click Me'
                img={imgUrl}
                size='48'
                onClick={() => alert('Avatar clicked!')}
            />
            {/* Avatar as a link */}
            <Avatar
                alt='Link to Profile'
                img={imgUrl}
                size='48'
                href='/profile'
            />
        </FlexRow>
    );
}
```

## Best Practices
*   **Provide `alt` Text:** Always include a descriptive `alt` prop. It's crucial for accessibility and provides the content for the initials fallback.
*   **Optimize Images:** Use images that are appropriately sized for the avatar dimensions to improve loading performance.
*   **Consistent Sizing:** Use a consistent set of sizes throughout your application to maintain visual harmony.
*   **Use as a Link:** When an avatar represents a user and links to their profile, use the `href` prop for correct semantic HTML and accessibility.
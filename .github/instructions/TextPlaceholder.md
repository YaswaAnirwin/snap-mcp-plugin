# TextPlaceholder Component

## Overview
The `TextPlaceholder` component, often referred to as a "skeleton loader" or "shimmer," is used to indicate that text content is in the process of loading. It renders gray, text-like shapes that mimic the structure of the final content.

This approach provides a better user experience than a traditional spinner because it gives a sense of what the layout will look like, reduces layout shift when the content arrives, and makes the application feel faster and more responsive.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `wordsCount` | `number` | `5` | The approximate number of "word" blocks to render in a single line. The actual number may vary slightly to create a more natural, ragged look. |
| `isAnimated` | `boolean` | `true` | If true, a subtle shimmering animation is applied across the placeholder to visually indicate that a process is active. |
| `cx` | `IHasCX` | - | Allows adding custom CSS class names to the component's root element for custom styling. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows adding standard HTML attributes to the root `div` element. |

## Usage Examples

### Basic Usage
A simple, single-line placeholder with the default number of words.

```jsx
import React from 'react';
import { TextPlaceholder } from '@uui/components';

export default function BasicPlaceholderExample() {
    return <TextPlaceholder />;
}
```

### Multi-line Paragraph Placeholder
You can simulate a paragraph of text by stacking multiple `TextPlaceholder` components and varying the `wordsCount`.

```jsx
import React from 'react';
import { TextPlaceholder } from '@uui/components';

export default function ParagraphPlaceholderExample() {
    return (
        <div>
            <TextPlaceholder wordsCount={8} />
            <TextPlaceholder wordsCount={12} />
            <TextPlaceholder wordsCount={10} />
            <TextPlaceholder wordsCount={4} />
        </div>
    );
}
```

### Advanced Usage: Conditional Rendering During Data Fetching
This is the primary use case for `TextPlaceholder`. It is displayed conditionally while data is being fetched from an API. Once the data is available, the placeholder is replaced with the actual content.

```jsx
import React, { useState, useEffect } from 'react';
import { TextPlaceholder } from '@uui/components';

// Mock function to simulate fetching data from an API
const fetchUserProfile = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                name: 'Jane Doe',
                bio: 'A software developer who loves creating intuitive user interfaces with React and UUI.'
            });
        }, 2500); // Simulate a 2.5-second network delay
    });
};

export default function ProfileCard() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile().then(data => {
            setUser(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '300px' }}>
            {isLoading ? (
                <>
                    {/* Placeholder for the user's name (a short heading) */}
                    <TextPlaceholder wordsCount={3} />
                    {/* Placeholder for the user's bio (a paragraph) */}
                    <div style={{ marginTop: '12px' }}>
                        <TextPlaceholder wordsCount={10} />
                        <TextPlaceholder wordsCount={8} />
                    </div>
                </>
            ) : (
                <div>
                    <h3 style={{ margin: 0 }}>{user.name}</h3>
                    <p style={{ marginTop: '12px' }}>{user.bio}</p>
                </div>
            )}
        </div>
    );
}
```

## Best Practices and Warnings

### **Mimic the Final Layout**
The most effective skeleton loaders are those that closely match the shape and structure of the content they are replacing.
*   Use a short `TextPlaceholder` for a heading.
*   Use multiple `TextPlaceholder` instances for a paragraph.
*   Combine `TextPlaceholder` with other skeleton components (e.g., for avatars, images) to build a complete loading state for your UI. This prevents the page layout from shifting when the real content loads.

### **Accessibility**
The `TextPlaceholder` is a purely visual and decorative component. It provides no information to users of assistive technologies like screen readers. To prevent confusion, the component automatically adds `aria-hidden="true"` to its root element, so it is ignored by screen readers.

### **Use for Asynchronous Operations**
Placeholders are designed for asynchronous operations that have a noticeable delay (typically > 300-500ms). For very fast operations, showing and then quickly hiding a placeholder can cause an unpleasant "flicker." In such cases, it might be better to show nothing until the content is ready.

### **Animation**
The default shimmer animation (`isAnimated={true}`) is highly recommended as it clearly communicates that the application is active and processing, not frozen.
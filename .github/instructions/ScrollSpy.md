# ScrollSpy Component

## Overview
The `ScrollSpy` component is a powerful utility that tracks the scroll position of the viewport (or a scrollable container) and identifies which content section is currently visible. It's commonly used to automatically highlight the corresponding link in a navigation menu, such as a table of contents, as the user scrolls through the page.

This component does not render any visible UI itself. Instead, it monitors scroll activity and provides the ID of the currently active element through a callback.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `elements` | `string[]` | `[]` | An array of the `id` attributes of the DOM elements you want to track. The order of IDs in the array should match the order of the elements in the DOM. |
| `onActiveChange` | `(id: string \| null) => void` | - | A callback function that is invoked whenever a new element becomes active. It receives the `id` of the active element, or `null` if no element is active. |
| `offset` | `number` | `0` | A pixel value to offset the scroll position for determining the active element. A negative value (e.g., `-100`) is useful when you have a fixed header, ensuring the element is highlighted only when it's below the header. |
| `containerId` | `string` | - | The `id` of a specific scrollable container element to monitor. If not provided, `ScrollSpy` will monitor the main browser window's scroll events. |

## Usage Examples

### Basic Usage
This example shows how to create a simple navigation menu that highlights the link corresponding to the section currently in the viewport.

```jsx
import React, { useState } from 'react';
import { ScrollSpy } from '@uui/components';
import { Link } from '@uui/components'; // Assuming a UUI Link component

const sections = [
    { id: 'section-1', title: 'First Section' },
    { id: 'section-2', title: 'Second Section' },
    { id: 'section-3', title: 'Third Section' },
];

export default function BasicScrollSpyExample() {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <div>
            {/* The ScrollSpy component tracks the elements and updates the state */}
            <ScrollSpy
                elements={sections.map(s => s.id)}
                onActiveChange={setActiveSection}
            />

            {/* The navigation menu uses the state to highlight the active link */}
            <nav style={{ position: 'fixed', top: '20px', left: '20px' }}>
                <h4>Table of Contents</h4>
                {sections.map(section => (
                    <Link
                        key={section.id}
                        href={`#${section.id}`}
                        // Apply an 'active' style if the section is the active one
                        color={activeSection === section.id ? 'primary' : 'secondary'}
                        style={{ display: 'block', margin: '5px 0' }}
                    >
                        {section.title}
                    </Link>
                ))}
            </nav>

            {/* The content sections that ScrollSpy is tracking */}
            <main style={{ marginLeft: '200px' }}>
                {sections.map(section => (
                    <div key={section.id} id={section.id} style={{ height: '800px', border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
                        <h2>{section.title}</h2>
                        <p>Scroll down to see the next section...</p>
                    </div>
                ))}
            </main>
        </div>
    );
}
```

### Advanced Usage with Offset for Fixed Header
A common use case is a fixed header that covers the top portion of the page. The `offset` prop ensures that a section is only considered "active" when it appears just below the header.

```jsx
import React, { useState } from 'react';
import { ScrollSpy } from '@uui/components';
import { Link } from '@uui/components';

const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'features', title: 'Features' },
    { id: 'pricing', title: 'Pricing' },
    { id: 'contact', title: 'Contact Us' },
];

const HEADER_HEIGHT = 60; // The height of our fixed header

export default function OffsetScrollSpyExample() {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <div>
            {/* The ScrollSpy component with a negative offset */}
            <ScrollSpy
                elements={sections.map(s => s.id)}
                onActiveChange={setActiveSection}
                offset={-HEADER_HEIGHT} // Highlight when the section is 60px below the top
            />

            {/* A fixed header */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: `${HEADER_HEIGHT}px`, background: '#f0f0f0', borderBottom: '1px solid #ddd', zIndex: 100, padding: '0 20px', display: 'flex', alignItems: 'center' }}>
                <h3>My Website</h3>
            </header>

            <div style={{ display: 'flex', paddingTop: `${HEADER_HEIGHT}px` }}>
                {/* The navigation menu */}
                <nav style={{ position: 'fixed', top: `${HEADER_HEIGHT}px`, left: '20px', width: '180px' }}>
                    <h4>Contents</h4>
                    {sections.map(section => (
                        <Link
                            key={section.id}
                            href={`#${section.id}`}
                            color={activeSection === section.id ? 'primary' : 'secondary'}
                            style={{ display: 'block', margin: '10px 0' }}
                        >
                            {section.title}
                        </Link>
                    ))}
                </nav>

                {/* The content sections */}
                <main style={{ marginLeft: '220px', flex: 1 }}>
                    {sections.map(section => (
                        <section key={section.id} id={section.id} style={{ height: '600px', padding: '20px' }}>
                            <h2>{section.title}</h2>
                        </section>
                    ))}
                </main>
            </div>
        </div>
    );
}
```

## Best Practices
*   **Correct IDs:** Ensure that every ID passed to the `elements` prop exactly matches the `id` attribute of a corresponding element in the DOM. Mismatched IDs are the most common source of issues.
*   **Fixed Headers:** Always use the `offset` prop when you have a fixed or sticky header. The value should typically be the negative height of your header to prevent the title from being hidden underneath it when the link is activated.
*   **Performance:** `ScrollSpy` is optimized for performance, but tracking a very large number of elements (hundreds) on a complex page might have an impact. In such cases, consider whether all elements need to be tracked.
*   **User Experience:** Ensure that the navigation links (`<a>` tags with `href` attributes) work correctly even if JavaScript is disabled. The `ScrollSpy` functionality should be an enhancement, not a requirement for navigation.
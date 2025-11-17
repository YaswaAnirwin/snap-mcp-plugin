# RichTextView Component

## Overview
The `RichTextView` component is designed to render HTML content within a React application. It is particularly useful for displaying formatted text that comes from a rich text editor, a database, or a CMS, such as articles, product descriptions, or user-generated comments.

The component ensures that the rendered HTML is clean and safe by default, but it's crucial to understand the security implications of rendering arbitrary HTML.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `htmlContent` | `string` | `''` | The HTML string you want to display. |
| `cx` | `IHasCX` | - | Allows adding custom CSS class names to the component's root `div` element for custom styling. |
| `rawProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Allows adding standard HTML attributes to the root `div` element. |

## Usage Examples

### Basic Usage
Here's how to render a simple HTML string. The component will parse the string and render the corresponding HTML elements.

```jsx
import React from 'react';
import { RichTextView } from '@uui/components';

export default function BasicRichTextViewExample() {
    const content = '<p>This is a paragraph with some <strong>bold text</strong> and <em>italic text</em>.</p>';

    return (
        <RichTextView htmlContent={content} />
    );
}
```

### Advanced Usage
The component can handle more complex HTML structures, including headings, lists, links, and blockquotes.

```jsx
import React from 'react';
import { RichTextView } from '@uui/components';

export default function AdvancedRichTextViewExample() {
    const articleHtml = `
        <h1>The Power of Component Libraries</h1>
        <p>
            Component libraries like UUI streamline development by providing pre-built, reusable, and accessible UI components. 
            Read more on <a href="https://example.com" target="_blank" rel="noopener noreferrer">our official blog</a>.
        </p>
        <h2>Key Benefits</h2>
        <ul>
            <li>Consistency across the application</li>
            <li>Faster development cycles</li>
            <li>Built-in accessibility</li>
        </ul>
        <blockquote>
            A good component library is a force multiplier for any development team.
        </blockquote>
    `;

    return (
        <RichTextView htmlContent={articleHtml} />
    );
}
```

## Best Practices and Warnings

### **Security: Preventing XSS Attacks**
This is the most important consideration when using `RichTextView`. Rendering HTML from untrusted sources (e.g., user comments) can expose your application to Cross-Site Scripting (XSS) attacks if the content is not properly sanitized.

While `RichTextView` may have internal sanitization, **it is a critical best practice to always sanitize HTML on the server-side or client-side before passing it to the component.** Use a well-vetted library like `DOMPurify` for this purpose.

**Example with Sanitization:**

```jsx
import React from 'react';
import { RichTextView } from '@uui/components';
import DOMPurify from 'dompurify';

export default function SecureRichTextViewExample() {
    // Malicious user-provided HTML with an attempted XSS attack
    const untrustedHtml = `
        <p>This is a user comment.</p>
        <img src="invalid-source" onerror="alert('XSS Attack!')" />
    `;

    // Sanitize the HTML before rendering
    const sanitizedHtml = DOMPurify.sanitize(untrustedHtml);

    return (
        <div>
            <h3>Sanitized Content:</h3>
            {/* The malicious onerror attribute will be removed by DOMPurify */}
            <RichTextView htmlContent={sanitizedHtml} />
        </div>
    );
}
```

### Styling
The `RichTextView` component renders standard HTML tags. You can style this content in a few ways:
1.  **Global CSS:** Define styles for `h1`, `p`, `a`, `ul`, etc., in your global stylesheet.
2.  **Scoped Styling:** Pass a custom class via the `cx` prop and write scoped CSS to target elements only within that `RichTextView` instance. This prevents styles from leaking out and affecting other parts of your application.

```css
/* Scoped styling example */
.my-custom-article h1 {
    font-size: 2rem;
    color: #333;
}

.my-custom-article a {
    color: #007bff;
    text-decoration: none;
}

.my-custom-article a:hover {
    text-decoration: underline;
}
```

```jsx
// Applying the custom class
<RichTextView htmlContent={articleHtml} cx="my-custom-article" />
```
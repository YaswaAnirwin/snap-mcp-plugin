# SearchInput Component

## Overview
The `SearchInput` component is a specialized text input designed for search functionality. It provides a familiar and intuitive interface for users to enter search queries, typically including features like a search icon, a clear button, and built-in debouncing to optimize performance.

It is ideal for implementing search bars, filtering lists, or any feature that requires user-initiated text-based searching.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | - | The current value of the search input. It should be managed in the parent component's state. |
| `onValueChange` | `(newValue: string) => void` | - | Callback function that is invoked when the input value changes. |
| `onSearch` | `(query: string) => void` | - | Callback function triggered when the user explicitly initiates a search (e.g., by pressing 'Enter' or clicking the search icon). |
| `onCancel` | `() => void` | - | Callback function that is called when the user clears the input using the 'clear' (x) button. Typically used to reset the search value and results. |
| `placeholder` | `string` | `'Search'` | Placeholder text to display when the input is empty. |
| `isDisabled` | `boolean` | `false` | If true, the input is disabled and cannot be interacted with. |
| `isLoading` | `boolean` | `false` | If true, a loading spinner is displayed in the input, indicating that a search is in progress. |
| `debounceDelay` | `number` | `300` | The delay in milliseconds before the `onValueChange` callback is fired after the user stops typing. This is crucial for performance. Set to `0` to disable debouncing. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | The visual size of the input field. |
| `cx` | `IHasCX` | - | Allows adding custom CSS class names to the component for custom styling. |
| `rawProps` | `React.InputHTMLAttributes<HTMLInputElement>` | - | Allows adding standard HTML attributes to the underlying `input` element. |

## Usage Examples

### Basic Usage
A simple controlled search input. The `onValueChange` callback is used to update the component's state on every keystroke (after the `debounceDelay`).

```jsx
import React, { useState } from 'react';
import { SearchInput } from '@uui/components';

export default function BasicSearchInputExample() {
    const [searchValue, setSearchValue] = useState('');

    return (
        <SearchInput
            value={searchValue}
            onValueChange={setSearchValue}
            onCancel={() => setSearchValue('')} // Handle the clear button
            placeholder="Search for articles..."
        />
    );
}
```

### Advanced Usage: Debounced API Search with Loading State
This is a common and powerful pattern. The search query is sent to an API only after the user has stopped typing for a specified duration (`debounceDelay`). The `isLoading` prop provides visual feedback during the API call.

```jsx
import React, { useState, useCallback } from 'react';
import { SearchInput } from '@uui/components';

// A mock API call function
const searchApi = (query) => {
    console.log('Searching for:', query);
    return new Promise(resolve => setTimeout(() => resolve([`Result for "${query}" 1`, `Result for "${query}" 2`]), 1000));
};

export default function DebouncedSearchExample() {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);

    // useCallback ensures the function reference is stable
    const handleSearch = useCallback(async (query) => {
        if (!query) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        const apiResults = await searchApi(query);
        setResults(apiResults);
        setIsLoading(false);
    }, []);

    const handleClearSearch = () => {
        setValue('');
        setResults([]);
    };

    return (
        <div>
            <SearchInput
                value={value}
                onValueChange={setValue} // Update the input value immediately
                onSearch={handleSearch} // Trigger the search on Enter/click
                onCancel={handleClearSearch}
                isLoading={isLoading}
                debounceDelay={500} // Wait 500ms after user stops typing
                placeholder="Search and press Enter..."
            />
            <div style={{ marginTop: '20px' }}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {results.map((result, index) => <li key={index}>{result}</li>)}
                    </ul>
                )}
            </div>
        </div>
    );
}
```

## Best Practices
*   **Controlled Component:** Always use `SearchInput` as a controlled component by managing its `value` in the parent's state and providing an `onValueChange` handler.
*   **Use Debouncing for Performance:** For any search that triggers an API call or a heavy client-side filtering operation, use the `debounceDelay` prop. A delay between 300ms and 500ms is generally a good starting point. This prevents excessive requests and improves application performance and user experience.
*   **Provide User Feedback:** Use the `isLoading` prop to give users a clear visual indication that their search is being processed. This prevents confusion and repeated actions.
*   **Handle Clearing:** Implement the `onCancel` callback to provide a way for users to easily reset the search input and the corresponding results.
*   **Accessibility:** While the component is built with accessibility in mind, ensure it has a proper, visible `<label>` or an `aria-label` (via `rawProps`) in your application to describe its purpose to screen reader users. A placeholder is not a substitute for a label.

```jsx
// Example with aria-label for accessibility
<SearchInput
    value={value}
    onValueChange={setValue}
    rawProps={{
        'aria-label': 'Search through site content'
    }}
/>
```
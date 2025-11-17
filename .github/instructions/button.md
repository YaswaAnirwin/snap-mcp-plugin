# Button Component

## Overview
The Button component is a fundamental interactive element in the UUI library. It's used to trigger actions, navigate, and control application flow. It can be customized with different styles, sizes, and icons to fit various use cases.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `onClick` | `function` | - | Callback function triggered when the button is clicked. |
| `caption` | `string` | - | The text displayed on the button. |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'critical' \| 'white' \| 'neutral'` | `'primary'` | Visual style variant of the button. |
| `size` | `'18' \| '24' \| '30' \| '36' \| '42' \| '48' \| '60'` | `'36'` | Size of the button. |
| `fill` | `'solid' \| 'outline' \| 'ghost' \| 'none'` | `'solid'` | The fill style of the button. |
| `isDisabled` | `boolean` | `false` | Disables the button when true. |
| `icon` | `Icon` | - | An icon to be displayed on the button. |
| `iconPosition`| `'left' \| 'right'` | `'left'` | Position of the icon relative to the caption. |
| `isDropdown` | `boolean` | `false` | If true, the button will have a dropdown indicator. |
| `isOpen` | `boolean` | `false` | If true, the dropdown indicator will be in the "open" state. |
| `link` | `Link` | - | A URL to navigate to when the button is clicked. |
| `href` | `string` | - | If provided, the button will be rendered as an `<a>` tag, navigating to the specified URL. |
| `target` | `string` | - | Standard `<a>` tag `target` attribute (e.g., `'_blank'`). Used only when `href` is set. |
| `cx` | `any` | - | Allows for adding custom CSS class names. |
| `rawProps` | `React.HTMLAttributes<HTMLButtonElement \| HTMLAnchorElement>` | - | Provides access to the underlying HTML element's attributes. |
## Usage Examples

### Basic Usage
```jsx
import { Button } from '@uui/components';

// A simple primary button
<Button
  caption="Click Me"
  onClick={() => alert('Button clicked!')}
/>

// A secondary button
<Button
  caption="Secondary Action"
  onClick={() => console.log('Secondary action')}
  color='secondary'
/>
```

### Advanced Usage

### With Icons

Icons can be added to buttons to provide visual cues and save space.

```jsx
import { Button, FlexRow } from '@epam/uui';
import { ReactComponent as AddIcon } from '@epam/assets/icons/action-add-fill.svg';
import { ReactComponent as DownIcon } from '@epam/assets/icons/navigation-chevron-down-fill.svg';

export default function IconButtonExample() {
  return (
    <FlexRow spacing="12">
      {/* Icon on the left (default) */}
      <Button 
        caption="Add Item" 
        icon={AddIcon} 
        onClick={() => {}} 
      />

      {/* Icon on the right */}
      <Button 
        caption="Show More" 
        icon={DownIcon} 
        iconPosition="right" 
        onClick={() => {}} 
      />

      {/* Icon-only button (no caption) */}
      <Button 
        icon={AddIcon} 
        onClick={() => {}} 
      />
    </FlexRow>
  );
}
```

### States (Disabled and Loading)

Buttons should visually represent their current state, such as when an action is in progress or unavailable.

```jsx
import React, { useState } from 'react';
import { Button, FlexRow } from '@epam/uui';

export default function StateButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <FlexRow spacing="12">
      {/* Disabled button */}
      <Button caption="Cannot Click" isDisabled={true} />

      {/* Loading button - caption changes and it becomes disabled */}
      <Button
        caption={isLoading ? 'Saving...' : 'Save'}
        onClick={handleClick}
        isDisabled={isLoading}
      />
    </FlexRow>
  );
}
```

#### Link Button
```jsx
import { Button } from '@uui/components';

// A button that acts as a link
<Button
  caption="Go to Google"
  link={{ pathname: 'https://www.google.com' }}
/>
```

## Best Practices
*   **Clarity:** Use clear and concise captions that describe the action the button will perform.
*   **Consistency:** Maintain a consistent button style throughout your application for a cohesive user experience.
*   **Hierarchy:** Use different button colors and fills to indicate the importance of actions. For example, use `'primary'` for the main action and `'secondary'` for less important actions.
*   **Statefulness:**  Clearly indicate the button's state (e.g., disabled, loading) to provide feedback to the user.
*   **Accessibility:** Ensure that buttons are accessible to all users by providing appropriate ARIA attributes when necessary.
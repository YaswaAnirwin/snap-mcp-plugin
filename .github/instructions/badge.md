# Badge Component

## Overview
The Badge component is a versatile element used to highlight information, display statuses, counts, or short labels. It can be configured with various colors, styles, and can include icons and counters.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `React.ReactNode` | - | The content to be displayed within the badge. |
| `color` | `'info' \| 'success' \| 'warning' \| 'critical' \| 'neutral'` | `'info'` | Defines the semantic color of the badge. |
| `fill` | `'solid' \| 'outline'` | `'solid'` | Sets the visual style of the badge. |
| `size` | `'18' \| '24' \| '30' \| '36' \| '42' \| '48'` | `'36'` | Defines the size of the badge. |
| `icon` | `React.ComponentType` | - | An icon to be displayed within the badge. |
| `iconPosition`| `'left' \| 'right'` | `'left'` | Positions the icon to the left or right of the caption. |
| `count` | `React.ReactNode` | - | A numerical or string value to display in a count indicator. |
| `indicator` | `boolean` | `false` | If true, displays a small dot indicator. Only visible when `fill` is `'outline'`. |
| `onClick` | `(event: React.MouseEvent) => void` | - | Callback function triggered when the badge is clicked. |
| `onIconClick` | `(event: React.MouseEvent) => void` | - | Callback function for clicks on the icon. |
| `isDisabled` | `boolean` | `false` | Disables the badge, making it non-interactive. |
| `isDropdown` | `boolean` | `false` | If true, the badge will render a dropdown icon, indicating it can toggle a dropdown menu. |
| `isOpen` | `boolean` | `false` | Controls the state of the dropdown icon (e.g., flips the icon when the dropdown is open). |
| `dropdownIcon`| `React.ComponentType` | - | Custom icon to use for the dropdown indicator. |
| `cx` | `any` | - | Allows for adding custom CSS classes. |
| `rawProps` | `React.HTMLAttributes<HTMLSpanElement>` | - | Provides access to the underlying HTML element's attributes. |

## Usage Examples

### Basic Colors and Styles

Badges can be used with different semantic colors and fill styles to match the context of the information being presented.

```jsx
import { Badge, FlexRow } from '@epam/uui';

export default function BasicBadgeExample() {
  return (
    <FlexRow spacing="12">
      {/* Solid fill style (default) */}
      <Badge color="info" caption="Info" />
      <Badge color="success" caption="Success" />
      <Badge color="warning" caption="Warning" />
      <Badge color="critical" caption="Critical" />
      
      {/* Outline fill style */}
      <Badge color="info" fill="outline" caption="Info" />
      <Badge color="success" fill="outline" caption="Success" />
      <Badge color="warning" fill="outline" caption="Warning" />
      <Badge color="critical" fill="outline" caption="Critical" />
    </FlexRow>
  );
}
```

### Sizes and Counts

Badges can be resized and can include a numerical count, which is useful for notifications or item counts.

```jsx
import { Badge, FlexRow } from '@epam/uui';

export default function SizeAndCountExample() {
  return (
    <FlexRow spacing="12" alignItems="center">
      <Badge size="18" caption="Small" count={5} />
      <Badge size="24" caption="Medium" count={10} />
      <Badge size="36" caption="Large (Default)" count={99} />
      <Badge size="48" caption="Extra Large" count="1k+" />
    </FlexRow>
  );
}
```

### With Icons

You can add icons to badges and control their position. This is useful for creating more visually descriptive labels.

```jsx
import { Badge, FlexRow } from '@epam/uui';
import { ReactComponent as NotificationIcon } from '@epam/assets/icons/notification-done-fill.svg';
import { ReactComponent as UserIcon } from '@epam/assets/icons/action-user-fill.svg';

export default function IconBadgeExample() {
  return (
    <FlexRow spacing="12">
      {/* Icon on the left (default) */}
      <Badge 
        color="success" 
        fill="outline" 
        icon={NotificationIcon} 
        caption="Available" 
      />
      
      {/* Icon on the right */}
      <Badge 
        color="info" 
        fill="solid" 
        icon={UserIcon} 
        iconPosition="right" 
        caption="User Status" 
      />
    </FlexRow>
  );
}
```

### As a Status Indicator

Using the `indicator` prop with an `outline` fill is a great way to represent statuses like "Draft," "In Progress," or "Ready."

```jsx
import { Badge, FlexRow } from '@epam/uui';

export default function StatusIndicatorExample() {
  return (
    <FlexRow spacing="18">
      <Badge color="neutral" fill="outline" indicator={true} caption="Draft" />
      <Badge color="warning" fill="outline" indicator={true} caption="In Progress" />
      <Badge color="success" fill="outline" indicator={true} caption="Ready" />
    </FlexRow>
  );
}
```

### As a Dropdown Toggler

The Badge can be made interactive, for example, to act as a toggler for a dropdown menu.

```jsx
import React, { useState } from 'react';
import { Badge, Dropdown, Panel } from '@epam/uui';

export default function DropdownBadgeExample() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderDropdownBody = () => (
    <Panel background="surface-main" shadow>
      <div style={{ padding: '12px' }}>Dropdown Content</div>
    </Panel>
  );

  return (
    <Dropdown
      renderBody={renderDropdownBody}
      renderTarget={(props) => (
        <Badge
          {...props}
          caption="Open Menu"
          color="info"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          isDropdown={true}
          isOpen={isDropdownOpen}
        />
      )}
      value={isDropdownOpen}
      onValueChange={setIsDropdownOpen}
    />
  );
}
```

## Best Practices
*   **Use Semantic Colors:** Apply colors purposefully. `success` for positive outcomes, `critical` for errors or urgent items, `warning` for alerts, and `info` for neutral information.
*   **Keep Captions Brief:** Badges are designed for short, scannable text. Avoid long captions that might wrap or overflow.
*   **Ensure Accessibility:** When using badges for status, ensure the meaning is conveyed by more than just color alone. Use captions or icons to provide context for screen reader users.
*   **Interactive Usage:** When a badge is clickable, ensure it has a clear purpose, like opening a modal, filtering a list, or toggling a dropdown.
*   **Combine with Other Components:** Badges work well inside tables, forms, cards, and user profiles to provide contextual metadata.
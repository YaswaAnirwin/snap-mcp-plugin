Of course. Here is the comprehensive documentation for the React `VerticalTabButton` component from the UUI library, designed to be clear and informative for GitHub Copilot.

---
~~~markdown
# Vertical Tab Button Component (React)

## Overview
The `VerticalTabButton` is a specialized button component styled for use within a vertical navigation structure, such as the sidebar of a settings page. It serves as a single, clickable tab item and is intended to be used in a group to control which view or content panel is displayed.

## API Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `string` | - | **Required.** The text label to display on the tab button. |
| `onClick` | `(e: React.MouseEvent<...>) => void` | - | Callback function executed when the button is clicked. |
| `isActive` | `boolean` | `false` | If `true`, the button is styled as the currently active tab. |
| `isDisabled` | `boolean` | `false` | If `true`, the button is disabled and cannot be interacted with. |
| `icon` | `Icon` | - | An optional icon to display to the left of the caption. |
| `size` | `'36' \| '48'` | `'36'` | The height of the tab button. |
| `href` | `string` | - | If provided, the component renders as an `<a>` tag instead of a `<button>`. |
| `...IHasCX` | `CX` | - | Allows for adding custom CSS classes. |
| `...IHasRawProps` | `HTMLAttributes<...>` | - | Provides access to the raw HTML attributes of the underlying element. |
| `...IHasAnalyticsEvent` | `AnalyticsEvent` | - | Props for UUI analytics tracking. |

## Usage Examples

### Basic Usage
A standalone `VerticalTabButton` in its default and active states. In a real application, the `isActive` prop would be controlled by state.

```jsx
import React from 'react';
import { VerticalTabButton } from '@uui/components';
import { VBox } from '@uui/components'; // VBox is a simple vertical flex container

export function BasicVerticalTabButtonExample() {
  return (
    <VBox>
      {/* An active vertical tab button */}
      <VerticalTabButton caption="Profile" isActive={true} />

      {/* An inactive vertical tab button */}
      <VerticalTabButton caption="Settings" isActive={false} />
    </VBox>
  );
}
```

### Advanced Usage: Stateful Tab Group
This example demonstrates a common use case: managing a group of vertical tabs with React state. Clicking a tab updates the state, which in turn updates the `isActive` prop of the buttons.

```jsx
import React, { useState } from 'react';
import { VerticalTabButton, VBox } from '@uui/components';
import { faUser, faCog, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export function VerticalTabGroupExample() {
  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { id: 'Profile', caption: 'Profile', icon: faUser },
    { id: 'Security', caption: 'Security', icon: faShieldAlt },
    { id: 'Settings', caption: 'Settings', icon: faCog, isDisabled: true },
  ];

  return (
    <VBox>
      {tabs.map(tab => (
        <VerticalTabButton
          key={tab.id}
          caption={tab.caption}
          icon={tab.icon}
          // The button is active if its ID matches the activeTab state
          isActive={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
          isDisabled={tab.isDisabled}
        />
      ))}
    </VBox>
  );
}
```

## Best Practices
*   **State Management:** The parent component should always control the `isActive` state for a group of `VerticalTabButton`s to ensure only one can be active at a time.
*   **Accessibility:** When creating a tab list, wrap the `VerticalTabButton` components in a container with `role="tablist"`. The `VerticalTabButton` itself handles the `role="tab"` and `aria-selected` attributes.
*   **Use as Links:** If your tabs correspond to different URL routes, use the `href` prop to render them as semantic anchor tags. This is better for SEO and accessibility.
*   **Container:** Use a layout container like `VBox` or a simple `div` with appropriate styling to hold a group of `VerticalTabButton`s.

## Notes
*   This component is a building block. It is designed to be the clickable tab element itself, not a full-fledged tab container with content panels. You are responsible for rendering the content associated with the active tab.
*   For horizontal tab navigation, use the `TabButton` component instead.

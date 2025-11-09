# Amplify UI Codebase

## Overview

This repository contains a reusable frontend codebase built with Nextjs. It includes a collection of modular UI components designed for consistency across the web app, along with Zustand-based state management stores for efficient global state handling. The components are styled with TailwindCSS mostly and focus on accessibility, responsiveness, and developer experience.

Key features:
- Reusable, customizable UI components (e.g., buttons, loaders, pagination).
- Lightweight state management with Zustand to minimize boilerplate and optimize rerenders.
- Easy setup for development and production.

## Prerequisites

- Node.js (v22.18.0 recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone git@github.com:taolaktech/amplify-ui.git
   cd amplify-ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Project

### Development Mode
Start the development server with hot reloading:
```
npm run dev
```

This will launch the app at `http://localhost:3000` (or the port specified in your config).

### Build for Production
Create an optimized production build:
```
npm run build
```
or
```
yarn build
```

The build artifacts will be in the `dist` or `build` folder. Serve them with any static server (e.g., `npx serve -s build`).

### Linting
Run lint 
```
npm run lint
```


### NOTE: Please run lint and build before making a PR.

## Reusable Components

This codebase provides a set of battle-tested, reusable components. Import them from `./lib/ui`. Below is a summary of key components, including props and usage examples. All components are functional React components and support TypeScript for type safety.

### Button
A versatile button component with support for icons, loading states, variants, and custom sizing.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Button text label. |
| `icon` | `React.ReactNode` | - | Optional icon (e.g., from react-icons). |
| `iconPosition` | `"left" \| "right"` | `"left"` | Position of the icon relative to text. |
| `secondary` | `boolean` | `false` | Use secondary styling (outline or lighter variant). |
| `tertiary` | `boolean` | `false` | Use tertiary styling (minimal or ghost variant). |
| `buttonSize` | `"small" \| "medium" \| "large"` | `"medium"` | Size variant for the button. |
| `height` | `number` | - | Custom height in pixels. |
| `gradientBorder` | `boolean` | `false` | Apply a gradient border effect. |
| `disabled` | `boolean` | `false` | Disable the button and its action. |
| `action` | `() => void` | `() => {}` | Click handler. |
| `showShadow` | `boolean` | `false` | Add a box shadow. |
| `loading` | `boolean` | `false` | Show loading spinner inside the button. |
| `hasIconOrLoader` | `boolean` | `false` | Flag for internal layout adjustments when icon or loader is present. |
| `iconSize` | `number` | `18` | Size of the icon in pixels. |

**Example:**
```tsx
import Button from './components/Button';

<Button
  text="Click Me"
  icon={<SomeIcon />}
  iconPosition="left"
  secondary
  action={() => console.log('Clicked!')}
  loading={isLoading}
/>
```

### Link (DefaultLink)
A styled link component that behaves like a button but navigates via `href`. Supports similar styling to Button.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Link text label. |
| `icon` | `React.ReactNode` | - | Optional icon. |
| `iconPosition` | `"left" \| "right"` | - | Position of the icon. |
| `secondary` | `boolean` | `false` | Secondary styling. |
| `buttonSize` | `"small" \| "medium" \| "large"` | `"medium"` | Size variant. |
| `height` | `number` | - | Custom height. |
| `hasIconOrLoader` | `boolean` | `false` | Layout flag for icon/loader. |
| `href` | `string` | `"#"` | Destination URL. |

**Example:**
```tsx
import DefaultLink from './components/DefaultLink';

<DefaultLink
  text="Go to Home"
  href="/"
  icon={<HomeIcon />}
  secondary
/>
```

### Input
A standard text input field with validation support. (Full props not detailed here; extend as needed with `value`, `onChange`, `placeholder`, etc.)

**Example:**
```tsx
import Input from './components/Input';

<Input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="Enter text..."
/>
```

### SelectInput
A dropdown select component for choosing from options.

**Props:** (Common: `value`, `onChange`, `options` as array of `{label, value}`.)

**Example:**
```tsx
import SelectInput from './components/SelectInput';

<SelectInput
  options={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}
  value={selected}
  onChange={(val) => setSelected(val)}
/>
```

### Skeleton
A placeholder loader for content while data is fetching. Customizable shape and size.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `"100%"` | Width (e.g., `"200px"` or `"50%"`). |
| `height` | `string` | `"100px"` | Height. |
| `borderRadius` | `string` | `"10px"` | Border radius for rounded edges. |
| `style` | `React.CSSProperties` | - | Inline styles override. |

**Example:**
```tsx
import Skeleton from './components/Skeleton';

<Skeleton width="300px" height="20px" />
```

### Toast
A notification toast for success/error messages. You can show toast message with an showToast function from `toastStore`

**Usage:**  `showToast({title,  message, type })`.

### Pagination
A simple paginator for lists/tables.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `pageCount` | `number` | Total number of pages. |
| `setCurrentPage` | `(page: number) => void` | Handler to update current page. |
| `currentPage` | `number` | Active page number. |

**Example:**
```tsx
import Pagination from './components/Pagination';

<Pagination
  pageCount={10}
  currentPage={1}
  setCurrentPage={setPage}
/>
```

### ProgressBar
A linear progress indicator.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `width` | `number` | Progress percentage (0-100). |

**Example:**
```tsx
import ProgressBar from './components/ProgressBar';

<ProgressBar width={75} />
```

### CloudLoader
A cloud-themed animated loader for async operations.

**Usage:** Render standalone; no major props.

### Circle Loader
A circular spinner loader.

**Usage:** Similar to CloudLoader; customizable via `size` prop if extended.

### Toggle
A switch toggle for boolean states.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `on` | `boolean` | - | Current toggle state. |
| `toggle` | `() => void` | - | Handler to flip the state. |
| `large` | `boolean` | `false` | Use larger size. |

**Example:**
```tsx
import Toggle from './components/Toggle';

<Toggle on={isEnabled} toggle={() => setEnabled(!isEnabled)} large />
```

## State Management (Zustand Stores)

We use [Zustand](https://github.com/pmndrs/zustand) for lightweight, hook-based state management. Stores are defined in `./lib/stores` (e.g., `useUIStore`).

### Best Practice for Selectors
To avoid unnecessary rerenders, always use primitive selectors instead of destructuring objects:

**❌ Avoid:**
```tsx
const { isToggled } = useUIStore((state) => state); // Rerenders on any state change
```

**✅ Do:**
```tsx
const isToggled = useUIStore((state) => state.isToggled); // Only rerenders when `isToggled` changes
```

This optimizes performance by subscribing only to the specific slice of state.

### Creating/Using Stores
Example store setup (in `./stores/uiStore.ts`):
```tsx
import { create } from 'zustand';

interface UIState {
  isToggled: boolean;
  actions: {
    toggle: () => void;
  }
}

export const useUIStore = create<UIState>((set) => ({
  isToggled: false,
  actions: {
    toggle: () => set((state) => ({ isToggled: !state.isToggled })),
  }
}));
```

Usage:
```tsx
import { useUIStore } from './stores/uiStore';

const {isToggled} = useUIStore((state) => state.actions.isToggled);
const toggle = useUIStore((state) => state.toggle);
```
### Icons
Most icons referenced in Figma designs leverage the Iconsax library [(@iconsax/react)](https://iconsax-react.pages.dev), which is pre-installed in the project. Iconsax provides a comprehensive, customizable set of 1,200+ line icons optimized for React, ensuring consistency in stroke weight, alignment, and theming.

#### Guidelines

- Check Iconsax First: Before importing external or custom icons (e.g., from react-icons or SVGs), search the Iconsax library for an equivalent. This promotes design system consistency, reduces bundle size, and simplifies maintenance.

#### Usage
Import icons directly and render them as React components. No additional setup required.
Example:

```
.tsx
import { Home, Heart, SearchNormal1 } from '@iconsax/react';

// Basic usage
<Home size={24} color="currentColor" variant="Linear" />

// In a component (e.g., Button)
<Button
  text="Home"
  icon={<Home size={18} color="white" variant="Bold" />}
  iconPosition="left"
  action={() => navigate('/home')}
/>

// Conditional rendering
{isFavorite ? (
  <Heart size={20} color="#ff6b6b" variant="TwoTone" />
) : (
  <Heart size={20} color="#9ca3af" variant="Outline" />
)}

```
If an icon isn't available in Iconsax and must be custom:

Add it to ./public as an SVG.


## Contributing

1. Clone the repo and create a feature branch.
2. Make changes and run tests.
3. Submit a PR with a clear description.


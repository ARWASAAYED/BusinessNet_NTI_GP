# 🎨 UI/UX Design Guide - Business Social Network

## 🎯 Design Philosophy

**Professional yet Friendly** - Strike the perfect balance between corporate professionalism and approachable social interaction.

**Core Principles:**
1. **Clarity** - Information should be easy to find and understand
2. **Consistency** - Uniform patterns across all interfaces
3. **Efficiency** - Minimize clicks to complete tasks
4. **Delight** - Subtle animations and interactions that feel premium
5. **Accessibility** - Usable by everyone, including those with disabilities

---

## 🎨 Color System

### Primary Palette
```css
/* Blue - Trust, Professionalism, Stability */
--primary-50: #EFF6FF;   /* Lightest - backgrounds */
--primary-100: #DBEAFE;  /* Light - hover states */
--primary-200: #BFDBFE;  /* Soft accents */
--primary-300: #93C5FD;  /* Borders */
--primary-400: #60A5FA;  /* Interactive elements */
--primary-500: #3B82F6;  /* Main brand color */
--primary-600: #2563EB;  /* Hover states */
--primary-700: #1D4ED8;  /* Active states */
--primary-800: #1E40AF;  /* Dark accents */
--primary-900: #1E3A8A;  /* Darkest */
```

### Secondary Palette
```css
/* Purple - Creativity, Innovation, Premium */
--secondary-50: #FDF4FF;
--secondary-100: #FAE8FF;
--secondary-200: #F5D0FE;
--secondary-300: #F0ABFC;
--secondary-400: #E879F9;
--secondary-500: #A855F7;  /* Accent color */
--secondary-600: #9333EA;
--secondary-700: #7E22CE;
--secondary-800: #6B21A8;
--secondary-900: #581C87;
```

### Semantic Colors
```css
/* Success - Green */
--success-50: #ECFDF5;
--success-500: #10B981;
--success-600: #059669;
--success-700: #047857;

/* Warning - Amber */
--warning-50: #FFFBEB;
--warning-500: #F59E0B;
--warning-600: #D97706;
--warning-700: #B45309;

/* Error - Red */
--error-50: #FEF2F2;
--error-500: #EF4444;
--error-600: #DC2626;
--error-700: #B91C1C;

/* Info - Cyan */
--info-50: #ECFEFF;
--info-500: #06B6D4;
--info-600: #0891B2;
--info-700: #0E7490;
```

### Neutral Palette
```css
/* Gray Scale */
--gray-50: #F9FAFB;    /* Lightest backgrounds */
--gray-100: #F3F4F6;   /* Card backgrounds */
--gray-200: #E5E7EB;   /* Borders */
--gray-300: #D1D5DB;   /* Disabled states */
--gray-400: #9CA3AF;   /* Placeholder text */
--gray-500: #6B7280;   /* Secondary text */
--gray-600: #4B5563;   /* Body text */
--gray-700: #374151;   /* Headings */
--gray-800: #1F2937;   /* Dark headings */
--gray-900: #111827;   /* Darkest text */
```

### Usage Guidelines
- **Primary Blue**: Main CTAs, links, active states, brand elements
- **Secondary Purple**: Premium features, badges, special highlights
- **Success Green**: Confirmations, success messages, positive metrics
- **Warning Amber**: Warnings, pending states, important notices
- **Error Red**: Errors, destructive actions, critical alerts
- **Neutrals**: Text, backgrounds, borders, shadows

---

## 📝 Typography

### Font Families
```css
/* Using Next.js next/font for optimization */
// In app/layout.tsx:
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-primary'
})

const poppins = Poppins({ 
  weight: ['500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-heading'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

/* CSS Variables */
--font-primary: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: var(--font-jetbrains-mono), 'Courier New', monospace;
```

### Type Scale
```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - Captions, labels */
--text-sm: 0.875rem;     /* 14px - Secondary text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - Section headings */
--text-3xl: 1.875rem;    /* 30px - Page headings */
--text-4xl: 2.25rem;     /* 36px - Hero headings */
--text-5xl: 3rem;        /* 48px - Display headings */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Line Heights */
--leading-tight: 1.25;    /* Headings */
--leading-snug: 1.375;    /* Subheadings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Long-form content */
--leading-loose: 2;       /* Spacious text */

/* Letter Spacing */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
```

### Typography Styles
```css
/* Heading 1 - Page Title */
.h1 {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--gray-900);
}

/* Heading 2 - Section Title */
.h2 {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--gray-800);
}

/* Body Text */
.body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-600);
}

/* Caption */
.caption {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--gray-500);
}
```

---

## 📐 Spacing & Layout

### Spacing Scale
```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### Container Widths
```css
--container-sm: 640px;   /* Mobile landscape */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
--container-2xl: 1536px; /* Extra large */
```

### Grid System
```css
/* 12-column grid */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* Common layouts */
.layout-sidebar {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-8);
}

.layout-three-column {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: var(--space-6);
}
```

---

## 🎭 Components

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--primary-600);
  border: 2px solid var(--primary-500);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-600);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--gray-600);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card-premium {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.card-premium::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  color: var(--gray-900);
  background: white;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--gray-400);
}

.input-error {
  border-color: var(--error-500);
}

.input-error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}
```

### Avatars

```css
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.avatar-lg {
  width: 80px;
  height: 80px;
}

.avatar-xl {
  width: 120px;
  height: 120px;
}

.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-group .avatar {
  margin-left: -12px;
  transition: transform 0.2s ease;
}

.avatar-group .avatar:first-child {
  margin-left: 0;
}

.avatar-group .avatar:hover {
  transform: scale(1.1);
  z-index: 10;
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.badge-primary {
  background: var(--primary-100);
  color: var(--primary-700);
}

.badge-success {
  background: var(--success-100);
  color: var(--success-700);
}

.badge-premium {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}
```

---

## 🎬 Animations & Transitions

### Keyframe Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shimmer */
@keyframes shimmer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

### Transition Utilities

```css
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition: all 0.15s ease;
}

.transition-slow {
  transition: all 0.5s ease;
}

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 🌓 Dark Mode

```css
/* Dark Mode Colors */
[data-theme="dark"] {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-tertiary: #94A3B8;
  
  --border-color: #334155;
  
  /* Adjust primary colors for dark mode */
  --primary-500: #60A5FA;
  --primary-600: #3B82F6;
}

/* Dark mode card */
[data-theme="dark"] .card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Media Queries

```css
/* Mobile (default) */
.container {
  padding: var(--space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
  
  .layout-sidebar {
    display: grid;
    grid-template-columns: 280px 1fr;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
  }
  
  .layout-three-column {
    display: grid;
    grid-template-columns: 280px 1fr 320px;
  }
}
```

---

## 🎨 Page Layouts

### Feed Layout

```
┌─────────────────────────────────────────────────────┐
│                    Navbar                            │
├──────────┬──────────────────────────┬────────────────┤
│          │                          │                │
│ Sidebar  │      Main Feed           │  Trending      │
│          │                          │  Sidebar       │
│ - Home   │  ┌──────────────────┐   │                │
│ - Explore│  │  Create Post     │   │ • Trending     │
│ - Comm.  │  └──────────────────┘   │   Topics       │
│ - Msg    │                          │                │
│          │  ┌──────────────────┐   │ • Suggested    │
│          │  │  Post Card       │   │   Businesses   │
│          │  │  - Avatar        │   │                │
│          │  │  - Content       │   │ • Who to       │
│          │  │  - Actions       │   │   Follow       │
│          │  └──────────────────┘   │                │
│          │                          │                │
│          │  ┌──────────────────┐   │                │
│          │  │  Post Card       │   │                │
│          │  └──────────────────┘   │                │
│          │                          │                │
└──────────┴──────────────────────────┴────────────────┘
```

### Business Profile Layout

```
┌─────────────────────────────────────────────────────┐
│                    Navbar                            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Cover Image                          │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌────┐  Business Name          [Follow] [Message] │
│  │Logo│  @handle • Verified ✓                      │
│  └────┘  Category • Location                       │
│                                                      │
│  Description text...                                │
│  Website • 1.2K Followers • 85 Reputation          │
│                                                      │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ About    │  Posts Tab                               │
│ Info     │                                          │
│          │  ┌──────────────────┐                   │
│ • Founded│  │  Post Card       │                   │
│ • Size   │  └──────────────────┘                   │
│ • Industry                                          │
│          │  ┌──────────────────┐                   │
│ Analytics│  │  Post Card       │                   │
│ Chart    │  └──────────────────┘                   │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

## ✨ Micro-interactions

### Like Animation
```css
.like-button {
  transition: all 0.3s ease;
}

.like-button.liked {
  animation: likeAnimation 0.5s ease;
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
```

### Loading States
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Toast Notifications
```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  background: white;
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## ♿ Accessibility

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

button:focus-visible {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}
```

### ARIA Labels
```html
<!-- Always include descriptive labels -->
<button aria-label="Like this post">
  <HeartIcon />
</button>

<input 
  type="text" 
  aria-label="Search posts"
  placeholder="Search..."
/>
```

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Use tools like WebAIM Contrast Checker

---

## 🎯 Design Patterns

### Empty States
```html
<div class="empty-state">
  <img src="illustration.svg" alt="" />
  <h3>No posts yet</h3>
  <p>Start following businesses to see their posts here</p>
  <button class="btn-primary">Explore Businesses</button>
</div>
```

### Error States
```html
<div class="error-state">
  <AlertIcon />
  <h3>Something went wrong</h3>
  <p>We couldn't load this content. Please try again.</p>
  <button class="btn-secondary">Retry</button>
</div>
```

### Success States
```html
<div class="success-state">
  <CheckCircleIcon />
  <h3>Post published!</h3>
  <p>Your post is now visible to your followers</p>
</div>
```

---

**Design System Version**: 1.0  
**Last Updated**: 2025-12-29  
**Maintained by**: Design Team

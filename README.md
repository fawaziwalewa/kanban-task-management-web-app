# Frontend Mentor - Kanban task management web app solution

This is a solution to the [Kanban task management web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size (Mobile 375px, Tablet 768px, Desktop 1440px)
- See hover and active states for all interactive elements on the page
- Create, read, update, and delete boards and tasks
- Receive form validations when trying to create/edit boards and tasks (prevent empty titles or empty items)
- Mark subtasks as complete and move tasks between columns
- Hide/show the board sidebar on desktop and tablet
- Open the mobile navigation dropdown modal on smaller screens
- Toggle the theme between light and dark modes with persistent preferences
- **Bonus**: Keep track of any changes across sessions using `localStorage` persistence
- **Bonus**: Custom landing page and intuitive onboarding flow for empty boards and empty columns

### Screenshot

![Kanban Task Management Web App Preview](./preview.png)

### Links

- GitHub Repository: [https://github.com/fawaziwalewa/kanban-task-management-web-app](https://github.com/fawaziwalewa/kanban-task-management-web-app)
- Live Site URL: [https://main-umber-pi-58.vercel.app](https://main-umber-pi-58.vercel.app)
- Solution on Frontend Mentor: [https://www.frontendmentor.io/solutions/kanban-task-management-web-app---nextjs-16-tailwind-css-and-typescript--dLycG7TrX](https://www.frontendmentor.io/solutions/kanban-task-management-web-app---nextjs-16-tailwind-css-and-typescript--dLycG7TrX)

## My process

### Built with

- Semantic HTML5 markup & WAI-ARIA Accessible Patterns
- CSS custom properties & Design System Tokens in `rem` units
- Flexbox & CSS Grid
- Mobile-first responsive layout architecture (Mobile 375px, Tablet 768px, Desktop 1440px)
- [React 19](https://react.dev/) - JavaScript UI library
- [Next.js 16 (App Router)](https://nextjs.org/) - React Framework with Turbopack
- [TypeScript](https://www.typescriptlang.org/) - Strict type safety across boards, columns, tasks, and subtasks
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework with custom `@custom-variant dark` support
- [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/) - 24+ Automated unit and component tests
- Context API & Custom Hooks with `localStorage` synchronization

### Running Tests

```bash
# Run full automated test suite with Vitest
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### What I learned

Working on this comprehensive challenge provided deep hands-on experience in production frontend engineering, accessible component design, and immutable state architecture.

#### 1. Accessible WAI-ARIA Modal Focus Management
Implementing robust focus containment without heavy third-party modal dependencies required managing focusable DOM nodes dynamically:
```tsx
useEffect(() => {
  if (!isOpen) return;
  previousActiveElement.current = document.activeElement as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    previousActiveElement.current?.focus();
  };
}, [isOpen, onClose]);
```

#### 2. Tailwind CSS v4 Design Tokens in Accessible `rem` Units
To respect user browser font scaling preferences while adhering to Figma design specifications:
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: #635fc7;
  --color-primary-hover: #a8a4ff;
  --color-destructive: #ea5555;
  --color-destructive-hover: #ff9898;
  --color-dark-bg: #20212c;
  --color-dark-surface: #2b2c37;
  --color-dark-lines: #3e3f4e;
  --color-light-bg: #f4f7fd;
  --color-light-surface: #ffffff;
  --color-light-lines: #e4ebfa;
}

.text-heading-xl { font-size: 1.5rem; line-height: 1.875rem; font-weight: 700; }
.text-heading-l  { font-size: 1.125rem; line-height: 1.4375rem; font-weight: 700; }
.text-heading-m  { font-size: 0.9375rem; line-height: 1.1875rem; font-weight: 700; }
.text-heading-s  { font-size: 0.75rem; line-height: 0.9375rem; font-weight: 700; letter-spacing: 0.15em; }
```

#### 3. Stable UUIDs & Synchronized Column Renaming
To prevent data loss when users rename board columns, columns maintain stable identifiers while task `status` fields are automatically synchronized during board updates:
```typescript
const updateBoard = (name: string, columnNames: { id?: string; name: string }[]) => {
  if (!activeBoard) return;
  const existingCols = activeBoard.columns;
  const updatedColumns = columnNames
    .filter((c) => c.name.trim().length > 0)
    .map((c, index) => {
      const existing = c.id
        ? existingCols.find((ex) => ex.id === c.id)
        : existingCols.find((ex) => ex.name.toLowerCase() === c.name.trim().toLowerCase()) || existingCols[index];
      const targetName = c.name.trim();
      return {
        id: c.id || existing?.id || `col-${Date.now()}-${index}`,
        name: targetName,
        tasks: existing ? existing.tasks.map((t) => ({ ...t, status: targetName })) : [],
      };
    });

  setBoards((prev) =>
    prev.map((b, idx) => (idx === activeBoardIndex ? { ...b, name: name.trim(), columns: updatedColumns } : b))
  );
};
```

### Continued development

Future enhancements planned for this project include:
- **Full-Stack Database Persistence**: Connecting to a PostgreSQL database via Prisma/Supabase for authenticated multi-device sync.
- **Drag-and-Drop Animations**: Enhancing drag and drop task moving across columns with `@dnd-kit/core` and smooth physics animations.
- **Real-Time Collaboration**: Adding live updates via WebSockets so teams can collaborate on boards concurrently.

### Useful resources

- [W3C WAI-ARIA Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) - Comprehensive guide for accessible modal dialog design and focus trapping.
- [W3C WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) - Standard keyboard interaction patterns for custom status dropdown selectors.
- [Vitest Documentation](https://vitest.dev/guide/) - Blazing fast unit testing framework integrated with Vite and JSDOM.
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) - Reference for modern theme tokens and CSS variables.
- [Next.js App Router Documentation](https://nextjs.org/docs/app) - App Router best practices for React 19 server/client components.

### AI Collaboration

This project was built with the assistance of **Antigravity AI (Google DeepMind)**. 

- **Figma Translation**: Transformed pixel-perfect Figma designs (desktop, tablet, and mobile states) into responsive React components and Tailwind CSS tokens.
- **Form Validation & State**: Crafted dynamic array form helpers for adding/removing subtasks and board columns with error handling.
- **Code Quality & Testing**: Automated layout verification across viewport sizes (375px, 768px, 1440px), ensured zero ESLint/TypeScript errors, and addressed React 19 client hydration constraints.

## Author

- Website - [Fawaz Iwalewa](https://iwaola.me/)
- Frontend Mentor - [@fawaziwalewa](https://www.frontendmentor.io/profile/fawaziwalewa)
- GitHub - [@fawaziwalewa](https://github.com/fawaziwalewa)
- Twitter - [@iwalewa_fawaz](https://x.com/iwalewa_fawaz)

## Acknowledgments

Thanks to Frontend Mentor for providing such a well-crafted design challenge and comprehensive Figma files.

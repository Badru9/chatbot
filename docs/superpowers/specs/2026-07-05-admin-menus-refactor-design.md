# Admin Menus Refactor Design

## Scope

Refactor `app/admin/menus` without changing its visible UI, API endpoints, credentials behavior, messages, or menu operations. The work must preserve local edits already present in the working tree.

## Current Problems

`page.tsx` owns data fetching, mutations, form fields, modal state, icon mapping, reorder logic, and all markup. This makes the page difficult to review and test.

Two effects also violate `react-hooks/set-state-in-effect`:

- The mount effect calls `setIsMounted(true)` synchronously.
- The fetch effect calls `fetchMenus()`, which synchronously sets loading state before its first asynchronous boundary.

The mount flag has no browser-only dependency to protect. Manual fetching also duplicates loading and refetch behavior already supplied by TanStack Query.

## Architecture

Keep the route page as a thin composition layer. Move each responsibility into a focused module under `app/admin/menus`.

- `page.tsx` renders the page shell and composes menu components.
- `menu.types.ts` defines menu data, form values, and mutation payload types.
- `menu.constants.tsx` stores supported icon metadata and icon rendering.
- `menu.api.ts` contains fetch functions for list, create, update, delete, and reorder requests.
- `menu.utils.ts` contains pure helpers such as default form values, next order calculation, and reorder payload creation.
- `use-menus.ts` wraps TanStack Query queries and mutations.
- `menu-table.tsx` renders loading, empty, and populated table states.
- `menu-form-modal.tsx` owns add/edit form state and submission.
- `delete-menu-modal.tsx` renders deletion confirmation and submission state.

Names may change slightly during implementation when existing project conventions require it. Module boundaries and responsibilities remain fixed.

## Data Flow

`useMenus` reads menu data through `useQuery`. Query state supplies loading and error information, so the page needs no fetch effect or separate loading state.

Create, update, and delete operations use `useMutation`. Successful mutations invalidate the menu query, close the relevant modal, and display the same UI result as the current implementation.

Reordering keeps the current immediate visual response. The mutation applies an optimistic query-cache update, sends the two changed menu records, then rolls back the previous cache value if the request fails. It invalidates the query after settlement so client order matches backend state.

The form modal receives either no menu for add mode or one menu for edit mode. Its initial state is derived when the modal instance is opened. A stable mode-specific `key` remounts the form when the target changes, avoiding state synchronization through an effect.

## Effect Removal

Remove `isMounted`, its effect, and the duplicate loading screen tied to that flag. This page does not read `window`, storage, media queries, or another client-only external system during render.

Remove the manual fetch effect. TanStack Query owns request lifecycle through `useQuery`.

No effect will copy props into form state. Initial form values come from component initialization, and event handlers own later changes.

## Error Handling

API helpers throw typed errors for non-success responses. Existing Indonesian alert messages remain unchanged unless the current response contains no usable error body, in which case the current fallback text remains.

Failed optimistic reorder restores prior query data. Network failures remain visible in console where current behavior logs them. Mutation pending state disables duplicate submissions where supported without changing layout.

## Testing

Use the existing Node test runner for pure helpers:

- New-menu defaults use the next available order.
- Edit defaults copy every editable field.
- Moving first item up and last item down leaves data unchanged.
- Valid reorder swaps item positions and order values without mutating input.
- Reorder payload contains exactly the changed records.

Run the targeted helper tests first and observe the expected failure before implementation. After implementation, run targeted tests, ESLint for `app/admin/menus`, TypeScript checking, and the production build.

## Acceptance Criteria

- UI and user-visible behavior match the current page.
- Existing menu API routes and `credentials: 'include'` remain.
- `page.tsx` contains composition code instead of request and form implementation.
- TanStack Query supplies list loading state and mutation lifecycle.
- No synchronous state update occurs inside an effect in `app/admin/menus`.
- Targeted tests, ESLint, TypeScript checking, and production build pass.

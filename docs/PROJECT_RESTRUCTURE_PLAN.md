# CertSprints Project Restructure Plan

## Why Restructure

The prototype has grown into a full mobile product:

- 83 HTML screens currently live directly inside `web/`.
- CSS, JavaScript, and assets are partly shared and partly feature-specific.
- LMS activities, app navigation, games, settings, account, and community pages
  currently appear as peers even though they have different ownership.
- Direct prototype links couple screens to filenames and make moves risky.

The project should be organized by product domain while preserving the existing
working prototype during migration.

## Important Constraint

Do not move every page at once.

The current prototype contains hundreds of relative navigation and asset
references. A mass move would silently break routes, images, styles, and
JavaScript. Migrate one domain at a time and keep root-level compatibility
routes until all callers use the new route registry.

## Target Structure

```text
CertSprints-HTML/
├── docs/
│   ├── LMS_EXPERIENCE_REGISTRY.md
│   ├── PROJECT_RESTRUCTURE_PLAN.md
│   ├── lms-experience-registry.json
│   └── project-route-manifest.json
├── scripts/
│   └── audit-project-structure.mjs
└── web/
    ├── app/
    │   ├── home/
    │   ├── progress/
    │   ├── notifications/
    │   └── more/
    ├── lms/
    │   ├── backlog/
    │   └── activities/
    │       ├── knowledge-poll/
    │       ├── mock-exam/
    │       └── ...
    ├── games/
    │   ├── catalog/
    │   └── activities/
    ├── practice/
    ├── community/
    ├── account/
    │   ├── auth/
    │   └── profile/
    ├── settings/
    ├── commerce/
    ├── support/
    ├── onboarding/
    └── shared/
        ├── css/
        ├── js/
        └── assets/
            └── icons/
```

Each screen folder should eventually contain its own page, styles, JavaScript,
and feature-only assets:

```text
web/lms/activities/knowledge-poll/
├── index.html
├── knowledge-poll.css
├── knowledge-poll.js
└── assets/
```

Assets used by multiple domains belong in `web/shared/assets/`. Icons remain a
single shared library and must continue following `ICONS.md`.

## Ownership Rules

### Shared

Place code in `web/shared/` only when it is used by multiple domains.

- App shell and phone-frame styling
- Design tokens
- Common navigation
- LMS activity host/router
- Shared icons and generally reusable media

### Feature-Owned

Keep files with their feature when they are only used by that feature.

- Screen-specific CSS and JavaScript
- Activity-specific illustrations
- Feature content fixtures
- Feature-specific state machines

### Route Ownership

Every HTML screen must appear exactly once in
[`project-route-manifest.json`](./project-route-manifest.json). The manifest
records its current route, owning domain, and target route.

Frontend navigation should eventually use route IDs instead of filenames:

```js
navigateTo("lms.activity", { activityId });
navigateTo("app.notifications");
navigateTo("settings.notifications");
```

LMS activity navigation must additionally follow the backend-composed contract
defined in `LMS_EXPERIENCE_REGISTRY.md`.

## Migration Phases

### Phase 0: Inventory and Guardrails

- Maintain the route ownership manifest.
- Run `node scripts/audit-project-structure.mjs`.
- Add a link/reference audit before every folder migration.
- Do not create new root-level HTML screens.

### Phase 1: Shared Foundation

- Move `app.css`, common components, and shared icons under `web/shared/`.
- Add compatibility references so existing screens continue to load.
- Introduce a route registry/helper for prototype navigation.

### Phase 2: Low-Risk Domains

Move domains with fewer cross-links first:

1. Account/auth — migrated to `web/account/auth/`; root compatibility routes retained
2. Settings — migrated to `web/settings/`; root compatibility routes retained
3. Commerce — migrated to `web/commerce/`; root compatibility routes retained
4. Community — migrated to `web/community/`; root compatibility routes retained
3. Commerce
4. Community
5. Support

Keep lightweight root compatibility pages during the transition.

### Phase 3: App Shell and Games

- Move dashboard, progress, notifications, and more.
- Move the games catalog and game activities.
- Consolidate repeated top header and bottom navigation code.

### Phase 4: LMS

- Add a shared LMS activity host and backend activity registry.
- Move `study_backlog` into `web/lms/backlog/`.
- Move each learning renderer into `web/lms/activities/<activity-type>/`.
- Replace hardcoded next-page links with LMS completion/navigation events.

### Phase 5: Cleanup

- Remove root compatibility pages after all references use canonical routes.
- Remove duplicate and legacy assets.
- Enforce folder ownership in the audit script.

## Migration Checklist Per Screen

1. Confirm the page owner and target route in the manifest.
2. Move HTML, CSS, JS, and feature-only assets together.
3. Update shared asset and navigation references.
4. Add or retain a root compatibility route.
5. Test direct load, back, help, completion, and next navigation.
6. Run the structure audit.
7. Visually verify the screen at mobile viewport.

## Decisions

- Preserve plain HTML, CSS, and vanilla JavaScript for now.
- Do not introduce a mandatory build step during the restructure.
- Keep stable backend LMS activity types independent of physical file paths.
- Treat the route manifest as the migration source of truth.
- New screens must be created directly inside their owning domain folder.

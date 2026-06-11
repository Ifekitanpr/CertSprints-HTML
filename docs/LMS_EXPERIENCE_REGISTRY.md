# CertSprints LMS Experience Registry

## Purpose

The CertSprints LMS is a backend-composed learning system. A course or module is
an ordered list of activities supplied by the backend. The mobile app chooses
the correct renderer from the activity `type`; it must not assume a permanent
sequence from the prototype's `window.location.href` links.

`study_backlog` is the LMS navigation and resume surface. It is not a learning
activity. Every other registered experience can be placed in any compatible
course or module by the backend.

The machine-readable source of truth is
[`lms-experience-registry.json`](./lms-experience-registry.json).

## Runtime Contract

Each backend activity should provide at least:

```json
{
  "id": "activity_01J...",
  "type": "knowledge_poll",
  "version": 1,
  "courseId": "course_ccmp",
  "moduleId": "module_ethics",
  "title": "Apply ethical judgment",
  "content": {},
  "configuration": {},
  "progress": {
    "status": "not_started",
    "state": {},
    "updatedAt": null
  },
  "navigation": {
    "previousActivityId": null,
    "nextActivityId": "activity_01K..."
  }
}
```

### Required Rules

1. Route by stable activity `type`, never by HTML filename.
2. Treat current prototype links as demo navigation only.
3. Persist activity state using the backend activity `id`.
4. Resume the exact saved internal state when supported.
5. Ask the backend for the next activity after completion.
6. Unknown activity types must show a recoverable unsupported-activity state.
7. Renderer changes that break the content contract require a new `version`.

## LMS Surfaces

| Surface | Purpose | Prototype |
|---|---|---|
| `study_backlog` | Module/sprint outline, status, locking, and resume entry point | `study-backlog.html` |
| `lesson_player` | Shared lesson shell and content playback | `lesson-player.html` |

## Registered Learning Experiences

The order below is an inventory, not a required course sequence.

| Activity type | Display name | Learning mechanic | Prototype route |
|---|---|---|---|
| `lesson` | Lesson | Guided lesson/video/content playback | `lesson-player.html` |
| `key_takeaway` | Key Takeaway | Capture or review a lesson takeaway | `key-takeaway.html` |
| `gap_prompt` | Gap Prompt | Identify uncertainty and revisit learning | `gap-prompt.html` |
| `insight_exchange` | Insight Exchange | Reflect, compare, and submit an insight | `insight-exchange.html` |
| `decision_simulator` | Decision Simulator | Make and review scenario decisions | `decision-simulator.html` |
| `scenario_sorting` | Scenario Sorting | Sort scenarios into conceptual groups | `scenario-sorting.html` |
| `risk_cycle_sequencer` | Risk Cycle Sequencer | Arrange process steps in order | `risk-cycle-sequencer.html` |
| `sorting_classification` | Sorting Classification | Classify prompts using a second sorting pattern | `sorting-type-2.html` |
| `boolean_flashcard` | Boolean Flashcard | Evaluate true/false statements | `boolean-flashcard.html` |
| `active_recall` | Active Recall | Recall knowledge without prompts | `active-recall.html` |
| `blurting_canvas` | Blurting Canvas | Free recall and self-comparison | `blurting-canvas.html` |
| `retrieval_sprint` | Retrieval Sprint | Timed retrieval practice | `retrieval-sprint.html` |
| `pre_assessment_quiz` | Pre-Assessment Quiz | Establish baseline knowledge | `pre-assessment-quiz.html` |
| `decision_tree` | Decision Tree | Explore branching decision logic | `decision-tree.html` |
| `knowledge_poll` | Knowledge Poll | Rate the effectiveness of a response | `knowledge-poll.html` |
| `peer_teachback` | Peer Teachbacks | Record, receive AI feedback, and review peers | `peer-teachbacks.html` |
| `comprehension_check` | Comprehension Check | Short formative understanding check | `comprehension-check.html` |
| `lesson_quiz` | Lesson Quiz | Assess a single lesson | `lesson-quiz.html` |
| `module_quiz` | Module Quiz | Assess a complete module | `module-quiz.html` |
| `mock_exam` | Mock Exam | Desktop-required exam and mobile results review | `mock-exam.html` |
| `capability_matrix` | Capability Matrix | Review a sequence of professional capabilities | `capability-matrix.html` |
| `standard_evolution` | Standard Evolution | Explore how a professional standard evolved | `standard-evolution.html` |
| `ethics_evolution` | Ethics Evolution | Explore stages in the code of ethics | `ethics-evolution.html` |
| `standard_comparison` | Standard Comparison | Compare shifts between standard versions | `standard-comparison.html` |
| `ethics_comparison` | Ethics Comparison | Compare earlier and updated ethics codes | `ethics-comparison.html` |
| `reading` | Reading | Read structured long-form learning content | `reading.html` |
| `definition_matrix` | Definition Matrix | Explore definitions through practical lenses | `definition-matrix.html` |
| `phase_controller` | Phase Controller | Swipe through methodology/process phases | `phase-controller.html` |
| `curriculum_overview` | Curriculum | Explore a curriculum and capability framework | `curriculum.html` |
| `core_terms` | Core Terms & Definitions | Progress through a sequence of core terms | `core-terms.html` |

## Prototype Variants

Variants are content or presentation configurations of a stable activity type,
not separate backend activity types.

| Prototype | Registered as | Notes |
|---|---|---|
| `key-takeaway-2.html` | `key_takeaway` | Alternate/multi-takeaway configuration |
| `knowledge-poll-2.html` | `knowledge_poll` | Alternate poll content and flow configuration |

## Activity Lifecycle

Recommended status values:

```text
not_started -> in_progress -> completed
                         \-> skipped
                         \-> blocked
```

An activity may additionally report `failed` or `requires_external_completion`
when its mechanic requires it. For example, `mock_exam` can wait for desktop
completion and `peer_teachback` can remain blocked until peer-review
requirements are satisfied.

## Navigation Migration

The HTML prototypes currently use direct links to demonstrate flows. Production
mobile implementations should replace those links with LMS navigation events:

```text
activity.started
activity.progressed
activity.completed
activity.skipped
activity.back_requested
activity.help_requested
```

After `activity.completed`, the LMS orchestration layer persists progress and
opens the backend-provided `nextActivityId`. Activity renderers do not choose
their successors.

## Exclusions

The following are not LMS activity types:

- Dashboard, Progress, Games, More, Settings, Notifications, and account screens
- Practice games such as Mindset Sprint, Logic Sniper, Blueprint Builder, and
  Narrative Quest
- Help/support screens

They may link into or support the LMS, but they are owned by separate app
navigation domains.

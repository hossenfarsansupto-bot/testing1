# Content Guide: Script-to-JSON Conversion Rules

This document defines the strict rules and conventions for converting docx script files into interactive scene JSON files for the NASA hardware storytelling web app. All subsequent scene conversions (Moon, Mars, Deep Space, Climax, Outro) must follow these rules to ensure engine compatibility and narrative consistency.

---

## 1. Scene File Format

Every scene is stored as a standalone JSON file in `/src/content/scenes/<scene_id>.json`.
The filename must match the `id` field exactly.

```json
{
  "id": "scene_identifier",
  "title": "Human Readable Title",
  "theme": "ship | moon | mars | mars_arctic | deep_space | alarm | home_stretch",
  "endsStory": false,
  "nodes": []
}
```

### Supported Themes
- `ship`: Inside Felice's spaceship (default / navigation).
- `moon`: Lunar surface sites (Retroreflectors, ALSEP).
- `mars`: Martian desert/equatorial landing sites (Viking, Sojourner).
- `mars_arctic`: Martian polar/ice sites (Phoenix / TEGA&MECA).
- `deep_space`: Outer solar system and interstellar probes (Pioneer, Voyager).
- `alarm`: Emergency warning theme (pulsing amber/red, high-contrast, respects reduce-motion).
- `home_stretch`: Return journey home through the asteroid belt.

---

## 2. Node Types and Schemas

### 2.1 `say` Node (Dialogue)
Used for speech by either Felice or the ship's computer (System).
```json
{
  "type": "say",
  "speaker": "felice" | "system",
  "text": "The spoken sentence or introductory text.",
  "list": [
    "Optional item 1",
    "Optional item 2"
  ]
}
```
- `speaker`: Only `"felice"` or `"system"` are valid speakers.
- `list`: When a speech contains a numbered or bulleted list (such as the 3 ship safety rules), it is attached to the `say` node via the `list` property. The UI renders this as an ordered list (1, 2, 3...) inside the dialogue bubble.

### 2.2 `stage` Node (Stage Directions / Narration)
Used for actions, atmospheric descriptions, or silence.
```json
{
  "type": "stage",
  "text": "Italicized action or narrative description."
}
```

### 2.3 `choice` Node (User Decision / Quiz)
Used for branching questions, feelings checks, or educational quizzes.
```json
{
  "type": "choice",
  "prompt": "Optional question prompt displayed above options.",
  "options": [
    {
      "label": "Option text",
      "correct": true,
      "response": [
        { "type": "say", "speaker": "felice", "text": "Feedback response." }
      ]
    }
  ]
}
```
- After the chosen option's `response` nodes play, story flow converges back to the parent sequence.
- Educational quizzes are not scored with penalties; incorrect answers receive kind, educational feedback.

### 2.4 `menu` Node (Visit-All Inspector)
Used when a script specifies inspecting multiple items before continuing (e.g. instruments, cameras).
```json
{
  "type": "menu",
  "prompt": "Select an instrument to inspect:",
  "mode": "visitAll",
  "options": [
    {
      "id": "instrument_a",
      "label": "Alpha Sensor",
      "nodes": [
        { "type": "say", "speaker": "felice", "text": "Details about Alpha Sensor..." }
      ]
    }
  ]
}
```
- The user is returned to the menu until all items have been visited. Once all options have been explored, the story proceeds to the next node.

### 2.5 `goto` Node (Scene Transition)
```json
{
  "type": "goto",
  "scene": "target_scene_id"
}
```
Used when a scene explicitly transitions to another scripted scene rather than returning to a hub.

---

## 3. Mapping Conventions from Script to JSON

1. **Speaker Mapping**:
   - Lines prefixed with `System:` map to `{ "type": "say", "speaker": "system", "text": "..." }`.
   - Lines prefixed with `Felice:` map to `{ "type": "say", "speaker": "felice", "text": "..." }`.
   - Plain text following a speaker label belongs to that speaker until the next speaker label is encountered.
2. **Stage Directions**:
   - Text enclosed in `*asterisks*` maps to `{ "type": "stage", "text": "..." }` with asterisks stripped.
   - Any standalone direction without a speaker label (even without asterisks) is narrative → `stage`.
3. **Dialogue Splitting**:
   - Long paragraphs must be split into dialogue-sized chunks of at most about 3 sentences.
   - Never split mid-sentence. Each chunk must be a coherent thought suitable for young readers (ages 8–13).
4. **Choices and Options**:
   - Bulleted `- option` lists following a question map to a `choice` node.
   - Text marked `(If 1 is selected: ...)` maps to that option's `response` array.
5. **Inspect Menus**:
   - Patterns indicating "Items available... return to this menu until all visited" map to `menu` with `"mode": "visitAll"`.
6. **Embedded Lists**:
   - Bulleted or numbered lists inside dialogue map to the `list` property on the `say` node.
7. **Author Notes Exclusion**:
   - Build instructions, notes in parentheses/italics such as `(Options will be added soon.)`, `(Both choices lead to the same outcome)`, or `*At this point in the story...*` are build metadata and must **NOT** be included in scene files.
8. **Destination Menus**:
   - Trailing menus at script ends (e.g., "Please pick the destination you'd like to visit") are excluded from scene files. Hubs generate destination navigation dynamically based on state.
9. **Story Ending**:
   - A final "THE END." line is omitted from text and represented by `"endsStory": true` on the scene object.
10. **Word-for-Word Fidelity**:
    - Preserve scripted wording exactly. Do not summarize, truncate, paraphrase, or inject added jokes.

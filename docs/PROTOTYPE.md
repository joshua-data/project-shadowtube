# UI Prototype Reference

HTML Prototype file: `docs/prototype.html`

## Screen Layout

### 1. Header
- Logo (ShadowTube) + Learning History / Settings buttons
- Sticky header with blur background

### 2. URL Input Area
- Center aligned, large title + subtitle
- URL input + "Extract Script" button
- Transitions to minimized state when loading starts

### 3. Main Layout (2 columns)

**Left (Main):**
- Video player (16:9 ratio, rounded corners)
- Control bar (segment navigation / segment repeat / speed / subtitle toggle / full repeat)
- Subtitle display area (English + translated, key expression highlights)

**Right (Side Panel, sticky):**
- Segment script list (scrollable, click to navigate, progress bar)
- Key expression panel (expressions for current segment)

### 4. Loading Overlay
- Full screen cover
- Step-by-step text: Extracting subtitles → Segmenting → Translating → Analyzing expressions

## Design Tokens

```css
--bg-primary: #0a0a0f      /* Background */
--bg-card: #1a1a26          /* Card background */
--accent: #6366f1           /* Main accent (indigo) */
--kr-accent: #38bdf8        /* Translation accent (sky blue) */
--text-primary: #e8e8f0     /* Primary text */
--text-secondary: #9898b0   /* Secondary text */
```

## Fonts

- Titles/UI: Outfit (sans-serif)
- Body: System font stack
- Code/Timestamps: JetBrains Mono

## Interactions

- Segment click → Switch subtitle/expressions + video seek
- EN/TR/OFF buttons → Subtitle toggle
- 🔁 button → Segment repeat mode active indicator
- Keyboard: ←→(segments), R(repeat), Space(play/pause), ±(speed)

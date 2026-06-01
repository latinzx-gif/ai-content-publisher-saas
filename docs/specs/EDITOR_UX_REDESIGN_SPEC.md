# Editor UX Redesign Specification

## Current Problems
- **Form-Heavy Experience:** The current Generate page feels like a complex settings configuration form rather than an immersive content creation canvas. 
- **Hidden Context:** Brand Memory, Image Rules, and Knowledge Sources are buried or disjointed from the active generation context, making it hard for users to know what the AI is "thinking."
- **Clunky Localization:** The multi-language workflow relies on dropdowns and toggle switches rather than an intuitive, side-by-side editing experience.
- **Delayed Gratification:** The workflow is form-first rather than preview-first; users must fill out extensive parameters before seeing any output.

## UX Goals
- **Preview-First Workflow:** Shift the focal point to the content output. Parameter adjustments should feel like real-time steering of an active canvas rather than a batch submission.
- **Contextual Visibility:** Expose active Brand Memory, Image Rules, and Knowledge Sources in a persistent, glanceable sidebar.
- **Seamless Multilingual:** Provide a side-by-side or quick-toggle translation view for flawless multi-language content editing.
- **Richer Experience:** Upgrade the output area to a WYSIWYG/block-style editor with inline AI steering and real-time platform previews.

## Information Architecture
The new architecture divides the workspace into three distinct contextual zones:

1. **Left Panel: Context & Sources**
   - Brand Memory Status (Active Tone, Personality, Image Rules).
   - Knowledge Sources (URLs, documents, RAG status).
   - Saved Templates & Angles.
2. **Center Panel: Editor Canvas**
   - Rich Text / Block Editor.
   - Inline AI command menu (e.g., "Make more professional", "Expand this point").
   - Language Split-View (e.g., Thai on the left, English on the right).
3. **Right Panel: Preview & Assets**
   - Platform-specific interactive preview (LinkedIn, Facebook, etc.).
   - Media Gallery (Generated AI images, uploaded assets).
   - Auto-Hashtag Manager.

## Component Tree
```
EditorLayout/
├── ContextSidebar/
│   ├── BrandMemoryWidget
│   ├── ImageRulesSummary
│   └── KnowledgeSourceManager
├── MainEditor/
│   ├── EditorToolbar (Formatting & AI Actions)
│   ├── LanguageSplitView
│   └── RichTextCanvas
└── PreviewSidebar/
    ├── PlatformPreview (Live rendered card)
    ├── MediaGallery
    └── HashtagManager
```

## Desktop Layout
The desktop layout utilizes a spacious 3-pane horizontal split to maximize productivity without hiding critical information:
- **Left Pane (`w-[20%]`):** Context Sidebar. Minimalist, mostly read-only status indicators and source management.
- **Center Pane (`flex-1`):** Editor Canvas. The primary focus area, maximizing width for the Language Split-View.
- **Right Pane (`w-[30%]`):** Preview Sidebar. Sticky position so the user always sees the final platform representation as they type.

## Responsive Layout
- **Large Desktop (1440px+):** Full 3-pane visibility.
- **Laptop (1280px - 1439px):** 3-pane visibility, relying on `flex-grow` and `flex-shrink` with `min-w` constraints to absorb compression without stacking.
- **Tablet (768px - 1279px):** 2-pane layout. The Left Panel (Context) collapses into an icon-rail or hidden drawer. Center (Editor) and Right (Preview) remain side-by-side.
- **Mobile (<768px):** Single column. Implements a fixed bottom Tab Navigation (`Context` | `Editor` | `Preview`) to allow users to switch between panes without excessive vertical scrolling.

## User Flow
1. **Initialize:** The user lands on the Editor. A lightweight modal or inline prompt asks for the core topic.
2. **Contextualize:** The user attaches Knowledge Sources (URLs) in the left panel. Brand Memory is auto-applied based on their profile.
3. **Draft Generation:** The AI populates the Center Pane with a draft.
4. **Refine & Localize:** The user edits the text inline. They open the Language Split-View to tweak the Thai and English versions simultaneously.
5. **Visualize:** The user reviews the Right Panel to see the exact LinkedIn card preview, adjusts generated AI images in the Media Gallery, and curates auto-generated hashtags.
6. **Approve:** The user clicks "Send to Review Board" or "Publish".

## Future AI Image Integration
The Media Gallery in the Right Panel will feature a "Generate Image" button. This will automatically read the `Image Rules` (color palettes, visual constraints, negative prompts) from the Brand Memory (Left Panel) and construct a highly optimized DALL-E/Midjourney prompt. This ensures all generated images are strictly on-brand without user effort.

## Future Google Drive RAG Integration
The `KnowledgeSourceManager` will expand beyond static URLs to include a Google Drive connector. Users can pick specific Docs or PDFs, which are instantly vectorized and added to the LLM's context window. Citations will appear directly within the Editor Canvas, explicitly showing which sentences were derived from which Drive document.

## Future Obsidian RAG Integration
To support power users with a "Second Brain" workflow, a local/cloud Obsidian vault connector will be added. This allows the AI to query specific markdown notes, tags, or daily logs directly into the active editor context, seamlessly merging personal knowledge management with public brand publishing.

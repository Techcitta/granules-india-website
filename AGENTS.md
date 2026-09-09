# Granules India Website — Project Memory & Design System Specification

This document serves as the persistent memory for all agents working on the Granules India website.

## 1. Core Typography Standard
- **Primary Font Family**: `'Manrope', Arial, sans-serif` (weights: 400, 500, 600, 700, 800).
- **Default Strong Text**: `#070707` / `#2a2a2a`
- **Default Body Text**: `#3f3f3f` / `#4b5563`
- **Brand Blue**: `#0061f8`
- **Muted / Secondary**: `#6a6a6a` / `#7b8898`

## 2. Master Type Scale & Roles

### Page Titles (`.cp-page-title`, `.ld-main-title`)
- **Desktop**: `clamp(34px, 2.8vw, 52px)`
- **Mobile**: `34px`
- **Weight**: `700`
- **Line Height**: `1.2` (120%)
- **Letter Spacing**: `-0.3px`
- **Color**: `#0061f8`

### Intro / Lead Descriptions (`.cp-about-desc`, `.ms-intro`, `.ld-main-desc`)
- **Desktop**: `clamp(18px, 1.3vw, 22px)` (Desktop 22px, Mobile 18px)
- **Weight**: `400`
- **Line Height**: `1.5` (150%)
- **Letter Spacing**: `-0.2px`
- **Color**: `#070707` (`var(--n9, #070707)`)
- **Paragraph Spacing**: `16px` vertical gap between paragraphs
- **Layout Rule**: Multi-sentence narrative intros must be broken into distinct paragraphs (`gap: 16px`) for visual clarity and breathing room.

### Section Headings (`h2`, `[class*='section-head'] h2`)
- **Desktop**: `clamp(26px, 2.3vw, 44px)`
- **Mobile**: `26px` - `28px`
- **Weight**: `700`
- **Line Height**: `1.2`
- **Letter Spacing**: `-0.5px`

### Card Headings (`.ld-name`, `[class*='card'] h3`)
- **Desktop**: `20px` (`var(--fs-card)`)
- **Mobile**: `18px`
- **Weight**: `700`
- **Line Height**: `1.3` - `1.4`
- **Letter Spacing**: `0`
- **Color**: `#0061f8`

### Metadata / Roles / Labels (`.ld-role`, `[class*='meta']`)
- **Desktop**: `14px` (`var(--fs-meta)`)
- **Mobile**: `12px`
- **Weight**: `600`
- **Line Height**: `1.35` - `1.4`
- **Letter Spacing**: `0.6px`
- **Text Transform**: `uppercase`
- **Color**: `#6a6a6a`

### Breadcrumbs (`.cp-breadcrumb`, `.ld-main-breadcrumb`, `.ld-profile-breadcrumb`)
- **Font**: `600 var(--fs-breadcrumb, 13.5px)/1.4 var(--font-primary, 'Manrope', sans-serif)`
- **Letter Spacing**: `0.9px`
- **Text Transform**: `uppercase`
- **Color**: `#7b8898`
- **Separator**: `›` (chevron character, color `#94a3b8`)
- **Active / Current**: `#0061f8` (`font-weight: 700`)
- **Margins**: `clamp(60px, 8vw, 118px) auto 16px !important;`

### Buttons & CTAs (`.ld-cta-btn`, `.btn`, `button`)
- **Desktop**: `16px` (`var(--fs-button)`)
- **Mobile**: `14px`
- **Weight**: `700`
- **Line Height**: `1.5`
- **Letter Spacing**: `0.2px`
- **Text Transform**: `uppercase`

## 3. Container & Spacing System
- **Container Shell**: Always `width: min(85%, 1632px) !important; max-width: 1632px !important; margin-inline: auto !important; box-sizing: border-box;`
- **Section Spacing**: Standard `75px` vertical gap between major blocks.
- **Card Grids**:
  - Leadership grid uses 3 cards per row across both tabs: `grid-template-columns: repeat(3, 1fr)`.
  - Grid Gap: `clamp(36px, 4vw, 56px) clamp(24px, 2.5vw, 36px)`.
- **Stat & Metric Boxes**:
  - Background: `#edf5ff`
  - Border Radius: `22px`
  - Padding: `22px 24px`
  - Value: `48px` / `500` / `#0061f8`
  - Label: `12px` / `600` / uppercase / `#0061f8`

## 4. Cross-Link / CTA Banner Standard (e.g. `.cp-career`, `.ms-leadership`)
- **Container Shell**:
  - Width: `width: min(85%, 1632px) !important; max-width: 1632px !important;`
  - Margins: `margin: 75px auto 0 !important;` (standard 75px section gap)
  - Height: `height: 250px; min-height: 250px;` (desktop)
  - Border Radius: `40px`
  - Padding: `24px clamp(30px, 4vw, 60px)`
  - Box Shadow: `0 16px 44px -12px rgba(0, 34, 90, 0.1)`
  - Display: `display: flex; align-items: center; position: relative; overflow: hidden;`
- **Background & Gradient Overlay**:
  - Image: `img.cp-bg` (`position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;`)
  - Overlay: `.cp-bg-overlay` (`position: absolute; inset: 0; z-index: 0; background: linear-gradient(89deg, rgba(190, 237, 250, 0.9) 34.8%, rgba(0, 186, 234, 0) 68.9%), rgba(0, 0, 0, 0.1);`)
- **Content Stack Layout (`[class*='-copy']`)**:
  - `position: relative; z-index: 1; max-width: 744px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px;`
- **Pill CTA Button (`.cp-cta-btn`)**:
  - **Position**: Stacked directly **above the heading** (`margin-bottom: 2px`) on the left.
  - **Padding**: `7px 20px`
  - **Border Radius**: `50px`
  - **Background**: `#0061f8`
  - **Text Color**: `#ffffff`
  - **Font**: `700 clamp(10.5px, 0.75vw, 12px)/1 var(--font-primary, 'Manrope', sans-serif)`
  - **Letter Spacing**: `0.8px`
  - **Text Transform**: `uppercase`
  - **Arrow Icon**: `→` (`&rarr;`) with gap `6px`
  - **Hover**: `background: #004ecc; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0, 97, 248, 0.35);`
- **Banner Heading (`h2`)**:
  - **Font**: `700 clamp(24px, 2.2vw, 36px)/1.2 var(--font-primary, 'Manrope', sans-serif)`
  - **Letter Spacing**: `-0.02em`
  - **Color**: `#0061f8`
- **Banner Subtext (`p`)**:
  - **Font**: `500 clamp(13.5px, 0.95vw, 16px)/1.45 var(--font-primary, 'Manrope', sans-serif)`
  - **Letter Spacing**: `-0.01em`
  - **Color**: `#2a2a2a`


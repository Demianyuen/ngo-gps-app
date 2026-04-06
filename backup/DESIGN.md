# Design System: NGO GPS - Apple Inspired Minimal

## 1. Visual Theme & Atmosphere

NGO GPS adopts Apple's philosophy of minimalism with purpose — every element serves the user's journey through exploration activities. The design is reductive to its core: vast white spaces create breathing room, typography anchors the experience, and the interface retreats until it becomes invisible. This is minimalism as reverence for the content.

The design creates a cinematic experience — alternating between pure white backgrounds that feel open and informational, and subtle gray sections that provide visual rhythm. The color story is intentionally restrained: a sophisticated blue gradient serves as the primary accent, representing technology and trust, while neutrals create a clean, professional canvas.

**Key Characteristics:**
- System fonts with optical sizing — SF Pro Display/Text on Apple, -apple-system elsewhere
- Binary light/neutral section rhythm: pure white (`#ffffff`) alternating with light gray (`#f5f5f7`)
- Primary accent: Sophisticated blue gradient (`#667eea` → `#764ba2`) for CTAs and highlights
- Card-based layout with generous whitespace
- Extremely tight headline line-heights (1.07-1.14) creating billboard-like impact
- Full-width section layout with centered content
- Pill-shaped CTAs creating soft, approachable action buttons
- Generous whitespace allowing each moment to breathe

## 2. Color Palette & Roles

### Primary
- **Pure White** (`#ffffff`): Main backgrounds, content areas. Clean canvas for exploration.
- **Light Gray** (`#f5f5f7`): Alternate section backgrounds, card containers. Subtle depth without distraction.
- **Near Black** (`#1d1d1f`): Primary text on light backgrounds. Slightly warmer than pure black.

### Interactive & Brand
- **Primary Gradient** (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`): Main CTAs, brand elements, active states
- **Primary Blue** (`#667eea`): Hover states, focus rings, secondary interactive elements
- **Deep Purple** (`#764ba2`): Gradient end point, dark mode accents

### Text Colors
- **Primary Text** (`#1d1d1f`): Headlines, body text on light backgrounds
- **Secondary Text** (`#86868b`): Supporting text, descriptions, metadata
- **Tertiary Text** (`#86868b` with 60% opacity): Disabled states, placeholders
- **White** (`#ffffff`): Text on dark/gradient backgrounds

### Surfaces
- **Surface 1** (`#f5f5f7`): Card backgrounds, elevated surfaces
- **Surface 2** (`#eaeaea`): Nested cards, grouped content
- **Surface 3** (`#ffffff`): Highest elevation, modals, overlays

### Functional
- **Success** (`#34c759`): Completed checkpoints, positive feedback
- **Warning** (`#ff9500`): Alerts, important notices
- **Error** (`#ff3b30`): Error states, failed actions
- **Info** (`#5ac8fa`): Informational messages

## 3. Typography Rules

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
             "PingFang TC", "Microsoft JhengHei", "Segoe UI", sans-serif;
```

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| Display Hero | 56px | 600 | 1.07 | -0.28px | Main headlines, max impact |
| Section Heading | 40px | 600 | 1.10 | normal | Feature titles, page headers |
| Tile Heading | 28px | 400 | 1.14 | 0.196px | Content section titles |
| Card Title | 21px | 700 | 1.19 | 0.231px | Bold card headings |
| Sub-heading | 21px | 400 | 1.19 | 0.231px | Regular card headings |
| Body Large | 19px | 400 | 1.47 | -0.374px | Emphasized body text |
| Body | 17px | 400 | 1.47 | -0.374px | Standard reading text |
| Body Emphasis | 17px | 600 | 1.24 | -0.374px | Labels, emphasized text |
| Caption | 14px | 400 | 1.29 | -0.224px | Secondary text, descriptions |
| Caption Bold | 14px | 600 | 1.29 | -0.224px | Emphasized captions |
| Micro | 12px | 400 | 1.33 | -0.12px | Fine print, metadata |

### Principles
- **Weight restraint**: Primarily 400 (regular) and 600 (semibold). Use 700 sparingly.
- **Negative tracking**: Subtle letter-spacing adjustment at all sizes for tight, efficient text.
- **Extreme line-height range**: Headlines at 1.07, body at 1.47.
- **Traditional Chinese**: "PingFang TC" and "Microsoft JhengHei" for optimal rendering.

## 4. Component Stylings

### Buttons

**Primary (Gradient CTA)**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #ffffff;
padding: 14px 28px;
border-radius: 12px;
border: none;
font-size: 17px;
font-weight: 400;
transition: all 0.2s ease;
```
Hover: Scale 1.02, brightness 1.05
Active: Scale 0.98
Focus: 2px solid #667eea outline

**Secondary**
```css
background: #f5f5f7;
color: #1d1d1f;
padding: 12px 24px;
border-radius: 10px;
border: none;
font-size: 17px;
```

**Pill Link**
```css
background: transparent;
color: #667eea;
border-radius: 980px;
border: 1px solid #667eea;
padding: 8px 16px;
font-size: 14px;
```

### Cards
```css
background: #ffffff;
border-radius: 16px;
padding: 20px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
transition: all 0.3s ease;
```
Hover: `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1)`

### Inputs
```css
background: #ffffff;
border: 2px solid #e2e8f0;
border-radius: 10px;
padding: 12px 16px;
font-size: 17px;
transition: border-color 0.2s;
```
Focus: `border-color: #667eea`

### Navigation
**Tab Bar**
```css
background: rgba(255, 255, 255, 0.94);
backdrop-filter: saturate(180%) blur(20px);
border-top: 0.5px solid #e2e8f0;
```

**Header**
```css
background: rgba(255, 255, 255, 0.94);
backdrop-filter: saturate(180%) blur(20px);
border-bottom: 0.5px solid #e2e8f0;
```

## 5. Layout Principles

### Spacing Scale
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- Section spacing: 64px vertical
- Component spacing: 24px
- Element spacing: 12-16px

### Grid System
- Container max-width: 1200px
- Columns: 12
- Gutter: 24px
- Margins: 20px (mobile), 40px (desktop)

### Whitespace Philosophy
Generous whitespace is intentional — it creates focus and sophistication. Never crowd elements.

## 6. Depth & Elevation

```css
/* Elevation Levels */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.15);
```

### Surface Hierarchy
1. Base: `#ffffff` (white canvas)
2. Elevated: `#f5f5f7` (light gray cards)
3. Floating: White with shadow-md
4. Modal: White with shadow-xl

## 7. Do's and Don'ts

### Do
- ✅ Use generous whitespace
- ✅ Maintain tight line-heights for headlines
- ✅ Apply subtle shadows for depth
- ✅ Use gradient CTAs sparingly
- ✅ Keep button corners rounded (12px)
- ✅ Use consistent 16-20px card padding

### Don't
- ❌ Use pure black (`#000000`) — use `#1d1d1f`
- ❌ Over-use gradients — reserve for primary actions
- ❌ Use harsh borders — prefer shadows
- ❌ Crowd elements — whitespace is luxury
- ❌ Mix too many font weights — stick to 400/600
- ❌ Use bright neon colors — stay sophisticated

## 8. Responsive Behavior

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px

### Mobile Optimizations
- Single column layout
- Larger touch targets
- Simplified navigation
- Optimized images (WebP)

## 9. Implementation Examples

### Activity Card
```jsx
<div style={{
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  marginBottom: '16px'
}}>
  <h3 style={{
    fontSize: '21px',
    fontWeight: 700,
    lineHeight: '1.19',
    letterSpacing: '0.231px',
    margin: '0 0 8px 0'
  }}>
    長洲島歷史文化探索
  </h3>
  <p style={{
    fontSize: '17px',
    lineHeight: '1.47',
    color: '#86868b',
    margin: '0 0 20px 0'
  }}>
    探索長洲島的歷史古蹟與自然美景
  </p>
  <button style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '17px',
    fontWeight: 400,
    cursor: 'pointer'
  }}>
    立即參加
  </button>
</div>
```

### History Section
```jsx
<div style={{
  background: '#fef5e7',
  borderLeft: '4px solid #f39c12',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px'
}}>
  <h4 style={{
    fontSize: '17px',
    fontWeight: 600,
    color: '#1d1d1f',
    margin: '0 0 12px 0'
  }}>
    📜 歷史故事
  </h4>
  <p style={{
    fontSize: '17px',
    lineHeight: '1.6',
    color: '#2c3e50',
    margin: 0
  }}>
    張保仔是清朝著名的海盜，據說他在這個洞穴收藏了無數寶藏...
  </p>
</div>
```

---

**Design Philosophy Summary:**
Minimalism with purpose — every pixel serves the user's exploration journey. Apple-inspired sophistication meets NGO GPS functionality.

# Mobile Testing Checklist

## Overview
This document provides a comprehensive testing guide for verifying mobile responsiveness and touch interactions on the Habit Tracker app.

---

## Testing Tools

### Option 1: Chrome DevTools (Recommended for Quick Testing)
1. Open app in Chrome: `http://localhost:3000`
2. Press `F12` to open DevTools
3. Click **Toggle Device Toolbar** (or `Ctrl+Shift+M` / `Cmd+Shift+M`)
4. Select device presets:
   - **iPhone SE** (375x667) - Small screen
   - **iPhone 13** (390x844) - Modern iPhone
   - **Pixel 5** (393x851) - Android
   - **iPad** (768x1024) - Tablet
   - **Custom** (320px width) - Minimum viewport

### Option 2: Real Device Testing
- Access via local network: `http://[your-computer-IP]:3000`
- Test on actual iOS/Android devices

### Option 3: Browser Mobile Emulation
- **Firefox:** `Ctrl+Shift+M` → Responsive Design Mode
- **Safari:** Enable Developer menu → Enter Responsive Design Mode

---

## Test Checklist

### 🏠 Login Page (All Screen Sizes)

| Feature | 375px | 390px | 768px | Status |
|---------|-------|-------|-------|--------|
| Page centers properly | ☐ | ☐ | ☐ | |
| Title readable (not cut off) | ☐ | ☐ | ☐ | |
| Input fields full width | ☐ | ☐ | ☐ | |
| **TEST:** Tap email input → No auto-zoom | ☐ | ☐ | ☐ | |
| **TEST:** Tap password input → No auto-zoom | ☐ | ☐ | ☐ | |
| Login button ≥ 44px tall (easy to tap) | ☐ | ☐ | ☐ | |
| "Sign Up" link tappable | ☐ | ☐ | ☐ | |
| No horizontal scrolling | ☐ | ☐ | ☐ | |

**Test Actions:**
- Tap email field → Keyboard should appear, no zoom
- Tap password field → Keyboard should appear, no zoom
- Tap Login button → Should submit
- Tap "Sign Up instead" link → Should switch mode

---

### 📱 Main App Header (Logged In)

| Feature | 375px | 390px | 768px | Status |
|---------|-------|-------|-------|--------|
| App title centered and visible | ☐ | ☐ | ☐ | |
| Buttons stack properly | ☐ | ☐ | ☐ | |
| "+ Create Habit" button tappable | ☐ | ☐ | ☐ | |
| Settings button tappable (⚙️) | ☐ | ☐ | ☐ | |
| Logout button tappable | ☐ | ☐ | ☐ | |
| No button overlap | ☐ | ☐ | ☐ | |
| No text wrapping in button labels | ☐ | ☐ | ☐ | |

**Expected Layout:**
- **≤ 400px:** Buttons stack vertically (full width)
- **400-768px:** Buttons in 2 columns
- **> 768px:** All buttons in one row

**Test Actions:**
- Tap "+ Create Habit" → Modal should open
- Tap Settings (⚙️) → Should navigate to settings page
- Tap Logout → Should redirect to login

---

### 🃏 Habit Cards

| Feature | 375px | 390px | 768px | Status |
|---------|-------|-------|-------|--------|
| Cards stack vertically (1 column) | ☐ | ☐ | ☐ | |
| Card takes full available width | ☐ | ☐ | ☐ | |
| Habit name readable (no overflow) | ☐ | ☐ | ☐ | |
| Description truncates properly | ☐ | ☐ | ☐ | |
| Freeze badge (❄️) visible | ☐ | ☐ | ☐ | |
| Streak badge (🔥) visible | ☐ | ☐ | ☐ | |
| Timer/completion display readable | ☐ | ☐ | ☐ | |
| All buttons fit in row (no wrap) | ☐ | ☐ | ☐ | |
| **TEST:** Buttons ≥ 44px tall | ☐ | ☐ | ☐ | |
| No card horizontal overflow | ☐ | ☐ | ☐ | |

**Test Actions:**
- Tap "Mark Complete" → Should complete habit
- Tap "View Stats" → Stats modal opens
- Tap "Edit" → Edit modal opens
- Tap "Delete" → Confirmation modal opens
- Verify color status (green/yellow/orange/red) displays correctly

---

### ➕ Create/Edit Habit Modal

| Feature | 375px | 390px | 768px | Status |
|---------|-------|-------|-------|--------|
| Modal centers on screen | ☐ | ☐ | ☐ | |
| Close button (✕) tappable ≥ 44px | ☐ | ☐ | ☐ | |
| Habit name input full width | ☐ | ☐ | ☐ | |
| Description textarea full width | ☐ | ☐ | ☐ | |
| **TEST:** Input tap → No auto-zoom | ☐ | ☐ | ☐ | |
| Checkboxes easy to toggle | ☐ | ☐ | ☐ | |
| Number inputs responsive | ☐ | ☐ | ☐ | |
| Cancel/Create buttons stack vertically | ☐ | ☐ | ☐ | |
| Buttons ≥ 48px tall (better touch) | ☐ | ☐ | ☐ | |
| Modal doesn't extend beyond screen | ☐ | ☐ | ☐ | |
| Scrollable if content overflows | ☐ | ☐ | ☐ | |

**Test Actions:**
- Tap ✕ → Modal closes
- Tap outside overlay → Modal closes
- Fill form → Tap "Create Habit" → Success
- Tap "Cancel" → Modal closes without saving

---

### ⚙️ Settings Page

| Feature | 375px | 390px | 768px | Status |
|---------|-------|-------|-------|--------|
| Page header centered | ☐ | ☐ | ☐ | |
| White box fits screen width | ☐ | ☐ | ☐ | |
| Email field readable | ☐ | ☐ | ☐ | |
| **TEST:** Password input → No zoom | ☐ | ☐ | ☐ | |
| Password strength bar visible | ☐ | ☐ | ☐ | |
| "Change Password" button full width | ☐ | ☐ | ☐ | |
| "Delete Account" button full width | ☐ | ☐ | ☐ | |
| Buttons ≥ 48px tall | ☐ | ☐ | ☐ | |
| Danger zone (yellow) readable | ☐ | ☐ | ☐ | |
| "Back to Habits" button tappable | ☐ | ☐ | ☐ | |
| Delete modal confirmation works | ☐ | ☐ | ☐ | |

**Test Actions:**
- Change password → Verify success message
- Type weak password → Strength bar shows "Weak"
- Type strong password → Strength bar shows "Strong"
- Click "Delete Account" → Confirmation modal appears
- Type "DELETE" → Delete button activates

---

### 📊 Stats Modal (View Stats)

| Feature | 375px | 390px | 768px | Status |
|---------|-------|-------|-------|--------|
| Modal centers properly | ☐ | ☐ | ☐ | |
| Close button (✕) tappable | ☐ | ☐ | ☐ | |
| Streak stats readable | ☐ | ☐ | ☐ | |
| Freeze count visible | ☐ | ☐ | ☐ | |
| "Use Freeze" button accessible | ☐ | ☐ | ☐ | |
| Numbers don't wrap weird | ☐ | ☐ | ☐ | |
| Modal scrollable if needed | ☐ | ☐ | ☐ | |

**Test Actions:**
- Open stats on in-danger habit → "Use Freeze" button present
- Tap "Use Freeze" → Confirmation modal opens
- Verify streak displayed correctly

---

## Touch Interaction Tests

### Tap Highlighting
- ✅ Tapping buttons should show subtle purple highlight (0.2 opacity)
- ✅ No weird blue highlight on Android Chrome
- ✅ No stuck highlight after tap

### Keyboard Behavior
- ✅ Tapping input focuses keyboard
- ✅ Input scrolls into view (not hidden by keyboard)
- ✅ No page zoom when focusing inputs
- ✅ "Done"/"Go" button on keyboard works

### Scroll Behavior
- ✅ Page scrolls smoothly (no janky scrolling)
- ✅ No horizontal scrolling on any page
- ✅ Modal content scrolls if taller than viewport
- ✅ No rubber-band scrolling beyond page bounds

### Button Touch Targets
Measure button size using DevTools "Inspect":
- All primary action buttons: **≥ 44x44px** ✅
- Modal close buttons: **≥ 44x44px** ✅
- Header buttons: **≥ 44px height** ✅

---

## Browser Testing Matrix

| Browser | Device | Version | Status | Notes |
|---------|--------|---------|--------|-------|
| Chrome | iPhone SE (simulator) | Latest | ☐ | DevTools emulation |
| Chrome | Pixel 5 (simulator) | Latest | ☐ | DevTools emulation |
| Safari | iPhone 13 | iOS 17+ | ☐ | Real device |
| Chrome | Android phone | 120+ | ☐ | Real device |
| Firefox | Desktop responsive | Latest | ☐ | Responsive mode |
| Edge | Desktop responsive | Latest | ☐ | Mobile emulation |

---

## Common Issues to Watch For

### ❌ Problems to Avoid
- **Auto-zoom on input focus** (iOS Safari)
  - Fixed by: `font-size: 16px` on all inputs
- **Buttons too small** (< 44px)
  - Fixed by: Global `min-height: 44px` on buttons
- **Horizontal scrolling**
  - Fixed by: `overflow-x: hidden` on body
- **Text overlapping**
  - Fixed by: Responsive font sizes, proper padding
- **Modal too wide**
  - Fixed by: `max-width: 100%`, padding on overlay
- **Tap delay** (300ms on older iOS)
  - Fixed by: Modern CSS (no extra fixes needed in 2024)

### ✅ Expected Mobile Behaviors
- Smooth scrolling
- Tap highlights briefly (purple tint)
- Modals overlay content cleanly
- Forms submit on "Go" keyboard button
- No pinch-zoom needed (but allowed via `maximum-scale=5`)

---

## Testing Commands

### Start Dev Server
```bash
npm start
```

### Check Mobile-Friendly Meta Tags
Open DevTools → Elements → `<head>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes">
<meta name="theme-color" content="#667eea">
```

### Simulate Slow Network (Mobile 3G)
1. DevTools → Network tab
2. Set throttling: "Slow 3G"
3. Reload page → Verify load time acceptable

---

## Quick Mobile Test (5 Minutes)

**iPhone SE (375px)**
1. Login → ✅
2. Create habit → ✅
3. Mark complete → ✅
4. View stats → ✅
5. Edit habit → ✅
6. Delete habit → ✅
7. Settings page → ✅
8. Change password → ✅
9. Logout → ✅

**Pixel 5 (393px)**
1. Login → ✅
2. Timer habit → Start/Stop → ✅
3. Freeze badge visible → ✅
4. Color status changes → ✅

**iPad (768px)**
1. Cards remain single column → ✅
2. Header buttons in row → ✅

---

## Reporting Issues

If you find layout bugs:
1. **Screenshot** the issue
2. **Note device/screen size** (e.g., "iPhone 13, 390x844")
3. **Describe behavior** ("Button text wraps to 3 lines")
4. **Expected behavior** ("Button should be 1 line")

---

## Status Summary

**Total Tests:** 100+  
**Completed:** ☐  
**Issues Found:** 0  
**Date Tested:** ___________  

---

## Next Steps After Mobile Testing

Once mobile tests pass:
1. ✅ Mark "Mobile Testing & Tweaks" complete in roadmap
2. Move to **Error Boundary Component**
3. Test error boundary on mobile too
4. Deploy to Vercel for real-world mobile testing

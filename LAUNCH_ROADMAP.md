# Habit Tracker — Google Play Launch Roadmap

**Target:** Publish to Google Play Store in 3 days of focused development  
**Effort:** 3 hours/day (lean, MVP-focused)  
**Tech Stack:** React (frontend) → Vercel, FastAPI (backend) → Railway

---

## 🎯 Progress Tracker

| Day | Status | Completed | Total |
|-----|--------|-----------|-------|
| Day 1 | 🟢 In Progress | 1/5 | 5 tasks |
| Day 2 | ⏳ Planned | 0/5 | 5 tasks |
| Day 3 | ⏳ Planned | 0/6 | 6 tasks |

**Last Updated:** Feb 13, 2026 | **Started:** Feb 13, 2026

---

## 📅 Development Schedule

### **Day 1: Core Card Features & Backend Freezes**
*Focus: Essential user interactions (Edit, Delete, Manual Override) + backend freeze init*

#### Frontend (2.5 hrs)
- [ ] Add **Edit Habit Modal** (edit name, description, settings)
  - Reuse CreateHabitModal as template
  - Call PATCH `/habits/{id}` endpoint
  - Show success/error feedback
  
- [ ] Add **Delete Habit Button & Confirmation Dialog**
  - Red button at bottom of card
  - "Are you sure? This cannot be undone." modal
  - Call DELETE `/habits/{id}` endpoint
  - Refresh habit list on success
  
- [ ] Add **Manual Override for Timer Habits**
  - Button appears only if `allow_manual_override=true`
  - Time picker dialog (hours: 0-23, minutes: 0-59)
  - Submit as manual log entry to backend
  - Show success confirmation

- [ ] **Reorganize Card Buttons** (consistent layout):
  ```
  [Mark Complete / START] [View Stats] [Edit] [Delete]
  ```
  - All in one row (flex wrap if needed)
  - Consistent sizing and spacing

#### Backend (0.5 hrs)
- [x] Initialize **2 Freezes per Habit** at creation
  - ✅ Added `freezes_remaining` field to Habit model (default: 2)
  - ✅ Updated POST `/habits/` to initialize with 2 freezes
  - ✅ Created Alembic migration & applied to database
  - ✅ Updated `use_freeze()` endpoint to decrement per-habit freezes
  - ✅ Updated `get_habit_stats()` to return habit.freezes_remaining

---

### **Day 2: Danger Visual System & Account Settings**
*Focus: User safety feedback (In Danger colors) + account management*

#### Frontend (2.5 hrs)
- [ ] **Implement "In Danger" Color System**
  - Use `HabitStatus.color` + `HabitStatus.in_danger` from backend
  - Card border glow colors:
    - 🟢 Green: Completed today
    - 🟡 Yellow: Pending, safe (early in day)
    - 🟠 Orange: In danger (late in day, not completed)
    - 🔴 Red: Missed (missed yesterday)
    - 🔵 Blue: Frozen (streak freeze applied)
  - Update card CSS classes dynamically
  - Show warning badge "⚠️ In Danger" on card
  
- [ ] **Usage of Freezes Button** (next to Edit/Delete)
  - Only show if `freezes.remaining > 0` and `in_danger = true`
  - Call POST `/habits/{id}/freeze` on click
  - Show "Freeze used!" confirmation, decrement counter
  - Disable button if already frozen or no freezes left

- [ ] **Account Settings Page**
  - New route: `/settings`
  - Display current email
  - Change password form (current + new password)
  - Delete account button with double-confirmation
  - Freeze balance display (earned freezes from user level)

- [ ] **Settings Navigation Link** (in app header)

#### Backend (0.5 hrs)
- [ ] Verify `freeze_balance` increments every 7-day streak
  - Logic should already exist; confirm in tests
  - No changes needed if working correctly

---

### **Day 3: Polish, Testing & Deployment Setup**
*Focus: Production readiness, deployment configuration, store assets*

#### Frontend (1.5 hrs)
- [ ] **Environment Configuration**
  - Create `.env.production` with backend API URL
  - Update API service to use `process.env.REACT_APP_API_URL`
  - Test against production backend URL
  
- [ ] **Error Boundary Component**
  - Wrap app in error boundary
  - Display friendly error messages
  - Add "Report Bug" button
  
- [ ] **Loading Placeholders (Skeleton Screens)**
  - Habit card skeleton during load
  - Stats modal skeleton during fetch
  - Smoother perceived performance

- [ ] **Mobile Testing & Tweaks**
  - Test on iPhone Safari (iOS)
  - Test on Android Chrome
  - Fix any layout breakage
  - Verify touch interactions (no hover-only features)

- [ ] **Create PWA Manifest** (mobile install support)
  - `public/manifest.json` (update icons, name, theme color)
  - Add to home screen capability

- [ ] **Final UI Polish**
  - Consistent spacing across all components
  - Accessibility: ARIA labels, keyboard navigation
  - Dark mode consideration (defer if tight on time)

#### Backend (0.5 hrs)
- [ ] **Update CORS** for production domain
  - Add your final Vercel frontend domain to allowed origins
  - Remove localhost restrictions
  
- [ ] **Environment Variables**
  - Database URL (managed by Railway)
  - JWT secret (strong, random)
  - CORS domain configuration
  - API documentation URL

- [ ] **Deploy to Railway** (free tier)
  - Connect GitHub repo
  - Set environment variables
  - Verify all endpoints working
  - Load test (basic)

#### Google Play Store Prep (1 hr)
- [ ] **Create Google Play Developer Account**
  - Pay $25 one-time fee
  - Complete company/identity verification
  
- [ ] **Build APK/App Bundle**
  - Generate signed release build
  - Create app signing key
  
- [ ] **Prepare Store Listing**
  - App title: "Habit Tracker"
  - Short description (80 chars)
  - Full description (4000 chars)
  - Screenshot 1: Habit list view
  - Screenshot 2: Timer in action
  - Screenshot 3: Stats modal
  - Screenshot 4: Streak counter
  - Privacy policy URL
  - Support email
  - Category: Productivity or Lifestyle

- [ ] **Submit for Review**
  - Upload APK/AAB bundle
  - Submit for review
  - Expected wait: 24-48 hours for approval

---

## ✅ Pre-Launch Checklist

### Security & Privacy
- [ ] Privacy policy page (on website or in-app)
- [ ] Data handling disclosure (no tracking, no ads)
- [ ] GDPR/user data compliance verified
- [ ] Secure password hashing (bcrypt) ✅ already implemented
- [ ] JWT token expiry configured

### Performance
- [ ] Bundle size < 500KB (gzipped)
- [ ] First Contentful Paint < 2 seconds
- [ ] No console errors
- [ ] Network requests optimized (no duplicate calls)

### Testing
- [ ] Smoke test: Create habit → Log session → View stats
- [ ] Smoke test: Edit habit → Delete habit
- [ ] Smoke test: Use freeze on in-danger habit
- [ ] Smoke test: Mobile viewport full walkthrough
- [ ] Error case: Logout → Can't access habits (403 error handling)

### Backend
- [ ] All endpoints responding with correct status codes
- [ ] Error messages are helpful and non-leaky
- [ ] Database backups configured
- [ ] Monitoring/logging setup (if using Railway)

---

## 📊 Feature Priority Matrix

### 🟢 Must Have (Day 1-3)
1. Edit habit
2. Delete habit (with confirmation)
3. Manual override for timer habits (with time picker)
4. Delete account
5. In Danger visual system
6. Use freezes button
7. Initial 2 freezes per habit

### 🟡 Should Have (Post-Launch, Week 1-2)
8. Weekly analytics charts
9. Streak milestone notifications ("7-day streak unlocked!")
10. Best streak tracking & display
11. Habit categories/tags
12. Settings page (notifications times)

### 🔵 Nice to Have (Post-Launch, Month 2+)
13. Achievement badges
14. Dark mode
15. Completion calendar heatmap
16. Data export (CSV/PDF)
17. Habit templates
18. Custom habit icons

---

## 📝 Further Recommendations & Future Considerations

### Recommended Future Additions (Priority Order)

#### Tier 1 (Month 1)
- **Habit Archive** instead of hard delete (ability to restore)
  - Backend: Add `archived: bool` to Habit model
  - Frontend: Show "Archive" instead of "Delete", add archived filter
  
- **Notification Reminders**
  - Per-habit notification time (e.g., "Remind me at 9 PM")
  - Requires push notification setup (Firebase Cloud Messaging)
  - Low priority if no users request

- **Avatar & Profile Customization**
  - User avatar upload
  - Display name (vs email)
  - Bio/about section

#### Tier 2 (Month 2)
- **Social Features** (optional, lowers privacy guarantee)
  - Friend/group habits
  - Habit sharing (view-only mode)
  - Leaderboards (top streaks)
  - **Risk:** Significantly increases backend complexity

- **Advanced Analytics**
  - Weekly trend charts (line graph)
  - Monthly summary (bar charts)
  - Consistency score (% of days completed)
  - Time-of-day heatmap (when are you most productive?)

- **Gamification**
  - XP system (points for streaks)
  - Level progression
  - Badges (7-day, 30-day, 100-day, never_froze, etc.)
  - **Warning:** Can become a distraction; keep it simple

#### Tier 3 (Month 3+)
- **AI/ML Features** (higher server cost)
  - Predictive completion reminders
  - Habit recommendations based on user patterns
  - Motivation quotes based on mood
  
- **Integration with External Services**
  - Apple Health integration
  - Google Calendar integration
  - Strava integration for fitness habits
  - **Complexity:** High; consider third-party SDKs

- **Offline-First Architecture**
  - Local data sync when online
  - Works without internet
  - **Complexity:** Significant refactor

---

### Features to Possibly Skip (Keep it Simple)

❌ **Not Recommended for v1:**
- Multi-profile support (one user per account is fine)
- Habit sharing groups
- In-app messaging/chat
- Wearable integration (Apple Watch, Fitbit)
- Gamification point system (too distracting)
- AI coach feature (too complex, needs NLP)
- Habit prediction algorithm (premature optimization)
- Cryptocurrency/blockchain rewards (unnecessary, adds complexity)

**Why skip these?** They add surface area for bugs, increase backend cost, and dilute core functionality. Launch simple. Add based on *user request*, not speculation.

---

### Backend Architecture Notes

**Current Stack:**
- Python 3.10+
- FastAPI (async, performant)
- SQLAlchemy ORM (database-agnostic)
- PostgreSQL (managed by Railway)
- alembic (migrations, version-controlled)

**Scalability Considerations (not needed for v1, but good to know):**
- Current in-memory session handling is fine for < 10k users
- For millions: Consider Redis for session caching
- For millions: Add database read replicas
- For millions: Add CDN for frontend (Vercel already includes)

**Monitoring** (recommended even for v1):
- Sentry (error tracking, free tier generous)
- LogRocket (session replay, helps debug user issues)
- PostHog (product analytics, privacy-first)

---

### Deployment Recommendations

**Frontend Hosting:**
| Platform | Pros | Cons | Cost |
|----------|------|------|------|
| **Vercel** | Next.js native, auto-scaling, Analytics | Limited to Vercel ecosystem | Free tier generous |
| **Netlify** | Same as Vercel, great UX | Same limitations | Free tier generous |
| **Firebase Hosting** | Google ecosystem integration | Lock-in | Free tier small |

**Recommendation:** **Vercel** — Best developer experience, auto-deploy from GitHub, generous free tier.

**Backend Hosting:**
| Platform | Pros | Cons | Cost |
|----------|------|------|------|
| **Railway** | Simple UI, good docs, FastAPI ready | Limited free tier (500hrs/month) | Free tier with pay-as-you-go |
| **Fly.io** | Global deployment, Kubernetes native | Learning curve | Free tier small, then pay |
| **Render** | Auto-deploy, simple, free tier | Slower cold starts | Free tier tiny, then paid |

**Recommendation:** **Railway** — Best middle ground for small to medium apps, clear pricing.

---

### Cost Estimate (First Year)

| Service | Cost | Notes |
|---------|------|-------|
| Google Play Account | $25 (one-time) | Registration fee |
| Vercel (frontend) | $0/month | Free tier sufficient for < 100k users |
| Railway (backend) | $0-20/month | Free tier: 500hrs compute + $5 per GB database. ~$10/month typical startup. |
| Domain name (.com) | $12/year | Namecheap, not required for store launch |
| **Total First Year** | **~$70** | Extremely cheap for a production app |

---

## 🎯 Launch Success Metrics

Track these after launch:

1. **User Acquisition**
   - Downloads in first week
   - Organic vs. store referrals
   
2. **Engagement**
   - DAU (Daily Active Users)
   - Session length
   - Habit creation rate
   
3. **Retention**
   - Day 7 retention (% who open app after 1 week)
   - Day 30 retention
   - Churn rate
   
4. **Technical Health**
   - Error rate (< 0.1% acceptable)
   - Crash rate (< 0.01% acceptable)
   - Performance (API response time < 500ms p95)

**Goal for Week 1:** 50 downloads, 20% DAU retention

---

## 📞 Support & Feedback Loop

**Post-Launch:**
- Monitor Google Play reviews (respond to feedback)
- Set up email support (support@habittracker-app.com)
- Join indie app communities (Indie Hackers, ProductHunt)
- Ask users what features they want before building

**Don't:**
- Build features nobody asks for
- Get lost in perfectionism
- Add encryption/security features prematurely
- Rebuild from scratch

---

## 🚀 Final Motivation

You're shipping a **real, production app** in 3 days. That's amazing.

The fact that your backend is 86% test-covered, well-architected, and ready means you're not rushing—you're executing. Launch now, perfect later.

Ship. Iterate. Listen to users.

**You've got this.** 💪

---

**Document Version:** 1.0  
**Last Updated:** Feb 13, 2026  
**Next Review:** After Day 1 launch check-in

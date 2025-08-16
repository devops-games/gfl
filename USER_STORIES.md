# Fantasy Football Web Application - User Stories

This document contains comprehensive user stories for implementing a traditional web-based Fantasy Football application using React (frontend) and NestJS (backend). These stories were created before pivoting to the git-based approach but remain valuable for reference.

## Epic Structure

1. [User Authentication & Account Management](#epic-1-user-authentication--account-management)
2. [Team Management](#epic-2-team-management)
3. [Gameweek Management](#epic-3-gameweek-management)
4. [Special Features (Chips)](#epic-4-special-features-chips)
5. [League Management](#epic-5-league-management)
6. [Statistics & Analytics](#epic-6-statistics--analytics)
7. [Scoring System](#epic-7-scoring-system)
8. [Mobile & Notifications](#epic-8-mobile--notifications)
9. [Data Integration](#epic-9-data-integration)
10. [Cup Competition](#epic-10-cup-competition)
11. [Social Features](#epic-11-social-features)

---

## Epic 1: User Authentication & Account Management

### FFWA-001: User Registration
**As a** new user  
**I want to** create an account with email and password  
**So that** I can participate in fantasy football leagues  

**Acceptance Criteria:**
- User can register with email, username, and password
- Email validation and uniqueness check
- Password strength requirements enforced (min 8 chars, 1 uppercase, 1 number, 1 special)
- Confirmation email sent upon registration
- User redirected to team creation after verification
- GDPR compliance checkboxes
- Age verification (18+)

**Technical Notes:**
- NestJS: JWT authentication with Passport.js
- Password hashing with bcrypt (10 salt rounds)
- React: Form validation with react-hook-form
- Email service: SendGrid or AWS SES
- Database: PostgreSQL users table

---

### FFWA-002: User Login
**As a** registered user  
**I want to** log in to my account  
**So that** I can access my fantasy teams and leagues  

**Acceptance Criteria:**
- Login with email/username and password
- "Remember me" option (30-day token)
- Password reset link available
- OAuth options (Google, Facebook)
- Rate limiting (5 attempts per 15 minutes)
- Two-factor authentication option
- Session management with refresh tokens

**Technical Notes:**
- JWT access token (15 min) + refresh token (7 days)
- Redis for session storage
- React: Protected routes with React Router
- NestJS: Guards for route protection

---

### FFWA-003: User Profile Management
**As a** logged-in user  
**I want to** manage my profile settings  
**So that** I can update my information and preferences  

**Acceptance Criteria:**
- Edit username, email, and display name
- Change password with current password verification
- Set notification preferences (email, push, SMS)
- Upload/change avatar image (max 5MB, JPEG/PNG)
- Select favorite Premier League team
- Privacy settings (public/private profile)
- Account deletion option (GDPR compliant)
- View account statistics

---

## Epic 2: Team Management

### FFWA-004: Initial Squad Selection
**As a** new user  
**I want to** select my initial 15-player squad  
**So that** I can start playing fantasy football  

**Acceptance Criteria:**
- £100 million budget displayed with live tracking
- Player list with advanced filters:
  - Position (GK, DEF, MID, FWD)
  - Team (all 20 PL clubs)
  - Price range slider
  - Form/Points filters
  - Injury status
- Search with autocomplete
- Player cards showing:
  - Photo, name, team, position
  - Price and price change indicator
  - Form (last 5 gameweeks)
  - Total points
  - Ownership percentage
  - Upcoming fixtures (next 5)
- Real-time budget calculation
- Maximum 3 players per PL club enforced
- Squad requirements: 2 GK, 5 DEF, 5 MID, 3 FWD
- Auto-save draft every 30 seconds
- Squad suggestions based on popular picks
- Import squad from code

**Technical Notes:**
- React: Virtual scrolling for player list (react-window)
- Optimistic UI updates
- WebSocket for real-time price changes
- NestJS: Caching layer with Redis
- Elasticsearch for player search

---

### FFWA-005: Team Formation Selection
**As a** team manager  
**I want to** select my starting XI and formation  
**So that** my team can earn points each gameweek  

**Acceptance Criteria:**
- Interactive pitch visualization
- Drag-and-drop players between bench and pitch
- Formation templates:
  - 4-4-2, 4-3-3, 3-5-2, 3-4-3, 5-4-1, 5-3-2
- Formation validation (min 3 DEF, 2 MID, 1 FWD)
- Player position indicators
- Injury/suspension warnings
- Fixture difficulty badges
- Auto-substitute priority order setting
- Captain (C) and vice-captain (VC) badges
- Save formation for gameweek
- Copy formation from previous gameweek

**Technical Notes:**
- React: react-beautiful-dnd for drag-and-drop
- Canvas/SVG for pitch rendering
- State management with Redux Toolkit

---

### FFWA-006: Player Transfers
**As a** team manager  
**I want to** make transfers between gameweeks  
**So that** I can improve my team based on form and fixtures  

**Acceptance Criteria:**
- Display available free transfers (max 5)
- Show transfer cost (-4 points per extra)
- Transfer confirmation modal with:
  - Points deduction warning
  - Budget impact
  - Team value change
- Price change prediction (rising/falling)
- Transfer history log with filters
- Deadline countdown timer (prominent display)
- Maximum 20 transfers per gameweek
- Suggested transfers based on:
  - Injuries/suspensions
  - Form changes
  - Fixture difficulty
- Undo last transfer (before confirmation)
- Transfer planner for future gameweeks

**Technical Notes:**
- Optimistic locking for concurrent updates
- Transaction handling for transfer operations
- Background jobs for price calculations

---

## Epic 3: Gameweek Management

### FFWA-008: Captain Selection
**As a** team manager  
**I want to** select my captain and vice-captain  
**So that** I can maximize points through strategic captaincy  

**Acceptance Criteria:**
- One-click captain selection from pitch view
- Captain (2x points) badge
- Vice-captain backup selection
- Captaincy stats display:
  - Player's captain history
  - Success rate
  - Average points when captained
- Popular captain choices percentage
- Fixture analysis for captain picks
- Captain change confirmation
- Historical captaincy performance graph

---

### FFWA-009: View Fixtures and Deadlines
**As a** team manager  
**I want to** view upcoming fixtures and deadlines  
**So that** I can plan my transfers and team selection  

**Acceptance Criteria:**
- Fixture list with:
  - Next 5 gameweeks visible
  - Kick-off times in user's timezone
  - TV broadcast information
  - Stadium information
- Fixture Difficulty Rating (FDR) with color coding:
  - 1 (Green) - Easiest
  - 5 (Red) - Hardest
- Double/Blank gameweek indicators
- Deadline countdown in header (always visible)
- Calendar view option
- Export fixtures to calendar (iCal)
- Team news aggregation
- Weather conditions for matches

---

### FFWA-010: Live Gameweek Scoring
**As a** team manager  
**I want to** see live scores during matches  
**So that** I can track my team's performance in real-time  

**Acceptance Criteria:**
- Live point updates (within 2 minutes of action)
- Player action feed:
  - Goals (⚽)
  - Assists (🅰️)
  - Cards (🟨🟥)
  - Bonus points (⭐)
  - Clean sheets (🧤)
- Live bonus points system (BPS) display
- Auto-substitution preview
- Mini-league rank changes
- Live average score comparison
- Match statistics integration
- Push notifications for key events
- Live chat during matches

**Technical Notes:**
- WebSocket connection with Socket.io
- Redis pub/sub for event distribution
- Server-Sent Events as fallback
- Rate limiting for chat messages

---

## Epic 4: Special Features (Chips)

### FFWA-011: Wildcard Activation
**As a** team manager  
**I want to** use my Wildcard chip  
**So that** I can make unlimited transfers without point deductions  

**Acceptance Criteria:**
- Wildcard button with remaining count
- Confirmation dialog explaining:
  - Unlimited transfers this gameweek
  - No point deductions
  - Cannot be cancelled
  - Separate cards for each half of season
- Visual indicator when active
- Transfer suggestions optimized for wildcard
- Team value optimization tool
- Saved transfers preserved
- Wildcard history tracking

---

### FFWA-012: Free Hit Chip
**As a** team manager  
**I want to** use my Free Hit chip  
**So that** I can build a one-week team for specific fixtures  

**Acceptance Criteria:**
- Free Hit activation with clear warning
- Preview of team reverting next gameweek
- Unlimited transfers for current gameweek
- Original team backup display
- Cannot combine with other chips
- One-time use indicator
- Suggested teams for blank/double gameweeks
- Comparison tool (Free Hit team vs Original)

---

## Epic 5: League Management

### FFWA-016: Create Private League
**As a** user  
**I want to** create a private league  
**So that** I can compete with friends  

**Acceptance Criteria:**
- League creation wizard:
  - Name (3-50 characters)
  - Description (optional, max 500 chars)
  - Type (Classic/Head-to-Head)
  - Scoring (Standard/Custom)
  - Max teams (2-1000)
  - Start gameweek
  - Entry requirements
- Auto-generated join code (6 alphanumeric)
- QR code for easy sharing
- League logo upload
- Custom scoring rules (if selected)
- League admin designation
- League rules/description editor
- Entry fee settings (optional)

---

### FFWA-017: Join Leagues
**As a** team manager  
**I want to** join public and private leagues  
**So that** I can compete against others  

**Acceptance Criteria:**
- Browse public leagues with filters:
  - Size
  - Entry requirements
  - Start date
  - Scoring type
- Join via 6-character code
- Join via QR code scan
- Join via shared link
- Search leagues by name
- Preview league details:
  - Current members
  - League leader
  - Average score
  - Rules
- Maximum 50 leagues per user
- Leave league option with confirmation
- League recommendations based on skill level

---

## Epic 6: Statistics & Analytics

### FFWA-020: Player Statistics
**As a** team manager  
**I want to** view detailed player statistics  
**So that** I can make informed transfer decisions  

**Acceptance Criteria:**
- Comprehensive stats dashboard:
  - Season totals (goals, assists, clean sheets, bonus)
  - Form graph (last 10 gameweeks)
  - Points per match average
  - Minutes played percentage
  - Shots, key passes, tackles, saves
- ICT Index (Influence, Creativity, Threat)
- Ownership percentage with trends
- Price history graph
- Fixture difficulty for next 10 games
- Head-to-head stats vs upcoming opponents
- Expected points (xP) predictions
- Comparison tool (up to 4 players)
- Export stats to CSV

---

### FFWA-021: Team Analysis Dashboard
**As a** team manager  
**I want to** analyze my team's performance  
**So that** I can identify strengths and weaknesses  

**Acceptance Criteria:**
- Performance metrics:
  - Points by position breakdown
  - Captain success rate
  - Bench points wasted
  - Transfer efficiency (points gained/lost)
  - Chip usage effectiveness
  - Team value growth chart
- Suggested improvements with reasoning
- Weak spots identification
- Formation effectiveness analysis
- Best/worst gameweeks
- Percentile rankings
- Season trends visualization

---

## Epic 7: Scoring System

### FFWA-023: Points Calculation Engine
**As a** system administrator  
**I want to** automatically calculate points  
**So that** scores are updated accurately and quickly  

**Acceptance Criteria:**
- Import match data from provider API
- Calculate points within 2 minutes of final whistle
- Handle all scoring scenarios:
  - Goals, assists, clean sheets
  - Bonus points (BPS)
  - Cards, own goals
  - Penalty saves/misses
  - Minutes played
- Process auto-substitutions correctly
- Recalculation for stat corrections
- Points audit trail with timestamps
- Rollback capability for errors
- Notification on points finalization

**Technical Notes:**
- Microservice architecture for scaling
- Message queue (RabbitMQ) for processing
- Idempotent calculations
- Database transactions with isolation

---

## Epic 8: Mobile & Notifications

### FFWA-025: Mobile Responsive Design
**As a** mobile user  
**I want to** manage my team on mobile devices  
**So that** I can play anywhere  

**Acceptance Criteria:**
- Responsive breakpoints:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- Touch-optimized interactions:
  - Swipe gestures for navigation
  - Long press for player details
  - Pinch to zoom on pitch view
- Simplified mobile navigation
- Optimized data usage mode
- Offline mode with sync
- Native app features:
  - Shake to random captain
  - Face ID/Touch ID login
  - Widget for team score
- Progressive Web App (PWA) capabilities

---

### FFWA-026: Push Notifications
**As a** team manager  
**I want to** receive relevant notifications  
**So that** I don't miss important events  

**Acceptance Criteria:**
- Notification types:
  - Deadline reminders (custom timing)
  - Team news for owned players
  - Price changes (rises/falls)
  - League invitations
  - Gameweek results
  - Injury updates
  - Match lineup announcements
  - Transfer suggestions
- Granular preferences per notification type
- Quiet hours setting
- Email digest option
- SMS for critical alerts (optional)
- In-app notification center
- Mark as read/unread
- Notification history (30 days)

---

## Epic 9: Data Integration

### FFWA-027: Live Data Feed Integration
**As a** system  
**I want to** integrate with sports data providers  
**So that** player and match data is current  

**Acceptance Criteria:**
- Real-time match events (< 30 second delay)
- Player statistics updates
- Team news and lineups (1 hour before kickoff)
- Injury and suspension data
- Historical data import (5 seasons)
- Fallback data sources
- Data validation and sanitization
- Rate limiting compliance
- Error handling and retry logic
- Data consistency checks
- Webhook receivers for push updates

**Technical Notes:**
- Primary: Opta/Stats Perform API
- Fallback: Alternative data provider
- Circuit breaker pattern
- Data transformation pipeline
- Event sourcing for match events

---

## Epic 10: Cup Competition

### FFWA-029: Cup Entry and Draws
**As a** eligible manager  
**I want to** enter the cup competition  
**So that** I can compete in knockout format  

**Acceptance Criteria:**
- Automatic qualification (top 50% by GW16)
- Random draw generation with seeding
- Cup bracket visualization (interactive)
- Round progression tracking
- Cup history archive
- Trophy cabinet display
- Rematch statistics
- Cup final buildup features

---

## Epic 11: Social Features

### FFWA-031: Team Sharing
**As a** team manager  
**I want to** share my team on social media  
**So that** I can show off my selections  

**Acceptance Criteria:**
- Generate shareable team graphics:
  - Custom backgrounds
  - Team formation view
  - Key stats overlay
  - Branding elements
- Social platform integration:
  - Twitter/X
  - Facebook
  - Instagram
  - WhatsApp
- Custom share messages with hashtags
- Include gameweek rank/points
- Privacy settings
- Watermark options
- Download as image

---

### FFWA-032: In-App Messaging
**As a** league member  
**I want to** communicate with other managers  
**So that** we can discuss and banter  

**Acceptance Criteria:**
- League chat rooms with:
  - Message history
  - Emoji reactions
  - GIF support
  - Reply to specific messages
- Direct messages between managers
- Push notifications for messages
- Moderation tools:
  - Report inappropriate content
  - Block users
  - Mute conversations
- Message search
- File/image sharing (limited)
- Read receipts (optional)
- Typing indicators

---

## Non-Functional Requirements

### FFWA-033: Performance Optimization
**As a** user  
**I want to** experience fast load times  
**So that** I can manage my team efficiently  

**Acceptance Criteria:**
- Page load under 3 seconds (3G connection)
- API response under 200ms (p95)
- Support 100,000 concurrent users
- 99.9% uptime SLA
- CDN for static assets
- Image optimization (WebP with fallback)
- Code splitting and lazy loading
- Database query under 100ms
- Horizontal scaling capability

---

### FFWA-034: Security Implementation
**As a** user  
**I want to** my data to be secure  
**So that** my account is protected  

**Acceptance Criteria:**
- HTTPS everywhere (HSTS enabled)
- Rate limiting on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection (CSP headers)
- CSRF tokens
- GDPR compliance:
  - Data export
  - Right to deletion
  - Privacy policy
  - Cookie consent
- PCI compliance (if payments)
- Regular security audits
- Dependency vulnerability scanning
- WAF implementation

---

### FFWA-035: Accessibility Compliance
**As a** user with disabilities  
**I want to** use all features  
**So that** I can fully participate  

**Acceptance Criteria:**
- WCAG 2.1 AA compliance
- Screen reader compatibility (ARIA labels)
- Keyboard navigation (focus indicators)
- High contrast mode
- Font size adjustment (up to 200%)
- Alternative text for all images
- Captions for video content
- Color blind friendly palettes
- Reduced motion option
- Skip navigation links

---

## Implementation Priority

### Phase 1 - MVP (Weeks 1-4)
- User authentication (FFWA-001, 002)
- Initial squad selection (FFWA-004)
- Basic team management (FFWA-005, 006)
- Captain selection (FFWA-008)
- Points calculation (FFWA-023)
- Basic league functionality (FFWA-016, 017)

### Phase 2 - Core Features (Weeks 5-8)
- Live scoring (FFWA-010)
- All chips (FFWA-011, 012, 013, 014)
- League standings (FFWA-018)
- Player statistics (FFWA-020)
- Mobile responsive (FFWA-025)

### Phase 3 - Enhanced Features (Weeks 9-12)
- Advanced analytics (FFWA-021, 022)
- Push notifications (FFWA-026)
- Social features (FFWA-031, 032)
- Cup competition (FFWA-029, 030)

### Phase 4 - Polish & Scale (Weeks 13-16)
- Performance optimization (FFWA-033)
- Security hardening (FFWA-034)
- Accessibility (FFWA-035)
- Additional integrations

## Technical Stack Summary

### Frontend
- React 18+ with TypeScript
- Redux Toolkit for state management
- React Query for data fetching
- React Hook Form for forms
- Material-UI or Ant Design for UI
- Socket.io client for real-time
- Recharts for data visualization

### Backend
- NestJS with TypeScript
- PostgreSQL database
- Redis for caching and sessions
- Bull for job queues
- Socket.io for WebSocket
- Passport.js for authentication
- TypeORM for database ORM

### Infrastructure
- Docker containerization
- Kubernetes for orchestration
- AWS/GCP/Azure cloud hosting
- CloudFlare CDN
- GitHub Actions CI/CD
- Datadog/New Relic monitoring
- Sentry error tracking

### Third-Party Services
- SendGrid/AWS SES for email
- Twilio for SMS (optional)
- Stripe for payments (optional)
- Opta/Stats Perform for data
- Cloudinary for image hosting
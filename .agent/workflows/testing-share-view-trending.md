# Testing Guide for Share, View, and Trending Features

## What to Test

### 1. Share Functionality
**Before fixes:** Share count was static or not updating
**After fixes:** Share count updates dynamically

#### Test Steps:
1. Navigate to any post in the feed or trending page
2. Click the "Share" button on a post
3. **Expected:** Share count should increment by 1 immediately
4. Refresh the page
5. **Expected:** Share count should persist (not reset)
6. Check in MongoDB or backend logs to verify `shareCount` field is being updated

---

### 2. View Score Functionality  
**Before fixes:** Views were not tracked when posts were displayed
**After fixes:** Views auto-increment when posts are shown

#### Test Steps:
1. Navigate to the feed or trending page
2. Observe any post card being rendered
3. **Expected:** View count should increment automatically (check the "X Views" text)
4. Open Developer Console and check for any errors
5. **Expected:** No errors related to `incrementView`
6. Refresh and view the same post
7. **Expected:** View count increases again (each view is tracked)
8. Check backend logs or MongoDB to verify `impressions` field is being updated

---

### 3. Trending Posts Sorting
**Before fixes:** Trending posts may have shown posts with 0 votes/views
**After fixes:** Trending shows posts sorted by actual engagement

#### Test Steps:
1. Navigate to `/trending` page
2. **Expected:** Posts should be sorted by:
   - Highest upvotes first
   - Then by most views
   - Then by most recent
3. Check that posts shown have actual engagement (upvotes > 0 or views > 0)
4. Click on category filters (Technology, Business, Finance, Design)
5. **Expected:** Posts should filter by category and maintain sorting
6. Verify trending topics sidebar shows hashtags with actual usage counts

---

### 4. Comment Count Display
**Before fixes:** Comment count may not have been displayed correctly
**After fixes:** Comment count shows actual number of comments

#### Test Steps:
1. View any post in feed or trending
2. Click "Comments" button to expand comment section
3. Add a new comment
4. **Expected:** Comment count should increment immediately
5. Delete a comment (if you're the owner)
6. **Expected:** Comment count should decrement
7. Refresh page
8. **Expected:** Comment count persists correctly

---

## Quick Verification Checklist

- [ ] Share button increments count on click
- [ ] View count auto-increments when post is displayed
- [ ] Trending page shows posts sorted by engagement
- [ ] Comment count updates when adding/deleting comments
- [ ] All counts persist after page refresh
- [ ] No console errors in browser
- [ ] Backend receives requests to `/posts/:id/share` and `/posts/:id/view`

---

## Backend API Endpoints to Monitor

**Share:**
- POST `/posts/:id/share`
- Response includes updated `shareCount`

**View:**
- POST `/posts/:id/view`  
- Response includes updated `impressions` count

**Trending:**
- GET `/trends/posts?category=All&page=1&limit=10`
- Response includes posts sorted by `upvotesCount`, then `impressions`

**Trending Topics:**
- GET `/trends/topics?category=All`
- Response includes hashtags sorted by score/usage

---

## Database Fields to Check

In MongoDB `posts` collection, each post should have:
```json
{
  "shareCount": 0,      // Should increment when shared
  "impressions": 0,     // Should increment on view
  "upvotesCount": 0,    // Should match upvotes.length
  "commentsCount": 0,   // Should increment/decrement with comments
  "upvotes": [],        // Array of user IDs
  "downvotes": []       // Array of user IDs
}
```

---

## Known Issues & Notes

1. **View tracking on every render:** Each time PostCard mounts, it tracks a view. This is intentional for engagement tracking.
2. **Multiple views per user:** The current implementation doesn't prevent duplicate views from the same user. This can be enhanced later with user-specific view tracking.
3. **Trending calculation:** Uses a combination of upvotes, views, comments, and recency. Promoted trends appear at the top.

---

## Performance Considerations

- View tracking happens in background (fire-and-forget on backend)
- Trend scores update dynamically when posts get views/votes
- Frontend shows optimistic updates (immediate UI changes before backend confirms)

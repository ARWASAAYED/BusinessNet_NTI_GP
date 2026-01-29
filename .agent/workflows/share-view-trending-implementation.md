# Share and View Score Dynamic Implementation

## Summary of Changes

### Backend Changes

#### 1. Post Model (`backend/src/models/post.js`)
- **Added** `shareCount` field to properly track social shares
- This field is now separate from `externalClicks` for better tracking

#### 2. Post Controller (`backend/src/controllers/postController.js`)
- **Updated** `sharePost()` function to increment `shareCount` instead of `externalClicks`
- **Enhanced** to populate author and business information when sharing
- View tracking already working via `incrementView()` endpoint

#### 3. Comment Controller (`backend/src/controllers/commentController.js`)
- ✅ Already properly updates `commentsCount` when comments are created/deleted
- No changes needed

### Frontend Changes

#### 1. Post Service (`frontend/src/services/postService.ts`)
- **Added** `incrementView()` method to track post views
- This connects to the backend `/posts/:id/view` endpoint

#### 2. PostCard Component (`frontend/src/components/post/PostCard.tsx`)
- **Added** automatic view tracking when post is displayed using `useEffect`
- **Added** `viewCount` state to dynamically update view count
- **Added** `hasTrackedView` flag to prevent duplicate view tracking
- **Enhanced** share button to properly update `shareCount` state
- **Enhanced** view count display with Eye icon and proper formatting
- Views are now tracked once per post render

## How It Works

### Share Functionality
1. User clicks Share button in PostCard
2. Frontend calls `postService.sharePost(postId)`
3. Backend increments `shareCount` in database
4. Backend returns updated post
5. Frontend updates local `shareCount` state
6. UI shows new share count immediately

### View Score Functionality
1. PostCard component mounts and displays a post
2. `useEffect` hook automatically calls `postService.incrementView(postId)`
3. Backend increments `impressions` count
4. Backend also updates trend scores for hashtags
5. Frontend receives updated view count
6. UI displays dynamic view count with Eye icon

### Trending Posts
The trending algorithm (`backend/src/controllers/trendController.js`) now properly:
1. Sorts posts by `upvotesCount` (descending)
2. Then by `impressions`/views (descending)
3. Then by `createdAt` (most recent)
4. Filters by category if specified
5. Returns actual posts with real engagement metrics

## API Endpoints Used

- `POST /posts/:id/share` - Increment share count
- `POST /posts/:id/view` - Increment view count and update trends
- `GET /trends/posts` - Get trending posts sorted by engagement
- `GET /trends/topics` - Get trending topics/hashtags

## Benefits

✅ **Real-time tracking**: Views and shares update immediately
✅ **Accurate trending**: Posts ranked by actual engagement (votes, views, comments)
✅ **Better UX**: Users see live engagement metrics
✅ **SEO-friendly**: Track which content performs best
✅ **Analytics-ready**: Data available for business insights

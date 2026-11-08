/**
 * @file src/App.jsx
 * @description Root application component with route tree.
 *
 * - Public routes (auth pages): wrapped in PublicRoute (redirects authenticated users)
 * - Protected routes (app pages): wrapped in ProtectedRoute (redirects unauthenticated users)
 * - checkAuth() dispatched on mount to rehydrate session from refresh token cookie
 */

import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { checkAuth, clearUser } from './store/slices/authSlice.js';
import { fetchProfile } from './store/slices/profileSlice.js';
import { fetchUnreadCount, receiveRealTimeNotification } from './store/slices/notificationSlice.js';
import { receiveSocketMessage, setOnlineUsers, userConnected, userDisconnected, messageDeleted } from './store/slices/messagingSlice.js';
import toast from 'react-hot-toast';
import socketClient from './sockets/socketClient.js';
import tokenService from './services/tokenService.js';

import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import PublicRoute from './components/common/PublicRoute.jsx';
import { FullScreenLoader } from './components/common/Loader.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// ─── Auth pages (eagerly loaded — small, immediately needed) ──────────────────
import AiCoachPage from './pages/AiCoach/AiCoachPage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';
import AiWorkoutGeneratorPage from "./pages/Workout/AiWorkoutGeneratorPage.jsx";

// ─── App pages (lazy loaded) ──────────────────────────────────────────────────
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage.jsx'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage.jsx'));
const OnboardingFlow = lazy(() => import('./pages/Onboarding/OnboardingFlow.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Workouts & Exercises
const ExerciseLibraryPage = lazy(() => import('./pages/Exercises/ExerciseLibraryPage.jsx'));
const ExerciseDetailsPage = lazy(() => import('./pages/Exercises/ExerciseDetailsPage.jsx'));
const WorkoutPlansPage = lazy(() => import('./pages/Workouts/WorkoutPlansPage.jsx'));
const WorkoutPlanDetailsPage = lazy(() => import('./pages/Workouts/WorkoutPlanDetailsPage.jsx'));
const ActiveWorkoutPage = lazy(() => import('./pages/Workouts/ActiveWorkoutPage.jsx'));
const WorkoutHistoryPage = lazy(() => import('./pages/Workouts/WorkoutHistoryPage.jsx'));
// Community
const CommunityFeedPage = lazy(() => import('./pages/Community/CommunityFeedPage.jsx'));
const CreatePostPage = lazy(() => import('./pages/Community/CreatePostPage.jsx'));
const PostDetailsPage = lazy(() => import('./pages/Community/PostDetailsPage.jsx'));
const SavedPostsPage = lazy(() => import('./pages/Community/SavedPostsPage.jsx'));
const CommunityUserPage = lazy(() => import('./pages/Community/CommunityUserPage.jsx'));

// Messaging
const MessagingLayout = lazy(() => import('./pages/Messaging/MessagingLayout.jsx'));

// Notifications
const NotificationCenterPage = lazy(() => import('./pages/Notifications/NotificationCenterPage.jsx'));

// Learning Hub
const LearningHomePage = lazy(() => import('./pages/Learning/LearningHomePage.jsx'));
const VideoDetailsPage = lazy(() => import('./pages/Learning/VideoDetailsPage.jsx'));
const RoadmapsPage = lazy(() => import('./pages/Learning/RoadmapsPage.jsx'));
const UserLibraryPage = lazy(() => import('./pages/Learning/UserLibraryPage.jsx'));
const VideoSearchPage = lazy(() => import('./pages/Learning/VideoSearchPage.jsx'));

// Fitness Videos (YouTube Feed)
import FitnessVideosPage from './pages/Videos/FitnessVideosPage.jsx';
import FeedVideoDetailsPage from './pages/Videos/VideoDetailsPage.jsx';

// Fitness Shorts
const ShortsPage = lazy(() => import('./pages/Shorts/ShortsPage.jsx'));
const ShortDetailPage = lazy(() => import('./pages/Shorts/ShortDetailPage.jsx'));

// Admin
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute.jsx';
const AdminDashboardPage = lazy(() => import('./pages/Admin/DashboardPage.jsx'));
const AdminUsersPage = lazy(() => import('./pages/Admin/UsersPage.jsx'));
const AdminCommunityPage = lazy(() => import('./pages/Admin/CommunityModerationPage.jsx'));
const AdminMessagesPage = lazy(() => import('./pages/Admin/MessagesModerationPage.jsx'));
const AdminReportsPage = lazy(() => import('./pages/Admin/ReportsPage.jsx'));
const AdminAuditLogsPage = lazy(() => import('./pages/Admin/AuditLogsPage.jsx'));

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Attempt to rehydrate the session on every mount using the refresh cookie.
    dispatch(checkAuth());

    // Listen for the Axios logout event (fired on failed refresh)
    const handleAxiosLogout = () => dispatch(clearUser());
    window.addEventListener('auth:logout', handleAxiosLogout);
    return () => window.removeEventListener('auth:logout', handleAxiosLogout);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      dispatch(fetchUnreadCount());
      
      const currentToken = tokenService.getToken();
      if (currentToken) {
        socketClient.connect(currentToken);
        const socket = socketClient.getSocket();
        if (socket) {
          socket.on('notification:new', (data) => {
            dispatch(receiveRealTimeNotification(data));
            // Ensure title is shown if present (for E2E match)
            const text = data.title ? `${data.title}: ${data.message || ''}` : (data.message || 'New notification received');
            toast.success(text);
          });

          socket.on('receiveMessage', (msg) => {
            console.log('App.jsx receiveMessage triggered:', msg.content, 'sender:', msg.sender?.name);
            dispatch(receiveSocketMessage(msg));
            const isCurrentActive = document.querySelector(`[data-conversation-id="${msg.conversation}"]`);
            if (!isCurrentActive) {
              toast.success(`New message from ${msg.sender?.name || 'someone'}`);
            }
          });

          // Global Presence Listeners
          socket.on('initialOnlineUsers', (users) => dispatch(setOnlineUsers(users)));
          socket.on('userOnline', (id) => dispatch(userConnected(id)));
          socket.on('userOffline', (id) => dispatch(userDisconnected(id)));
          socket.on('messageDeleted', (id) => dispatch(messageDeleted(id)));
        }
        return () => {
          socket.off('notification:new');
          socket.off('receiveMessage');
          socket.off('initialOnlineUsers');
          socket.off('userOnline');
          socket.off('userOffline');
          socket.off('messageDeleted');
        };
      }
    } else {
      socketClient.disconnect();
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* ─── Public / Auth routes ────────────────────────────────── */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* ─── Protected app routes ─────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/workouts/active/:planId/:dayId" element={<ActiveWorkoutPage />} />
          
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/exercises" element={<ExerciseLibraryPage />} />
            <Route path="/exercises/:slug" element={<ExerciseDetailsPage />} />
            
            <Route path="/workouts/plans" element={<WorkoutPlansPage />} />
            <Route path="/workouts/plans/:id" element={<WorkoutPlanDetailsPage />} />
            <Route path="/workouts/active" element={<ActiveWorkoutPage />} />
            <Route path="/workouts/history" element={<WorkoutHistoryPage />} />
            <Route path="/workouts/ai-generator" element={<AiWorkoutGeneratorPage />} />

            {/* AI Coach */}
            {/* Community Routes */}
            <Route path="/community" element={<CommunityFeedPage />} />
            <Route path="/community/create" element={<CreatePostPage />} />
            <Route path="/community/post/:id" element={<PostDetailsPage />} />
            <Route path="/community/saved" element={<SavedPostsPage />} />
            <Route path="/community/user/:userId" element={<CommunityUserPage />} />
            
            {/* Chat Routes */}
            <Route path="/messages" element={<MessagingLayout />} />
            
            {/* Notification Route */}
            <Route path="/notifications" element={<NotificationCenterPage />} />
            
            {/* Learning Hub Routes */}
            <Route path="/learning" element={<LearningHomePage />} />
            <Route path="/learning/search" element={<VideoSearchPage />} />
            <Route path="/learning/video/:id" element={<VideoDetailsPage />} />
            <Route path="/learning/roadmaps" element={<RoadmapsPage />} />
            <Route path="/learning/roadmaps/:id" element={<RoadmapsPage />} />
            <Route path="/learning/library" element={<UserLibraryPage />} />
            
            {/* Fitness Video Feed Routes */}
            <Route path="/videos" element={<FitnessVideosPage />} />
            <Route path="/videos/:id" element={<FeedVideoDetailsPage />} />
            
            {/* Fitness Shorts Routes */}
            <Route path="/shorts" element={<ShortsPage />} />
            <Route path="/shorts/:id" element={<ShortDetailPage />} />
            
            <Route path="/ai-coach" element={<AiCoachPage />} />
          </Route>

          {/* ─── Protected Admin routes ───────────────────────────────── */}
          <Route element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/community" element={<AdminCommunityPage />} />
              <Route path="/admin/messages" element={<AdminMessagesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/logs" element={<AdminAuditLogsPage />} />
            </Route>
          </Route>
        </Route>

        {/* ─── Index redirect ───────────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ─── 404 ─────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;

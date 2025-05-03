import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import BlogDashboard from '../components/blog_dashboard/BlogDashboard';
import BlogEditorPage from '../components/blog_dashboard/BlogEditorPage';
import BlogEditorPageWrapper from '../components/blog_dashboard/BlogEditorPageWrapper';

/**
 * Blog routes configuration for the application
 * Includes routes for blog dashboard, editor, and creation
 */
const BlogRoutes = () => {
  return (
    <>
      {/* Main blog dashboard route */}
      <Route
        path="/dashboard/blogs"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <BlogDashboard />
          </ProtectedRoute>
        }
      />

      {/* Blog creation route */}
      <Route
        path="/dashboard/blogs/create"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <BlogEditorPage isEditing={false} />
          </ProtectedRoute>
        }
      />

      {/* Blog editing route with dynamic parameter */}
      <Route
        path="/dashboard/blogs/edit/:blogId"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <BlogEditorPageWrapper />
          </ProtectedRoute>
        }
      />
    </>
  );
};


export default BlogRoutes;
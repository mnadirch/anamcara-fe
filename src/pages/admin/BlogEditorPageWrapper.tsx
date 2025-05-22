
import { useParams } from 'react-router-dom';
import BlogEditorPage from './CreateBlog';


const BlogEditorPageWrapper = () => {
  const { blogId } = useParams<{ blogId: string }>();
  
  if (!blogId) {
    console.error('Blog ID is missing from URL parameters');
    return <div className="text-white p-8">Error: Blog ID is missing</div>;
  }
  
  return (
    <BlogEditorPage 
      
      blogId={blogId} 
    />
  );
};

export default BlogEditorPageWrapper;
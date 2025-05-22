import { useState, useEffect } from 'react';
import { FaEllipsisV, FaCheck, FaTimes } from 'react-icons/fa';
import { Dropdown } from '../../components/addons/Dropdown';
import { deleteComment, getComments, updateComment } from '../../utils/blogs';
import { formatRelativeDate } from '../../pages/admin';

interface Comment {
    key: string;
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
    };
}

const BlogPostWithComments = ({ id }: { id: any }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState('');

    const handleUpdateComment = async (commentId: string) => {
        try {
            const response = await updateComment(commentId, editedContent);
            if (response.success) {
                fetchComments()
                setEditingCommentId(null);
            }
        } catch (err) {
            setError('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const response = await deleteComment(commentId);
            if (response.success) {
                fetchComments()
            }
        } catch (err) {
            setError('Failed to delete comment');
        }
    };

    const startEditing = (commentId: string, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditedContent(currentContent);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditedContent('');
    };

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await getComments(id);
            if (response.success) {
                const formattedData = response.data?.data.map((item: any, index: any) => ({
                    key: item.id,
                    id: index,
                    content: item.content,
                    createdAt: item.created_at,
                    user: {
                        id: item.profiles.id,
                        name: `${item.profiles.first_name}${item.profiles.last_name ? ` ${item.profiles.last_name}` : ''}`,
                        avatar: item.profiles.avatar_url
                    }
                }));
                setComments(formattedData);
            }
        } catch (err) {
            setError('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    return (
        <div className="w-full py-10">
            {/* Comments section */}
            <h2 className="text-2xl font-semibold mb-6">Comments ({comments.length})</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : comments.length === 0 ? (
                <p className="text-gray-500">No comments yet</p>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-4 rounded-lg">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                                    {comment.user.avatar ? (
                                        <img
                                            src={comment.user.avatar}
                                            alt={comment.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-600 font-medium">
                                            {comment.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex justify-between items-center gap-3">
                                        <h4 className="font-medium w-fit">{comment.user.name}</h4>
                                        <time className="text-sm text-white opacity-60">
                                            ({formatRelativeDate(comment.createdAt)})
                                        </time>
                                    </div>

                                    {editingCommentId === comment.key ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateComment(comment.key)}
                                                className="text-white hover:opacity-70 cursor-pointer"
                                                title="Save"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="text-white hover:opacity-70 cursor-pointer"
                                                title="Cancel"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <Dropdown
                                            trigger={
                                                <button className="text-white opacity-60 hover:opacity-50">
                                                    <FaEllipsisV />
                                                </button>
                                            }
                                            items={[
                                                {
                                                    label: 'Edit',
                                                    onClick: () => startEditing(comment.key, comment.content),
                                                },
                                                {
                                                    label: 'Delete',
                                                    onClick: () => handleDeleteComment(comment.key),
                                                }
                                            ]}
                                        />
                                    )}
                                </div>

                                {editingCommentId === comment.key ? (
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="w-full mt-2 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 focus:outline-none"
                                        rows={3}
                                        autoFocus
                                    />
                                ) : (
                                    <p className="mt-2 text-white opacity-70">{comment.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogPostWithComments;
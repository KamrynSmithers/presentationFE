import { useState, useEffect } from 'react';
import { createComment, getComments, updateComment, deleteComment } from '../api/api';
import '../comments.css';

interface Comment {
  _id: string;
  contentTitle: string;
  contentType: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
  rating?: number;
  createdAt: string;
}

interface CommentsSectionProps {
  contentTitle: string;
  contentType: 'movie' | 'book' | 'music';
}

function CommentsSection({ contentTitle, contentType }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    loadComments();
  }, [contentTitle, contentType]);

  const loadComments = async () => {
    try {
      const response = await getComments(contentTitle, contentType);
      setComments(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading comments:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await createComment(contentTitle, contentType, newComment, newRating || undefined);
      setComments([response.data, ...comments]);
      setNewComment('');
      setNewRating(0);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post comment. Please log in.');
    }
  };

  const handleUpdate = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const response = await updateComment(commentId, editText, editRating || undefined);
      setComments(comments.map(c => c._id === commentId ? response.data : c));
      setEditingId(null);
      setEditText('');
      setEditRating(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
    setEditRating(comment.rating || 0);
  };

  if (loading) return <div className="comments-loading">Loading comments...</div>;

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="rating-input">
          <label id="ratingComment">Rating:</label>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${newRating >= star ? 'filled' : ''}`}
              onClick={() => setNewRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder={`Write your thoughts about this ${contentType}...`}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button type="submit">Post Comment</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment">
              {editingId === comment._id ? (
                /* Edit Mode */
                <div className="comment-edit">
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${editRating >= star ? 'filled' : ''}`}
                        onClick={() => setEditRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(comment._id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="comment-header">
                    <span className="comment-user">{comment.user.username}</span>
                    {comment.rating && (
                      <span className="comment-rating">
                        {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                      </span>
                    )}
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  {comment.user._id === currentUserId && (
                    <div className="comment-actions">
                      <button onClick={() => startEdit(comment)}>Edit</button>
                      <button onClick={() => handleDelete(comment._id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
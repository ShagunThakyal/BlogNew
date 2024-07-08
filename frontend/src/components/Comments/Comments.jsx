// src/components/Comments/Comments.jsx
import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const Comments = ({ blogId, accessToken, userId }) => {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [authors, setAuthors] = useState({});
    const [showComments, setShowComments] = useState(false); // State to manage comments visibility

    useEffect(() => {
        if (!accessToken) {
            console.log("No access token found");
            return;
        }

        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/comment/${blogId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                if (result.data) {
                    setComments(result.data);
                    fetchAuthors(result.data);
                } else {
                    console.log("No comments available in API response");
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchAuthors = async (comments) => {
            const authorIds = [...new Set(comments.map(comment => comment.owner))];
            const authorsData = {};

            for (const id of authorIds) {
                try {
                    const response = await fetch(`http://localhost:3000/api/v1/user/${id}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json();
                    authorsData[id] = result.data.username; // Adjust according to your API response
                } catch (error) {
                    console.error(`Error fetching author with id ${id}:`, error);
                }
            }

            setAuthors(authorsData);
        };

        fetchComments();
    }, [accessToken, blogId]);

    const handleAddComment = async () => {
        if (!commentContent) return;

        try {
            const response = await fetch(`http://localhost:3000/api/v1/comment/${blogId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                credentials: 'include',
                body: JSON.stringify({ content: commentContent })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.data) {
                setComments([...comments, result.data]);
                setCommentContent('');
            } else {
                console.error("Failed to add comment:", result.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setComments(comments.filter(comment => comment._id !== commentId));
            } else {
                console.error("Failed to delete comment:", result.message);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const timeAgo = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    };

    return (
        <div>
            <button 
                onClick={() => setShowComments(!showComments)}
                className="px-4 py-2 ml-5 lg:ml-auto bg-green-600 text-white rounded-md cursor-pointer mb-4 hover:bg-green-700"
            >
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>

            {showComments && (
                <div className="mt-4 p-4 border-t border-gray-300">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment._id} className="mb-4 p-2 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2">
                                        <h1 className="text-base font-semibold text-gray-800">
                                            {capitalizeFirstLetter(authors[comment.owner] || 'Loading author...')}
                                        </h1>
                                        <h1 className="text-sm text-gray-600">
                                            {timeAgo(comment.createdAt)}
                                        </h1>
                                        {comment.owner === userId && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)} 
                                                className="text-red-500 ml-1 hover:text-red-600"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments available.</p>
                    )}
                    <div className="mt-4 flex flex-col">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Add a comment..."
                            className="p-2 border border-gray-300 rounded-md mb-2 min-h-[80px]"
                        />
                        <button 
                            onClick={handleAddComment} 
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Add Comment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comments;

import React, { useEffect, useState } from 'react'
import './Post.css';
import {Avatar} from '@material-ui/core';
import { db } from '../firebase/firebase';
import firebase from 'firebase';

function Post({currentUser, id, username, caption, imageUrl}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(()=>{ 
        let unsubscribe;
        if(id){
            unsubscribe = db.collection('posts')
            .doc(id)
            .collection('comments').orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(doc => doc.data()))
            })
        }

        return () => {
            unsubscribe();
        }
    },[id])


    const postComment = (e) =>{
        e.preventDefault();
        db.collection('posts').doc(id).collection('comments').add({
            text: comment,
            username: currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">

            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>            

            <img 
                className="post__image"
                src={imageUrl}
                alt="Post not loading"
            />

            <p className="post__text"><strong>{username}</strong> {caption}</p>

            {comments.length>0 &&
                <div className="post__comments">
                {comments.map(comment => (
                    <div className="post__commentsBody">
                        <strong className="post__commentsName">{comment.username}</strong>
                        <p className="post__commentsText">{comment.text}</p>
                    </div>
                ))}
            </div>}

            {currentUser && <div>
                <form className="post__comment">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit" onClick={(e)=>postComment(e)} className="post__button">Post</button>
                </form>
            </div>}
        </div>
    )
}

export default Post

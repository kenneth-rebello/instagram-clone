import { IconButton } from '@material-ui/core'
import React from 'react'
import { useState } from 'react';
import './Upload.css'
import { storage, db } from '../firebase/firebase'
import firebase from 'firebase';
import { Photo } from '@material-ui/icons';

function Upload({username}) {

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleFile = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const uploadPost = () =>{
        if(image){
            const upload = storage.ref(`images/${image.name}`).put(image);
            upload.on(
                "state_changed",
                snapshot => {
                    const p = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(p);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage.ref("images").child(image.name).getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                    });

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                }
            )
        }
    }

    console.log(username);

    return (
        <div className="upload">
            <div className="container">
                <div className="field">
                    <input  
                        type="text" 
                        placeholder="Say something..." 
                        onChange={(e)=>setCaption(e.target.value)} 
                    />
                </div>
                <div className="field">
                    <input type="file" onChange={e => handleFile(e)}/>
                    <IconButton onClick={uploadPost}>
                        <Photo/>
                    </IconButton>
                </div>
                <div className="field">
                    <progress className="upload__progress" value={progress} max="100"/>
                </div>
            </div>
        </div>
    )
}

export default Upload   
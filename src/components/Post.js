import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import "../styles/Post.css"

import firebase from "firebase"
import {db} from '../firebase'
import { Button, Input } from '@material-ui/core'

function Post({user, postId, username, imgUrl, caption}) {
    console.log({user, postId, username, imgUrl, caption})
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }
        
    
        return ()=>{
          //used to not create multiple onAuthStateChange
          unsubscribe()
        }
      },[postId]) // runs on page refresh

      const postComment=(e)=>{
          e.preventDefault()

          db.collection("posts").doc(postId).collection('comments').add({
              text: comment,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
          setComment('')
      }
    

    return (
        <div className="PostCard">
            <div className="PostSec1">
                <Avatar
                src=""
                alt="Profile Pic" />
                <div className="PostSec1Data">
                    <h5><strong>{username}</strong></h5>
                    
                </div>
            </div>
            <div className="PostSec2">
                <img src={imgUrl}
                alt="insta pic"/>
            </div>
            <div className="PostSec3">
                <h5><strong>{username} </strong> {caption}</h5>                
            </div>  
            <div className="PostSec4">
                {
                    user?(
                        <form>
                    <Input
                    className="PostSec4Input"
                    placeholder="Comment..."
                    required="true"
                    type="text"
                    value={comment}
                    onChange={(e)=>{setComment(e.target.value)}}
                    />
                    <Button
                    disabled={!comment}
                    className="PostSec4Button"
                    onClick={postComment}>Submit</Button>
                </form>
                    ):(
                        <h5 className="comment">Login to comment</h5>
                    )
                }
            </div>
            <div className="PostSec5">
                {
                    comments.map((comment)=>(
                        <p className="comment">
                            <strong>{comment.username}</strong>{comment.text}
                        </p>
                    ))
                }
            </div>                    
        </div>
    )
}

export default Post

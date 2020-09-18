import React,{useState} from 'react'
import {db, storage} from '../firebase'
import firebase from 'firebase'
import { Button, Input, LinearProgress } from '@material-ui/core'

function ImgUpload({username}) {
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)
    
    const handleChange = (e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }        
    }
    const handleUpload = (e) =>{
        e.preventDefault()

        const uploadTask = storage.ref(`instagram_images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                // Progressbar logic here
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                )
                setProgress(progress)
            },
            (error)=>{
                //in case of error
                console.error(error)
                alert(error.message)
            },
            ()=>{
                //after upload complete
                storage
                .ref("instagram_images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    console.log(url)
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })

                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
    }

    return (
        <div className="uploadCard">
            <LinearProgress variant="determinate" value={progress} max="100"/>
            <Input placeholder="Caption..." onChange={(e)=>setCaption(e.target.value)} type="text"/>
            <Input type="file" onChange={handleChange}/>
            <Button type="submit" onClick={handleUpload}>Upload</Button>
            
        </div>
    )
}

export default ImgUpload

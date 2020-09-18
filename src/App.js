import React, { useEffect, useState } from 'react'
import Post from "./components/Post"
import './App.css';
import {Button, Input, Modal} from '@material-ui/core'
import ImgUpload from './components/ImgUpload'
import InstagramEmbed from 'react-instagram-embed'


import {db,auth,storage} from './firebase'

function App() {
  const [posts, setPosts] = useState([])
  const [open,setOpen] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [openSignin, setOpenSignin] = useState(false)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in
        console.log(authUser)
        setUser(authUser)
        setEmail('')
        setPassword('')
        setUsername('')
        setOpen(false)
        
      }
      else{
        //if user logged out
        setUser(null)
      }
    })

    return ()=>{
      //used to not create multiple onAuthStateChange
      unsubscribe()
    }
  },[user, username]) // runs on page refresh

  useEffect(()=>{
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> ({
        id:doc.id,
        post: doc.data() 
      })))
    })
  },[]) // runs on page refresh

  const signUp=(e)=>{
    e.preventDefault()

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message))
  }

  const signin= (e)=>{
    e.preventDefault()

    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))

    setOpenSignin(false)

  }



  return (
    <div>
      <div className="Navbar">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="insta logo"/>
       {
         user?(
               <Button className="buttons"  onClick={()=>auth.signOut()}>Sign out</Button>
              ):(
                <div>
                <Button className="buttons"  onClick={()=>setOpen(true)}>Sign Up</Button>
                <Button className="buttons" onClick={()=>setOpenSignin(true)}>Login</Button>
             
                </div>
                  )
       }
       
      </div>      
      <div className="App">
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >        
        <div>        
         <div className="signUp">
         <img className="logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="insta logo"/>
           <form>
             <div className="input">
             <Input 
             placeholder="Username"
             value={username}
             fullWidth="true"
             onChange={(e)=>setUsername(e.target.value)} />
             </div>
             <div className="input">
             <Input
             placeholder='Email'
             fullWidth="true"
             value={email}
             onChange={(e)=>setEmail(e.target.value)} />
             </div>
             <div className="input">
             <Input
             placeholder="Password"
             value={password}
             fullWidth="true" 
             onChange={(e)=>setPassword(e.target.value)}/>
             </div>
             <Button type="submit" onClick={signUp} >Submit</Button>
             <Button style={{marginLeft: 10}}
               variant="outlined" 
               color="secondary"
               onClick={()=>setOpen(false)}
               > Close</Button>
           </form>
         </div>
        </div>

      </Modal>
      <Modal
        open={openSignin}
        onClose={()=>setOpenSignin(false)}
      >        
        <div>
         <div className="signUp">
         <img className="logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="insta logo"/>
           <form>             
             <div className="input">
             <Input
             placeholder='Email'
             fullWidth="true"
             value={email}
             onChange={(e)=>setEmail(e.target.value)} />
             </div>
             <div className="input">
             <Input
             fullWidth="true"
             placeholder="Password"
             value={password} 
             onChange={(e)=>setPassword(e.target.value)}/>
             </div>
             <Button type="submit" onClick={signin} >Submit</Button>
             <Button style={{marginLeft: 10}}
              variant="outlined" 
              color="secondary"
              onClick={()=>setOpenSignin(false)}
              > Close</Button>
           </form>
         </div>
        </div>

      </Modal>
      {
        user?
        (
          <ImgUpload username={user.displayName}/>
        ):(
          <h3 style={{textAlign: "center", padding: 20}}>Login to upload</h3>
        )
      }
        <div className="div">
          <h6 style={{textAlign: "center", marginBottom: 30}}> Made with 💓 by Ankit Pathak (AK99) </h6>
        <InstagramEmbed
          url='https://www.instagram.com/p/CEyWzc2lrSD/'
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div>
        <div className="Posts">        
        {
          posts.map(({id, post})=>(
            
            <Post key={id} postId={id} user={user} username={post.username} imgUrl={post.imageUrl} caption={post.caption}/>       
          ))
        } 
        </div>        
      </div>      
    </div>    
  )
}

export default App;

/*
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOVPGyVhPVKR6b8eyPKg-LdHBsWlDbYBM",
  authDomain: "ak99instagram.firebaseapp.com",
  databaseURL: "https://ak99instagram.firebaseio.com",
  projectId: "ak99instagram",
  storageBucket: "ak99instagram.appspot.com",
  messagingSenderId: "188615511118",
  appId: "1:188615511118:web:92dd3ef79afd98552e471f",
  measurementId: "G-KYT758SNLK"
}; */
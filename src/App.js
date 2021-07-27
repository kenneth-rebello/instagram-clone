import { Button, Input, Modal } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import Post from './components/Post';
import Upload from './components/Upload';
import { db, auth } from './firebase/firebase';

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });


  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snaphsot) => {
      setPosts(snaphsot.docs.map(doc => {
        return {
          id: doc.id,
          username: doc.data().username,
          imageUrl: doc.data().imageUrl,
          caption: doc.data().caption
        }
      }));
    });
  },[]);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }else{
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    }
  },[])

  const Changer = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    }); 
  }

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(form.email, form.password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: form.username
      })
    })
    .catch(error => alert(error.message));
    setOpen(false);
  }

  const login = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(form.email, form.password)
    .catch(error=>alert(error.message));
    setOpenSignIn(false);
  }

  let {username, email, password} = form;

  return (
    <div className="app">

      <Modal 
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="modal">
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
                alt="Instagram"
                height="30px"
              />
              <section className="field">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  name="username"
                  onChange={(e)=>Changer(e)}
                />
              </section>
              <section className="field">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(e)=>Changer(e)}
                />
              </section>
              <section className="field">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={(e)=>Changer(e)}
                />
              </section>
              <Button type="submit" onClick={(e)=>signUp(e)}>
                Sign Up!
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div className="modal">
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
                alt="Instagram"
                height="30px"
              />
              <section className="field">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(e)=>Changer(e)}
                />
              </section>
              <section className="field">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={(e)=>Changer(e)}
                />
              </section>
              <Button type="submit" onClick={(e)=>login(e)}>
                Login!
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
          alt="Instagram"
        />
        {user ? 
          <div className="app__authContainer">
            <h4 className="app__headerName">{user.displayName}</h4>
            <Button onClick={() => auth.signOut()}>Sign Out</Button> 
          </div>
          : 
          <div className="app__authContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Login</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        }
      </div>      
      
      <div className="app__body">
        <div className="app__posts">
          {posts.map(post => <Post currentUser={user} key={post.id} id={post.id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/> )}
        </div>

      </div>      

      {user?.displayName ? <Upload username={user.displayName}/> : <h3>Login to upload</h3>}
    </div>
  );
}

export default App;

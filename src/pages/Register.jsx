import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr ] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

  try {

const res = await createUserWithEmailAndPassword(auth, email, password);

const storageRef = ref(storage, displayName);

const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on(
  (error) => {
      setErr(true);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        await updateProfile(res.user, {
          displayName,
          photoURL: downloadURL,
        });
        await setDoc(doc(collection(db, 'users'), res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        });

        await setDoc(doc(collection(db, 'userChats'), res.user.uid), {});
        navigate("/");

      });
    }
  );

  }catch(err){
    console.log('Signup Error:', err);
    setErr(true);
  }
  };

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className="logo">Kebs Chat</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Display Name' />
                <input type="email" placeholder='Email'/>
                <input type="password" placeholder='Password'/>
                <input style={{display: "none"}} type="file" id='file' />
                <label htmlFor="file">
                    <img src={Add} alt="" />
                    <span>Add an Avatar</span>
                </label>
                <button>Sign Up</button>
                {err && <span>Something went wrong!</span>}
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  )
}

export default Register

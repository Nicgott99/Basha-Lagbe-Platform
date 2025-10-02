import { GithubAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/users/userSlice';
import { useNavigate } from 'react-router';
import { FaGithub } from 'react-icons/fa';

export default function GitHubOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGitHubClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email'); // Request email access
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      
      // Get user info
      const user = result.user;

      const res = await fetch('/server/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: user.displayName || user.reloadUserInfo?.screenName,
          email: user.email,
          photoURL: user.photoURL,
          login: user.reloadUserInfo?.screenName
        })
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'GitHub sign-in failed');
      }

      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup closed by user');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        console.error('Account exists with different credential');
      } else {
        console.error('Could not sign in with GitHub:', error.message);
      }
    }
  };

  return (
    <button
      onClick={handleGitHubClick}
      type='button'
      className='bg-gray-800 text-white p-3 rounded-lg uppercase hover:opacity-95 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-900'
    >
      <FaGithub className='text-xl' />
      Sign in with GitHub
    </button>
  );
}

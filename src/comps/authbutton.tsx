
import { useUser } from '@auth0/nextjs-auth0/client';

import LoginButton from './loginbutton';
import LogoutButton from './logoutbutton';

const AuthenticationButton = () => {
  const { user } = useUser();

  return !user ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;
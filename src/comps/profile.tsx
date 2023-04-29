/* eslint-disable @next/next/no-img-element */
import { useUser } from '@auth0/nextjs-auth0/client';

export const Profile = () => {
  const { user } = useUser();
  return (
    <div>
        {!user?.picture ? (
            <div>
            </div>
          ) :
            <div>
              <div className="row align-items-center profile-header">
                <div className="col-md-2 mb-3">
                  <img
                    src={user?.picture}
                    alt="Profile"
                    className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                  />
                </div>
                <div className="col-md text-center text-md-left">
                  <h2>{user?.name}</h2>
                  <p className="lead text-muted">{user?.email}</p>
                </div>
              </div>
              <div className="row">
                <pre className="col-12 text-light bg-dark p-4">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          }
    </div>
  );
};
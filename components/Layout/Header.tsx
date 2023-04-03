import React from 'react'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

const Header = () => {
  const { user } = useUser()
  return (
    <header className="">
      <div className="">
        <Link href="/" className="">
          Home
        </Link>
        <nav className="">
          {user ? (
            <div className="">
              <div>
                {user.name},
                {user.uuid}
              </div>
              <Link href="/admin" className="">
                  Admin
              </Link>
              /
              <Link href="/api/graphql" className="">
                  GraphQL
              </Link>
              /
              <Link href="/api/auth/logout"  className="">
                  Logout
              </Link>
            </div>
          ) : (
            <Link href="/api/auth/login" className="">
                Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

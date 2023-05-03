import React from 'react'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

const Header = () => {
  const { user } = useUser()
  return (
    <header className="">
      <div className="">
        <nav className="">
        <Link href="/" className="">
          Home |
        </Link>
          {user ? (
            <>
              <span>
                {user.name},
                {user.uuid} |
              </span>
              <Link href="/admin/item/create" className="">
                  Add Item
              </Link>
              |
              <Link href="/api/graphql" className="">
                  GraphQL
              </Link>
              |
              <Link href="/api/auth/logout"  className="">
                  Logout
              </Link>
            </>
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

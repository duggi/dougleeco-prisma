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
              <Link href="/admin" className="">
                Admin Home |
              </Link>
              <Link href="/admin/item" className="">
                Items Admin |
              </Link>
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
              <span>
                {user.name}
              </span>
            </>
          ) : (
            <Link href="/api/auth/login" className="">
                Login
            </Link>
          )}
        </nav>
      </div>
      <hr />
    </header>
  );
};

export default Header;

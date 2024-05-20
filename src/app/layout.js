import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({ children }) {
  const { userId } = auth();

  // select every profile where clerk_id = userId from auth
  //  if there is a value in userid they have logged in before

  const profile = await db.query(
    `SELECT * FROM profile WHERE clerk_id = '${userId}'`
  );

  // if the user is logged in AND they don't have an entry in the profiles table, add the clerk_id
  // profile.rowCount === 0 true if no profile in the database
  // userId !== null   if there is a userId registered this will not be (!==) null, so if null, no clerk_id exists
  if (profile.rowCount === 0 && userId !== null) {
    // add them to our database if not there
    await db.query(`INSERT INTO profile (clerk_id) VALUES ('${userId}')`);
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
              <p>page header logged out- Welcome</p>
            </SignedOut>

            <SignedIn>
              <UserButton />
              <p>page header logged in - here be a page</p>
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

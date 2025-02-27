import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession(); // Renamed `data` to `session` for clarity

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  return (
    <>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <Link href="/api/auth/signin">
          <button>Sign In</button>
        </Link>
      )}
    </>
  );
}

export default Header;

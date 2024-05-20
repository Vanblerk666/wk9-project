import { db } from "@/lib/db";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Posts() {
  // get the clerk userId - extract userId property from the object returned by auth() and
  // assign it to a variable named userId.
  const { userId } = auth();

  // join to get new posts
  const posts = await db.query(`SELECT
  posts.id,
  posts.posttext,
  profile.id,
  profile.username
FROM posts
INNER JOIN profile ON posts.poster_id = profile.id;`);
  console.log(posts);
  // server action to add a new post
  async function handleAddPost(formData) {
    "use server";

    // get information from the form
    const content = formData.get("content");

    // get the profile id from the database
    const result = await db.query(
      `SELECT id FROM profile WHERE clerk_id = '${userId}'`
    );
    const profileId = result.rows[0].id;

    // add the new post to the database
    await db.query(
      `INSERT INTO posts (poster_id, posttext) VALUES (${profileId}, '${content}')`
    );
  }

  return (
    <div>
      <h2>Posts</h2>
      <SignedIn>
        <h3>Create new post</h3>
        <form action={handleAddPost}>
          <textarea name="content" placeholder="New post"></textarea>
          <button>Submit</button>
        </form>
      </SignedIn>

      <SignedOut>
        <p>You need to sign in to add a post</p>
        <SignInButton />
      </SignedOut>

      <h3>All posts</h3>
      <div>
        {posts.rows.map((post) => {
          return (
            <div key={post.id}>
              <h4>{post.username}</h4>
              <p>{post.posttext}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

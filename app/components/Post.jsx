"use client";
import { useState, useEffect } from "react";
 
const Post = () => {
  const [posts, setPosts] = useState([]);
  const [edtitingId, setEditingId] = useState(null); // ID to track the ID of the post being edited
  const [editingTitle, setEditingTitle] = useState(""); // To store the Title or Post being editied
  const [error, setError] = useState(""); // To store the error message
 
  useEffect(() => {
    fetch("http://localhost:3300/posts") // Fetching the posts from the backend
      .then((response) => response.json()) // Converting the response to JSON
      .then((response) => setPosts(response)); // Setting the posts state with the data from the response
  }, []); // Dependency array to re-run the effect when the posts state changes
 
  // This is how we post data to the server
  const addPost = (title) => {
    // Function to add a new post
    fetch("http://localhost:3300/posts", {
      // Sending a POST request to the backend to add a new post.
      method: "POST", // Setting the request method as POST
      headers: { "Content-Type": "application/json" }, // Setting content type to JSON in the request headers
      body: JSON.stringify({ title }), // Sending the post title in the request body as JSON
    })
      .then((response) => response.json()) // Converts the response to JSON
      .then((newPost) => setPosts((prevPosts) => [...prevPosts, newPost])); // Adds the new post to the state
  };
 
  const updatePost = (id, title) => {
    fetch(`http://localhost:3300/posts/${id}`, {
      // Sending a PUT request to the backend to update a post)
      method: "PUT", // Setting the request method as PUT
      headers: { "Content-Type": "application/json" }, // Setting content type to JSON in the request headers
      body: JSON.stringify({ title }), // Sending the post title in the request body as JSON
    }).then(() => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? { ...post, title } : post))
      );
    });
    setEditingId(null); // Resetting the editing ID
    setEditingTitle(""); // Resetting the editing title
  };
 
  const deletePost = (id) => {
    fetch(`http://localhost:3300/posts/${id}`, {
      // Sending a DELETE request to the backend to delete a post
      method: "DELETE", // Setting the request method as DELETE
    }).then(() => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); // Filtering out the post with the specified ID
    });
  };
 
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    if (!title) {
      // Error handling if the title is empty
      setError("Please enter a Post");
      return;
    }
    setError(""); // setting the error message state to empty
    addPost(title); // Calling the addPost function to add a new post
    e.target.title.value = ""; // Resetting the input field
  };
 
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
 
      {/* Handle Submit */}
      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Title"
          name="title"
        />
        {/* Add button Type */}
        <button
          className="bg-blue-500 text-white py-1 px-2 rounded"
          type="submit"
        >
          Add Post
        </button>
      </form>
 
        { error && <p className="text-red-500 mt-2">{error}</p>}
      {/* Display Posts */}
      <ul className="mt-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border p-2 my-2 flex justify-between items-center"
          >
            {edtitingId === post.id ? ( // Check if the post is being edited, if yest display in Edit mode, else display in normal mode
                <div className="flex items-center">
                    <input
                    className="border p-2 mr-2"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <button className="bg-green-500 text-white py-1 px-2 ml-2 rounded-full"
                    onClick={() => updatePost(post.id, editingTitle)}
                    >Save</button>
                 
                </div>
            ):( <div className="flex items-center">
                <span className="font-bold">{post.title}</span>{" "}
                {/* Displays the post title   */}
                <button
                  className="bg-yellow-500 text-white py-1 px-2 rounded-full ml-2"
                  onClick={() => {
                    setEditingId(post.id); // Setting the editing ID
                    setEditingTitle(post.title); // Setting the editing title
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 ml-2 rounded-full"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
              </div>)}
           
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default Post;
const express = require("express");
const cors = require("cors");
let { sequelize } = require("./lib/index.js");
let { post } = require("./models/post.model.js");

const app = express();
app.use(express.json());
app.use(cors());

let postData = [
    {
      title: 'Getting Started with Node.js',
      content:
        'This post will guide you through the basics of Node.js and how to set up a Node.js project.',
      author: 'Alice Smith',
    },
    {
      title: 'Advanced Express.js Techniques',
      content:
        'Learn advanced techniques and best practices for building applications with Express.js.',
      author: 'Bob Johnson',
    },
    {
      title: 'ORM with Sequelize',
      content:
        'An introduction to using Sequelize as an ORM for Node.js applications.',
      author: 'Charlie Brown',
    },
    {
      title: 'Boost Your JavaScript Skills',
      content:
        'A collection of useful tips and tricks to improve your JavaScript programming.',
      author: 'Dana White',
    },
    {
      title: 'Designing RESTful Services',
      content: 'Guidelines and best practices for designing RESTful APIs.',
      author: 'Evan Davis',
    },
    {
      title: 'Mastering Asynchronous JavaScript',
      content:
        'Understand the concepts and patterns for writing asynchronous code in JavaScript.',
      author: 'Fiona Green',
    },
    {
      title: 'Modern Front-end Technologies',
      content:
        'Explore the latest tools and frameworks for front-end development.',
      author: 'George King',
    },
    {
      title: 'Advanced CSS Layouts',
      content:
        'Learn how to create complex layouts using CSS Grid and Flexbox.',
      author: 'Hannah Lewis',
    },
    {
      title: 'Writing Testable JavaScript Code',
      content:
        'An introduction to unit testing and test-driven development in JavaScript.',
      author: 'Jane Miller',
    },
  ]

// Endpoint to seed the database
app.get("/seed_db", async (req, res) => {
  try{
    await sequelize.sync({ force: true });
    await post.bulkCreate(postData);
    
    return res.status(201).json({ message: "Database seeding successful." });
  } catch(error){
    return res.status(500).json({ message: "Error seeding the database", error: error.message });
  }
});  

// function to get all posts
async function getAllPosts(){
    let result = await post.findAll();
    return { posts: result };
}

// Endpoint to get all posts
app.get("/posts", async (req, res) => {
    try{
      let response = await getAllPosts();
      
      if(response.posts.length === 0){
        return res.status(404).json({ message: "No posts found." });
      }
      
      return res.status(200).json(response);
    } catch(error){
        return res.status(500).json({ message: "Error fetching all posts", error: error.message });
    }
});

// function to add a new post in database
async function addNewPost(postData){
    let newPost = await post.create(postData);
    return { newPost };
}

// function to get a post by Id
async function getPostById(id){
    let postData = await post.findOne({ where: {id} });
    return { post: postData };
}

// Endpoint to get a post by Id
app.get("/posts/details/:id", async (req, res) => {
    try{
        let id = parseInt(req.params.id);
        let response = await getPostById(id);

        if(response.post === null){
            return res.status(404).json({ message: "Post not found." });
        }
        
        return res.status(200).json(response);
    } catch(error){
        return res.status(500).json({ message: "Error fetching the post", error: error.message });
    }
})

// Endpoint to add a new post
app.post("/posts/new", async (req, res) => {
  try{
    let newPost = req.body.newPost;
    let response = await addNewPost(newPost);
    return res.status(201).json(response);
  } catch(error){
    return res.status(500).json({ message: "Error adding the new post", error: error.message });
  }
});

// function to update post information by Id
async function updatePostById(updatePostData,id){
    let postDetails = await post.findOne({ where: {id} });
    if(!postDetails){
        return {}
    }

    postDetails.set(updatePostData);
    let updatedPost = await postDetails.save();

    return { message: "Post updated sucessfully", updatedPost };
}

// Endpoint to update post by Id
app.post("/posts/update/:id", async (req, res) => {
  try{
    let newPostData = req.body;
    let id = parseInt(req.params.id);
    let response = await updatePostById(newPostData, id);

    if(!response.message){
        return res.status(404).json({ message: "POst not found." });
    }
    
    return res.status(201).json(response);
  } catch(error){
    return res.status(500).json({ message: "Error updating the post", error: error.message });
  }
});

// function to delete a post from database
async function deletePostById(id){
    let destroyedPost = await post.destroy({ where: {id} });
    if(destroyedPost === 0){
        return {};
    }
    return { message: "Post record has been deleted successfully." };
}

// Endpoint to delete a post from database
app.post("/posts/delete", async (req, res) => {
  try{
    let id = parseInt(req.body.id);
    let response = await deletePostById(id);

    if(!response.message){
        return res.status(404).json({ message: "Post not found." })
    }
    
    return res.status(201).json(response);
  } catch(error){
    return res.status(500).json({ message: "Error deleting the post", error: error.message });
  }
});

module.exports = { app };
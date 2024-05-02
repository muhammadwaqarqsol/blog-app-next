"use client";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import MyButton from "@/app/component/button/button";
import React, { useState, useEffect } from "react";
// import Navbar from "@/app/component/navbar/navbar";
import { convertToHTML } from "draft-convert";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import "draft-js/dist/Draft.css";
import Input from "@/app/component/input/input";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MyModal from "@/app/component/modal/modal";
import axios  from 'axios';
const Blog = ({getAllBlogs}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);
  const [blog, setBlog] = useState(null);
  const [blogList, setBlogList] = useState([]);
  const [title, setTitle] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData")) ;
  // console.log(userId.id)
const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
 const addBlog = async() =>{
  try {
 const blogData =  {
    title ,
    description : convertedContent ,
    userId : userData.id 
  }
  const add_data = await axios.post("http://localhost:3000/api/blogs" , {...blogData}) ; 
  getAllBlogs()

  }
  catch (error){
   console.log(error)
  }
 
 } 
  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
  }, [editorState]);

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

// useEffect(()=>{
//   getAllBlogs ()
// },[])
  return (
    <>
      {/* <Navbar /> */}
    <MyModal open={open}
        handleClose={handleClose}>
          <div className="border-2 container m-auto mt-10 px-3 rounded-md">
              <div className="container">
                <label>
                  {" "}
                  Title :
                  <Input
                    classAdd="container mb-5 "
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
              </div>
              <div className="h-[200px]">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                />
              </div>
            </div> </MyModal>
      <div className="border-2 container m-auto mt-10 px-3 rounded-md">
        <div className="container">
          <label>
            {" "}
            Title :
            <Input
              classAdd="container mb-5 "
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div className="h-[200px]">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
        </div>
      </div>
      <div className="flex justify-center mt-3">
        <MyButton
          btnName="Blog Post"
          variant="contained"
          onClick={() => {
            setBlog(convertedContent);
            addBlog()
          }}
        />
      </div>

      {blogList.map((value, index) => (
        <>
          <div
            key={index}
            className="border p-3 box-shadow mt-3 h-[100px] container m-auto w-[70%] rounded-md "
          >
            <div className="flex justify-between ">
              <h3 className="font-bold text-[1.2rem] "> {value.title}usman</h3>

              <ModeEditOutlineIcon onClick={handleOpen}>
                edit
              </ModeEditOutlineIcon>
            </div>
            <div
              dangerouslySetInnerHTML={createMarkup(value.description)}
            ></div>
          </div>
        </>
      ))}
    </>
  );
};


 async function getServerSideProps() {
  // Fetch data from external API
  const getAllBlogs = async() =>{
    try {
       const blogData = await axios.get("http://localhost:3000/api/blogs") ;
       console.log(blogData)
       setBlogList (blogData?.data?.allBlogs)
    } catch (error) {
      console.log(error) 
    }
  }
  
  // Pass data to the page via props
  return { props: { getAllBlogs } }
}
 

export {getServerSideProps , Blog}
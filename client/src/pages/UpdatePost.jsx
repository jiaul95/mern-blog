import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from "draft-js-import-html";
import axiosInstance from "../../axios/axios";
import {  
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  dismissImageAlert,
  imageUploadFailure,
  successAlert,

} from "../features/user/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const UpdatePost = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formInput, setFormInput] = useState({
    title: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const dispatch = useDispatch();
  const {
    successMessage: successMessage,
    error: errorMessage,
    loading,
  } = useSelector((state) => state.post);

  const  {currentUser} = useSelector((state) => state.user);


  const fileInputRef = useRef(null);

  const { postId } = useParams();

  useEffect(() => {
    axiosInstance
      .get(`/post/getPosts?postId=${postId}`)
      .then((res) => {
        const { title, category, content, image } = res.data.data.posts[0];
        setFormInput({ title, category });
        setEditorState(EditorState.createWithContent(stateFromHTML(content)));
        setImageFileUrl(image);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [postId]);

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.id]: e.target.value });
  };

  const handleEditorChange = (newState) => {
    setEditorState(newState);
    const rawContentState = convertToRaw(newState.getCurrentContent());
    const contentHTML = draftToHtml(rawContentState);
    setFormInput({ ...formInput, content: contentHTML });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (Object.keys(formInput).length === 0) {
      return;
    }
    if (imageFile && imageFile.type.split("/")[0] !== "image") {
      return dispatch(updatePostFailure("Please select an image"));
    }

    const formData = new FormData();


    if(imageFile){
      formData.append("postImage", imageFile ?? null);
    }
    formData.append("formInput", JSON.stringify(formInput));   

    dispatch(updatePostStart());

    axiosInstance
      .put(`/post/updatePost/${postId}/${currentUser._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          dispatch(updatePostSuccess(res.data.data));
          dispatch(successAlert(res.data.message));
          console.log("Success",res.data);

          // setFormInput({ ...formInput, title: res.data.data.title });
          // setFormInput({ ...formInput, category: res.data.data.category });  
          // const contentState = stateFromHTML(res.data.data.content);
          // setEditorState(EditorState.createWithContent(contentState)); 
          // setImageFileUrl(res.data.data.image);
        } else {
          dispatch(updatePostSuccess("Failed to update profile!"));
        }
      })
      .catch((error) => {
        console.error("Error Response", error);
        dispatch(updatePostFailure(error.response.data.message));
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 10 * 1024 * 1024) {
      dispatch(imageUploadFailure("File size should not exceed 2MB!"));
      setImageFile(null);
      setImageFileUrl(null);
      return;
    }

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleUpdatePost}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={handleChange}
            value={formInput.title}
          />
          <Select
            id="category"
            onChange={handleChange}
            value={formInput.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="reactjs">React.js</option>
            <option value="javascript">JavaScript</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt="post-image"
            id="image"
            className="w-full h-[250px] object-cover"
            onChange={handleChange}
          />
        )}

        {errorMessage && (
          <Alert
            className="mt-2"
            color="failure"
            onDismiss={() => dispatch(dismissImageAlert())}
          >
            {errorMessage}
          </Alert>
        )}

        <div className="editor">
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="custom-editor"
            editorClassName="bg-white p-4 min-h-[200px] border border-gray-300 rounded-lg"
            placeholder="Write something...."
            required
          />
        </div>
        {successMessage && (
          <Alert
            className="mt-4"
            color="success"
            onDismiss={() => dispatch(dismissImageAlert())}
          >
            {successMessage}
          </Alert>
        )}

        <Button type="submit" gradientDuoTone="purpleToPink">
          {/* {loading ? "Loading" : "Update"} */}
          Update
        </Button>
      </form>
    </div>
  );
};

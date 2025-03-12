import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import axiosInstance from "../../axios/axios";
import { dismissImageAlert, imageUploadFailure, publishPostFailure, publishPostStart, publishPostSuccess, successAlert } from "../features/user/postSlice";
import { useDispatch, useSelector } from "react-redux";


export const CreatePost = () => {

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formInput, setFormInput] = useState({});  
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const dispatch = useDispatch();
  const  {
    createPostSuccess:successMessage,
    error: errorMessage,
    loading       
} = useSelector((state) => state.post);

  console.log("loading",loading);
 

  const handleChange = (e) => {   
    setFormInput({...formInput, [e.target.id]: e.target.value });
  }

  const handleEditorChange = (newState) => {
    setEditorState(newState); 
    const rawContentState = convertToRaw(newState.getCurrentContent());
    const contentHTML = draftToHtml(rawContentState);
    setFormInput({...formInput, content: contentHTML });
  };


  console.log("form input", formInput);


    const handleCreatePost = async (e) => {
      
        e.preventDefault();

        if(Object.keys(formInput).length === 0) {           
          return;
        }
        if (!imageFile) {
          return dispatch(publishPostFailure("Please select an image"));
        }

        if(imageFile.type.split('/')[0]!== 'image'){
          return dispatch(publishPostFailure("Please select an image"));
        }
        const formData = new FormData();
        formData.append("postImage", imageFile);  
        formData.append("formInput", JSON.stringify(formInput));      
     


        // console.log("form submitted", formData); return;

        dispatch(publishPostStart());

        axiosInstance.post(`/post/create`, formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              },
          }
        )
        .then((res) => {
            console.log('res',res.data);
            if(res.data.success === true){         
                dispatch(publishPostSuccess(res.data.data));
                dispatch(successAlert("Profile Updated successfully!"));                
                setImageFileUrl(null);
                setFormInput({}); 
            }else
            {
              dispatch(publishPostFailure("Failed to update profile!"));
            }
        })
        .catch((error) => {
          console.error('Error Response', error);
          dispatch(publishPostFailure(error.response.data.message));
        });  

    }

  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
        
      if(file.size > 10 * 1024 * 1024){    
          dispatch(imageUploadFailure("File size should not exceed 2MB!"))        
          setImageFile(null);
          setImageFileUrl(null);
          return;        
      }

      if(file){
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }

    }
  
  

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create Post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleCreatePost}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput type="text" placeholder="Title" required id="title" className="flex-1" onChange={handleChange} />
              <Select id="category" onChange={handleChange}>
                  <option value="uncategorized">Select a category</option>
                  <option value="reactjs">React.js</option>
                  <option value="javascript">JavaScript</option>
                  <option value="nextjs">Next.js</option>
              </Select>
          </div>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"> 
              <FileInput type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          {imageFileUrl && 
            <img src={imageFileUrl} alt="post-image" id="image" className="w-full h-[250px] object-cover" onChange={handleChange} />
          }

            {
                errorMessage && (
                    <Alert className="mt-2" color="failure" onDismiss={() => dispatch(dismissImageAlert()) }>
                        {errorMessage}
                    </Alert>
                )
            }

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
                {successMessage && 
                    <Alert className="mt-4" color="success" onDismiss={() => dispatch(dismissImageAlert()) }>
                        {successMessage}
                    </Alert>                    
                } 
            
            <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
                  { loading ? "Loading" : "Publish" }
            </Button>
      </form>

    </div>
  )
}

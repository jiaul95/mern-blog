import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const CreatePost = () => {

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create Post
      </h1>

      <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
              <Select>
                  <option value="uncategorized">Select a category</option>
                  <option value="reactjs">React.js</option>
                  <option value="javascript">JavaScript</option>
                  <option value="nextjs">Next.js</option>
              </Select>
          </div>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"> 
              <FileInput type="file" accept="image/*" />
              <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline> Upload Image </Button>
          </div>
           <div >
              <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName="custom-editor"
                  editorClassName="bg-white p-4 min-h-[200px] border border-gray-300 rounded-lg"
                  placeholder="Write something...."
                  required
                />
            </div>
            
            <Button type="submit" gradientDuoTone="purpleToPink">
                    Publish
                </Button>
      </form>

    </div>
  )
}

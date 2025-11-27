import React from 'react'
import { CldUploadWidget } from 'next-cloudinary';




export default function UploadWidget({changeMedia}: {changeMedia : React.Dispatch<string>}) {
  return (
    <CldUploadWidget uploadPreset="RoshApp"   onSuccess={(result) => {

        const info = result.info;
        if (info != null && typeof info !== "string") {
        const url = info.secure_url; // now TS knows this exists
        console.log("Uploaded image URL:", url);
        changeMedia(url);

        }

        }}>
        {
            ({open}) => {
                return <button className="w-full bg-neutral-800 p-2 rounded" onClick={() => open()} > Upload an Image</button>
            }
        }

    </CldUploadWidget>
  )
}

"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useState } from "react";



interface FileUploadProps {
    onSuccesss : ( res : IKUploadResponse) => void
    onProgress ?: ( progress : number) => void
    fileType ?: "image" | "video"
}

export default function FileUpload({
    onSuccesss,
    onProgress,
    fileType = "image"
} : FileUploadProps ) {
  const [uploading ,setuploading] = useState(false);
  const [error ,seterror] = useState<String | null>(null);

  const onError = (err: {message : string}) => {
    console.log("Error", err);
    seterror(err.message);
    setuploading(false);
  };

  const handlerSuccess = (res : IKUploadResponse) => {
        console.log(res);
        setuploading(false);
        seterror(null);
        onSuccesss(res);
  };

  const handlerProgress = (evt  : ProgressEvent) =>{
    if( evt.lengthComputable && onProgress ){
        const per = ( evt.loaded / evt.total  ) * 100;
        onProgress(Math.round(per));
    }
  }
  const handleStartUpload = () => {
    setuploading(true);
    seterror(error);
  };

  const ValidateFile = (file : File) =>{
    if( fileType == "video" ){
        if( !file.type.startsWith("video/")){
            seterror("Please Upload a Video File ")
            return false;
        }
        if( file.size > 100 * 1024 * 1024 ){
            seterror("Video must be less than 100 MB")
            return false;
        }
    }else{
        const validTypes = ["image/jpeg","image/png","image/webp"]
        if( !validTypes.includes(file.type) ){
            seterror("Please Upload a valid Image type (jpeg,png,webp)");
            return false;
        }
        if( file.size > 10 * 1024 * 1024 ){
            seterror("image must be less than 10 MB")
            return false;
        }
    }
    return false;
  }
  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={ValidateFile}
    
          overwriteFile={true}
          overwriteAITags={true}
          overwriteTags={true}
          overwriteCustomMetadata={true}
    
          onError={onError}
          onSuccess={handlerSuccess}
          onUploadProgress={handlerProgress}
          onUploadStart={handleStartUpload}
          className="file-input file-input-border w-full"
          folder={fileType === "video" ? "/videos" : "/images"}
        />
        {
            uploading  && (
                <div className="flex items-center gap-2 text-sm text-primary"> 
                <Loader2 className="animate-spin w-4 h-4"/>
                <span>Uploading...</span>
                </div>
            )
        }
        {
            error && (
                <div className="text-error text-sm ">{error}</div>
            )
        }
    </div>
  );
}
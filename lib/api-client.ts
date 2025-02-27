import { IVideo } from "@/Models/Video";


type fetchOptions = {
    method ?: "GET" | "POST" | "PUT" | "DELETE",
    body ?: any,
    headers ?: Record<string,string>
}

export type videoFormData = Omit<IVideo,"_id">

class APIclient{
    private async custome_fetch<T>( 
        endpoint : string,
        options : fetchOptions = {}
    ) : Promise<T>{
        const { method = "GET", body,  headers = {}} = options;
        const defaultHeaders = {
            "Content-Type" : "application/json",
            ...headers
        }

       const response =  await fetch(`/api${endpoint}`,{method,headers : defaultHeaders,
            body : body ? JSON.stringify(body) : undefined
        })

        if (!response.ok) {
            throw new Error(await response.text());
          }
        return response.json();
    }
    async getVideos(){
        return this.custome_fetch<IVideo[]>("/videos")
    }
    async getsingleVideo(id: string){
        return this.custome_fetch<IVideo>(`/videos/${id}`)
    }
    async  CreateVideo(videoData : videoFormData) {
        return this.custome_fetch("/videos",{
            method : "POST",
            body : videoData
        })
    }
}




export const apiClient = new APIclient();


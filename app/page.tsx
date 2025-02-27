'use client'
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/Models/Video";
import { useEffect, useState } from "react";
import { IKVideo } from "imagekitio-next";
import { ObjectId } from "mongoose";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.log("Error Fetching Videos");
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Video Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={(video?._id as ObjectId).toString()}
          className="card shadow-lg p-4">
            <IKVideo
              path={video.videoUrl} // Ensure this is a valid ImageKit video path
  
              controls={true} // Enables video controls
              className="rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-2">{video.title}</h2>
            <p className="text-gray-600">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

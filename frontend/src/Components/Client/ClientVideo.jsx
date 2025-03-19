import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

// Player imports
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

function ClientVideo() {
  const [videos, setVideos] = useState([]);
  const [videoImages, setVideoImages] = useState({});
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading states
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingVideoPlayer, setLoadingVideoPlayer] = useState(false);

  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, VIDEO_BASE_URL } = useContext(ProjectContext);
  const token = localStorage.getItem("token");

  // Fetch all videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideos(true);
      try {
        const response = await axios.get(`${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/all-video`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setVideos(response.data.videos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  // Fetch images for videos
  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      const images = {};
      for (const video of videos) {
        try {
          const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
          images[video.title] = imageUrl;
          console.log(imageUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
      setVideoImages(images);
      setLoadingImages(false);
    };

    if (videos.length > 0) fetchImages();
  }, [videos]);

  // Play video function
  const handlePlayVideo = async (filename) => {
    try {
      setLoadingVideoPlayer(true);
      const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(filename)}.mp4`;
      setSelectedVideo(videoUrl);
      setIsModalOpen(true);
      console.log(videoUrl)
    } catch (error) {
      console.error("Error fetching video:", error);
      Toast.fire({ icon: "error", title: "Error loading video" });
    } finally {
      setLoadingVideoPlayer(false);
    }
  };

  return (
    <>
      <div className="p-4">
        {loadingVideos ? (
          <div className="text-center text-gray-500 text-lg">Loading videos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg hover:scale-105 duration-400 shadow-md  overflow-hidden max-w-sm mx-auto">
                {loadingImages ? (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">Loading image...</div>
                ) : (
                  <img src={videoImages[video.title]} alt="Video Thumbnail" className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <button
                    onClick={() => handlePlayVideo(video.title)}
                    className="w-full cursor-pointer bg-gray-950 hover:bg-gray-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-white p-4 rounded-lg w-full max-w-3xl">
            <button
              className="absolute z-50 top-3 cursor-pointer right-3 text-black text-2xl font-bold bg-gray-200 hover:bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >✕
            </button>
            <div className="relative">
              {loadingVideoPlayer ? (
                <p className="text-center text-gray-500">Loading video...</p>
              ) : (
                <MediaPlayer title="Video Player" src={selectedVideo}>
                  <MediaProvider />
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              )}
              <img
                src="https://www.requingroup.com/logo.png"
                className="absolute top-5 right-5 w-20 opacity-50"
                alt="Watermark"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientVideo;


import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import ReactPlayer from "react-player";
import ProjectContext from "../../Context/ProjectContext";

function Testing() {
  const [videos, setVideos] = useState([]);
  const [videoImages, setVideoImages] = useState({}); // Stores images per video
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, VIDEO_BASE_URL } = useContext(ProjectContext)

  // Fetch all videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(API_BASE_URL + API_URL + VIDEO_BASE_URL + "/all-video");
        setVideos(response.data.videos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, []);

  // Fetch images for videos
  useEffect(() => {
    const fetchImages = async () => {
      const images = {};
      for (const video of videos) {
        try {
          const imageUrl = `${API_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
          images[video.title] = imageUrl;
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
      setVideoImages(images);
    };

    if (videos.length > 0) fetchImages();
  }, [videos]);

  // Play video function
  const handlePlayVideo = async (filename) => {
    try {
      const videoUrl = `${API_BASE_URL}/get-image-url?filename=${encodeURIComponent(filename)}.mp4`;
      setSelectedVideo(videoUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching video:", error);
      Toast.fire({ icon: "error", title: "Error loading video" });
    }
  };

  return (
    <>
      <div >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden text-center">
              <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${videoImages[video.title]})` }} ></div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{video.title}</h3>

                <button onClick={() => handlePlayVideo(video.title)} type="button" class=" cursor-pointer bg-gray-950 hover:bg-gray-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"> Watch Now</button>


              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-white p-4 rounded-lg w-full max-w-3xl">
            <button
              className="absolute z-50 top-3 right-3 text-black text-2xl font-bold bg-gray-200 hover:bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <div className="relative">
              <ReactPlayer
                url={selectedVideo} // Video source
                playing={isModalOpen}

                controls
                width="100%"
                height="auto"
                className="rounded-lg"
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload", // Prevent download option
                      onContextMenu: (e) => e.preventDefault(), // Disable right-click
                    },
                  },
                }}
              />
              {/* Watermark */}
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

export default Testing;

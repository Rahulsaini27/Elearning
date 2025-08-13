


// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

// import '@vidstack/react/player/styles/default/theme.css';
// import '@vidstack/react/player/styles/default/layouts/video.css';
// import { MediaPlayer, MediaProvider } from '@vidstack/react';
// import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
// import ProjectContext from '../../Context/ProjectContext';

// function Coursevideo() {
//     const { courseId } = useParams();
//     const [videos, setVideos] = useState([]);
//     const [videoImages, setVideoImages] = useState({});
//     const [selectedVideo, setSelectedVideo] = useState(null);
//     const [videoLoading, setVideoLoading] = useState(false);

//     const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL } = useContext(ProjectContext);
//     const admintoken = localStorage.getItem('admintoken');
//     useEffect(() => {
//         if (courseId) {
//             axios.get(
//                 `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/course/${courseId}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${admintoken}`, // ✅ Properly set Authorization header
//                         "Content-Type": "application/json"
//                     }
//                 }
//             )
//                 .then(response => {
//                     setVideos(response.data.videos);
//                     if (response.data.videos && response.data.videos.length > 0) {
//                         handlePlayVideo(response.data.videos[0].title);
//                     }
//                 })
//                 .catch(error => {
//                     console.error("Error fetching videos:", error);
//                 });
//         }
//     }, [courseId]);

//     useEffect(() => {
//         const fetchImages = async () => {
//             const images = {};
//             await Promise.all(videos.map(async (video) => {
//                 try {
//                     const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
//                     images[video.title] = imageUrl;
//                 } catch (error) {
//                     console.error("Error fetching image:", error);
//                 }
//             }));
//             setVideoImages(images);
//         };

//         if (videos.length > 0) fetchImages();
//     }, [videos]);

//     const handlePlayVideo = async (filename) => {
//         setVideoLoading(true);
//         try {
//             const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
//             setSelectedVideo(videoUrl);
//         } catch (error) {
//             console.error("Error fetching video:", error);
//         } finally {
//             setVideoLoading(false);
//         }
//     };

//     const currentIndex = videos.findIndex(video =>
//         `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(video.title)}.mp4` === selectedVideo
//     );

//     const handlePrevious = () => {
//         if (currentIndex > 0) {
//             handlePlayVideo(videos[currentIndex - 1].title);
//         }
//     };

//     const handleNext = () => {
//         if (currentIndex < videos.length - 1) {
//             handlePlayVideo(videos[currentIndex + 1].title);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 text-slate-800"> {/* Changed background and text color */}
//             <div className="container mx-auto px-4 py-8">
//                 {/* Navigation */}
//                 <div className="mb-6">
//                     <Link to="/admin/admin-course" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"> {/* Changed link color */}
//                         <ChevronLeft className="mr-2" size={18} /> {/* Slightly smaller icon */}
//                         Back to All Courses
//                     </Link>
//                 </div>

//                 {/* Main Content */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Video Player Column */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Video Player */}
//                         <div className="relative overflow-hidden rounded-xl shadow-md border border-slate-200"> {/* Added rounding, shadow, and border */}
//                             <MediaPlayer
//                                 className="w-full aspect-video"
//                                 title={videos[currentIndex]?.title || "Course Video"}
//                                 src={selectedVideo || ""}
//                             >
//                                 <MediaProvider />
//                                 <DefaultVideoLayout icons={defaultLayoutIcons} />
//                             </MediaPlayer>
//                             <img
//                                 src="/logo.png"
//                                 className="absolute top-4 right-4 w-16 opacity-40"
//                                 alt="Watermark"
//                             />
//                         </div>

//                         {/* Navigation Buttons */}
//                         <div className="flex justify-between items-center">
//                             <button
//                                 onClick={handlePrevious}
//                                 disabled={currentIndex <= 0}
//                                 className="flex items-center px-4 py-2
//                                     text-slate-700
//                                     bg-slate-100
//                                     hover:bg-slate-200
//                                     rounded-lg
//                                     transition-colors
//                                     disabled:opacity-50
//                                     disabled:cursor-not-allowed font-medium" 
//                             >
//                                 <ChevronLeft className="mr-2" />
//                                 Previous
//                             </button>
//                             <button
//                                 onClick={handleNext}
//                                 disabled={currentIndex >= videos.length - 1}
//                                 className="flex items-center px-4 py-2
//                                     text-slate-700
//                                     bg-slate-100
//                                     hover:bg-slate-200
//                                     rounded-lg
//                                     transition-colors
//                                     disabled:opacity-50
//                                     disabled:cursor-not-allowed font-medium" 
//                             >
//                                 Next
//                                 <ChevronRight className="ml-2" />
//                             </button>
//                         </div>

//                         {/* Video Information */}
//                         {videos[currentIndex] && (
//                             <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200"> {/* Refined card styles */}
//                                 <h2 className="text-2xl font-bold text-slate-800 mb-3">{videos[currentIndex].title}</h2> {/* Adjusted text color */}
//                                 <p className="text-slate-600">{videos[currentIndex].description}</p> {/* Adjusted text color */}
//                             </div>
//                         )}
//                     </div>

//                     {/* Course Content Sidebar */}
//                     <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 h-fit"> {/* Refined card styles */}
//                         <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-3 border-slate-200">Course Content</h3> {/* Adjusted text and border color */}
//                         <div className="space-y-4">
//                             {videos.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     onClick={() => handlePlayVideo(item.title)}
//                                     className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
//                                         ${currentIndex === index
//                                             ? "bg-indigo-500/10 ring-2 ring-indigo-500" // Changed active state colors
//                                             : "hover:bg-slate-50"
//                                         }`}
//                                 >
//                                     <img
//                                         src={videoImages[item.title] || "https://via.placeholder.com/100"}
//                                         alt={`Thumbnail of ${item.title}`}
//                                         className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm bg-slate-200" // Added background for empty image
//                                     />
//                                     <div className="flex-grow">
//                                         <h4 className="font-medium text-slate-800">{item.title}</h4> {/* Adjusted text color */}
//                                         <div className="flex items-center text-slate-600 text-sm mt-1"> {/* Adjusted text color */}
//                                             <PlayCircle className="w-4 h-4 mr-2 text-indigo-500" /> {/* Changed icon color */}
//                                             Video Lesson
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Coursevideo;


import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import ProjectContext from '../../Context/ProjectContext';

function Coursevideo() {
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]);
    const [videoImages, setVideoImages] = useState({});
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false);

    const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL } = useContext(ProjectContext);
    const admintoken = localStorage.getItem('admintoken');
    useEffect(() => {
        if (courseId) {
            axios.get(
                `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/course/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${admintoken}`, // ✅ Properly set Authorization header
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => {
                    setVideos(response.data.videos);
                    if (response.data.videos && response.data.videos.length > 0) {
                        handlePlayVideo(response.data.videos[0].title);
                    }
                })
                .catch(error => {
                    console.error("Error fetching videos:", error);
                });
        }
    }, [courseId]);

    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            await Promise.all(videos.map(async (video) => {
                try {
                    const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
                    images[video.title] = imageUrl;
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }));
            setVideoImages(images);
        };

        if (videos.length > 0) fetchImages();
    }, [videos]);

    const handlePlayVideo = async (filename) => {
        setVideoLoading(true);
        try {
            const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
            setSelectedVideo(videoUrl);
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setVideoLoading(false);
        }
    };

    const currentIndex = videos.findIndex(video =>
        `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(video.title)}.mp4` === selectedVideo
    );

    const handlePrevious = () => {
        if (currentIndex > 0) {
            handlePlayVideo(videos[currentIndex - 1].title);
        }
    };

    const handleNext = () => {
        if (currentIndex < videos.length - 1) {
            handlePlayVideo(videos[currentIndex + 1].title);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800"> {/* Changed background and text color */}
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Link to="/admin/admin-course" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"> {/* Changed link color */}
                        <ChevronLeft className="mr-2" size={18} /> {/* Slightly smaller icon */}
                        Back to All Courses
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className="relative overflow-hidden rounded-xl shadow-md border border-slate-200"> {/* Added rounding, shadow, and border */}
                            <MediaPlayer
                                className="w-full aspect-video"
                                title={videos[currentIndex]?.title || "Course Video"}
                                src={selectedVideo || ""}
                            >
                                <MediaProvider />
                                <DefaultVideoLayout icons={defaultLayoutIcons} />
                            </MediaPlayer>
                            <img
                                src="/logo.png"
                                className="absolute top-4 right-4 w-16 opacity-40"
                                alt="Watermark"
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex <= 0}
                                className="flex items-center px-4 py-2
                                    text-slate-700
                                    bg-slate-100
                                    hover:bg-slate-200
                                    rounded-lg
                                    transition-colors
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed font-medium" 
                            >
                                <ChevronLeft className="mr-2" />
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= videos.length - 1}
                                className="flex items-center px-4 py-2
                                    text-slate-700
                                    bg-slate-100
                                    hover:bg-slate-200
                                    rounded-lg
                                    transition-colors
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed font-medium" 
                            >
                                Next
                                <ChevronRight className="ml-2" />
                            </button>
                        </div>

                        {/* Video Information */}
                        {videos[currentIndex] && (
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200"> {/* Refined card styles */}
                                <h2 className="text-2xl font-bold text-slate-800 mb-3">{videos[currentIndex].title}</h2> {/* Adjusted text color */}
                                <p className="text-slate-600">{videos[currentIndex].description}</p> {/* Adjusted text color */}
                            </div>
                        )}
                    </div>

                    {/* Course Content Sidebar */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 h-fit"> {/* Refined card styles */}
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-3 border-slate-200">Course Content</h3> {/* Adjusted text and border color */}
                        <div className="space-y-4">
                            {videos.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePlayVideo(item.title)}
                                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                                        ${currentIndex === index
                                            ? "bg-indigo-500/10 ring-2 ring-indigo-500" // Changed active state colors
                                            : "hover:bg-slate-50"
                                        }`}
                                >
                                    <img
                                        src={videoImages[item.title] || "https://via.placeholder.com/100"}
                                        alt={`Thumbnail of ${item.title}`}
                                        className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm bg-slate-200" // Added background for empty image
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-slate-800">{item.title}</h4> {/* Adjusted text color */}
                                        <div className="flex items-center text-slate-600 text-sm mt-1"> {/* Adjusted text color */}
                                            <PlayCircle className="w-4 h-4 mr-2 text-indigo-500" /> {/* Changed icon color */}
                                            Video Lesson
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Coursevideo;

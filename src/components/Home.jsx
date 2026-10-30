import { useEffect, useState } from "react";
import projectsData from "./projectsData";
import ShapeDiverViewer from "./ShapeDiverViewer";
import ShapeDiverAppIframe from "./ShapeDiverAppIframe";


// project image on home page
const ProjectThumbnail = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project.id)}
      className=" rounded-md p-2 shadow-md cursor-pointer border-[2px] border-gray-300 border-dashed transition duration-200"
    >
      <img
        src={project.mainImage}
        alt={project.title}
        className="w-full h-auto max-w-[900px] max-h-[700px] rounded-md"
      />
    </div>
  );
};

// Projects Show Case
const ProjectShowcase = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Build media array based on what this project actually has
  const mediaItems = [];

  // Add ShapeDiver Viewer model if it exists
  if (project.shapediverConfig) {
    mediaItems.push({ 
      type: 'shapediver', 
      component: (
        <ShapeDiverViewer
          My_Model_View_URL={project.shapediverConfig.My_Model_View_URL}
          My_Ticket={project.shapediverConfig.My_Ticket}
          onLoad={() => {
            console.log('✅ Model loaded successfully'); 
            setIsLoading(false)
          }}
          onSelect={(event) => console.log('User selected:', event)}
        />
      )
    });
  }


  
  if (project.firstImage) {
    mediaItems.push({type: 'image', src: project.firstImage})
  }

  // Add video if it exists
  if (project.video) {
    mediaItems.push({ type: 'video', src: project.video });
  }
  
  // Add images if they exist
  if (project.images && project.images.length > 0) {
    project.images.forEach(src => {
      mediaItems.push({ type: 'image', src });
    });
  }

  if (project.shapediverApp) {
    mediaItems.push({
      type: 'shapediver',
      component: (
        <ShapeDiverAppIframe
        src={project.shapediverApp.My_App_URL}
        checkout={project.shapediverApp.checkout}
        onLoad={() => setIsLoading(false)}
        />
      )
    });
  }

  // If no media at all, show fallback
  if (mediaItems.length === 0) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl">&times;</button>
        <div className="bg-white p-8 rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
          <p className="text-gray-500">No media available for this project.</p>
        </div>
      </div>
    );
  }

  const handleMediaClick = (e) => {
    if (mediaItems.length <= 1) return;
    
    const mediaWidth = e.currentTarget.offsetWidth;
    const clickX = e.nativeEvent.offsetX;
    const zoneWidth = mediaWidth / 4;

    if (clickX < zoneWidth) {
      setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1);
      setIsLoading(true);
    } else if (clickX > zoneWidth * 3) {
      setCurrentIndex(currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0);
      setIsLoading(true);
    }
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0);
    setIsLoading(true);
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1);
    setIsLoading(true);
  };

  // Get the label for current item
  const getCurrentLabel = () => {
    const item = mediaItems[currentIndex];
    if (item.type === 'shapediver') return 'Interactive 3D Model';
    if (item.type === 'video') return 'Video';
    return 'Image';
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-600 text-3xl p-2 rounded-full transition z-50"
      >
        &times;
      </button>

      <div className="bg-white p-8 rounded-md shadow-lg w-[90vw] relative max-h-[90vh] overflow-hidden">
        <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
        <h3 className="mb-4 opacity-60">
          By {project.name} · {project.date}
          {mediaItems.length > 1 ? (
            <span className="ml-4 px-3 py-1 bg-gray-200 rounded-full text-sm">
              {getCurrentLabel()}
            </span>
          ) : mediaItems[0]?.type === 'shapediver' ? (
            <span className="ml-4 px-3 py-1 bg-gray-200 rounded-full text-sm">
              Interactive 3D Model
            </span>
          ) : null}
        </h3>
        
        <div className="relative h-[calc(90vh-200px)] bg-gray-100 rounded-md overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {/* Navigation arrows - only show if more than one item */}
          {mediaItems.length > 1 && (
            <>
              <div 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center z-20 cursor-pointer"
                style={{ right: '20px' }}
                onClick={goToNext}
              >
                <div className="text-white text-4xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center pb-1 hover:bg-opacity-75 transition">
                  &gt;
                </div>
              </div>
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center z-20 cursor-pointer"
                style={{ left: '20px' }}
                onClick={goToPrev}
              >
                <div className="text-white text-4xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center pb-1 hover:bg-opacity-75 transition">
                  &lt;
                </div>
              </div>
              <div className="absolute top-4 right-16 text-black px-3 py-1 bg-white bg-opacity-75 rounded-full text-sm font-bold z-10">
                {currentIndex + 1} / {mediaItems.length}
              </div>
            </>
          )}

          <div 
            className="w-full h-full cursor-pointer"
            onClick={handleMediaClick}
          >
            {mediaItems[currentIndex].type === 'shapediver' ? (
              <div className="w-full h-full">
                {mediaItems[currentIndex].component}
              </div>
            ) : mediaItems[currentIndex].type === 'video' ? (
              <video 
                controls 
                className="w-full h-full object-contain"
                onLoadedData={() => setIsLoading(false)}
              >
                <source src={mediaItems[currentIndex].src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={mediaItems[currentIndex].src}
                onLoad={() => setIsLoading(false)}
                alt={project.title}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [showcaseProject, setShowcaseProject] = useState(null);

  const handleThumbnailClick = (projectId) => {
    setShowcaseProject(projectId);
  };

  const handleCloseShowcase = () => {
    setShowcaseProject(null);
  };

  const selectedProject = projectsData.find(
    (project) => project.id === showcaseProject,
  );

  return (
    <div className="container mt-24 mx-auto p-8 justify-center">
      <div className="flex flex-col mb-20 gap-10 justify-center items-center">
        {projectsData.map((project) => (
          <div key={project.id} className="w-full max-w-[900px]">
              {/* Render thumbnail for regular projects */}
              <ProjectThumbnail
                project={project}
                onClick={handleThumbnailClick}
              />
          </div>
        ))}
      </div>

      {selectedProject && (
          <ProjectShowcase
          project={selectedProject}
          onClose={handleCloseShowcase}
          />
      )}
    </div>
  );
};

export default Home;
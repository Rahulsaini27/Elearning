// import { useEffect } from "react";
// import gsap from "gsap";
// import { loadSlim } from "tsparticles-slim";
// import Particles from "react-tsparticles";

// const particleOptions = {
//   background: { color: "transparent" },
//   particles: {
//     number: { value: 50, density: { enable: true, value_area: 800 } },
//     color: { value: "#ffffff" },
//     shape: { type: "circle" },
//     opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
//     size: { value: 3, random: true, anim: { enable: true, speed: 5, size_min: 0.3 } },
//     line_linked: { enable: true, distance: 250, color: "#ffffff", opacity: 0.4, width: 1 },
//     move: { enable: true, speed: 2, direction: "none", out_mode: "out" },
//   },
//   interactivity: {
//     events: {
//       onHover: { enable: true, mode: "repulse" },  // Particles will still react to hover
//     },
//     modes: { repulse: { distance: 100, duration: 0.4 } },
//   },
//   retina_detect: true,
// };

// const GalaxyBackground = () => {
//   const particlesInit = async (engine) => { await loadSlim(engine); };

//   useEffect(() => {
//     gsap.to(".nebula-cloud", {
//       scale: gsap.utils.wrap([1, 1.05, 1.1]),
//       opacity: gsap.utils.wrap([0.3, 0.5, 0.7]),
//       duration: 6,
//       stagger: 2,
//       repeat: -1,
//       yoyo: true,
//       ease: "power1.inOut"
//     });
//   }, []);

//   return (
//     <div className="galaxy-background fixed inset-0 -z-50 overflow-hidden pointer-events-none">
//       <Particles id="tsparticles" init={particlesInit} options={particleOptions} className="absolute inset-0 w-full h-full z-10" />
//       <div className="absolute inset-0 bg-gradient-to-br from-[#210227] via-[#0d020f] to-[#220427]" />
//       <div className="absolute inset-0">
//         <div className="nebula-cloud absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#c874b2] blur-3xl opacity-10 rounded-full" />
//         <div className="nebula-cloud absolute bottom-1/3 right-1/4 w-1/3 h-1/3 bg-[#f5d5e0] blur-3xl opacity-5 rounded-full" />
//         <div className="nebula-cloud absolute top-1/3 right-1/3 w-1/4 h-1/4 bg-[#7b337d] blur-2xl opacity-20 rounded-full" />
//         <div className="nebula-cloud absolute bottom-1/4 left-1/3 w-1/4 h-1/4 bg-[#c874b2] blur-3xl opacity-10 rounded-full" />
//       </div>
//     </div>
//   );
// };

// export default GalaxyBackground;



import { useEffect } from "react";
import gsap from "gsap";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

const particleOptions = {
  background: { color: "transparent" },
  particles: {
    number: { value: 50, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
    size: { value: 3, random: true, anim: { enable: true, speed: 5, size_min: 0.3 } },
    line_linked: { enable: true, distance: 250, color: "#ffffff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 2, direction: "none", out_mode: "out" },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },  // Particles will still react to hover
    },
    modes: { repulse: { distance: 100, duration: 0.4 } },
  },
  retina_detect: true,
};

const GalaxyBackground = () => {
  const particlesInit = async (engine) => { await loadSlim(engine); };

  useEffect(() => {
    gsap.to(".nebula-cloud", {
      scale: gsap.utils.wrap([1, 1.05, 1.1]),
      opacity: gsap.utils.wrap([0.3, 0.5, 0.7]),
      duration: 6,
      stagger: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <div className="galaxy-background fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <Particles id="tsparticles" init={particlesInit} options={particleOptions} className="absolute inset-0 w-full h-full z-10" />
      {/* Kept the dark galaxy background gradient for unauthenticated pages consistent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#210227] via-[#0d020f] to-[#220427]" />
      <div className="absolute inset-0">
        {/* Nebula clouds, colors are part of the galaxy theme */}
        <div className="nebula-cloud absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#c874b2] blur-3xl opacity-10 rounded-full" />
        <div className="nebula-cloud absolute bottom-1/3 right-1/4 w-1/3 h-1/3 bg-[#f5d5e0] blur-3xl opacity-5 rounded-full" />
        <div className="nebula-cloud absolute top-1/3 right-1/3 w-1/4 h-1/4 bg-[#7b337d] blur-2xl opacity-20 rounded-full" />
        <div className="nebula-cloud absolute bottom-1/4 left-1/3 w-1/4 h-1/4 bg-[#c874b2] blur-3xl opacity-10 rounded-full" />
      </div>
    </div>
  );
};

export default GalaxyBackground;
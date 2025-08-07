"use client";

import { useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { projects } from "@/data";
import { PinContainer } from "./ui/3d-pin";
import { useRevealAnimation } from "@/utils/useRevealAnimation";
import { useRevealContext } from "@/utils/RevealContext";

const RecentProjects = () => {
  const { shouldReveal } = useRevealContext();
  const { elementRef } = useRevealAnimation({
    delay: 0.5,
    duration: 0.8,
    distance: 80,
    stagger: 0.2,
    trigger: "scroll",
    threshold: 0.1,
  });

  useEffect(() => {
    if (shouldReveal && elementRef.current) {
      elementRef.current.style.opacity = "1";
    }
  }, [shouldReveal, elementRef]);

  return (
    <div
      className="py-20"
      id="projects"
      ref={elementRef as any}
      style={{ opacity: 0 }}
    >
      <h1 className="heading project-heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-14 mt-10">
        {projects.map((item) => (
          <div
            className="project-item lg:w-[30%] md:w-[45%] w-[80vw] lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center"
            key={item.id}
          >
            <PinContainer title={item.link} href={item.link}>
              {/* Container for project content */}
              <div className="flex flex-col">
                {/* Project Image Section */}
                <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                  <div
                    className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                    style={{ backgroundColor: "#13162D" }}
                  >
                    <img src="/bg.png" alt="bgimg" />
                  </div>
                  <img
                    src={item.img}
                    alt="cover"
                    className="z-10 absolute bottom-0"
                  />
                </div>

                {/* Project Content Section */}
                <div className="flex flex-col items-start">
                  <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                    {item.title}
                  </h1>

                  <p
                    className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                    style={{
                      color: "#BEC1DD",
                      margin: "1vh 0",
                    }}
                  >
                    {item.des}
                  </p>

                  {/* Tech Stack Icons */}
                  <div className="flex items-center justify-between mt-7 mb-3 w-full">
                    <div className="flex items-center">
                      {item.iconLists.map((icon, index) => (
                        <div
                          key={index}
                          className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                          style={{
                            transform: `translateX(-${5 * index + 2}px)`,
                          }}
                        >
                          <img src={icon} alt="icon5" className="p-2" />
                        </div>
                      ))}
                    </div>

                    {/* Live Site Link */}
                    <div className="flex justify-center items-center">
                      <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                        Check Live Site
                      </p>
                      <FaLocationArrow className="ms-3" color="#CBACF9" />
                    </div>
                  </div>
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;

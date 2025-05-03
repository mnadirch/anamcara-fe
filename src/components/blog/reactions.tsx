// Reactions.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';

// Import reaction SVG assets (adjust the paths as needed)
import likeIcon from '../../assets/reactions/like.svg';
import loveIcon from '../../assets/reactions/love.svg';
import hahaIcon from '../../assets/reactions/haha.svg';
import wowIcon from '../../assets/reactions/wow.svg';
import sadIcon from '../../assets/reactions/sad.svg';
import angryIcon from '../../assets/reactions/angry.svg';

// Animation variants for the reaction icons
const variants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0,
  },
};

const Reactions: React.FC = () => {
  // Internal component for rendering each reaction icon with a tooltip
  interface ReactionItemProps {
    icon: string;
    name: string;
  }

  const ReactionItem: React.FC<ReactionItemProps> = ({ icon, name }) => (
    <motion.div variants={variants}>
      <div
        className="group relative w-11 h-11 max-sm:w-7 max-sm:h-7 rounded-full bg-black cursor-pointer transition-transform duration-200 transform hover:scale-125"
        data-reaction-name={name}
      >
        <img src={icon} alt={name} className="w-full h-full" />
        <span className="absolute top-[-25px] left-1/2 -translate-x-1/2 px-1 text-xs bg-white text-gray-600 rounded-sm capitalize font-normal opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ fontFamily: '"Calibri", sans-serif' }}
        >
          {name}
        </span>
      </div>
    </motion.div>
  );

  return (
    <main>
      <div>
        <section className="mx-auto">
          {/* Like button thumb */}
          <span className="relative inline-flex items-center md:justify-center text-center w-[100px] py-4 px-5 rounded-full cursor-pointer">
            {/* Reactions wrapper is always visible */}
            <motion.div
              initial="visible"
              animate="visible"
              variants={variants}
              className="absolute w-[90%] md:w-[350px] p-2 md:p-3 mt-2 md:mt-3 w-[350px] p-2 mt-2 rounded-full  shadow-[0_5px_20px_-2px_rgba(0,0,0,0.2)] flex justify-between items-center"            >
              <ReactionItem name="like" icon={likeIcon} />
              <ReactionItem name="love" icon={loveIcon} />
              <ReactionItem name="haha" icon={hahaIcon} />
              <ReactionItem name="wow" icon={wowIcon} />
              <ReactionItem name="sad" icon={sadIcon} />
              <ReactionItem name="angry" icon={angryIcon} />
            </motion.div>
          </span>
        </section>
      </div>
    </main>
  );
};

export default Reactions;

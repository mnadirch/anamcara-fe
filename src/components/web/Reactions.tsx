import React from 'react';
import { motion, Variants } from 'framer-motion';
import { likeIcon, loveIcon, hahaIcon, wowIcon, angryIcon, sadIcon } from '../../../public';

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
    interface ReactionItemProps {
        icon: string;
        name: string;
    }

    const ReactionItem: React.FC<ReactionItemProps> = ({ icon, name }) => (
        <motion.div variants={variants}>
            <div
                className="group relative lg:w-11 lg:h-11 md:w-7 md:h-7 w-6 h-6 rounded-full bg-black cursor-pointer transition-transform duration-200 transform hover:scale-125"
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
        <div className="relative flex items-center md:justify-center gap-2 w-full sm:py-5 py-4 cursor-pointer">
            {/* Reactions wrapper is always visible */}
            <motion.div
                initial="visible"
                animate="visible"
                variants={variants}
                className="absolute p-2 md:p-3 mt-2 md:mt-3 max-w-[350px] rounded-full shadow-[0_5px_20px_-2px_rgba(0,0,0,0.2)] flex justify-between items-center gap-2">
                <ReactionItem name="like" icon={likeIcon} />
                <ReactionItem name="love" icon={loveIcon} />
                <ReactionItem name="haha" icon={hahaIcon} />
                <ReactionItem name="wow" icon={wowIcon} />
                <ReactionItem name="sad" icon={sadIcon} />
                <ReactionItem name="angry" icon={angryIcon} />
            </motion.div>
        </div>

    );
};

export default Reactions;

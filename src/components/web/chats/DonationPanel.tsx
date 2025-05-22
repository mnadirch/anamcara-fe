import { useState } from 'react';
import { FiUser } from 'react-icons/fi';

interface DonationCard {
  title: string;
  raised: string;
  donations: string;
  progress: string;
  image: string;
}

interface DonationPanelProps {
  donation: string;
}

const DonationPanel: React.FC<DonationPanelProps> = ({ donation }) => {
  const [showAll, setShowAll] = useState(false);

  const donationCards: DonationCard[] = [
    {
      title: "Help End Malaria Deaths in the Countries",
      raised: "$30,400 raised",
      donations: "2.5K donations",
      progress: "75%",
      image: donation,
    },
    {
      title: "Support Clean Water Projects",
      raised: "$18,200 raised",
      donations: "1.2K donations",
      progress: "60%",
      image: donation,
    },
    {
      title: "Educate Children in Rural Areas",
      raised: "$25,000 raised",
      donations: "2.0K donations",
      progress: "80%",
      image: donation,
    },
  ];

  return (
    <div className="w-72 hidden lg:block bg-black overflow-y-auto p-6">
      <div className="flex justify-end items-center pt-2 mb-3 space-x-3">
        <div
          onClick={() => console.log('Icon 1 clicked')}
          className="w-9 h-9 rounded-full border border-[#A0FF06] text-[#A0FF06] hover:bg-[#A0FF06] hover:text-black transition-colors flex items-center justify-center font-semibold text-sm cursor-pointer"
        >
          <FiUser size={18} />
        </div>

        <div
          onClick={() => console.log('Icon 2 clicked')}
          className="w-9 h-9 rounded-full border border-[#A0FF06] text-[#A0FF06] hover:bg-[#A0FF06] hover:text-black transition-colors flex items-center justify-center font-semibold text-sm cursor-pointer"
        >
          <FiUser size={18} />
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2 border border-[#A0FF06] text-[#A0FF06] font-medium py-1.5 px-4 rounded-full hover:bg-[#A0FF06] hover:text-black transition-colors text-sm"
        >
          {showAll ? "View less" : "View all"} <span className="ml-1">→</span>
        </button>
      </div>

      <div className="space-y-4">
        {(showAll ? donationCards : [donationCards[0]]).map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-900 rounded-xl h-64 border border-[#A0FF06] shadow-lg shadow-[#A0FF06]/10 transition-all relative"
          >
            {/* Image with overlay */}
            <div className="relative p-3 pb-0">
              <img
                src={card.image}
                alt="Donation"
                className="w-full h-32 object-cover rounded-lg"
              />
              <span className="absolute bottom-3 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {card.donations}
              </span>
            </div>

            {/* Text Content */}
            <div className="p-3 pt-3">
              <h4 className="font-medium text-white mb-1 text-sm leading-snug">
                {card.title}
              </h4>
              <p className="text-[#A0FF06] font-bold text-sm">{card.raised}</p>
            </div>

            {/* Progress bar */}
            <div className="px-2">
              <div className="w-full h-2 bg-gray-600 border border-[#A0FF06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A0FF06]"
                  style={{ width: card.progress }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationPanel;

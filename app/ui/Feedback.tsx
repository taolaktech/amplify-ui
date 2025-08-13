import LikeIcon from "@/public/like.svg";
import ArrowIcon from "@/public/arrow-right-sm.svg";
import { useState } from "react";
import { useModal } from "../lib/hooks/useModal";
import CloseIcon from "@/public/close-circle.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { Star1, InfoCircle, LampOn, EmojiSad } from "iconsax-react";
import Button from "./Button";
import { usePostFeedBack } from "../lib/hooks";
import { useToastStore } from "../lib/stores/toastStore";
import { ImprovementCategory } from "@/type";

const improvement = [
  "General Experience",
  "Report a Bug",
  "Feature Request",
  "Something Felt Off",
];
const improvementCategory: Record<string, ImprovementCategory> = {
  "General Experience": "GENERAL_EXPERIENCE",
  "Report a Bug": "REPORT_BUG",
  "Feature Request": "FEATURE_REQUEST",
  "Something Felt Off": "SOMETHING_FELT_OFF",
};

const improvementIcon = {
  "General Experience": <Star1 size={12} color="#000" />,
  "Report a Bug": <InfoCircle size={12} color="#000" />,
  "Feature Request": <LampOn size={12} color="#000" />,
  "Something Felt Off": <EmojiSad size={12} color="#000" />,
};

const notSelectedImprovementIcon = {
  "General Experience": <Star1 size={12} color="#737373" />,
  "Report a Bug": <InfoCircle size={12} color="#737373" />,
  "Feature Request": <LampOn size={12} color="#737373" />,
  "Something Felt Off": <EmojiSad size={12} color="#737373" />,
};

const FeedbackModal = ({ handleClose }: { handleClose: () => void }) => {
  const [starRating, setStarRating] = useState(0);
  const [hoverStarRating, setHoverStarRating] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [selectedImprovement, setSelectedImprovement] = useState<string | null>(
    null
  );
  const setToast = useToastStore((state) => state.setToast);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackNoteError, setFeedbackNoteError] = useState(false);

  const { handlePostFeedBack, isPending } = usePostFeedBack(handleClose);
  const handleStarClick = (rating: number) => {
    setStarRating(rating);
    setIsBouncing(true);
    setTimeout(() => {
      setIsBouncing(false);
    }, 1000);
  };

  const handleStar = (rating: number) => {
    if (hoverStarRating) {
      return hoverStarRating >= rating;
    }
    return starRating >= rating;
  };

  const handleImprovementClick = (improvement: string) => {
    setSelectedImprovement(improvement);
  };

  const handleSubmit = () => {
    setFeedbackNoteError(false);
    if (feedbackNote.length < 10) {
      setFeedbackNoteError(true);
      return;
    }
    if (!selectedImprovement) {
      setToast({
        title: "Could not submit feedback",
        message: "Please select an improvement category",
        type: "info",
      });
      return;
    }
    handlePostFeedBack({
      rating: starRating,
      improvementCategory:
        improvementCategory[
          selectedImprovement as keyof typeof improvementCategory
        ],
      feedbackNote: feedbackNote,
    });
  };

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
    h-[90vh] w-[90vw] max-w-[558px] max-h-[620px]  sm:max-h-[720px] 
    z-30 rounded-3xl flex flex-col pt-3
    "
      >
        <div className="flex flex-col flex-1 my-3 overflow-y-auto px-6">
          <div className="flex items-center justify-end">
            <button onClick={handleClose} className="-mt-4 -mr-5 md:m-0">
              <CloseIcon width={48} height={48} />
            </button>
          </div>
          <div className="max-w-[404px] w-full mx-auto">
            <div className="font-medium text-lg text-heading tracking-250">
              How's your Amplify Experience?
            </div>
            <div className="text-sm text-[#737373] tracking-150">
              Are you satisfied with the service?
            </div>
            <div
              className={`inline-flex items-center hover:opacity-80 transition-opacity duration-300 gap-2 my-7`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverStarRating(star)}
                  onMouseLeave={() => setHoverStarRating(0)}
                >
                  <FontAwesomeIcon
                    icon={handleStar(star) ? faStarSolid : faStar}
                    bounce={isBouncing}
                    style={{
                      color: "#FA9B0C",
                      fontSize: "24px",
                      transition: "all 0.3s ease",
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium tracking-150 mb-4">
                Tell us what can be improved:
              </p>
              <div className="flex flex-shrink-0 gap-3 items-center flex-wrap">
                {improvement.map((item) => (
                  <div
                    key={item}
                    className={` rounded-full px-4 py-2 cursor-pointer flex items-center gap-2 ${
                      selectedImprovement === item
                        ? "bg-[#F3EFF6]"
                        : "bg-[#F8F8F8]"
                    }`}
                    onClick={() => handleImprovementClick(item)}
                  >
                    {selectedImprovement === item
                      ? improvementIcon[item as keyof typeof improvementIcon]
                      : notSelectedImprovementIcon[
                          item as keyof typeof notSelectedImprovementIcon
                        ]}
                    <span
                      className={` ${
                        selectedImprovement === item
                          ? "opacity-100"
                          : "opacity-80"
                      } text-xs text-[#000] font-medium`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-2">
              <p className="text-sm tracking-150">Add a note</p>
              <textarea
                rows={5}
                className="w-full resize-none text-heading focus:outline-0 font-medium tracking-150 bg-[rgba(230,230,230,0.25)] rounded-lg p-3 text-sm"
                placeholder="Write your note here"
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                onFocus={() => setFeedbackNoteError(false)}
              />
              {feedbackNoteError && (
                <p className="text-error-text text-xs mt-2">
                  Please enter a valid message
                </p>
              )}
            </div>
            <div className="sm:max-w-[219px] mx-auto my-4 md:my-10">
              <Button
                text="Submit Feedback"
                height={49}
                action={handleSubmit}
                loading={isPending}
                hasIconOrLoader
                // buttonSize="large"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Feedback({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useModal(isOpen);
  const handleOpen = () => {
    setIsOpen(true);
    // if (isSmallScreen) {
    //   setIsSidebarOpen(false);
    // }
  };

  const handleClose = () => {
    console.log("close");
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && <FeedbackModal handleClose={handleClose} />}

      <div
        className={`cursor-pointer ${
          isSidebarOpen ? "p-6" : "flex items-center justify-center py-2"
        } rounded-xl bg-[#FBFAFC]`}
        onClick={handleOpen}
      >
        <LikeIcon width={32} height={32} />
        {isSidebarOpen && (
          <>
            <div className="font-medium text-heading text-sm tracking-150 mt-3 mb-2">
              Tell us what’s working and what’s not
            </div>
            <div className="text-xs text-[#737373]">
              We’re building Amplify for you.
            </div>
            <div className="mt-3">
              <button className="bg-[#F3EFF6] rounded-xl flex items-center gap-1 px-4 py-2">
                <span className="text-xs text-[#000]">Give Feedback</span>
                <ArrowIcon width={12} height={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

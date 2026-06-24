import { useState } from "react";
import Loader from "../../views/spinner/Loader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePosts } from "../../hooks/usePosts";

const PaginatedList = () => {
  const PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const { data: items, isLoading, error } = usePosts(currentPage, PER_PAGE);

  if (isLoading)
    return (
      <div className="grid grid-cols-3 gap-6">
        <Loader />
      </div>
    );
  if (error) return <p style={{ color: "#ff0800" }}>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-3 gap-6 justify-items-center">
      {!isLoading && items.length === 0 && <p>No posts found.</p>}
      <AnimatePresence mode="popLayout">
        {items.map((post, index) => {
          if (post.image_url != "") {
            return (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="aspect-[1.2] rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 shadow-sm">
                  <img
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={post.image_url}
                  />
                </div>
                <h4 className="text-[11px] font-bold text-gray-900 leading-snug line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-[9px] text-gray-400 mt-2 italic font-medium">
                  {post.date}
                </p>
              </motion.div>
            );
          }
          return <Loader />;
        })}
      </AnimatePresence>
      {/* Pagination Controls */}
      <div className="order-last col-span-3 join ">
        <button
          className="join-item btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ArrowLeft />
        </button>
        <button className="join-item btn"> Page {currentPage} </button>
        <button
          className="join-item btn"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PaginatedList;

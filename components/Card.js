import { useEffect, useState } from 'react';
import { FaClock, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePrefetcher } from './Prefetcher';
import { AnimatePresence, motion } from 'framer-motion';

const Card = (props) => {
  const { data } = props;
  const { selectedItems, setSelectedItems } = usePrefetcher();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dayjs.extend(relativeTime);
  }, []);

  const addToSelection = (id) => {
    setSelectedItems([...selectedItems, id]);
  };

  const removeFromSelection = (id) => {
    setSelectedItems(selectedItems.filter((item) => item !== id));
  };

  return (
    <>
      <motion.div className="border-b-2 select-text cursor-pointer">
        <div className="p-5 w-full flex gap-5 items-center justify-between ">
          <div className="flex items-center gap-5">
            <input
              checked={selectedItems.includes(data.guid)}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  addToSelection(data.guid);
                } else {
                  removeFromSelection(data.guid);
                }
              }}
              type={'checkbox'}
              className="h-4 w-4 shadow flex"
            />
            <div
              onClick={(e) => setIsOpen(!isOpen)}
              className="flex flex-col bg-gray-200 p-2 text-center text-sm w-12"
            >
              <p className="text-md font-semibold">
                {dayjs(data.date).format('D')}
              </p>
              <p className="text-xs">{dayjs(data.date).format('MMM')}</p>
            </div>

            {/* initials of the sender's first name and surname */}
            <div onClick={(e) => setIsOpen(!isOpen)}>
              <p className="text-sm font-semibold bg-gray-600 text-white p-3 rounded-full w-10 h-10 flex items-center justify-center">
                {data.senderName.split(' ').length < 3 &&
                  data.senderName.split(' ')[0][0] +
                    data.senderName.split(' ')[1][0]}
                {data.senderName.split(' ').length > 2 &&
                  data.senderName
                    .split(' ')
                    .map((name, index) => (index !== 1 ? name[0] : ''))
                    .join('')}
              </p>
            </div>

            {/* subject and sender details */}
            <div
              onClick={(e) => setIsOpen(!isOpen)}
              className="flex justify-center flex-col"
            >
              <p>{data.title}</p>
              <p className="text-sm flex gap-1 truncate max-w-lg ">
                <span className="font-semibold">{data.senderName}</span>
                <span className="text-gray-500">&lt;{data.sender}&gt;</span>
                <span className="text-gray-500">
                  {dayjs(data.date).format('MMMM DD, YYYY')} at{' '}
                  {
                    // format time
                    dayjs(`${data.date}:${data.time}`).format('h:mm A')
                  }
                </span>
              </p>
            </div>
          </div>

          {/* tags, time duration, and action */}
          <div
            onClick={(e) => setIsOpen(!isOpen)}
            className="flex gap-5 items-center"
          >
            <div>
              {/* tags */}
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="flex gap-1"
              >
                {data.tags.split(',').map((tag, index) => {
                  // limit to 3 tags
                  if (index < 3) {
                    return (
                      <p
                        key={`${tag}_${index}`}
                        className="text-xs font-semibold border-gray-300 border rounded-lg p-1 flex items-center justify-center"
                      >
                        {tag}
                      </p>
                    );
                  }
                  // show pther tags as a single ellipsis
                  if (index === 3) {
                    return (
                      <p className="text-xs font-semibold border-gray-300 border rounded-lg p-1 flex items-center justify-center">
                        ...
                      </p>
                    );
                  }
                })}
              </motion.div>
              {/* time elapsed */}
              <p className="text-xs p-1 flex items-center justify-end gap-2">
                {dayjs(data.date).fromNow()}
                <FaClock />
              </p>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              onClick={(e) => setIsOpen(!isOpen)}
            >
              <FaChevronRight />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.2, ease: 'circOut' }}
              className="p-5 w-full flex flex-col gap-5 mb-16 cursor-default"
            >
              <div>
                {/* tags */}
                <div className="flex justify-end gap-1">
                  {data.tags.split(',').map((tag, index) => (
                    <p
                      key={index}
                      className="text-xs font-semibold border-blue-400 text-blue-400 border rounded-lg p-1 flex items-center justify-center"
                    >
                      {tag}
                    </p>
                  ))}
                </div>
              </div>

              <p>{data.body}</p>

              <div className="text-sm mt-5">
                <p>
                  From: <span className="font-semibold">{data.senderName}</span>
                  <span> &lt;{data.sender}&gt;</span>
                </p>
                <p>
                  Date: {dayjs(data.date).format('MMMM DD, YYYY')} at{' '}
                  {
                    // format time
                    dayjs(`${data.date}:${data.time}`).format('h:mm A')
                  }
                </p>
                <p>Subject: {data.title}</p>
                <p>
                  To: {data.recipientName} <span>&lt;{data.recipient}&gt;</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Card;

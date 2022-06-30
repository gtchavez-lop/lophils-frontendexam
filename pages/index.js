import { useEffect, useState } from 'react';
import { usePrefetcher } from '../components/Prefetcher';
import {
  FaSave,
  FaTags,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaClock,
} from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Card from '../components/Card';

const Home = () => {
  const { emailDataList, selectedItems, setSelectedItems } = usePrefetcher();
  const [page, setPage] = useState(1);
  const [emailData, setEmailData] = useState([]);

  useEffect(() => {
    dayjs.extend(relativeTime);

    // sort emailDataList by date, newest first
    const sortedEmailDataList = emailDataList.sort((a, b) => {
      return dayjs(b.date).diff(dayjs(a.date));
    });

    // set emailData to first page of sorted emailDataList
    setEmailData(sortedEmailDataList);
  }, []);

  const removeSelectedItems = (e) => {
    if (selectedItems.length > 0) {
      if (window.confirm('Are you sure you want to delete these items?')) {
        const newList = emailData.filter(
          (item) => !selectedItems.includes(item.guid)
        );
        setEmailData(newList);
        setSelectedItems([]);
      }
    } else {
      alert('Please select at least one item to delete.');
    }
  };

  return (
    <>
      {/* title */}
      <div className="mt-16">
        <p className="text-3xl font-semibold">LoPhils IT Internship</p>
        <p className="text-xl font-semibold">Front-end Developer Exam</p>
        <p className="text-lg text-gray-500 mt-2">Written by: Gerald Chavez</p>
      </div>

      {/* exam content */}
      <section className="mt-16">
        {/* header */}
        <div className="flex gap-5 p-5 md:items-center justify-between flex-col md:flex-row">
          {/* actions */}
          <div className="flex items-center gap-5">
            <input
              checked={selectedItems.length > 0 ? true : false}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  const newList = emailData.map((item, index) => {
                    // only return items that are in the range of the current page
                    // but do not return items that are not in the range of the current page
                    // and do not return items that are already selected
                    if (
                      index >= (page - 1) * 10 &&
                      index < page * 10 &&
                      !selectedItems.includes(item.guid)
                    ) {
                      return item.guid;
                    }
                  });

                  setSelectedItems([...selectedItems, ...newList]);
                }

                if (!e.currentTarget.checked) {
                  const newList = emailData.map((item, index) => {
                    // only return items that are in the range of the current page
                    // but do not return items that are not in the range of the current page
                    // and do not return items that are already selected
                    if (
                      index >= (page - 1) * 10 &&
                      index < page * 10 &&
                      selectedItems.includes(item.guid)
                    ) {
                      return item.guid;
                    }
                  });

                  setSelectedItems(
                    selectedItems.filter((item) => !newList.includes(item))
                  );
                }
              }}
              type="checkbox"
              className="h-4 w-4 shadow"
            />

            <div className="btn ml-5">
              <p className="hidden md:block">Save</p>
              <FaSave />
            </div>
            <div className="btn bg-gray-600 border-gray-600">
              <p className="hidden md:block">Manage Filters</p>
              <FaTags />
            </div>
            <div
              onClick={(e) => removeSelectedItems()}
              className="btn bg-red-500 border-red-500"
            >
              <p className="hidden md:block">Delete</p>
              <FaTrash />
            </div>
          </div>

          {/* pagination */}
          <div className="flex items-center gap-2">
            <div
              onClick={(e) => {
                // only change page if page is not 1
                if (page !== 1) {
                  setPage(page - 1);
                }
              }}
              className="btn bg-gray-600 border-gray-600"
            >
              <FaArrowLeft />
            </div>
            <p className="text-gray-500">
              {page * 10 - 10 + 1} - {page * 10} of {emailData.length}
            </p>
            <div
              onClick={(e) => {
                if (page !== Math.ceil(emailData.length / 10)) {
                  setPage(page + 1);
                }
              }}
              className="btn bg-gray-600 border-gray-600"
            >
              <FaArrowRight />
            </div>
          </div>
        </div>

        <div className="mt-10">
          {/* email list */}
          {emailData.slice((page - 1) * 10, page * 10).map((data, index) => (
            <div key={index}>
              <Card data={data} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

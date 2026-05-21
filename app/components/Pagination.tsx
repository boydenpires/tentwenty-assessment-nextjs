import Field from "@/app/components/form/Field";
import Select from "@/app/components/form/Select";
import { PER_PAGE_OPTIONS } from "@/app/lib/constants";

const WINDOW_SIZE = 8;

function getPageWindow(current: number, total: number) {
  if (total <= WINDOW_SIZE + 1) {
    return {
      pages: Array.from({ length: total }, (_, i) => i + 1),
      showEllipsis: false,
      showLastPage: false,
    };
  }

  const half = Math.floor(WINDOW_SIZE / 2);
  const start = Math.max(1, Math.min(current - half, total - WINDOW_SIZE));
  const end = start + WINDOW_SIZE - 1;

  return {
    pages: Array.from({ length: end - start + 1 }, (_, i) => start + i),
    showEllipsis: end < total - 1,
    showLastPage: end < total,
  };
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const { pages, showEllipsis, showLastPage } = getPageWindow(
    currentPage,
    totalPages,
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Field label="Rows per page" labelHidden>
          <Select
            name="perPage"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="text-sm leading-5 font-medium text-gray-650 border border-gray-200 rounded-xl py-2 px-3 bg-gray-50 shadow-input cursor-pointer"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <nav aria-label="Pagination">
        <ol className="flex items-center">
          <li className="border border-gray-200 rounded-l-xl overflow-hidden">
            {/* TODO extract the the buttons into PaginationButton.tsx maybe */}
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="cursor-pointer h-9 px-3 text-sm leading-5 font-medium text-gray-650 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Previous
            </button>
          </li>

          {pages.map((page) => (
            <li
              key={page}
              className="hidden sm:block border-y border-r border-gray-200"
            >
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className={`cursor-pointer size-9 text-sm leading-5 font-medium transition-colors hover:bg-gray-50 ${
                  page === currentPage
                    ? "text-brand bg-gray-50"
                    : "text-gray-650"
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          {showEllipsis && (
            <li
              aria-hidden="true"
              className="hidden sm:grid size-9 place-items-center text-sm leading-5 font-medium text-gray-650 border-y border-r border-gray-200"
            >
              ...
            </li>
          )}

          {showLastPage && (
            <li className="hidden sm:block border-y border-gray-200">
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Page ${totalPages}`}
                aria-current={totalPages === currentPage ? "page" : undefined}
                className={`cursor-pointer size-9 text-sm leading-5 font-medium transition-colors hover:bg-gray-50 ${
                  totalPages === currentPage
                    ? "text-brand bg-gray-50"
                    : "text-gray-650"
                }`}
              >
                {totalPages}
              </button>
            </li>
          )}

          <li className="border border-gray-200 rounded-r-xl overflow-hidden">
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="cursor-pointer h-9 px-3 text-sm leading-5 font-medium text-gray-650 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Next
            </button>
          </li>
        </ol>
      </nav>
    </div>
  );
}

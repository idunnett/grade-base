import type { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react'
import { BiBuildings } from 'react-icons/bi'
import { HiClock, HiUsers } from 'react-icons/hi'
import { MdInsertChart } from 'react-icons/md'
import type { FullCourse } from '../../types'
import getTermName from '../../utils/termUtils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  course: FullCourse
  onClick?: MouseEventHandler
  className?: string
  showSchool?: boolean
}

const CourseButton: FC<Props> = ({
  course,
  className,
  showSchool = true,
  ...props
}) => {
  return (
    <button
      key={course.id}
      type="button"
      className={`list-button flex-col justify-between ${className}`}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-1 whitespace-nowrap">
        <div className="flex items-center">
          <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
            <MdInsertChart
              style={{
                color: course.color,
              }}
            />
            {course.code}
          </h2>
          <p className="text-md text-base font-medium text-slate-500 dark:text-neutral-400">
            : {course.name}
          </p>
        </div>
        <span className="whitespace-nowrap text-base font-normal text-slate-500 dark:text-neutral-300">
          {getTermName(course.term)} {course.year}
        </span>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex gap-3 whitespace-nowrap text-sm font-light text-slate-600 dark:text-neutral-400">
          <div className="flex items-center gap-0.5">
            <HiClock />
            <span>{course.credits}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <HiUsers />
            <span>{course.memberCount}</span>
          </div>
        </div>
        {showSchool && (
          <div
            className="flex items-center gap-1 rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
            style={{
              color: course.school?.secondaryColor,
              backgroundColor: course.school?.color,
            }}
          >
            <BiBuildings />
            {course.school?.name}
          </div>
        )}
      </div>
    </button>
  )
}

export default CourseButton

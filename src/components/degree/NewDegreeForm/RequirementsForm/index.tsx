import { type FC, useEffect, useState } from 'react'
import { HiClock } from 'react-icons/hi'
import type {
  CreateDegreeFormData,
  FullCourse,
  CreatePartialCourse,
  CreateSubjectRequirement,
} from '../../../../types'
import CourseRequirements from './CourseRequirements'
import SubjectRequirements from './SubjectRequirements'

interface Props {
  name: string
  degreeYears: string
  credits: string
  requiredCourses: Array<FullCourse | CreatePartialCourse>
  subjectRequirements: Array<CreateSubjectRequirement>
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const RequirementsForm: FC<Props> = ({
  name,
  degreeYears,
  credits,
  requiredCourses,
  subjectRequirements,
  updateFields,
}) => {
  const [currentTotalCredits, setCurrentTotalCredits] = useState(
    requiredCourses
      .map((c) =>
        typeof c.credits === 'string' ? parseFloat(c.credits) : c.credits
      )
      .reduce((a, b) => a + b, 0)
  )

  useEffect(() => {
    setCurrentTotalCredits(
      requiredCourses
        .map((c) =>
          typeof c.credits === 'string' ? parseFloat(c.credits) : c.credits
        )
        .reduce((a, b) => a + b, 0) +
        subjectRequirements
          .map((s) => parseFloat(s.credits))
          .reduce((a, b) => a + b, 0)
    )
  }, [requiredCourses, subjectRequirements])

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-1 text-3xl font-bold text-slate-500 dark:text-neutral-200">
        {name}
      </h1>
      <div className="flex justify-between text-slate-500 dark:text-neutral-200">
        <h2 className="text-xl font-semibold">Course Requirements</h2>
        <div className="flex items-center gap-2 text-lg">
          <HiClock />
          <p>
            <span
              className={`${
                currentTotalCredits < parseFloat(credits) && 'text-red-300'
              }`}
            >
              {currentTotalCredits}
            </span>
            /{credits || 0}
          </p>
        </div>
      </div>
      <CourseRequirements
        degreeYears={degreeYears}
        requiredCourses={requiredCourses}
        updateFields={updateFields}
      />
      <SubjectRequirements
        subjectRequirements={subjectRequirements}
        updateFields={updateFields}
      />
    </div>
  )
}

export default RequirementsForm

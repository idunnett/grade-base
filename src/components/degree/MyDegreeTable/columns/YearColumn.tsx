import type { CellContext } from '@tanstack/react-table'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import {
  Dispatch,
  FC,
  FocusEvent,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { DegreeTableColumns, UserDegreeCourseUpdateInput } from '../types'

interface Props {
  info: CellContext<number | DegreeTableColumns, number | undefined>
  updateData: (data: UserDegreeCourseUpdateInput) => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
}

const YearColumn: FC<Props> = ({ info, setData, updateData }) => {
  const { data: session } = useSession()
  const [year, setYear] = useState(info.getValue()?.toString() ?? '')
  const [pressedEnter, setPressedEnter] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setYear(info.getValue()?.toString() ?? ''), [info])

  useEffect(() => {
    if (pressedEnter) handleYearUpdate()
  }, [pressedEnter])

  function handleYearUpdate() {
    if (info.getValue() === parseInt(year)) {
      if (pressedEnter) inputRef.current?.blur()
      return
    }
    if (typeof info.row.original === 'number') return
    else if (!session?.user?.degreeId) return alert('No degree ID found')
    const courseInfoId: string | undefined =
      info.row.original.courseInfoId ??
      info.row.original.partialCourseId ??
      info.row.original.subjectRequirementId
    if (!courseInfoId)
      return alert(
        'No course info, partial course, or subject requirement ID found at row'
      )
    setData((prevData) => {
      const updatedData = _.cloneDeep(prevData)
      const courseRow = updatedData.find(
        (courseRow) =>
          typeof courseRow !== 'number' &&
          (courseRow.courseInfoId === courseInfoId ||
            courseRow.partialCourseId === courseInfoId ||
            courseRow.subjectRequirementId === courseInfoId)
      )
      if (typeof courseRow !== 'number' && courseRow) {
        courseRow.year = year ? parseInt(year) : undefined
      }
      return updatedData
    })
    if (pressedEnter) {
      inputRef.current?.blur()
      setPressedEnter(false)
    }
    updateData({
      degreeId: session.user.degreeId,
      courseInfoId,
      year: year ? parseInt(year) : null,
    })
  }

  if (typeof info.row.original !== 'number' && info.row.original.linkedCourseId)
    return <span className="w-14">{year}</span>
  return (
    <input
      type="text"
      ref={inputRef}
      value={year ?? ''}
      maxLength={4}
      onChange={(e) => {
        const num = Number(e.target.value.replace(/\D/g, ''))
        if (e.target.value && num === 0) return
        setYear(e.target.value.replace(/\D/g, ''))
      }}
      onBlur={() => {
        if (!pressedEnter) handleYearUpdate()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') setPressedEnter(true)
      }}
      className="w-14"
    />
  )
}
export default YearColumn

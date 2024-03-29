import type { School } from '@prisma/client'
import type { CreateDegreeFormData } from '../../../types'
import InputSegment from '../../common/InputSegment'
import Widget from '../../common/Widget'
import SchoolAutoComplete from '../../school/SchoolAutoComplete'

interface Props {
  name: string
  school: School | null
  degreeYears: string
  credits: string
  admissionYear: string
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const GeneralInfoForm: React.FC<Props> = ({
  name,
  school,
  degreeYears,
  credits,
  admissionYear,
  updateFields,
}) => {
  return (
    <Widget className="p-4">
      <h2 className="text-3xl font-bold text-slate-500 dark:text-neutral-200">
        Create a Degree
      </h2>
      <InputSegment
        animate={false}
        label="Degree name"
        placeholder='e.g. "Bachelor of Arts"'
        autoComplete={false}
        autoFocus
        required
        value={name}
        onChange={(e) => updateFields({ name: e.target.value })}
      />
      <SchoolAutoComplete
        animate={false}
        onInitialFetch={(school: School) => updateFields({ school })}
        onSelect={(school: School) => updateFields({ school })}
        school={school}
      />
      <div className="flex justify-between gap-4">
        <InputSegment
          animate={false}
          label="Degree years"
          placeholder="e.g. 4"
          required
          value={degreeYears}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ degreeYears: e.target.value.replace(/\D/g, '') })
          }}
          maxLength={1}
        />
        <InputSegment
          animate={false}
          label="Credits"
          placeholder="e.g. 120"
          required
          value={credits}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ credits: e.target.value.replace(/\D/g, '') })
          }}
          maxLength={3}
        />
        <InputSegment
          animate={false}
          label="Admission year"
          placeholder={`e.g. ${new Date().getFullYear()}`}
          required
          value={admissionYear}
          onChange={(e) => {
            const num = Number(e.target.value.replace(/\D/g, ''))
            if (e.target.value && num === 0) return
            updateFields({ admissionYear: e.target.value.replace(/\D/g, '') })
          }}
          maxLength={4}
        />
      </div>
    </Widget>
  )
}

export default GeneralInfoForm

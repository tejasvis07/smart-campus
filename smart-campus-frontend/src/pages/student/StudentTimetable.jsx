import { useEffect, useState } from 'react'
import { getTimetable } from '../../api/client'
import Card from '../../components/Card'
import Spinner from '../../components/Spinner'
import TimetableGrid from '../../components/TimetableGrid'

export default function StudentTimetable() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTimetable().then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-600">Semester 5</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-800">Timetable</h1>
      </div>

      <Card title="Weekly schedule" eyebrow="Monday – Friday">
        {loading ? <Spinner label="Loading timetable" /> : <TimetableGrid entries={entries} />}
      </Card>
    </div>
  )
}

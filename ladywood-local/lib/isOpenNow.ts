type DayName = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'

const DAY_INDEX: Record<DayName, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

function parseTime(str: string): number | null {
    const m = str.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/i)
    if (!m) return null
    let h = parseInt(m[1], 10)
    const mins = m[2] ? parseInt(m[2], 10) : 0
    const period = m[3].toLowerCase()
    if (period === 'pm' && h !== 12) h += 12
    if (period === 'am' && h === 12) h = 0
    return h * 60 + mins
}

function isDayInSpec(spec: string, dayOfWeek: number): boolean {
    const s = spec.replace(/[–—]/g, '-').trim()
    const rangeMatch = s.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/i)
    if (rangeMatch) {
        const start = DAY_INDEX[rangeMatch[1] as DayName]
        const end = DAY_INDEX[rangeMatch[2] as DayName]
        return start <= end
            ? dayOfWeek >= start && dayOfWeek <= end
            : dayOfWeek >= start || dayOfWeek <= end
    }
    return s.split(/\s*&\s*/).some(p => DAY_INDEX[p.trim() as DayName] === dayOfWeek)
}

/**
 * Returns true if the location is currently open based on its hours string,
 * or if the hours are absent / unparseable (treat unknown = visible).
 *
 * Accepts an optional `now` date for testing.
 *
 * Handled formats:
 *   'Mon-Fri 6am-10pm Sat-Sun 7am-5pm'
 *   'Wed & Fri 12pm–2pm'
 *   'Tue & Fri 10am-1:15pm'
 *   'Mon-Fri 8:30am-4pm'
 *   'Wed 10am-11am'
 *   'See council site'  → always open (no parseable segments)
 */
export function isOpenNow(hours: string | null, now = new Date()): boolean {
    if (!hours?.trim()) return true

    // Each segment: <day-spec> <start>-<end>
    // day-spec = range (Mon-Fri) | & -list (Wed & Fri) | single (Wed)
    const segRe = /((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[-–](?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:\s*&\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))+|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))\s+(\d{1,2}(?::\d{2})?[ap]m)[-–—](\d{1,2}(?::\d{2})?[ap]m)/gi

    const matches = [...hours.matchAll(segRe)]
    if (matches.length === 0) return true

    const dayOfWeek = now.getDay()
    const currentMins = now.getHours() * 60 + now.getMinutes()

    return matches.some(match => {
        const [, daySpec, startStr, endStr] = match
        if (!isDayInSpec(daySpec, dayOfWeek)) return false
        const start = parseTime(startStr)
        const end = parseTime(endStr)
        if (start === null || end === null) return false
        return start <= end
            ? currentMins >= start && currentMins < end
            : currentMins >= start || currentMins < end
    })
}

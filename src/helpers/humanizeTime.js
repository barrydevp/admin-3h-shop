import moment from 'moment'

export default (time) => {
    const momentTime = moment.isMoment(time) ? time : moment(time)

    const today = moment().startOf('day')
    if (today.isBefore(momentTime)) {
        return momentTime.fromNow(false)
    }

    const thisWeek = moment().startOf('week')
    if (thisWeek.isBefore(momentTime)) {
        const dayOfWeek = momentTime.format('dddd')
        const time = momentTime.format('h:mm a')

        return `${dayOfWeek} at ${time}`
    }

    const thisYear = moment().startOf('year')
    if (thisYear.isBefore(momentTime)) {
        return momentTime.format('MMM D, h:mm a')
    }

    return momentTime.format('MMM D, YYYY')
}

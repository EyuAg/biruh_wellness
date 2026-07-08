const createTimeSlots = (startTime, endTime, intervalMinutes = 60) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let current = new Date(2000, 0, 1, startHour, startMinute);
    const end = new Date(2000, 0, 1, endHour, endMinute);

    while (current < end) {
        const next = new Date(current.getTime() + intervalMinutes * 60 * 1000);
        if (next > end) break;
        slots.push({
            start: current.toTimeString().slice(0, 5),
            end: next.toTimeString().slice(0, 5)
        });
        current = next;
    }

    return slots;
};

module.exports = {
    createTimeSlots
};

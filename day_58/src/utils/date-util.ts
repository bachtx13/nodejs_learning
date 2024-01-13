const addDate = (date: Date, days: number): Date => {
    const result = new Date();
    result.setDate(date.getDate() + days);
    return result;
}

export {
    addDate
}
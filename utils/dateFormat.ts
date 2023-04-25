function getLocaleString(date: Date): string {
    return date.toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
    });
}

function getDate(date: Date): string {
    if (date.getTime()) {
        const dateStr = getLocaleString(date);
        const separator = dateStr.includes(',') ? ',' : ' ';
        const day = dateStr?.split(separator)[0]?.trim();
        const separatedDate = day?.split('/');

        return `${separatedDate[0].padStart(
            2,
            '0'
        )}/${separatedDate[1].padStart(2, '0')}/${separatedDate[2]}`;
    } else {
        return 'dd/mm/aaaa';
    }
}

function getTime(date: Date): string {
    if (date.getTime()) {
        const dateStr = getLocaleString(date);
        const separator = dateStr.includes(',') ? ',' : ' ';
        const time = dateStr?.split(separator)[1]?.trim();
        const separatedDate = time?.split(':');

        return `${separatedDate[0]?.padStart(
            2,
            '0'
        )}:${separatedDate[1]?.padStart(2, '0')}hs`;
    } else {
        return 'hh:mm';
    }
}

export { getDate, getTime };

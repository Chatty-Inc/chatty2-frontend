const deriveCol = txt => {
    let s = 0;
    for (let i = 0; i < txt.length; i++) s += txt.charCodeAt(i);

    // Get a color
    const cols = [
        '#8e24aa',
        '#5e35b1',
        '#3949ab',
        '#1976d2',
        '#00838f',
        '#00796b',
        '#2e7d32',
        '#827717',
        '#bf360c',
        '#795548',
        '#d32f2f',
        '#546e7a',
    ];
    return cols[s % cols.length];
}

const log = (t, label, ...args) => console.log(
    `%c${t}%c${label}%c ${args.join(' ')}`,
    `color:#fff; padding: 2px 4px; background-color: ${deriveCol(t)}; border-radius: 4px 0 0 4px; border: 1px solid #888`,
    'border: 1px solid #888; padding: 2px 4px; border-radius: 0 4px 4px 0; border-left: none',
    ''
);


export default log;
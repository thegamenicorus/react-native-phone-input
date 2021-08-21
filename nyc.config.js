module.exports = {
    all: true,
    'check-coverage': true,
    include: ['src/**/*.ts'],
    exclude: ['**/coverage'],
    reporter: ['html', 'text'],
    'report-dir': './coverage',
    'temp-dir': './.nyc_output',
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
    watermarks: {
        branches: [35, 50],
        functions: [50, 75],
        lines: [50, 75],
        statements: [75, 95],
    },
};

// This file tells TypeScript that the 'vanta' module exists.
// It silences the TS7016 error by providing a minimal type.
declare module 'vanta/dist/vanta.fog.min' {
    // We're defining a function that takes options and returns an object with a destroy method.
    const FOG: (opts: any) => { destroy: () => void };
    export default FOG;
}
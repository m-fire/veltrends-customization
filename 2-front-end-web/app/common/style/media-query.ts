export const screenBreakpointMap = {
  mobile: 500,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  xwide: 1440,
} as const

export const Media = createScreenQueryMap()

function createScreenQueryMap() {
  return Object.entries(screenBreakpointMap).reduce(
    (acc, [name, width]) => {
      acc.minWidth[name as DeviceNames] = `@media (min-width: ${width}px)`
      acc.maxWidth[name as DeviceNames] = `@media (max-width: ${width}px)`
      return acc
    },
    { minWidth: {}, maxWidth: {} } as ScreenQueryMap,
  )
}
type DeviceNames = keyof typeof screenBreakpointMap
type ScreenQueryMap = Record<
  'minWidth' | 'maxWidth',
  Record<DeviceNames, string>
>

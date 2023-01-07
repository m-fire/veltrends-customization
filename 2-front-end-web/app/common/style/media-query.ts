export const screenBreakpointMap = {
  mobile: 500,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  xwide: 1440,
} as const

export const screen = createScreenQueryMap()

function createScreenQueryMap() {
  return Object.entries(screenBreakpointMap).reduce(
    (acc, [name, width]) => {
      acc.min_w[name as DeviceNames] = `@media (min-width: ${width}px)`
      acc.max_w[name as DeviceNames] = `@media (max-width: ${width}px)`
      return acc
    },
    { min_w: {}, max_w: {} } as ScreenQueryMap,
  )
}
type DeviceNames = keyof typeof screenBreakpointMap
type ScreenQueryMap = Record<'min_w' | 'max_w', Record<DeviceNames, string>>

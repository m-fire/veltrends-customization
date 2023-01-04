const breakWidthMap = {
  mobile: 500,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  xwide: 1440,
} as const

export const screen = Object.entries(breakWidthMap).reduce(
  (acc, [name, width]) => {
    acc[name as DeviceNames] = createMediaQuery(width)
    return acc
  },
  {} as ScreenMediaQueryMap,
)
type DeviceNames = keyof typeof breakWidthMap
type ScreenMediaQueryMap = Record<DeviceNames, string>

function createMediaQuery(width: number) {
  return `@media (min-width: ${width}px)`
}

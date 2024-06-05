import { useState, useEffect } from 'react'
import { BREAK_POINT } from '../components/Common/constants/breakPoint'

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<Record<'width' | 'height', number>>({
    width: 0,
    height: 0
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (window) {
      window.addEventListener('load', handleResize)
      window.addEventListener('resize', handleResize)
      window.addEventListener('orientationchange', handleResize)
      handleResize()
      return () => {
        window.removeEventListener('load', handleResize)
        window.removeEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)
      }
    }
  }, [])

  return {
    isSmallPC: windowSize.width < BREAK_POINT.DEFAULT_PC && windowSize.width >= BREAK_POINT.SMALL_PC,
    isMobile: windowSize.width < BREAK_POINT.TABLET && windowSize.width,
    isSmallMobile: windowSize.width < 600 && windowSize.width
  }
}

export default useWindowSize

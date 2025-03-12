'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// We use dynamic import with ssr: false for ApexCharts since it's not compatible with server-side rendering
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const ReactApexcharts = (props: any) => {
  // This state is used to handle the client-side mounting of the component
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Make sure we have valid data before rendering
  const safeProps = {
    ...props,
    series: Array.isArray(props.series) ? props.series : [],
    options: {
      ...(props.options || {}),
      // Ensure formatters handle undefined values gracefully
      plotOptions: {
        ...(props.options?.plotOptions || {}),
        pie: {
          ...(props.options?.plotOptions?.pie || {}),
          donut: {
            ...(props.options?.plotOptions?.pie?.donut || {}),
            labels: {
              ...(props.options?.plotOptions?.pie?.donut?.labels || {}),
              value: {
                ...(props.options?.plotOptions?.pie?.donut?.labels?.value || {}),
                formatter: function(val: any) {
                  return val !== undefined ? val.toString() : '0'
                }
              }
            }
          }
        }
      }
    }
  }

  if (!isMounted) {
    return null
  }

  return <ApexCharts {...safeProps} />
}

export default ReactApexcharts

import React from 'react'
import { NodeGroup } from 'react-move'
import { interpolate, interpolateTransformSvg } from 'd3-interpolate'
import Surface from './Surface'
import { scaleBand, scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { easeExpInOut, easePoly } from 'd3-ease'

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 250] // [width, height]
const trbl = [10, 10, 10, 10] // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
]
// **************************************************
//  Example
// **************************************************
const ReportOverallChart: React.FC<{questionsCount:{meetingId:number, meetingName:string, count:number}[]}> = (props)=> {
    const {questionsCount} = props;
    const xScale = scaleBand()
      .rangeRound([0, dims[0]])
      .domain(questionsCount.map((d) => d.meetingName))
      .padding(0.1)

    const yScale = scaleLinear()
      .rangeRound([dims[1], 0])
      .domain([0, max(questionsCount.map((d) => d.count))!])

    return (
      <div>
        <Surface view={view} trbl={trbl}>
          <NodeGroup
            data={questionsCount}
            keyAccessor={(d) => d.meetingName}

            start={() => ({
              opacity: 1e-6,
              x: 0,
              fill: '#00cf77',
              width: xScale.bandwidth(),
              height: 0,
            })}

            enter={(node, index) => ([ // An array!!
              {
                opacity: [0.8],
                width: [xScale.bandwidth()],
                height: [yScale(node.count)],
                timing: { duration: 1000 },
              },
              {
                x: [xScale(node.meetingName)],
                timing: { duration: 100 * index, ease: easePoly },
              },
            ])}

            update={(node) => ([ // An array!!
              {
                opacity: [0.8],
                fill: ['#00a7d8', 'grey'],
                timing: { duration: 2000 },
              },
              {
                x: [xScale(node.meetingName)],
                timing: { duration: 2000, ease: easeExpInOut },
              },
              {
                width: [xScale.bandwidth()],
                timing: { duration: 500 },
              },
              {
                height: [yScale(node.count)],
                timing: { delay: 2000, duration: 500 },
                events: { // Events!!
                  end() {
                    this.setState({ fill: 'steelblue' })
                  },
                },
              },
            ])}

            leave={() => ({
              opacity: [1e-6],
              fill: '#ff0063',
              timing: { duration: 1000 },
            })}

            interpolation={(begValue, endValue, attr) => {
              if (attr === 'transform') {
                return interpolateTransformSvg(begValue, endValue)
              }

              return interpolate(begValue, endValue)
            }}
          >
            {(nodes) => {
              return (
                <g>
                  {nodes.map(({ key, data, state }) => {
                    const { x, height, ...rest } = state

                    return (
                      <g key={key} transform={`translate(${x},0)`}>
                        <rect
                          y={height}
                          height={dims[1] - height}
                          {...rest}
                        />
                        <text
                          x="0"
                          y="20"
                          fill="#000"
                          transform="rotate(90 5,20)"
                        >{`${data.meetingName}`}</text>
                        <text
                          x="0"
                          y="5"
                          fill="#000"
                          transform="rotate(90 5,20)"
                        >{`${data.count}`}</text>
                      </g>
                    )
                  })}
                </g>
              )
            }}
          </NodeGroup>
        </Surface>
      </div>
    )
  
}

export default ReportOverallChart